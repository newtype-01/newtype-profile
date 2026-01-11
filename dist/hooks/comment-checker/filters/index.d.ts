import type { CommentInfo } from "../types";
import { filterBddComments } from "./bdd";
import { filterDirectiveComments } from "./directive";
import { filterDocstringComments } from "./docstring";
import { filterShebangComments } from "./shebang";
export { filterBddComments, filterDirectiveComments, filterDocstringComments, filterShebangComments };
export declare function applyFilters(comments: CommentInfo[]): CommentInfo[];
