'use client';

import { AppShell } from '@/components/ui/app-shell';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Calendar,
  Megaphone,
  Settings,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/subjects', label: 'Subjects', icon: GraduationCap },
  { href: '/admin/classes', label: 'Classes', icon: GraduationCap },
  { href: '/admin/calendar', label: 'Calendar', icon: Calendar },
  { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AppShell navItems={navItems}>{children}</AppShell>;
}
