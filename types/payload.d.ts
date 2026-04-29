export interface AuthPayload {
  userId: string;
  role: 'student' | 'admin' | 'visitor';
  [key: string]: any; // Allow other properties if needed later
}