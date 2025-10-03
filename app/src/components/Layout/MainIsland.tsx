import type { Project } from "../../types/project";
import ProjectList from "../ProjectList/ProjectList";
import ProjectForm from "../ProjectForm/ProjectForm";

import Island from "@jetbrains/ring-ui-built/components/island/island";
import Header from "@jetbrains/ring-ui-built/components/island/header";
import Content from "@jetbrains/ring-ui-built/components/island/content";

export default function MainIsland({
  uiMode,
  onToggle,
  onSubmit,
  onCancel,
}: {
  uiMode: "list" | "add";
  onToggle: (id: string, finished: boolean) => Promise<boolean>;
  onSubmit: (project: Project) => Promise<boolean>;
  onCancel: () => void;
}) {
  return (
    <Island className="limited-island" style={{ margin: "16px 0" }} narrow>
      <Header border>
        {uiMode === "list" ? "Projects" : "Add New Project"}
      </Header>
      <Content fade style={{ maxHeight: "90vh" }}>
        {uiMode === "list" ? (
          <ProjectList onToggle={onToggle} />
        ) : (
          <ProjectForm onSubmit={onSubmit} onCancel={onCancel} />
        )}
      </Content>
    </Island>
  );
}
