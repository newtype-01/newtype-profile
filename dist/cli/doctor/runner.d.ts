import type { DoctorOptions, DoctorResult, CheckDefinition, CheckResult, DoctorSummary, CheckCategory } from "./types";
export declare function runCheck(check: CheckDefinition): Promise<CheckResult>;
export declare function calculateSummary(results: CheckResult[], duration: number): DoctorSummary;
export declare function determineExitCode(results: CheckResult[]): number;
export declare function filterChecksByCategory(checks: CheckDefinition[], category?: CheckCategory): CheckDefinition[];
export declare function groupChecksByCategory(checks: CheckDefinition[]): Map<CheckCategory, CheckDefinition[]>;
export declare function runDoctor(options: DoctorOptions): Promise<DoctorResult>;
