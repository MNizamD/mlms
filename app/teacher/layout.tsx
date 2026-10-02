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
} from 'lucide-react';

const navItems = [
  { href: '/teacher/home', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/teacher/classes', label: 'Classes', icon: Users },
  { href: '/teacher/attendance', label: 'Attendance', icon: ClipboardList },
  { href: '/teacher/assessments', label: 'Assessments', icon: GraduationCap },
  { href: '/teacher/grades', label: 'Grade Sheets', icon: GraduationCap },
  { href: '/teacher/calendar', label: 'Calendar', icon: Calendar },
  { href: '/teacher/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/teacher/consultations', label: 'Consultations', icon: MessageSquare },
  { href: '/teacher/excuse-letters', label: 'Excuse Letters', icon: Mail },
];

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return <AppShell navItems={navItems}>{children}</AppShell>;
}
