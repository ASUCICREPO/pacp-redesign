import { CircleAlert, CircleCheckBig, FileCheck, Users } from 'lucide-react';

export const STATUS_STYLES = {
  draft: {
    label: "Draft",
    icon: FileCheck,
    bgColor: "bg-muted",
    textColor: "text-muted-foreground",
    borderColor: "border-border"
  },
  "needs-review": {
    label: "Needs Review",
    icon: CircleAlert,
    bgColor: "bg-secondary/20",
    textColor: "text-secondary-foreground",
    borderColor: "border-secondary"
  },
  "community-reviewed": {
    label: "Community Reviewed",
    icon: Users,
    bgColor: "bg-accent/20",
    textColor: "text-accent-foreground",
    borderColor: "border-accent"
  },
  stewarded: {
    label: "Stewarded",
    icon: CircleCheckBig,
    bgColor: "bg-primary/10",
    textColor: "text-primary",
    borderColor: "border-primary"
  }
};
