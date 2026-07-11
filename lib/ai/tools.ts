export const attendanceTool = {
  type: "function" as const,

  name: "getSubjectAttendance",

  description:
    "Get the authenticated student's attendance statistics for a specific subject.",

  parameters: {
    type: "object",

    properties: {
      subjectName: {
        type: "string",
        description: "The name of the subject.",
      },
    },
    required: ["subjectName"],
  },
};

export const allSubjectsAttendanceTool = {
  type: "function" as const,

  name: "getAllSubjectsAttendance",

  description:
    "Get attendance statistics for all subjects of the authenticated student. Use this when the user asks about attendance risk, comparisons, priorities, or attendance across multiple subjects.",

  parameters: {
    type: "object",
    properties: {},
  },
};

export const subjectAssessmentsTool = {
  type: "function" as const,

  name: "getSubjectAssessments",

  description:
    "Get all assessment and marks data for a specific subject, including maximum marks, obtained marks, and weightage. Use this for questions about marks, assessment performance, or remaining assessments in one subject.",

  parameters: {
    type: "object",

    properties: {
      subjectName: {
        type: "string",
        description: "The name of the subject whose assessment data is needed.",
      },
    },

    required: ["subjectName"],
  },
};

export const requiredMarksTool = {
  type: "function" as const,

  name: "getRequiredMarks",

  description:
    "Calculate the performance required in remaining assessments for a specific subject to reach a target final percentage. Use this when the student asks what they need to score or achieve in order to reach a target percentage.",

  parameters: {
    type: "object",

    properties: {
      subjectName: {
        type: "string",
        description: "The name of the subject.",
      },

      targetPercentage: {
        type: "number",
        description: "The desired final percentage in the subject.",
      },
    },

    required: ["subjectName", "targetPercentage"],
  },
};

export const subjectsTool = {
  type: "function" as const,

  name: "getSubjects",

  description:
    "Get the authenticated student's subjects, including their names and credits. Use this when the user's subject reference is unclear, misspelled, abbreviated, or when answering questions about their subject list.",

  parameters: {
    type: "object",
    properties: {},
  },
};

export const marksSimulationTool = {
  type: "function" as const,

  name: "simulateRequiredMarks",

  description:
    "Simulate hypothetical assessment scores for a subject and calculate what performance is required in the remaining assessments to reach a target final percentage. Use this for what-if questions involving assumed future assessment scores.",

  parameters: {
    type: "object",

    properties: {
      subjectName: {
        type: "string",
        description: "The name of the subject.",
      },

      targetPercentage: {
        type: "number",
        description:
          "The target final percentage the student wants to achieve.",
      },

      hypotheticalScores: {
        type: "array",

        items: {
          type: "object",

          properties: {
            assessmentName: {
              type: "string",
              description:
                "The name of the assessment whose score is being assumed.",
            },

            obtainedMarks: {
              type: "number",
              description:
                "The hypothetical raw marks scored in the assessment.",
            },
          },

          required: ["assessmentName", "obtainedMarks"],
        },
      },
    },

    required: ["subjectName", "targetPercentage", "hypotheticalScores"],
  },
};

export const allSubjectsPerformanceTool = {
  type: "function" as const,

  name: "getAllSubjectsPerformance",

  description:
    "Get the student's current academic performance across all subjects based on completed assessments. Use this for comparing subject performance, finding strongest or weakest subjects, or identifying subjects that need more academic focus.",

  parameters: {
    type: "object",
    properties: {},
  },
};
