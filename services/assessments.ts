import { CreateAssessmentInput } from "@/lib/validations/create-assessment";


export async function getAssessments(subjectId: number) {
  const response = await fetch(`/api/subjects/${subjectId}/assessments`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error);
  }

  return result;
}

export async function createAssessment(
  id: number,
  data: CreateAssessmentInput
) {
  const response = await fetch(`/api/subjects/${id}/assessments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error);
  }

  return result;
}

export async function updateAssessment(
  assessmentId: number,
  data: CreateAssessmentInput
) {
  const response = await fetch(`/api/assessments/${assessmentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error);
  }

  return result;
}

export async function deleteAssessment(id: number) {
  const response = await fetch(`/api/assessments/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error);
  }

  return result;
}