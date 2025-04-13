'use client';

import { Search, Bell, User } from 'lucide-react';
import { signOutAction } from '@/app/actions';
import { ThemeSwitcher } from '@/components/theme-switcher';

export default function TopBar() {
  return (
    <header
      className="fixed right-0 top-0 z-20 flex h-14 items-center justify-between border-b bg-background/80 px-4 transition-[left] duration-300 dark:bg-background/95"
      style={{ left: 'var(--sidebar-width)' }}
    >
      <div className="flex max-w-2xl flex-1 items-center">
        <div className="relative max-w-md flex-1">
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
