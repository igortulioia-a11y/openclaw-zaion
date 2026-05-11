import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { Type } from "@sinclair/typebox";

const sessionTodos = new Map<string, TodoItem[]>();

type TodoItem = {
  content: string;
  status: "pending" | "in_progress" | "completed";
  activeForm: string;
};

const TodoSchema = Type.Object({
  content: Type.String({ minLength: 1, description: "Imperative form (e.g. 'Run tests')" }),
  status: Type.Union(
    [Type.Literal("pending"), Type.Literal("in_progress"), Type.Literal("completed")],
    { description: "Task state" },
  ),
  activeForm: Type.String({
    minLength: 1,
    description: "Present continuous form shown during execution (e.g. 'Running tests')",
  }),
});

function renderTodos(todos: TodoItem[]): string {
  if (todos.length === 0) return "(no todos)";
  const lines = todos.map((t) => {
    const mark = t.status === "completed" ? "[x]" : t.status === "in_progress" ? "[~]" : "[ ]";
    const label = t.status === "in_progress" ? t.activeForm : t.content;
    const suffix = t.status === "in_progress" ? "  <-- in progress" : "";
    return `${mark} ${label}${suffix}`;
  });
  return lines.join(String.fromCharCode(10));
}

function sessionKey(agentId: string, sessionId: string): string {
  return `${agentId}:${sessionId}`;
}

export default definePluginEntry({
  id: "zaion-todowrite",
  name: "Zaion TodoWrite",
  description:
    "In-session task tracking tool. Maintain a structured todo list across multi-step work to reduce drift.",
  register(api) {
    api.registerTool({
      name: "todo_write",
      description: [
        "Create or update the agent's session-scoped todo list to track multi-step work.",
        "Use for tasks with 3+ steps or that span multiple turns.",
        "States: pending | in_progress | completed. Keep exactly one task in_progress at a time.",
        "Mark completed immediately when a step finishes (do not batch).",
      ].join(" "),
      parameters: Type.Object({
        todos: Type.Array(TodoSchema, {
          description: "Ordered list replacing the current session todos.",
        }),
      }),
      async execute(toolCallId: string, params: { todos: TodoItem[] }, ctx?: { agentId?: string; sessionId?: string }) {
        const agentId = ctx?.agentId ?? "default";
        const sessionId = ctx?.sessionId ?? "session";
        const key = sessionKey(agentId, sessionId);
        const todos = params.todos;

        const inProgress = todos.filter((t) => t.status === "in_progress");
        if (inProgress.length > 1) {
          return {
            content: [
              {
                type: "text",
                text: "ERROR: more than one task is in_progress. Exactly one task may be in_progress at a time. Mark all but one as pending or completed and retry.",
              },
            ],
            isError: true,
          };
        }

        sessionTodos.set(key, todos);
        const counts = {
          pending: todos.filter((t) => t.status === "pending").length,
          in_progress: inProgress.length,
          completed: todos.filter((t) => t.status === "completed").length,
        };

        const header = `Todos updated (${counts.completed}/${todos.length} completed, ${counts.in_progress} in progress, ${counts.pending} pending):`;
        const body = renderTodos(todos);
        return {
          content: [
            {
              type: "text",
              text: `${header}${String.fromCharCode(10, 10)}${body}`,
            },
          ],
        };
      },
    });

    api.logger?.info?.("zaion-todowrite: registered tool 'todo_write'");
  },
});
