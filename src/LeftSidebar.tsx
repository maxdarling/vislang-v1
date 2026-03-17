import React, {
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { useWorkspace, type Workspace } from "./WorkspaceContext";
import { useFunctionNamespace } from "./FunctionNamespaceContext";
import { clearAllPersistedData } from "./persistence";
import { parse } from "./parse";
import { prettifyScheme } from "./prettifyScheme";
import { evaluateScheme } from "./schemeEvaluator";

function WorkspaceItem({
  workspace,
  isActive,
  onClick,
  onRename,
  onDelete,
}: {
  workspace: Workspace;
  isActive: boolean;
  onClick: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(workspace.name);

  const commitRename = useCallback(() => {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== workspace.name) {
      onRename(trimmed);
    } else {
      setEditName(workspace.name);
    }
    setEditing(false);
  }, [editName, workspace.name, onRename]);

  return (
    <div
      className={`workspace-item${isActive ? " active" : ""}`}
      onClick={onClick}
    >
      {editing ? (
        <input
          className="workspace-item-input"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={commitRename}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitRename();
            if (e.key === "Escape") {
              setEditName(workspace.name);
              setEditing(false);
            }
          }}
          autoFocus
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <>
          <span className="workspace-item-name">{workspace.name}</span>
          {!workspace.isMain && (
            <span className="workspace-item-actions">
              <button
                type="button"
                className="workspace-item-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditName(workspace.name);
                  setEditing(true);
                }}
                title="Rename"
              >
                ✎
              </button>
              <button
                type="button"
                className="workspace-item-btn delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                title="Delete"
              >
                ×
              </button>
            </span>
          )}
        </>
      )}
    </div>
  );
}

