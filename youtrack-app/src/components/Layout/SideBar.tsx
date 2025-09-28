import Button from "@jetbrains/ring-ui-built/components/button/button";
import ButtonSet from "@jetbrains/ring-ui-built/components/button-set/button-set.js";

export default function AppSidebar({
  uiMode,
  setUiMode,
}: {
  uiMode: "list" | "add";
  setUiMode: (mode: "list" | "add") => void;
}) {
  return (
    <ButtonSet
      style={{
        display: "flex",
        flexDirection: "column",
        margin: "16px 0",
      }}
    >
      <Button
        active={uiMode === "list"}
        ghost={true}
        onClick={() => setUiMode("list")}
      >
        Projects
      </Button>
      <Button
        active={uiMode === "add"}
        ghost={true}
        onClick={() => setUiMode("add")}
      >
        Add new project
      </Button>
    </ButtonSet>
  );
}
