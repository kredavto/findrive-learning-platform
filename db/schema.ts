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
