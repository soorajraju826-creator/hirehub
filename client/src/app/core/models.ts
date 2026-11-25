export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'seeker' | 'recruiter' | 'admin';
  companyName?: string;
  headline?: string;
  location?: string;
}
export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  category?: string;
  description: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  createdAt: string;
  postedBy?: { _id: string; name: string; companyName?: string };
}
export interface Application {
  _id: string;
  status: string;
  createdAt: string;
  coverLetter?: string;
  job?: Job;
  applicant?: User;
}
