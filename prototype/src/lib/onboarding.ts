import {
  BookOpen,
  Compass,
  Database,
  FileText,
  GraduationCap,
  HardHat,
  Layers,
  Library,
  MessageSquareQuote,
  ScanSearch,
  Shapes,
  Sprout,
  Map as MapIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import type { ContributorRole } from '@/types/pacp';

/**
 * The role and task catalogue behind the onboarding wizard.
 *
 * Roles and their task sets come straight from the workflow designs in
 * `docs/Updated_Project_Scope_PACP_Project_.docx`. The scope document is
 * explicit that personalisation should stay shallow — role changes the wording
 * and the suggested starting points, never what a person is allowed to see.
 */

export interface OnboardingRole {
  id: ContributorRole;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const ONBOARDING_ROLES: OnboardingRole[] = [
  {
    id: 'crm_archaeologist',
    label: 'CRM Archaeologist',
    description:
      'Compliance archaeology, reporting, time pressure, large volumes of material.',
    icon: HardHat,
  },
  {
    id: 'graduate_student',
    label: 'Graduate Student',
    description: 'Training, thesis research, learning comparative frameworks.',
    icon: GraduationCap,
  },
  {
    id: 'undergraduate_student',
    label: 'Undergraduate Student',
    description: 'Introductory learning, visual recognition, guided exploration.',
    icon: Sprout,
  },
];

export interface OnboardingTask {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const ROLE_TASKS: Record<ContributorRole, OnboardingTask[]> = {
  crm_archaeologist: [
    {
      id: 'identify-sherd',
      label: 'Identify a Sherd',
      description: 'Narrow possibilities from a photo or a description of what you observe.',
      icon: ScanSearch,
    },
    {
      id: 'regional-parallels',
      label: 'Find Regional Parallels',
      description: 'Locate dated comparanda for your region and project area.',
      icon: MapIcon,
    },
    {
      id: 'report-text',
      label: 'Generate Report Text',
      description: 'Draft typology summaries, chronology ranges and citation packages.',
      icon: FileText,
    },
    {
      id: 'similar-assemblages',
      label: 'Browse Similar Assemblages',
      description: 'Compare your assemblage against published site collections.',
      icon: Layers,
    },
  ],
  graduate_student: [
    {
      id: 'guided-identification',
      label: 'Guided identification',
      description: 'See why matches were suggested, not just what they are.',
      icon: Compass,
    },
    {
      id: 'literature-exploration',
      label: 'Literature exploration',
      description: 'Trace the bibliography behind a type, ware or fabric.',
      icon: Library,
    },
    {
      id: 'dataset-building',
      label: 'Research dataset building',
      description: 'Assemble and save comparative sets for thesis work.',
      icon: Database,
    },
    {
      id: 'learning-through-debate',
      label: 'Learning through debate',
      description: 'Follow contested classifications through their revision history.',
      icon: MessageSquareQuote,
    },
  ],
  undergraduate_student: [
    {
      id: 'explore-traditions',
      label: 'Explore Ceramic Traditions',
      description: 'Browse visual galleries organised by region and period.',
      icon: Compass,
    },
    {
      id: 'compare-forms',
      label: 'Compare Vessel Forms',
      description: 'Put forms, slips and decoration side by side.',
      icon: Shapes,
    },
    {
      id: 'identification-basics',
      label: 'Learn Identification Basics',
      description: 'Work through the observations that underpin an attribution.',
      icon: BookOpen,
    },
    {
      id: 'course-exercises',
      label: 'Complete Course Exercises',
      description: 'Submit tentative identifications for instructor review.',
      icon: GraduationCap,
    },
  ],
  // Specialists get the graduate set; the scope document does not define a
  // separate onboarding path for them.
  specialist: [],
};

ROLE_TASKS.specialist = ROLE_TASKS.graduate_student;

export const roleLabel = (role: ContributorRole | null): string =>
  ONBOARDING_ROLES.find((r) => r.id === role)?.label ??
  (role === 'specialist' ? 'Specialist' : 'PACP');

export const taskLabel = (taskId: string): string => {
  for (const tasks of Object.values(ROLE_TASKS)) {
    const found = tasks.find((t) => t.id === taskId);
    if (found) return found.label;
  }
  return taskId;
};
