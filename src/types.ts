export interface Job {
  id: number;
  title: string;
  org: string;
  category: string;
  state: string;
  vacancy: string;
  lastDate: string;
  qual: string;
  salary: string;
  fee: string;
  feeSC: string;
  feeFemale: string;
  ageLow: string;
  ageHigh: string;
  applyLink: string;
  notifLink: string;
  status: "active" | "draft" | "upcoming" | "expired";
  isHot: boolean;
  isNew: boolean;
  desc: string;
  created: string;
}

export interface ExamResult {
  id: number;
  title: string;
  exam: string;
  date: string;
  link: string;
  state: string;
  status: "published" | "draft";
}

export interface AdmitCard {
  id: number;
  title: string;
  exam: string;
  examDate: string;
  link: string;
  state: string;
  status: "published" | "draft";
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  email: string;
  pubId: string;
  headerSlot: string;
  sidebarSlot: string;
}
