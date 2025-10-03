import { useEffect, useState } from "react";
import type { Project } from "../../types/project";

import Text from "@jetbrains/ring-ui-built/components/text/text";
import Toggle, {
  Size,
} from "@jetbrains/ring-ui-built/components/toggle/toggle";
import {
  Col,
  Grid,
  Row,
} from "@jetbrains/ring-ui-built/components/grid/grid.js";
import Button from "@jetbrains/ring-ui-built/components/button/button.js";
import ErrorMessage from "@jetbrains/ring-ui-built/components/error-message/error-message.js";
import frownIcon from "@jetbrains/icons/frown";

import { fetchProjects } from "../../services/api";
import { PAGE_SIZE } from "../../constants/PageSize";
import { OperationError } from "../../types/operationError";

export default function ProjectList({
  onToggle,
}: {
  onToggle: (id: string, finished: boolean) => Promise<boolean>;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [statuses, setStatuses] = useState<Record<string, OperationError>>({});

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<OperationError>(OperationError.None);

  const loadProjects = async (reset = false) => {
    if (loading) return;
    setLoading(true);

    try {
      const nextPage = reset ? 0 : page;
      const newProjects = await fetchProjects(nextPage, PAGE_SIZE);

      setProjects((prev) => (reset ? newProjects : [...prev, ...newProjects]));

      setHasMore(newProjects.length === PAGE_SIZE);
      setPage(nextPage + 1);
      setError(OperationError.None);
    } catch (err) {
      console.error("Failed to load projects", err);
      setError(OperationError.Get);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects(true);
  }, []);

  const handleToggle = async (id: string) => {
    const project = projects.find((p) => p.id === id);
    if (!project) return;

    setStatuses((prev) => ({ ...prev, [id]: OperationError.None }));
    const success = await onToggle(id, !project.finished);

    if (success) {
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, finished: !p.finished } : p))
      );
    } else {
      setStatuses((prev) => ({ ...prev, [id]: OperationError.Toggle }));
    }
  };

  if (error === OperationError.Get) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <ErrorMessage icon={frownIcon} message="Couldn't load the projects" />
        <Button onClick={() => loadProjects(true)}>Retry</Button>
      </div>
    );
  }

  return (
    <div>
      <Grid data-test="alignment">
        {projects.map((project) => (
          <Row key={project.id}>
            <Col xs={12} sm={6} md={6} lg={6}>
              <Text size={Text.Size.L}>{project.id}</Text>
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <Row end="xs">
                <Col xs={12}>
                  <Toggle
                    size={Size.Size14}
                    checked={project.finished}
                    onChange={() => handleToggle(project.id)}
                    leftLabel="Finished:"
                  />
                  {statuses[project.id] === OperationError.Toggle && (
                    <Text
                      size={Text.Size.S}
                      style={{ color: "var(--ring-error-color)" }}
                    >
                      Couldn't update the project
                    </Text>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        ))}
      </Grid>

      {hasMore && (
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <Button onClick={() => loadProjects()} disabled={loading}>
            {loading ? "Loading..." : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
}
