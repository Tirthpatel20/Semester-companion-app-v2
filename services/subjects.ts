import type { CreateSubjectInput } from "@/lib/validations/create-subject";

export async function getSubjects() {
    const response = await fetch("/api/subjects");

    if (!response.ok) {
    throw new Error("Failed to fetch subjects");
  }

  return response.json();
}

export async function getSubject(id?: number) {
  const response = await fetch(`/api/subjects/${id}`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error);
  }

  return result;
}

export async function createSubject(data: CreateSubjectInput) {
    const response = await fetch("/api/subjects", {
        method: "POST",
        headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    })

    const result = await response.json();

    if(!response.ok) throw new Error(result.error || "Failed to create subject");

    return result;
}

export async function deleteSubject(id: number) {
  const response = await fetch(`/api/subjects/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error);
  }

  return result;
}

export async function updateSubject(
  id: number,
  data: CreateSubjectInput,
) {
  const response = await fetch(`/api/subjects/${id}`, {
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