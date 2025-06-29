
export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR';
export type DocumentPermission = 'READ' | 'WRITE' | 'ADMIN';
export type DocumentVisibility = 'PRIVATE' | 'PUBLIC' | 'TEAM';
export type CollaborationStatus = 'ACTIVE' | 'INACTIVE' | 'INVITED';

export interface User {
  id: string;
  email: string;
  password?: string | null;
  name?: string | null;
  avatar?: string | null;
  image?: string | null;
  role: UserRole;
  emailVerified: boolean;
  emailVerificationToken?: string | null;
  resetToken?: string | null;
  resetTokenExpiration?: Date | null;
  lastActiveAt: Date;
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;
  ownedDocuments: Document[];
  collaborations: DocumentCollaborator[];
  sessions: Session[];
  activities: Activity[];
  comments: Comment[];
  accounts: Account[];
}

export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
  user: User;
}

export interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

export interface VerificationToken {
  identifier: string;
  token: string;
  expires: Date;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  visibility: DocumentVisibility;
  isDeleted: boolean;
  deletedAt?: Date | null;
  version: number;
  lastEditedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  owner: User;
  collaborators: DocumentCollaborator[];
  versions: DocumentVersion[];
  activities: Activity[];
  comments: Comment[];
}

export interface DocumentCollaborator {
  id: string;
  permission: DocumentPermission;
  status: CollaborationStatus;
  invitedAt: Date;
  joinedAt?: Date | null;
  lastAccessAt?: Date | null;
  documentId: string;
  userId: string;
  document: Document;
  user: User;
}

export interface DocumentVersion {
  id: string;
  version: number;
  content: string;
  changeLog?: string | null;
  createdAt: Date;
  documentId: string;
  createdById: string;
  document: Document;
}

export interface Activity {
  id: string;
  action: string;
  details?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
  userId: string;
  documentId?: string | null;
  user: User;
  document?: Document | null;
}

export interface Comment {
  id: string;
  content: string;
  position?: string | null;
  isResolved: boolean;
  createdAt: Date;
  updatedAt: Date;
  documentId: string;
  authorId: string;
  parentId?: string | null;
  document: Document;
  author: User;
  parent?: Comment | null;
  replies: Comment[];
}
