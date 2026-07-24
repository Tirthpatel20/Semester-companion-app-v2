import { db } from "@/db";
import { subjects } from "@/db/schema";
import { and, eq } from "drizzle-orm";

import { calculateAttendanceStats } from "../attendance";
import { calculateRequiredMarks, simulateRequiredMarks } from "../marks";
import { calculateSubjectPerformance } from "../performance";

export async function getSubjectAttendanceByName(
  userId: string,
  subjectName: string,
) {
  const subject = await db.query.subjects.findFirst({
    where: and(eq(subjects.userId, userId), eq(subjects.name, subjectName)),

    with: {
      attendanceRecords: {
        orderBy: (attendance, { asc }) => [asc(attendance.attendanceDate)],
      },
    },
  });

  if (!subject) {
    return {
      success: false,
      error: "SUBJECT_NOT_FOUND",
      message: `No subject named "${subjectName}" was found for this user.`,
    };
  }

  const stats = calculateAttendanceStats(subject.attendanceRecords);

  return {
    success: true,

    subject: {
      id: subject.id,
      name: subject.name,
      credits: subject.credits,
      totalClasses: subject.totalClasses,
    },

    attendance: stats,
  };
}

export async function getAllSubjectsAttendance(userId: string) {
  const userSubjects = await db.query.subjects.findMany({
    where: eq(subjects.userId, userId),

    with: {
      attendanceRecords: true,
    },
  });

  if (userSubjects.length === 0) {
    return {
      success: false,
      error: "NO_SUBJECTS_FOUND",
      message: "The user has not added any subjects yet.",
    };
  }

  return {
    success: true,

    subjects: userSubjects.map((subject) => ({
      subject: {
        id: subject.id,
        name: subject.name,
        credits: subject.credits,
        totalClasses: subject.totalClasses,
      },

      attendance: calculateAttendanceStats(subject.attendanceRecords),
    })),
  };
}

export async function getSubjectAssessmentsByName(
  userId: string,
  subjectName: string,
) {
  const subject = await db.query.subjects.findFirst({
    where: and(eq(subjects.userId, userId), eq(subjects.name, subjectName)),

    with: {
      assessments: true,
    },
  });

  if (!subject) {
    return {
      success: false,
      error: "SUBJECT_NOT_FOUND",
      message: `No subject named "${subjectName}" was found for this user.`,
    };
  }

  return {
    success: true,

    subject: {
      id: subject.id,
      name: subject.name,
      credits: subject.credits,
    },

    assessments: subject.assessments,
  };
}

export async function getRequiredMarksForSubject(
  userId: string,
  subjectName: string,
  targetPercentage: number,
) {
  const subject = await db.query.subjects.findFirst({
    where: and(eq(subjects.userId, userId), eq(subjects.name, subjectName)),

    with: {
      assessments: true,
    },
  });

  if (!subject) {
    return {
      success: false,
      error: "SUBJECT_NOT_FOUND",
      message: `No subject named "${subjectName}" was found for this user.`,
    };
  }

  const calculation = calculateRequiredMarks(
    subject.assessments,
    targetPercentage,
  );

  return {
    success: true,

    subject: {
      id: subject.id,
      name: subject.name,
      credits: subject.credits,
    },

    calculation,
  };
}

export async function getUserSubjects(userId: string) {
  const userSubjects = await db.query.subjects.findMany({
    where: eq(subjects.userId, userId),
    columns: {
      id: true,
      name: true,
      credits: true,
    },
  });

  if (userSubjects.length === 0) {
    return {
      success: false,
      error: "NO_SUBJECTS_FOUND",
      message: "The user has not added any subjects yet.",
    };
  }

  return {
    success: true,
    subjects: userSubjects,
  };
}

export async function simulateRequiredMarksForSubject(
  userId: string,
  subjectName: string,
  targetPercentage: number,
  hypotheticalScores: {
    assessmentName: string;
    obtainedMarks: number;
  }[],
) {
  const subject = await db.query.subjects.findFirst({
    where: and(eq(subjects.userId, userId), eq(subjects.name, subjectName)),

    with: {
      assessments: true,
    },
  });

  if (!subject) {
    return {
      success: false,
      error: "SUBJECT_NOT_FOUND",
      message: `No subject named "${subjectName}" was found for this user.`,
    };
  }

  const simulation = simulateRequiredMarks(
    subject.assessments,
    hypotheticalScores,
    targetPercentage,
  );

  return {
    success: true,

    subject: {
      id: subject.id,
      name: subject.name,
      credits: subject.credits,
    },

    hypotheticalScores,

    simulation,
  };
}

export async function getallSubjectsPerformance(userId: string) {
  const userSubjects = await db.query.subjects.findMany({
    where: eq(subjects.userId, userId),
    with: {
      assessments: true,
    },
  });

  if (userSubjects.length === 0) {
    return {
      success: false,
      error: "NO_SUBJECTS_FOUND",
      message: "The user has not added any subjects yet.",
    };
  }

  return {
    success: true,

    subjects: userSubjects.map((subject) => ({
      subject: {
        id: subject.id,
        name: subject.name,
        credits: subject.credits,
      },

      performance: calculateSubjectPerformance(subject.assessments),
    })),
  };
}

export async function getAllSubjectsAssessments(userId: string) {
  const userSubjects = await db.query.subjects.findMany({
    where: eq(subjects.userId, userId),

    with: {
      assessments: true,
    },
  });

  if (userSubjects.length === 0) {
    return {
      success: false,
      error: "NO_SUBJECTS_FOUND",
      message: "The user has not added any subjects yet.",
    };
  }

  return {
    success: true,

    subjects: userSubjects.map((subject) => ({
      subject: {
        id: subject.id,
        name: subject.name,
        credits: subject.credits,
      },

      assessments: subject.assessments,
    })),
  };
}
