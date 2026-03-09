// Category types

import type { ObjectId } from "./common";

export interface Category {
  _id: ObjectId;
  id?: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormInput {
  name: string;
}
