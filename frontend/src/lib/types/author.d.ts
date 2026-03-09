/**
 * Basic author data for creating/updating
 */
declare interface BasicAuthorI {
  name: string;
  bio?: string;
  books?: (string | BookI)[];
}

/**
 * Full author interface with all fields
 */
declare interface AuthorI extends BasicAuthorI {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Data required to create a new author
 */
declare interface CreateAuthorData {
  name: string;
  bio?: string;
}

/**
 * Data for updating an author (all fields optional)
 */
declare type UpdateAuthorData = Partial<CreateAuthorData>;
