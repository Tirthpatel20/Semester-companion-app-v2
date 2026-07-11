type Assessment = {
  maxMarks: number;
  obtainedMarks: number | null;
  weightage: number;
};

export function calculateSubjectPerformance(
  assessments: Assessment[],
) {
  let securedWeightedScore = 0;
  let completedWeightage = 0;

  for (const assessment of assessments) {
    if (assessment.obtainedMarks === null) {
      continue;
    }

    const contribution =
      (assessment.obtainedMarks /
        assessment.maxMarks) *
      assessment.weightage;

    securedWeightedScore += contribution;
    completedWeightage += assessment.weightage;
  }

  const currentPerformance =
    completedWeightage === 0
      ? null
      : (securedWeightedScore /
          completedWeightage) *
        100;

  return {
    securedWeightedScore: Number(
      securedWeightedScore.toFixed(2),
    ),

    completedWeightage,

    currentPerformance:
      currentPerformance === null
        ? null
        : Number(currentPerformance.toFixed(2)),
  };
}