export function LeftSidebar() {
  const {
    workspaces,
    activeId,
    setActiveId,
    addWorkspace,
    renameWorkspace,
    removeWorkspace,
    autosave,
    setAutosave,
    triggerSave,
  } = useWorkspace();

  const { namespace } = useFunctionNamespace();

  const mainFunction = useMemo(
    () => Object.values(namespace).find((entry) => entry.name === "main"),
    [namespace],
  );
  const mainParamCount = mainFunction?.paramCount ?? 0;
  const mainParamNames = mainFunction?.paramNames ?? [];

  const [paramValues, setParamValues] = useState<Record<number, string>>({});
  const [invalidParamIndexes, setInvalidParamIndexes] = useState<number[]>([]);
  const [compiledCode, setCompiledCode] = useState<string | null>(null);
  const [runOutput, setRunOutput] = useState<string | null>(null);
  const paramInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const [sidebarWidth, setSidebarWidth] = useState(260);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);

  const onResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isDragging.current = true;
      dragStartX.current = e.clientX;
      dragStartWidth.current = sidebarWidth;
      e.preventDefault();
    },
    [sidebarWidth],
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = e.clientX - dragStartX.current;
      setSidebarWidth(
        Math.max(140, Math.min(520, dragStartWidth.current + delta)),
      );
    };
    const onMouseUp = () => {
      isDragging.current = false;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const compileProgram = useCallback(() => {
    const programString = parse();
    const nextCode = prettifyScheme(programString);
    setCompiledCode(nextCode);
    return nextCode;
  }, []);

  const handleCompile = useCallback(() => {
    try {
      compileProgram();
    } catch (e) {
      setRunOutput(
        `compile error: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  }, [compileProgram]);

  const handleRun = useCallback(async () => {
    if (mainParamCount > 0 && (paramValues[0] ?? "").trim() === "") {
      setInvalidParamIndexes([0]);
      setRunOutput(`error: ${mainParamNames[0] ?? "arg1"} is required`);
      paramInputRefs.current[0]?.focus();
      return;
    }

    let code: string;
    try {
      code = compileProgram();
    } catch (e) {
      setRunOutput(
        `compile error: ${e instanceof Error ? e.message : String(e)}`,
      );
      return;
    }
    if (!mainFunction) {
      setRunOutput("no main function");
      return;
    }
    const paramList = Array.from(
      { length: mainParamCount },
      (_, i) => paramValues[i] ?? "",
    );
    const result = await evaluateScheme(code, paramList);
    setInvalidParamIndexes([]);
    setRunOutput(result.ok ? result.output : `error: ${result.error}`);
  }, [
    compileProgram,
    mainFunction,
    mainParamCount,
    mainParamNames,
    paramValues,
  ]);
  const [saveFlash, setSaveFlash] = useState(false);

  const handleSave = useCallback(() => {
    triggerSave();
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 1200);
  }, [triggerSave]);

  const handleReset = useCallback(() => {
    if (
      window.confirm("Reset all workspaces to defaults? This cannot be undone.")
    ) {
      clearAllPersistedData();
      window.location.reload();
    }
  }, []);

  return (
    <div className="left-sidebar" style={{ width: sidebarWidth }}>
      <div className="left-sidebar-workspace-section">
        <div className="left-sidebar-section-label">Workspaces</div>
        <div className="left-sidebar-persist">
          <button
            type="button"
            className={`persist-btn save-btn${saveFlash ? " flashed" : ""}`}
            onClick={handleSave}
            title="Save all workspace state now"
          >
            {saveFlash ? "Saved!" : "Save"}
          </button>
          <button
            type="button"
            className="persist-btn reset-btn"
            onClick={handleReset}
            title="Clear all saved state and reset to defaults"
          >
            Reset
          </button>
        </div>
        <label className="autosave-toggle">
          <input
            type="checkbox"
            checked={autosave}
            onChange={(e) => setAutosave(e.target.checked)}
          />
          <span>Autosave</span>
        </label>
        <div className="left-sidebar-workspaces">
          {workspaces.map((ws) => (
            <WorkspaceItem
              key={ws.id}
              workspace={ws}
              isActive={ws.id === activeId}
              onClick={() => setActiveId(ws.id)}
              onRename={(name) => renameWorkspace(ws.id, name)}
              onDelete={() => removeWorkspace(ws.id)}
            />
          ))}
          <button
            type="button"
            className="add-workspace-btn"
            onClick={addWorkspace}
            title="Add workspace"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="8"
                y1="3"
                x2="8"
                y2="13"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <line
                x1="3"
                y1="8"
                x2="13"
                y2="8"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="left-sidebar-run">
        <div className="run-header">Program</div>
        <button type="button" className="compile-btn" onClick={handleCompile}>
          Compile
        </button>
        <div className="scheme-label">Scheme</div>
        <pre className="compiled-code">{compiledCode ?? ""}</pre>
        <div className="scheme-label">main</div>
        {Array.from({ length: mainParamCount }, (_, i) => (
          <div key={i} className="run-param-row">
            <label className="run-param-label">
              {mainParamNames[i] ?? `p${i}`}
            </label>
            <input
              ref={(node) => {
                paramInputRefs.current[i] = node;
              }}
              className={`run-param-input${
                invalidParamIndexes.includes(i) ? " invalid" : ""
              }`}
              type="text"
              value={paramValues[i] ?? ""}
              aria-invalid={invalidParamIndexes.includes(i)}
              onChange={(e) => {
                const nextValue = e.target.value;
                setParamValues((prev) => ({ ...prev, [i]: nextValue }));
                if (
                  invalidParamIndexes.includes(i) &&
                  nextValue.trim() !== ""
                ) {
                  setInvalidParamIndexes((prev) =>
                    prev.filter((index) => index !== i),
                  );
                }
              }}
            />
          </div>
        ))}
        <button type="button" className="run-btn" onClick={handleRun}>
          Run
        </button>
        <div className="run-output">
          <span className="run-output-label">output:</span>
          <span className="run-output-value">{runOutput ?? ""}</span>
        </div>
      </div>
      <div className="sidebar-resize-handle" onMouseDown={onResizeMouseDown} />
    </div>
  );
}
