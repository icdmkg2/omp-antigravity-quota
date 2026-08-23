import { Container } from "@oh-my-pi/pi-tui";
import type { TodoItem } from "../../tools/todo.js";
/**
 * Component that renders a todo completion reminder notification, committed into
 * the transcript like a TTSR notification so it stays anchored in history rather
 * than floating above the editor.
 * Shows when the agent stops with incomplete todos.
 */
export declare class TodoReminderComponent extends Container {
    #private;
    private readonly todos;
    private readonly attempt;
    private readonly maxAttempts;
    constructor(todos: TodoItem[], attempt: number, maxAttempts: number);
    setToolActivityVisible(visible: boolean): void;
    render(width: number): readonly string[];
}
