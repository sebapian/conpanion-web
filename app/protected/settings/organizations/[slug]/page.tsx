'use client';

import React, { useEffect, useState } from 'react';
import { useOrganization } from '@/contexts/OrganizationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Building2,
  Users,
  Settings,
  Save,
  ArrowLeft,
  Shield,
  CreditCard,
  Database,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Organization, OrganizationMembership } from '@/lib/types/organization';

export default function OrganizationSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const { memberships, current, switchOrganization } = useOrganization();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [membership, setMembership] = useState<OrganizationMembership | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    max_members: 100,
    plan_type: 'free' as 'free' | 'starter' | 'professional' | 'enterprise',
    billing_email: '',
    data_region: 'us-east-1',
  });

  const slug = params.slug as string;

  useEffect(() => {
    const loadOrganization = () => {
      const foundMembership = memberships.find((m) => m.organization.slug === slug);

      if (foundMembership) {
        setOrganization(foundMembership.organization);
        setMembership(foundMembership);
        setFormData({
          name: foundMembership.organization.name || '',
          description: foundMembership.organization.description || '',
          max_members: foundMembership.organization.max_members || 100,
          plan_type: (foundMembership.organization.plan_type || 'free') as
            | 'free'
            | 'starter'
            | 'professional'
            | 'enterprise',
          billing_email: foundMembership.organization.billing_email || '',
          data_region: foundMembership.organization.data_region || 'us-east-1',
        });
      } else {
        // Organization not found, redirect to organizations page
        router.push('/protected/settings/organizations');
      }
      setIsLoading(false);
    };

    if (memberships.length > 0) {
      loadOrganization();
    }
  }, [memberships, slug, router]);

  const handleSave = async () => {
    if (!organization) return;

    setIsSaving(true);
    try {
      // Here you would call the update organization API
      console.log('Saving organization settings:', formData);
      // await updateOrganization(organization.id, formData);
      alert('Settings saved successfully! (This is a demo - changes are not actually saved)');
    } catch (error) {
      console.error('Failed to save organization settings:', error);
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSwitchToOrg = async () => {
    if (!organization || current?.id === organization.id) return;

    try {
      await switchOrganization(organization.id);
      alert('Switched to this organization!');
    } catch (error) {
      console.error('Failed to switch organization:', error);
      alert('Failed to switch organization');
    }
  };

  const canEdit = membership?.role === 'owner' || membership?.role === 'admin';

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            <p>Loading organization settings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!organization || !membership) {
    return (
      <div className="p-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Organization Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-destructive">
              The organization with slug "{slug}" was not found or you don't have access to it.
            </p>
            <Link href="/protected/settings/organizations">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Organizations
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/protected/settings/organizations">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold">
              <Building2 className="h-8 w-8" />
              {organization.name}
            </h1>
            <p className="text-muted-foreground">Organization settings and configuration</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {current?.id !== organization.id && (
            <Button onClick={handleSwitchToOrg} variant="outline">
              Switch to This Org
            </Button>
          )}
          <Badge variant={current?.id === organization.id ? 'default' : 'outline'}>
            {current?.id === organization.id ? 'Current' : membership.role}
          </Badge>
        </div>
      </div>

      {/* Quick Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Organization Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{organization.slug}</div>
              <div className="text-xs text-muted-foreground">Slug</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{organization.plan_type}</div>
              <div className="text-xs text-muted-foreground">Plan</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{membership.role}</div>
              <div className="text-xs text-muted-foreground">Your Role</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {organization.is_active ? 'Active' : 'Inactive'}
              </div>
              <div className="text-xs text-muted-foreground">Status</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            General Settings
          </CardTitle>
          <CardDescription>Basic organization information and configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                disabled={!canEdit}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_members">Max Members</Label>
              <Input
                id="max_members"
                type="number"
                value={formData.max_members}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, max_members: parseInt(e.target.value) || 100 }))
                }
                disabled={!canEdit}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              disabled={!canEdit}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="plan_type">Plan Type</Label>
              <Select
                value={formData.plan_type}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, plan_type: value as any }))
                }
                disabled={!canEdit}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free Plan</SelectItem>
                  <SelectItem value="starter">Starter Plan</SelectItem>
                  <SelectItem value="professional">Professional Plan</SelectItem>
                  <SelectItem value="enterprise">Enterprise Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="data_region">Data Region</Label>
              <Select
                value={formData.data_region}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, data_region: value }))}
                disabled={!canEdit}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us-east-1">US East (Virginia)</SelectItem>
                  <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                  <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                  <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {canEdit && (
            <div className="flex justify-end pt-4">
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Billing Settings
          </CardTitle>
          <CardDescription>Billing and subscription information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="billing_email">Billing Email</Label>
            <Input
              id="billing_email"
              type="email"
              value={formData.billing_email}
              onChange={(e) => setFormData((prev) => ({ ...prev, billing_email: e.target.value }))}
              disabled={!canEdit}
            />
          </div>

          <div className="rounded-lg bg-muted p-4">
            <h4 className="mb-2 font-medium">Subscription Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Current Plan:</span>
                <div className="font-medium capitalize">{organization.plan_type}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Subscription ID:</span>
                <div className="font-medium">{organization.subscription_id || 'N/A'}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members & Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Members & Permissions
          </CardTitle>
          <CardDescription>Manage organization members and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-muted p-4">
              <div>
                <div className="font-medium">Your Role: {membership.role}</div>
                <div className="text-sm text-muted-foreground">
                  Joined {new Date(membership.joined_at).toLocaleDateString()}
                </div>
              </div>
              <Badge variant="outline">{membership.status}</Badge>
            </div>

            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-medium">Permission Levels</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Owner:</strong> Full access to all settings and billing
                </div>
                <div>
                  <strong>Admin:</strong> Manage members and organization settings
                </div>
                <div>
                  <strong>Member:</strong> Access to projects and collaboration features
                </div>
                <div>
                  <strong>Guest:</strong> Limited access to specific projects
                </div>
              </div>
            </div>

            {canEdit && (
              <Button variant="outline" className="w-full">
                <Users className="mr-2 h-4 w-4" />
                Manage Members (Coming Soon)
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      {membership.role === 'owner' && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Shield className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>Irreversible and destructive actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-destructive p-4">
              <h4 className="mb-2 font-medium text-destructive">Delete Organization</h4>
              <p className="mb-4 text-sm text-muted-foreground">
                Permanently delete this organization and all its data. This action cannot be undone.
              </p>
              <Button variant="destructive" disabled>
                Delete Organization (Coming Soon)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
