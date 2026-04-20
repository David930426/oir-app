export interface NewsItem {
  id: string;
  title: string;
  category: 'Announcement' | 'Event' | 'Scholarship' | 'General';
  date: string;
  description: string;
  isNew: boolean;
  image?: string;
}

export interface StudentNotice {
  id: string;
  studentId: string;
  type: 'Document' | 'Package' | 'Letter' | 'ARC' | 'Other';
  status: 'Ready' | 'Processing' | 'Action Needed';
  location: string;
  description: string;
  timestamp: string;
}

export interface Organization {
  id: string;
  name: string;
  category: 'International' | 'Nationality' | 'Nationality' | 'Social' | 'Hobby';
  description: string;
  socialLinks: {
    line?: string;
    instagram?: string;
    facebook?: string;
  };
  upcomingEvents: string[];
  membersCount: number;
}

export interface User {
  id: string;
  name: string;
  studentId?: string;
  email: string;
  role: 'admin' | 'student';
  avatar?: string;
}

export interface Resource {
  id: string;
  title: string;
  category: 'Essential' | 'Guideline' | 'Form' | 'Other';
  description: string;
  fileType: 'PDF' | 'Link' | 'Doc';
  url: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
