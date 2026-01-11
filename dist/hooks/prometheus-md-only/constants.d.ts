export declare const HOOK_NAME = "prometheus-md-only";
export declare const PROMETHEUS_AGENTS: string[];
export declare const ALLOWED_EXTENSIONS: string[];
export declare const ALLOWED_PATH_PREFIX = ".chief/";
export declare const BLOCKED_TOOLS: string[];
export declare const PLANNING_CONSULT_WARNING = "\n\n---\n\n[SYSTEM DIRECTIVE - READ-ONLY PLANNING CONSULTATION]\n\nYou are being invoked by Prometheus (Planner), a READ-ONLY planning agent.\n\n**CRITICAL CONSTRAINTS:**\n- DO NOT modify any files (no Write, Edit, or any file mutations)\n- DO NOT execute commands that change system state\n- DO NOT create, delete, or rename files\n- ONLY provide analysis, recommendations, and information\n\n**YOUR ROLE**: Provide consultation, research, and analysis to assist with planning.\nReturn your findings and recommendations. The actual implementation will be handled separately after planning is complete.\n\n---\n\n";
