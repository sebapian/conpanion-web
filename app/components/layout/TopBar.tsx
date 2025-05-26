'use client';

import { Search, Bell, User, Menu } from 'lucide-react';
import { signOutAction } from '@/app/actions';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import { OrganizationSwitcher } from '@/components/OrganizationSwitcher';
import { RefObject } from 'react';

interface TopBarProps {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
  toggleButtonRef: RefObject<HTMLButtonElement | null>;
}

export default function TopBar({ isSidebarOpen, onSidebarToggle, toggleButtonRef }: TopBarProps) {
  return (
    <header className="fixed left-0 right-0 top-0 z-20 flex h-14 items-center justify-between border-b bg-background/80 px-4 dark:bg-background/95 lg:left-[var(--sidebar-width)]">
      <div className="flex items-center gap-4">
        <Button
          ref={toggleButtonRef}
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onSidebarToggle}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        {/* Organization Switcher */}
        <div className="flex items-center">
          <OrganizationSwitcher className="w-48 lg:w-64" />
        </div>

        <div className="relative hidden max-w-md flex-1 md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <input
            type="text"
            placeholder="Search everything..."
            className="w-full rounded-md bg-muted/50 py-1.5 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <ThemeSwitcher />
        <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted/50">
          <Bell className="h-5 w-5" />
        </button>
        <div className="group relative">
          <button className="flex items-center space-x-1 rounded-lg p-1 hover:bg-muted/50">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User className="h-5 w-5" />
            </div>
          </button>
          <div className="invisible absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border bg-background/95 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-200 group-hover:visible group-hover:opacity-100">
            <div className="p-2">
              <button className="w-full rounded px-3 py-2 text-left text-sm text-foreground hover:bg-muted/50">
                Profile Settings
              </button>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="w-full rounded px-3 py-2 text-left text-sm text-foreground hover:bg-muted/50"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
