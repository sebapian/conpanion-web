'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CheckSquare, FileText, Book, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';

const navItems = [
  { name: 'Home', icon: Home, href: '/protected' },
  { name: 'Tasks', icon: CheckSquare, href: '/protected/tasks' },
  { name: 'Forms', icon: FileText, href: '/protected/forms' },
  { name: 'Site Diaries', icon: Book, href: '/protected/site-diaries' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', isExpanded ? '12rem' : '4rem');
  }, [isExpanded]);

  return (
    <aside
      className={`fixed left-0 top-0 z-30 flex h-screen w-16 flex-col overflow-hidden border-r bg-background/80 py-4 transition-all duration-300 dark:bg-background/95 ${
        isExpanded ? 'w-48' : 'w-16'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex flex-1 flex-col space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative mx-2 flex items-center rounded-lg py-2 ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              <div className="flex w-12 items-center justify-center">
                <Icon className="h-5 w-5" />
              </div>
              <span
                className={`absolute left-12 whitespace-nowrap text-sm transition-transform duration-300 ${
                  isExpanded ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
      <Link
        href="/protected/settings"
        className="relative mx-2 flex items-center rounded-lg py-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      >
        <div className="flex w-12 items-center justify-center">
          <Settings className="h-5 w-5" />
        </div>
        <span
          className={`absolute left-12 whitespace-nowrap text-sm transition-transform duration-300 ${
            isExpanded ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
          }`}
        >
          Settings
        </span>
      </Link>
    </aside>
  );
}
