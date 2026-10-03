'use client';

import { AppShell } from '@/components/ui/app-shell';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  GraduationCap,
  Calendar,
  Megaphone,
  MessageSquare,
  Mail,
  Bell,
} from 'lucide-react';

const navItems = [
  { href: '/student', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/student/classes', label: 'My Classes', icon: Users },
  { href: '/student/attendance', label: 'Attendance', icon: ClipboardList },
  { href: '/student/assessments', label: 'Assessments', icon: GraduationCap },
  { href: '/student/grades', label: 'Grades', icon: GraduationCap },
  { href: '/student/calendar', label: 'Calendar', icon: Calendar },
  { href: '/student/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/student/consultations', label: 'Consultations', icon: MessageSquare },
  { href: '/student/excuse-letters', label: 'Excuse Letters', icon: Mail },
  { href: '/student/notifications', label: 'Notifications', icon: Bell },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <AppShell navItems={navItems}>{children}</AppShell>;
}
