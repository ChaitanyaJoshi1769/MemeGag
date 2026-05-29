// User & Auth Types
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  banner?: string;
  bio?: string;
  website?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  isCreator: boolean;
  role: UserRole;
  status: UserStatus;
  privacySettings: PrivacySettings;
}

export enum UserRole {
  USER = 'USER',
  CREATOR = 'CREATOR',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED',
  DELETED = 'DELETED',
}

export interface PrivacySettings {
  isPrivate: boolean;
  allowMessages: boolean;
  allowComments: boolean;
  showActivityStatus: boolean;
}

// Post Types
export interface Post {
  id: string;
  userId: string;
  user?: User;
  title?: string;
  description?: string;
  content: PostContent[];
  type: PostType;
  status: PostStatus;
  visibility: PostVisibility;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  remixCount: number;
  metadata: PostMetadata;
  tags: string[];
  community?: Community;
  communityId?: string;
  monetizationInfo?: MonetizationInfo;
  aiGenerated: boolean;
}

export enum PostType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  GIF = 'GIF',
  AUDIO = 'AUDIO',
  ARTICLE = 'ARTICLE',
  POLL = 'POLL',
  THREAD = 'THREAD',
  LIVESTREAM = 'LIVESTREAM',
  MIXED = 'MIXED',
}

export enum PostStatus {
  DRAFT = 'DRAFT',
  PENDING_MODERATION = 'PENDING_MODERATION',
  PUBLISHED = 'PUBLISHED',
  TRENDING = 'TRENDING',
  VIRAL = 'VIRAL',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
  FLAGGED = 'FLAGGED',
}

export enum PostVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  FRIENDS = 'FRIENDS',
  COMMUNITY = 'COMMUNITY',
}

export interface PostContent {
  type: 'image' | 'video' | 'gif' | 'text' | 'audio';
  url?: string;
  text?: string;
  mediaId?: string;
  metadata?: Record<string, unknown>;
}

export interface PostMetadata {
  originality: number; // 0-100
  virality: number; // 0-100
  toxicity: number; // 0-100
  engagement: number; // 0-100
  sentiment: 'positive' | 'negative' | 'neutral';
  isDuplicate: boolean;
  duplicateOf?: string;
  categories: string[];
  detectedObjects: string[];
  aiAnalysis?: {
    captions: string[];
    summary?: string;
    keywords: string[];
  };
}

export interface MonetizationInfo {
  isMonetized: boolean;
  revenue?: number;
  revenueSharePercentage?: number;
  sponsorIds?: string[];
}

// Comment Types
export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user?: User;
  content: string;
  status: CommentStatus;
  createdAt: Date;
  updatedAt: Date;
  likeCount: number;
  replyCount: number;
  parentCommentId?: string;
  metadata: CommentMetadata;
}

export enum CommentStatus {
  PUBLISHED = 'PUBLISHED',
  PENDING_MODERATION = 'PENDING_MODERATION',
  FLAGGED = 'FLAGGED',
  DELETED = 'DELETED',
}

export interface CommentMetadata {
  toxicity: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  isBot: boolean;
  containsLinks: boolean;
}

// Community Types
export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  avatar?: string;
  banner?: string;
  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
  memberCount: number;
  postCount: number;
  isPrivate: boolean;
  isPremium: boolean;
  rules: string[];
  topics: string[];
  moderators: string[];
  metadata: CommunityMetadata;
}

export interface CommunityMetadata {
  growth: number;
  engagement: number;
  health: number;
  aiModeration: boolean;
}

// Notification Types
export enum NotificationType {
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  FOLLOW = 'FOLLOW',
  MENTION = 'MENTION',
  REPLY = 'REPLY',
  LIVESTREAM_STARTED = 'LIVESTREAM_STARTED',
  NEW_SUBSCRIBER = 'NEW_SUBSCRIBER',
  TIP_RECEIVED = 'TIP_RECEIVED',
  COMMUNITY_INVITE = 'COMMUNITY_INVITE',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  actor?: User;
  actorId: string;
  targetId?: string;
  targetType?: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  deepLink?: string;
}

// Livestream Types
export interface Livestream {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: LivestreamStatus;
  startedAt: Date;
  endedAt?: Date;
  viewerCount: number;
  totalViewers: number;
  isRecorded: boolean;
  recordingUrl?: string;
  thumbnailUrl?: string;
  streamKey?: string;
  ingestUrl?: string;
  metadata: LivestreamMetadata;
}

export enum LivestreamStatus {
  SCHEDULED = 'SCHEDULED',
  LIVE = 'LIVE',
  ENDED = 'ENDED',
  OFFLINE = 'OFFLINE',
}

export interface LivestreamMetadata {
  bitrate: number;
  resolution: string;
  fps: number;
  viewers: number;
  duration: number;
  peakViewers: number;
}

// Reaction Types
export enum ReactionType {
  LIKE = 'LIKE',
  LOVE = 'LOVE',
  LAUGH = 'LAUGH',
  SAD = 'SAD',
  ANGRY = 'ANGRY',
  SURPRISED = 'SURPRISED',
  FIRE = 'FIRE',
  REPOST = 'REPOST',
  BOOKMARK = 'BOOKMARK',
}

export interface Reaction {
  id: string;
  userId: string;
  targetId: string;
  targetType: 'post' | 'comment';
  type: ReactionType;
  createdAt: Date;
}

