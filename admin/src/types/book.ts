// Book types

import type { ObjectId, FilterParams } from "./common";
import type { Author } from "./author";
import type { Category } from "./category";
import type { User } from "./user";

export type BookStatus = "in-shelf" | "out-of-stock";

export interface BookPrice {
  original?: number;
  current: number;
}

export interface Book {
  _id: ObjectId;
  id: string;
  title: string;
  author: ObjectId | Author;
  serialNumber: string;
  price: BookPrice;
  rentalPrice: number;
  lateFeePerDay: number;
  totalStock: number;
  availableStock: number;
  status: BookStatus;
  description: string;
  cover?: string;
  keywords: string[];
  category?: ObjectId | Category;
  contributedBy?: ObjectId | User;
  createdAt: string;
  updatedAt: string;
}

export interface BookPopulated extends Omit<
  Book,
  "author" | "category" | "contributedBy"
> {
  author: Author;
  category?: Category;
  contributedBy?: User;
}

export interface BookFilterParams extends FilterParams {
  status?: BookStatus;
  author?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface BookFormInput {
  title: string;
  author: string;
  serialNumber: string;
  price: {
    original?: number;
    current: number;
  };
  rentalPrice: number;
  lateFeePerDay: number;
  totalStock: number;
  availableStock: number;
  description: string;
  cover?: string;
  keywords?: string[];
  category?: string;
}
