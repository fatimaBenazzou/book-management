/**
 * Basic category data for creating/updating
 */
declare interface BasicCategoryI {
  name: string;
}

/**
 * Full category interface with all fields
 */
declare interface CategoryI extends BasicCategoryI {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Data required to create a new category
 */
declare interface CreateCategoryData {
  name: string;
}

/**
 * Data for updating a category (all fields optional)
 */
declare type UpdateCategoryData = Partial<CreateCategoryData>;
