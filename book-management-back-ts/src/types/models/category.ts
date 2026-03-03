import type { BaseDocument } from "../common.js";

/**
 * Category document interface
 * Represents a book category/genre
 */
export interface ICategory extends BaseDocument {
  /** Category name */
  name: string;
}
