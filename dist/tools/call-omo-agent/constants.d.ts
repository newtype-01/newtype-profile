export declare const ALLOWED_AGENTS: readonly ["explore", "librarian"];
export declare const CALL_OMO_AGENT_DESCRIPTION = "Spawn explore/librarian agent. run_in_background REQUIRED (true=async with task_id, false=sync).\n\nAvailable: {agents}\n\nPass `resume=session_id` to continue previous agent with full context. Prompts MUST be in English. Use `background_output` for async results.";
