import type { BaseDocument } from "../common.js";

/**
 * Author document interface
 * Represents a book author
 */
export interface IAuthor extends BaseDocument {
  /** Author's name */
  name: string;
  /** Author's biography (optional) */
  bio?: string;
}
