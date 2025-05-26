-- Migration: Migrate existing data to organizations
-- Purpose: Associate existing projects and users with organizations (forms inherit organization through projects)
-- Affected tables: projects, organization_users, user_profiles, and all organization-related tables
-- Special considerations: This migration handles existing data that pre-dates the organization system

-- Function to get or create a default organization for data migration
create or replace function public.get_or_create_default_organization()
returns integer as $$
declare
    default_org_id integer;
    default_org_name text := 'Conpanion Internal';
    default_org_slug text;
    first_user_id uuid;
begin
    -- Check if we already have a default organization for legacy data
    select id into default_org_id
    from public.organizations
    where name = default_org_name
    limit 1;
    
    if default_org_id is not null then
        return default_org_id;
    end if;
    
    -- Must have at least one user to create an organization
    select id into first_user_id
    from auth.users 
    order by created_at asc 
    limit 1;
    
    if first_user_id is null then
        raise exception 'Cannot create default organization: no users exist in the system';
    end if;
    
    -- Generate unique slug for the default organization
    default_org_slug := public.generate_organization_slug();
    
    -- Create a default organization for legacy data migration
    insert into public.organizations (
        name, 
        slug, 
        subdomain, 
        description,
        created_by,
        plan_type
    )
    values (
        default_org_name,
        default_org_slug,
        default_org_slug,
        'Internal development organization for Conpanion team',
        first_user_id,
        'free'
    )
    returning id into default_org_id;
    
    return default_org_id;
end;
$$ language plpgsql security definer;

-- Function to migrate existing projects to organizations
create or replace function public.migrate_projects_to_organizations()
returns integer as $$
declare
    projects_migrated integer := 0;
    project_record record;
    target_org_id integer;
    project_owner_org_id integer;
begin
    -- Get the default organization for projects without explicit ownership
    target_org_id := public.get_or_create_default_organization();
    
    -- Migrate projects that don't have an organization_id
    for project_record in 
        select id, created_by from public.projects 
        where organization_id is null
    loop
        -- Try to find an organization for the project owner
        select organization_id into project_owner_org_id
        from public.organization_users
        where user_id = project_record.created_by
        and status = 'active'
        order by joined_at asc
        limit 1;
        
        -- Use the project owner's organization if available, otherwise use default
        update public.projects
        set organization_id = coalesce(project_owner_org_id, target_org_id)
        where id = project_record.id;
        
        projects_migrated := projects_migrated + 1;
    end loop;
    
    return projects_migrated;
end;
$$ language plpgsql security definer;

-- Forms inherit organization context through projects (forms.project_id → projects.organization_id)
-- No migration needed for forms table

-- Function to migrate all existing users to the shared default organization
create or replace function public.migrate_users_to_default_organization()
returns table (
    user_id uuid,
    profile_created boolean,
    membership_created boolean
) as $$
declare
    user_record record;
    shared_org_id integer;
    profile_created_flag boolean;
    membership_created_flag boolean;
begin
    -- Get the shared default organization
    shared_org_id := public.get_or_create_default_organization();
    
    -- Process all users in the system
    for user_record in 
        select u.id, u.email, u.created_at
        from auth.users u
    loop
        profile_created_flag := false;
        membership_created_flag := false;
        
        -- Add user to the shared organization if not already a member
        if not exists (
            select 1 from public.organization_users 
            where user_id = user_record.id 
            and organization_id = shared_org_id
            and status = 'active'
        ) then
            insert into public.organization_users (
                organization_id,
                user_id,
                role,
                status,
                joined_at
            )
            values (
                shared_org_id,
                user_record.id,
                'member', -- All existing users become members
                'active',
                now()
            )
            on conflict (organization_id, user_id) do update set
                status = 'active',
                role = coalesce(organization_users.role, 'member');
            
            membership_created_flag := true;
        end if;
        
        -- Create or update user profile to point to shared organization
        if not exists (select 1 from public.user_profiles where id = user_record.id) then
            insert into public.user_profiles (
                id, 
                global_display_name, 
                current_organization_id,
                default_organization_id
            )
            values (
                user_record.id,
                coalesce(split_part(user_record.email, '@', 1), 'User'),
                shared_org_id,
                shared_org_id
            );
            
            profile_created_flag := true;
        else
            -- Update existing profile to point to shared organization
            update public.user_profiles 
            set 
                current_organization_id = shared_org_id,
                default_organization_id = shared_org_id
            where id = user_record.id;
        end if;
        
        -- Return the results for this user
        user_id := user_record.id;
        profile_created := profile_created_flag;
        membership_created := membership_created_flag;
        
        return next;
    end loop;
end;
$$ language plpgsql security definer;

-- Execute the migration for existing data
do $$
declare
    projects_count integer := 0;
    users_processed integer := 0;
    user_count integer := 0;
    migration_summary text;
begin
    raise notice 'Starting existing data migration to organizations...';
    
    -- Check if there are any users in the system
    select count(*) into user_count from auth.users;
    
    if user_count = 0 then
        raise notice 'No users found in system - skipping migration (will run automatically when users are created)';
        return;
    end if;
    
    -- First, migrate all users to the shared internal organization
    raise notice 'Migrating % existing users to shared internal organization...', user_count;
    select count(*) into users_processed
    from public.migrate_users_to_default_organization();
    
    -- Then migrate projects (forms get organization context through projects)
    raise notice 'Migrating existing projects to organizations...';
    select public.migrate_projects_to_organizations() into projects_count;
    
    -- Create summary
    migration_summary := format(
        'Migration completed: %s users processed, %s projects migrated (forms inherit organization through projects)',
        users_processed, projects_count
    );
    
    raise notice '%', migration_summary;
end;
$$;

-- Grant permissions for the new functions
grant execute on function public.get_or_create_default_organization() to authenticated;
grant execute on function public.migrate_projects_to_organizations() to authenticated;
grant execute on function public.migrate_users_to_default_organization() to authenticated;

-- Create a function to manually re-run the migration if needed
create or replace function public.rerun_data_migration()
returns text as $$
declare
    projects_count integer := 0;
    users_processed integer := 0;
    user_count integer := 0;
    migration_summary text;
begin
    -- Check if there are any users in the system
    select count(*) into user_count from auth.users;
    
    if user_count = 0 then
        return 'No users found in system - nothing to migrate';
    end if;
    
    -- Migrate all users to the shared internal organization
    select count(*) into users_processed
    from public.migrate_users_to_default_organization();
    
    -- Migrate projects (forms inherit organization through projects)
    select public.migrate_projects_to_organizations() into projects_count;
    
    -- Create summary
    migration_summary := format(
        'Re-migration completed: %s users processed, %s projects migrated (forms inherit organization through projects)',
        users_processed, projects_count
    );
    
    return migration_summary;
end;
$$ language plpgsql security definer;

grant execute on function public.rerun_data_migration() to authenticated; 