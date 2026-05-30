export interface FAQItem {
  question: string;
  answer: string;
}

export interface SEOMetadata {
  metaTitle: string;
  metaDesc: string;
  focusKeywords: string;
  structuredDataSchema?: string;
}

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
  faq?: FAQItem[];
  seo?: SEOMetadata;
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

export interface PushNotificationSetting {
  subscribed: boolean;
  channels: string[];
}

export interface PushNotificationAlert {
  id: number;
  title: string;
  body: string;
  category: string;
  createdAt: string;
  url?: string;
}

