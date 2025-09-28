import { useState } from "react";
import type { Project } from "../../types/project";

import Input, {
  Size as ISize,
} from "@jetbrains/ring-ui-built/components/input/input";
import Toggle, {
  Size as TSize,
} from "@jetbrains/ring-ui-built/components/toggle/toggle";
import Panel from "@jetbrains/ring-ui-built/components/panel/panel";
import Button from "@jetbrains/ring-ui-built/components/button/button";
import Text from "@jetbrains/ring-ui-built/components/text/text";

export default function ProjectForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (project: Project) => Promise<boolean>;
  onCancel: () => void;
}) {
  const [id, setId] = useState("");
  const [finished, setFinished] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id.trim()) return;

    const success = await onSubmit({ id, finished });
    if (success) {
      setSubmitStatus("success");
      setId("");
    } else {
      setSubmitStatus("error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "16px" }}
    >
      <Input
        label="Project Name"
        placeholder="Enter project name"
        value={id}
        size={ISize.L}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setId(e.target.value)
        }
        error={submitStatus === "error" ? "Project already exists" : null}
      />

      <Toggle
        size={TSize.Size16}
        checked={finished}
        onChange={() => setFinished(!finished)}
        leftLabel="Finished:"
      />

      {submitStatus === "success" && (
        <Text style={{ color: "var(--ring-success-color)" }}>
          Project submitted successfully
        </Text>
      )}

      <Panel style={{ paddingBottom: `calc(${2} * var(--ring-unit))` }}>
        <Button primary onClick={handleSubmit}>
          Submit
        </Button>

        <Button onClick={onCancel}>Cancel</Button>
      </Panel>
    </form>
  );
}
