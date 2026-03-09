// Author types

import type { ObjectId } from "./common";

export interface Author {
  _id: ObjectId;
  id: string;
  name: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthorWithBooks extends Author {
  books?: import("./book").Book[];
}

export interface AuthorFormInput {
  name: string;
  bio?: string;
}
