import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
};

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  displayName: text("display_name"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  contactEmail: text("contact_email"),
  registrationCompleted: integer("registration_completed", { mode: "boolean" }).notNull().default(false),
  registeredAt: text("registered_at"),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  emailVerifiedAt: text("email_verified_at"),
  emailVerificationTokenHash: text("email_verification_token_hash"),
  emailVerificationExpiresAt: text("email_verification_expires_at"),
  role: text("role").notNull().default("ambassador"),
  accessStatus: text("access_status").notNull().default("training"),
  ...timestamps,
}, (table) => [uniqueIndex("users_email_uq").on(table.email)]);

export const courses = sqliteTable("courses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  version: text("version").notNull(),
  legalStatus: text("legal_status").notNull().default("draft"),
  isMandatory: integer("is_mandatory", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

export const learningProgress = sqliteTable("learning_progress", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  moduleNumber: integer("module_number").notNull(),
  percent: integer("percent").notNull().default(0),
  status: text("status").notNull().default("not_started"),
  lastPosition: text("last_position"),
  ...timestamps,
}, (table) => [uniqueIndex("progress_user_course_module_uq").on(table.userId, table.courseId, table.moduleNumber)]);

export const lessonProgress = sqliteTable("lesson_progress", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id),
  lessonId: text("lesson_id").notNull(),
  completionPercent: integer("completion_percent").notNull().default(100),
  completedAt: text("completed_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("lesson_progress_user_lesson_uq").on(table.userId, table.lessonId)]);

export const demoProgress = sqliteTable("demo_progress", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id),
  demoId: text("demo_id").notNull(),
  completionPercent: integer("completion_percent").notNull().default(100),
  completedAt: text("completed_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("demo_progress_user_demo_uq").on(table.userId, table.demoId)]);

export const blockProgress = sqliteTable("block_progress", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id),
  blockId: text("block_id").notNull(),
  completedAt: text("completed_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("block_progress_user_block_uq").on(table.userId, table.blockId)]);

export const videoSubmissions = sqliteTable("video_submissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id),
  objectKey: text("object_key").notNull(),
  filename: text("filename").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  contentType: text("content_type").notNull(),
  durationSeconds: integer("duration_seconds"),
  submittedAt: text("submitted_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("video_submissions_user_uq").on(table.userId)]);

export const emailNotifications = sqliteTable("email_notifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id),
  eventType: text("event_type").notNull(),
  recipient: text("recipient").notNull(),
  status: text("status").notNull().default("pending"),
  providerMessageId: text("provider_message_id"),
  errorMessage: text("error_message"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  sentAt: text("sent_at"),
}, (table) => [uniqueIndex("email_notifications_user_event_uq").on(table.userId, table.eventType)]);

export const approvals = sqliteTable("approvals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  version: text("version").notNull(),
  status: text("status").notNull().default("pending"),
  reviewerId: text("reviewer_id").references(() => users.id),
  comment: text("comment"),
  ...timestamps,
}, (table) => [index("approvals_entity_idx").on(table.entityType, table.entityId)]);

export const leads = sqliteTable("leads", {
  id: text("id").primaryKey(),
  ambassadorId: text("ambassador_id").notNull().references(() => users.id),
  stage: text("stage").notNull().default("registered"),
  attributionStatus: text("attribution_status").notNull().default("pending"),
  consentVersion: text("consent_version"),
  consentRecordedAt: text("consent_recorded_at"),
  rejectionReasonCode: text("rejection_reason_code"),
  ...timestamps,
}, (table) => [index("leads_ambassador_stage_idx").on(table.ambassadorId, table.stage)]);

export const rewards = sqliteTable("rewards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  leadId: text("lead_id").notNull().references(() => leads.id),
  modelVersion: text("model_version").notNull(),
  basisKopecks: integer("basis_kopecks").notNull(),
  rateBasisPoints: integer("rate_basis_points").notNull(),
  preliminaryKopecks: integer("preliminary_kopecks").notNull(),
  confirmedKopecks: integer("confirmed_kopecks"),
  status: text("status").notNull().default("preliminary"),
  ...timestamps,
});

export const auditLog = sqliteTable("audit_log", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  actorId: text("actor_id").references(() => users.id),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  metadataJson: text("metadata_json").notNull().default("{}"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("audit_actor_created_idx").on(table.actorId, table.createdAt)]);
