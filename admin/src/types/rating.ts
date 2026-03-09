// Rating types

import type { ObjectId } from "./common";
import type { User } from "./user";
import type { Book } from "./book";

export interface Rating {
  _id: ObjectId;
  ratedBy: ObjectId | User;
  bookId: ObjectId | Book;
  rating: number;
  createdAt: string;
  updatedAt: string;
}
