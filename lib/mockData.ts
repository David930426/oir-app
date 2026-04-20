import { NewsItem, Organization, StudentNotice, Resource } from '../types';

export const mockResources: Resource[] = [
  {
    id: 'r1',
    title: 'Academic Calendar 2026-2027',
    category: 'Essential',
    description: 'Important dates for semesters, holidays, and exam periods.',
    fileType: 'PDF',
    url: '#'
  },
  {
    id: 'r2',
    title: 'International Student Handbook',
    category: 'Guideline',
    description: 'Comprehensive guide on campus life, culture, and regulations.',
    fileType: 'PDF',
    url: '#'
  },
  {
    id: 'r3',
    title: 'ARC Renewal Application Form',
    category: 'Form',
    description: 'Physical form required for manual ARC renewal submissions.',
    fileType: 'PDF',
    url: '#'
  },
  {
    id: 'r4',
    title: 'Work Permit Application Guide',
    category: 'Guideline',
    description: 'Step-by-step instructions for obtaining a student work permit in Taiwan.',
    fileType: 'Link',
    url: '#'
  },
  {
    id: 'r5',
    title: 'Health Insurance (NHI) FAQ',
    category: 'Essential',
    description: 'Common questions and answers regarding NHI coverage for foreign students.',
    fileType: 'PDF',
    url: '#'
  },
  {
    id: 'r6',
    title: 'Transcript Request Form',
    category: 'Form',
    description: 'Use this form to request official academic transcripts from the registrar.',
    fileType: 'Doc',
    url: '#'
  }
];

export const mockNotices: StudentNotice[] = [
  {
    id: 'n1',
    studentId: '1120001',
    type: 'Package',
    status: 'Ready',
    location: 'OIR Mailroom (Admin Bldg 2F)',
    description: 'You have a package from DHL ready for pickup.',
    timestamp: '2026-04-19T10:00:00Z'
  },
  {
    id: 'n2',
    studentId: '1120001',
    type: 'Document',
    status: 'Action Needed',
    location: 'OIR Office (Front Desk)',
    description: 'Please visit the OIR office to sign your dormitory agreement.',
    timestamp: '2026-04-20T14:00:00Z'
  },
  {
    id: 'n3',
    studentId: '1120002',
    type: 'ARC',
    status: 'Ready',
    location: 'OIR Office (Front Desk)',
    description: 'Your renewed ARC card is ready for collection.',
    timestamp: '2026-04-20T08:30:00Z'
  },
  {
    id: 'n4',
    studentId: '1130099',
    type: 'Letter',
    status: 'Ready',
    location: 'OIR Mailroom (Admin Bldg 2F)',
    description: 'A registered letter from your embassy has arrived.',
    timestamp: '2026-04-20T11:00:00Z'
  }
];

export const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'University Scholarship Results: Autumn 2026',
    category: 'Scholarship',
    date: '2026-04-20',
    description: 'The results for the first round of university scholarships have been released. Please check your student email for individual notifications.',
    isNew: true,
    image: 'https://picsum.photos/seed/award/800/400'
  },
  {
    id: '2',
    title: 'New ARC Online Application Workshop',
    category: 'Event',
    date: '2026-04-18',
    description: 'Join our workshop next Wednesday to learn how to use the NIA online portal for smoother ARC renewals.',
    isNew: true,
    image: 'https://picsum.photos/seed/workshop/800/400'
  },
  {
    id: '3',
    title: 'MOE Taiwan Scholarship Invitation',
    category: 'Scholarship',
    date: '2026-04-15',
    description: 'The Ministry of Education is now accepting applications for the 2026 Taiwan Scholarship. Great opportunity for degree students.',
    isNew: false,
    image: 'https://picsum.photos/seed/taiwan/800/400'
  },
  {
    id: '4',
    title: 'Lunar New Year Cultural Festival',
    category: 'Event',
    date: '2026-04-10',
    description: 'Join us for a celebration of cultures! Food stalls, performances, and more at the Student Plaza.',
    isNew: false,
    image: 'https://picsum.photos/seed/festival/800/400'
  }
];

export const mockOrgs: Organization[] = [
  {
    id: 'thuisa',
    name: 'THUISA (Tunghai International Student Association)',
    category: 'International',
    description: 'The main student organization representing all international students at Tunghai University.',
    socialLinks: {
      instagram: 'https://instagram.com/thuisa',
      line: 'https://line.me/thuisa'
    },
    upcomingEvents: ['International Food Fair', 'Beach Cleanup'],
    membersCount: 450
  },
  {
    id: 'thurive',
    name: 'THURIVE',
    category: 'Social',
    description: 'A community focused on student well-being and social connection for long-term residents.',
    socialLinks: {
      instagram: 'https://instagram.com/thurive'
    },
    upcomingEvents: ['Coffee & Chat', 'Exam Study Hall'],
    membersCount: 120
  }
];
