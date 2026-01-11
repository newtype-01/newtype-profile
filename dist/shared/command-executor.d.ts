export interface CommandResult {
    exitCode: number;
    stdout?: string;
    stderr?: string;
}
export interface ExecuteHookOptions {
    forceZsh?: boolean;
    zshPath?: string;
}
/**
 * Execute a hook command with stdin input
 */
export declare function executeHookCommand(command: string, stdin: string, cwd: string, options?: ExecuteHookOptions): Promise<CommandResult>;
/**
 * Execute a simple command and return output
 */
export declare function executeCommand(command: string): Promise<string>;
/**
 * Resolve embedded commands in text recursively
 */
export declare function resolveCommandsInText(text: string, depth?: number, maxDepth?: number): Promise<string>;
