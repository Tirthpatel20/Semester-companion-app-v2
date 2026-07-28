import {
  pgTable,
  text,
  integer,
  timestamp,
  date,
  unique,
  boolean,
  check,
  real,
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";

import { sql } from "drizzle-orm";

import { user } from "./auth-schema";

export const subjects = pgTable(
  "subjects",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
      }),

    name: text("name").notNull(),

    credits: real("credits").notNull(),

    totalClasses: integer("total_classes").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [unique().on(table.userId, table.name)],
);

export const attendanceRecords = pgTable(
  "attendance_records",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

    subjectId: integer("subject_id")
      .notNull()
      .references(() => subjects.id, {
        onDelete: "cascade",
      }),

    attendanceDate: date("attendance_date").notNull(),

    status: text("status").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    unique().on(table.subjectId, table.attendanceDate),
    check(
      "valid_attendance_status",
      sql`${table.status} IN ('Present', 'Absent', 'Cancelled')`,
    ),
  ],
);

export const assessments = pgTable(
  "assessments",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

    subjectId: integer("subject_id")
      .notNull()
      .references(() => subjects.id, {
        onDelete: "cascade",
      }),

    name: text("name").notNull(),

    maxMarks: integer("max_marks").notNull(),

    obtainedMarks: real("obtained_marks"),

    weightage: integer("weightage").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    unique().on(table.subjectId, table.name),

    check(
      "valid_weightage",
      sql`${table.weightage} >= 0
          AND
          ${table.weightage} <= 100`,
    ),

    check("valid_max_marks", sql`${table.maxMarks} > 0`),

    check(
      "valid_obtained_marks",
      sql`${table.obtainedMarks} IS NULL
          OR
          ${table.obtainedMarks} <= ${table.maxMarks}`,
    ),
  ],
);

export const aiConversations = pgTable("ai_conversations", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    }),

  title: text("title").notNull(),

  latestInteractionId: text("latest_interaction_id"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const aiMessages = pgTable(
  "ai_messages",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

    conversationId: integer("conversation_id")
      .notNull()
      .references(() => aiConversations.id, {
        onDelete: "cascade",
      }),

    role: text("role").notNull(),

    content: text("content").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    check("valid_message_role", sql`${table.role} IN ('user', 'assistant')`),
  ],
);

export const subjectRelations = relations(subjects, ({ many }) => ({
  attendanceRecords: many(attendanceRecords),
  assessments: many(assessments),
}));

export const aiConversationRelations = relations(
  aiConversations,
  ({ many }) => ({
    messages: many(aiMessages),
  }),
);

export const aiMessageRelations = relations(aiMessages, ({ one }) => ({
  conversation: one(aiConversations, {
    fields: [aiMessages.conversationId],
    references: [aiConversations.id],
  }),
}));

export const attendanceRelations = relations(attendanceRecords, ({ one }) => ({
  subject: one(subjects, {
    fields: [attendanceRecords.subjectId],
    references: [subjects.id],
  }),
}));

export const assessmentRelations = relations(assessments, ({ one }) => ({
  subject: one(subjects, {
    fields: [assessments.subjectId],
    references: [subjects.id],
  }),
}));
