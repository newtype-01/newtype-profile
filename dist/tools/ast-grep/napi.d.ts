import type { NapiLanguage, AnalyzeResult, MetaVariable } from "./types";
export declare function parseCode(code: string, lang: NapiLanguage): import("@ast-grep/napi").SgRoot<import("@ast-grep/napi/types/staticTypes").TypesMap>;
export declare function findPattern(root: ReturnType<typeof parseCode>, pattern: string): import("@ast-grep/napi").SgNode<import("@ast-grep/napi/types/staticTypes").TypesMap, import("@ast-grep/napi/types/staticTypes").Kinds<import("@ast-grep/napi/types/staticTypes").TypesMap>>[];
export declare function extractMetaVariables(node: ReturnType<ReturnType<typeof parseCode>["root"]>, pattern: string): MetaVariable[];
export declare function analyzeCode(code: string, lang: NapiLanguage, pattern: string, shouldExtractMetaVars: boolean): AnalyzeResult[];
export declare function transformCode(code: string, lang: NapiLanguage, pattern: string, rewrite: string): {
    transformed: string;
    editCount: number;
};
export declare function getRootInfo(code: string, lang: NapiLanguage): {
    kind: string;
    childCount: number;
};
