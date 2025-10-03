import type { Project } from "../types/project";

const API_URL = "http://localhost:8080/api/projects";

export async function fetchProjects(
  page: number = 0,
  size: number = 10
): Promise<Project[]> {
  const res = await fetch(`${API_URL}?page=${page}&size=${size}`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data.content ?? [];
}

export async function createProject(project: Project): Promise<Project> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to create project");
  }

  return data;
}

export async function updateProjectFinished(id: string, finished: boolean) {
  const res = await fetch(`${API_URL}/${id}/finished`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ finished }),
  });

  if (!res.ok) {
    throw new Error("Failed to update project");
  }

  return res.json();
}
