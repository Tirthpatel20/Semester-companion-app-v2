type Assessment = {
  name: string;
  maxMarks: number;
  obtainedMarks: number | null;
  weightage: number;
};

type HypotheticalScore = {
  assessmentName: string;
  obtainedMarks: number;
};

export function calculateRequiredMarks(
  assessments: Assessment[],
  targetPercentage: number,
) {
  let status:
    | "already_achieved"
    | "achievable"
    | "impossible"
    | "completed"
    | "incomplete_structure"
    | "invalid_structure";

  const totalWeightage = assessments.reduce(
    (sum, assessment) => sum + assessment.weightage,
    0,
  );

  if (totalWeightage < 100) {
    return {
      status: "incomplete_structure" as const,
      totalWeightage,
      missingWeightage: 100 - totalWeightage,
    };
  }

  if (totalWeightage > 100) {
    return {
      status: "invalid_structure" as const,
      totalWeightage,
      excessWeightage: totalWeightage - 100,
    };
  }

  let securedWeightedScore = 0;
  let remainingWeightage = 0;

  for (const assessment of assessments) {
    if (assessment.obtainedMarks === null) {
      remainingWeightage += assessment.weightage;
      continue;
    }

    const contribution =
      (assessment.obtainedMarks / assessment.maxMarks) * assessment.weightage;

    securedWeightedScore += contribution;
  }

  const scoreStillNeeded = targetPercentage - securedWeightedScore;

  let requiredPerformance: number | null = null;

  if (remainingWeightage === 0) {
    status = "completed";
  } else if (scoreStillNeeded <= 0) {
    status = "already_achieved";
    requiredPerformance = 0;
  } else {
    requiredPerformance = (scoreStillNeeded / remainingWeightage) * 100;

    status = requiredPerformance <= 100 ? "achievable" : "impossible";
  }

  return {
    status,

    targetPercentage,

    securedWeightedScore: Number(securedWeightedScore.toFixed(2)),

    remainingWeightage,

    scoreStillNeeded: Number(Math.max(0, scoreStillNeeded).toFixed(2)),

    requiredPerformance:
      requiredPerformance === null
        ? null
        : Number(requiredPerformance.toFixed(2)),
  };
}

export function simulateRequiredMarks(
  assessments: Assessment[],
  hypotheticalScores: HypotheticalScore[],
  targetPercentage: number,
) {
  const usedAssessmentNames = new Set<string>();

  for (const hypothetical of hypotheticalScores) {
    const assessment = assessments.find(
      (assessment) =>
        assessment.name.toLowerCase() ===
        hypothetical.assessmentName.toLowerCase(),
    );

    if (!assessment) {
      return {
        status: "assessment_not_found" as const,
        assessmentName: hypothetical.assessmentName,
      };
    }

    const normalizedName =
      hypothetical.assessmentName.toLowerCase();

    if (usedAssessmentNames.has(normalizedName)) {
      return {
        status: "duplicate_hypothesis" as const,
        assessmentName: hypothetical.assessmentName,
      };
    }

    usedAssessmentNames.add(normalizedName);

    if (
      hypothetical.obtainedMarks < 0 ||
      hypothetical.obtainedMarks > assessment.maxMarks
    ) {
      return {
        status: "invalid_hypothetical_score" as const,
        assessmentName: assessment.name,
        obtainedMarks: hypothetical.obtainedMarks,
        maxMarks: assessment.maxMarks,
      };
    }
  }

  const simulatedAssessments = assessments.map(
    (assessment) => {
      const hypotheticalScore =
        hypotheticalScores.find(
          (score) =>
            score.assessmentName.toLowerCase() ===
            assessment.name.toLowerCase(),
        );

      if (!hypotheticalScore) {
        return assessment;
      }

      return {
        ...assessment,
        obtainedMarks:
          hypotheticalScore.obtainedMarks,
      };
    },
  );

  return calculateRequiredMarks(
    simulatedAssessments,
    targetPercentage,
  );
}