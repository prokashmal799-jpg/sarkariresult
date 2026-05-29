export interface StateItem {
  code: string;
  name: string;
  jobsCount: number;
}

export interface SubJob {
  title: string;
  count: string;
  hot?: boolean;
  new?: boolean;
}

export interface CategoryCard {
  id: string;
  name: string;
  iconName: string;
  accentColor: string;
  badge?: "HOT" | "NEW";
  totalPosts: string;
  jobs: SubJob[];
}

export interface JobRow {
  id: string;
  title: string;
  department: string;
  vacancy: string;
  lastDate: string;
  qualification: string;
  tag?: "HOT" | "NEW";
  // Full details for detailing page
  jobLocation: string;
  applyMode: string;
  ageLimit: string;
  payScale: string;
  jobType: string;
  feeGen: string;
  feeOBC: string;
  feeSCST: string;
  feeFemale: string;
  startDate: string;
  officialNotificationUrl: string;
  applyOnlineUrl: string;
  fullRequirements?: string;
}

export interface ResultLink {
  title: string;
  tag?: "NEW" | "HOT";
}

export interface AdmitCardLink {
  title: string;
  tag?: "NEW" | "HOT";
}

export interface CalendarEntry {
  name: string;
  dateStr: string;
}

export type ViewState = "home" | "state" | "job";
