export declare function resolveSkillContent(skillName: string): string | null;
export declare function resolveMultipleSkills(skillNames: string[]): {
    resolved: Map<string, string>;
    notFound: string[];
};
