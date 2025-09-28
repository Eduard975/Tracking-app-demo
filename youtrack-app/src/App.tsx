import { useState } from "react";
import type { Project } from "./types/project";

import MainIsland from "./components/Layout/MainIsland";
import AppSidebar from "./components/Layout/SideBar";

import { updateProjectFinished, createProject } from "./services/api";

import ContentLayout from "@jetbrains/ring-ui-built/components/content-layout/content-layout";
import Sidebar from "@jetbrains/ring-ui-built/components/content-layout/sidebar";

import "./App.css";

function App() {
  const [uiMode, setUiMode] = useState<"list" | "add">("list");

  const toggleProject = async (id: string, finished: boolean) => {
    try {
      await updateProjectFinished(id, finished);
      return true;
    } catch {
      return false;
    }
  };

  const addProject = async (project: Project) => {
    try {
      await createProject(project);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <ContentLayout>
      <Sidebar className="sidebar">
        <AppSidebar uiMode={uiMode} setUiMode={setUiMode} />
      </Sidebar>
      <div style={{ justifyContent: "space-evenly", height: "90vh" }}>
        <MainIsland
          uiMode={uiMode}
          onToggle={toggleProject}
          onSubmit={addProject}
          onCancel={() => setUiMode("list")}
        />
      </div>
    </ContentLayout>
  );
}

export default App;
