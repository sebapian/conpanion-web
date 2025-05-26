'use client';

import React from 'react';
import { useOrganization } from '@/contexts/OrganizationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Users, Settings, ExternalLink } from 'lucide-react';
import { DebugOrganizations } from '@/components/DebugOrganizations';
import { DebugWrapper } from '@/utils/debug';
import Link from 'next/link';

export default function OrganizationsSettingsPage() {
  const { current, memberships, isLoading, error, switchOrganization } = useOrganization();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            <p>Loading organizations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Organization Settings</h1>
        <p className="text-muted-foreground">
          Manage your organizations and multi-tenancy settings
        </p>
      </div>

      {/* Current Organization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Current Organization
          </CardTitle>
          <CardDescription>The organization you are currently working in</CardDescription>
        </CardHeader>
        <CardContent>
          {current ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{current.name}</h3>
                  <p className="text-sm text-muted-foreground">Slug: {current.slug}</p>
                  {current.description && <p className="mt-2 text-sm">{current.description}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default">
                    {memberships.find((m) => m.organization_id === current.id)?.role || 'Unknown'}
                  </Badge>
                  <Link href={`/protected/settings/organizations/${current.slug}`}>
                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Manage
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{current.id}</div>
                  <div className="text-xs text-muted-foreground">ID</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {current.is_active ? 'Active' : 'Inactive'}
                  </div>
                  <div className="text-xs text-muted-foreground">Status</div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No current organization</p>
          )}
        </CardContent>
      </Card>

      {/* All Organizations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Your Organizations ({memberships.length})
          </CardTitle>
          <CardDescription>All organizations you have access to</CardDescription>
        </CardHeader>
        <CardContent>
          {memberships.length > 0 ? (
            <div className="space-y-3">
              {memberships.map((membership) => (
                <div
                  key={membership.organization_id}
                  className={`flex items-center justify-between rounded-lg border p-3 ${
                    current?.id === membership.organization_id
                      ? 'border-primary bg-accent'
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{membership.organization.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {membership.organization.slug}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{membership.role}</Badge>
                    <Link
                      href={`/protected/settings/organizations/${membership.organization.slug}`}
                    >
                      <Button size="sm" variant="ghost" className="flex items-center gap-1">
                        <Settings className="h-3 w-3" />
                        Settings
                      </Button>
                    </Link>
                    {current?.id !== membership.organization_id && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => switchOrganization(membership.organization_id)}
                      >
                        Switch
                      </Button>
                    )}
                    {current?.id === membership.organization_id && (
                      <Badge variant="default">Current</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No organizations found</p>
          )}
        </CardContent>
      </Card>

      {/* Debug API Calls */}
      <DebugWrapper>
        <DebugOrganizations />
      </DebugWrapper>

      {/* Raw Data Debug */}
      <DebugWrapper>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Context Debug Information
            </CardTitle>
            <CardDescription>Raw data from Organization Context</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-medium">Current Organization:</h4>
                <pre className="overflow-auto rounded bg-muted p-3 text-xs">
                  {JSON.stringify(current, null, 2)}
                </pre>
              </div>

              <div>
                <h4 className="mb-2 font-medium">Memberships:</h4>
                <pre className="overflow-auto rounded bg-muted p-3 text-xs">
                  {JSON.stringify(memberships, null, 2)}
                </pre>
              </div>

              <div>
                <h4 className="mb-2 font-medium">Loading State:</h4>
                <pre className="overflow-auto rounded bg-muted p-3 text-xs">
                  {JSON.stringify({ isLoading, error }, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </DebugWrapper>
    </div>
  );
}
