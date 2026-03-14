import type { Node, Edge } from "@xyflow/react";

const PREFIX = "vislang_";
const WORKSPACE_LIST_KEY = `${PREFIX}workspace_list`;
const ACTIVE_ID_KEY = `${PREFIX}active_id`;
const AUTOSAVE_KEY = `${PREFIX}autosave`;

export interface PersistedWorkspace {
  id: string;
  name: string;
  isMain: boolean;
  paramCount: number;
}

export interface PersistedWorkspaceData {
  nodes: Node[];
  edges: Edge[];
}

export function loadWorkspaceList(): PersistedWorkspace[] | null {
  try {
    const raw = localStorage.getItem(WORKSPACE_LIST_KEY);
    return raw ? (JSON.parse(raw) as PersistedWorkspace[]) : null;
  } catch {
    return null;
  }
}

export function saveWorkspaceList(workspaces: PersistedWorkspace[]): void {
  try {
    localStorage.setItem(WORKSPACE_LIST_KEY, JSON.stringify(workspaces));
  } catch (e) {
    console.warn("Failed to save workspace list", e);
  }
}

export function loadActiveId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_ID_KEY);
  } catch {
    return null;
  }
}

export function saveActiveId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_ID_KEY, id);
  } catch (e) {
    console.warn("Failed to save active id", e);
  }
}

export function loadAutosave(): boolean {
  try {
    return localStorage.getItem(AUTOSAVE_KEY) === "true";
  } catch {
    return false;
  }
}

export function saveAutosave(enabled: boolean): void {
  try {
    localStorage.setItem(AUTOSAVE_KEY, String(enabled));
  } catch (e) {
    console.warn("Failed to save autosave preference", e);
  }
}

export function loadWorkspaceData(id: string): PersistedWorkspaceData | null {
  try {
    const raw = localStorage.getItem(`${PREFIX}ws_${id}`);
    return raw ? (JSON.parse(raw) as PersistedWorkspaceData) : null;
  } catch {
    return null;
  }
}

export function saveWorkspaceData(
  id: string,
  data: PersistedWorkspaceData,
): void {
  try {
    localStorage.setItem(`${PREFIX}ws_${id}`, JSON.stringify(data));
  } catch (e) {
    console.warn("Failed to save workspace data", e);
  }
}

export function clearAllPersistedData(): void {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(PREFIX)) keysToRemove.push(key);
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k));
}