// Creator Economy Types
export interface CreatorProfile {
  userId: string;
  displayName: string;
  bio: string;
  avatar?: string;
  followerCount: number;
  totalEarnings: number;
  monthlyEarnings: number;
  products?: CreatorProduct[];
  subscriptionTier?: SubscriptionTier;
  bankAccount?: BankAccountInfo;
  taxInfo?: TaxInfo;
  analytics: CreatorAnalytics;
}

export interface CreatorProduct {
  id: string;
  creatorId: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  stock?: number;
  createdAt: Date;
}

export interface SubscriptionTier {
  id: string;
  creatorId: string;
  name: string;
  price: number;
  benefits: string[];
  memberCount: number;
}

export interface BankAccountInfo {
  accountHolderName: string;
  accountNumber: string;
  routingNumber?: string;
  bankName: string;
  currency: string;
}

export interface TaxInfo {
  taxId: string;
  taxType: string;
  country: string;
}

export interface CreatorAnalytics {
  totalViews: number;
  totalEngagement: number;
  avgEngagementRate: number;
  followerGrowth: number;
  postPerformance: PostPerformance[];
  monthlyRevenue: number[];
  audienceDemographics: AudienceDemographics;
}

export interface PostPerformance {
  postId: string;
  views: number;
  engagement: number;
  revenue: number;
}

export interface AudienceDemographics {
  ageGroups: Record<string, number>;
  genders: Record<string, number>;
  countries: Record<string, number>;
  interests: Record<string, number>;
}

// Moderation Types
export interface ModerationReport {
  id: string;
  reporterId: string;
  targetId: string;
  targetType: 'post' | 'comment' | 'user';
  reason: ReportReason;
  description?: string;
  evidence?: string[];
  status: ReportStatus;
  assignedModerator?: string;
  decision?: ModerationDecision;
  createdAt: Date;
  resolvedAt?: Date;
}

export enum ReportReason {
  HATE_SPEECH = 'HATE_SPEECH',
  VIOLENCE = 'VIOLENCE',
  HARASSMENT = 'HARASSMENT',
  SPAM = 'SPAM',
  MISINFORMATION = 'MISINFORMATION',
  NSFW = 'NSFW',
  COPYRIGHT = 'COPYRIGHT',
  IMPERSONATION = 'IMPERSONATION',
  SCAM = 'SCAM',
  OTHER = 'OTHER',
}

export enum ReportStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  IN_REVIEW = 'IN_REVIEW',
  RESOLVED = 'RESOLVED',
  APPEALED = 'APPEALED',
}

export enum ModerationDecision {
  APPROVED = 'APPROVED',
  REMOVED = 'REMOVED',
  WARNING_ISSUED = 'WARNING_ISSUED',
  ACCOUNT_SUSPENDED = 'ACCOUNT_SUSPENDED',
  ACCOUNT_BANNED = 'ACCOUNT_BANNED',
  FALSE_REPORT = 'FALSE_REPORT',
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ResponseMeta {
  timestamp: number;
  requestId: string;
  version: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Event Types for Event-Driven Architecture
export enum EventType {
  // User Events
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  // Post Events
  POST_CREATED = 'POST_CREATED',
  POST_UPDATED = 'POST_UPDATED',
  POST_PUBLISHED = 'POST_PUBLISHED',
  POST_DELETED = 'POST_DELETED',
  POST_VIRAL = 'POST_VIRAL',
  // Comment Events
  COMMENT_CREATED = 'COMMENT_CREATED',
  COMMENT_DELETED = 'COMMENT_DELETED',
  // Reaction Events
  REACTION_ADDED = 'REACTION_ADDED',
  REACTION_REMOVED = 'REACTION_REMOVED',
  // Moderation Events
  CONTENT_REPORTED = 'CONTENT_REPORTED',
  CONTENT_MODERATED = 'CONTENT_MODERATED',
  // Livestream Events
  LIVESTREAM_STARTED = 'LIVESTREAM_STARTED',
  LIVESTREAM_ENDED = 'LIVESTREAM_ENDED',
}

export interface DomainEvent {
  id: string;
  type: EventType;
  aggregateId: string;
  aggregateType: string;
  timestamp: number;
  version: number;
  data: Record<string, unknown>;
  userId?: string;
  metadata?: Record<string, unknown>;
}

// Request/Response Types
export interface CreatePostRequest {
  title?: string;
  description?: string;
  content: PostContent[];
  type: PostType;
  visibility: PostVisibility;
  tags?: string[];
  communityId?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdatePostRequest {
  title?: string;
  description?: string;
  visibility?: PostVisibility;
  tags?: string[];
}

export interface CreateCommentRequest {
  content: string;
  parentCommentId?: string;
}

export interface CreateNotificationRequest {
  userId: string;
  type: NotificationType;
  actorId: string;
  targetId?: string;
  targetType?: string;
  message: string;
  deepLink?: string;
}

// Analytics Types
export interface AnalyticsEvent {
  userId?: string;
  eventType: string;
  eventName: string;
  properties: Record<string, unknown>;
  timestamp: number;
  sessionId: string;
  deviceId: string;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  [key: string]: unknown;
}

// Error Types
export class ValidationError extends Error {
  constructor(
    public code: string,
    public message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(public code: string, public message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ConflictError extends Error {
  constructor(public code: string, public message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}
