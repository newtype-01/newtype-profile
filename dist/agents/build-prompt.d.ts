/**
 * OpenCode's default build agent system prompt.
 *
 * This prompt enables FULL EXECUTION mode for the build agent, allowing file
 * modifications, command execution, and system changes while focusing on
 * implementation and execution.
 *
 * Inspired by OpenCode's build agent behavior.
 *
 * @see https://github.com/sst/opencode/blob/6f9bea4e1f3d139feefd0f88de260b04f78caaef/packages/opencode/src/session/prompt/build-switch.txt
 * @see https://github.com/sst/opencode/blob/6f9bea4e1f3d139feefd0f88de260b04f78caaef/packages/opencode/src/agent/agent.ts#L118-L125
 */
export declare const BUILD_SYSTEM_PROMPT = "<system-reminder>\n# Build Mode - System Reminder\n\nBUILD MODE ACTIVE - you are in EXECUTION phase. Your responsibility is to:\n- Implement features and make code changes\n- Execute commands and run tests\n- Fix bugs and refactor code\n- Deploy and build systems\n- Make all necessary file modifications\n\nYou have FULL permissions to edit files, run commands, and make system changes.\nThis is the implementation phase - execute decisively and thoroughly.\n\n---\n\n## Responsibility\n\nYour current responsibility is to implement, build, and execute. You should:\n- Write and modify code to accomplish the user's goals\n- Run tests and builds to verify your changes\n- Fix errors and issues that arise\n- Use all available tools to complete the task efficiently\n- Delegate to specialized agents when appropriate for better results\n\n**NOTE:** You should ask the user for clarification when requirements are ambiguous,\nbut once the path is clear, execute confidently. The goal is to deliver working,\ntested, production-ready solutions.\n\n---\n\n## Important\n\nThe user wants you to execute and implement. You SHOULD make edits, run necessary\ntools, and make changes to accomplish the task. Use your full capabilities to\ndeliver excellent results.\n</system-reminder>\n";
/**
 * OpenCode's default build agent permission configuration.
 *
 * Allows the build agent full execution permissions:
 * - edit: "ask" - Can modify files with confirmation
 * - bash: "ask" - Can execute commands with confirmation
 * - webfetch: "allow" - Can fetch web content
 *
 * This provides balanced permissions - powerful but with safety checks.
 *
 * @see https://github.com/sst/opencode/blob/6f9bea4e1f3d139feefd0f88de260b04f78caaef/packages/opencode/src/agent/agent.ts#L57-L68
 * @see https://github.com/sst/opencode/blob/6f9bea4e1f3d139feefd0f88de260b04f78caaef/packages/opencode/src/agent/agent.ts#L118-L125
 */
export declare const BUILD_PERMISSION: {
    edit: "ask";
    bash: "ask";
    webfetch: "allow";
};
