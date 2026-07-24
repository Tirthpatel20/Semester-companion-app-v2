import {
  getSubjectAttendanceByName,
  getAllSubjectsAttendance,
  getSubjectAssessmentsByName,
  getRequiredMarksForSubject,
  getUserSubjects,
  simulateRequiredMarksForSubject,
  getallSubjectsPerformance,
  getAllSubjectsAssessments,
} from "./tool-services";

type ToolArgs = {
  subjectName?: string;
  targetPercentage?: number;
  hypotheticalScores?: {
    assessmentName: string;
    obtainedMarks: number;
  }[];
};

export async function executeTool(
  toolName: string,
  args: ToolArgs,
  userId: string,
) {
  switch (toolName) {
    case "getSubjectAttendance":
      if (!args.subjectName) {
        throw new Error("subjectName is required");
      }

      return getSubjectAttendanceByName(userId, args.subjectName);

    case "getAllSubjectsAttendance":
      return getAllSubjectsAttendance(userId);

    case "getSubjectAssessments":
      if (!args.subjectName) {
        throw new Error("subjectName is required");
      }

      return getSubjectAssessmentsByName(userId, args.subjectName);

    case "getRequiredMarks":
      if (!args.subjectName || args.targetPercentage === undefined) {
        throw new Error("subjectName and targetPercentage are required");
      }

      return getRequiredMarksForSubject(
        userId,
        args.subjectName,
        args.targetPercentage,
      );

    case "getSubjects":
      return getUserSubjects(userId);

    case "simulateRequiredMarks":
      if (
        !args.subjectName ||
        args.targetPercentage === undefined ||
        !args.hypotheticalScores
      ) {
        throw new Error(
          "subjectName, targetPercentage and hypotheticalScores are required",
        );
      }

      return simulateRequiredMarksForSubject(
        userId,
        args.subjectName,
        args.targetPercentage,
        args.hypotheticalScores,
      );

    case "getAllSubjectsPerformance":
      return getallSubjectsPerformance(userId);

    case "getAllSubjectsAssessments":
      return getAllSubjectsAssessments(userId);

    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}
