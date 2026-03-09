// User types — roles are lowercase to match backend

import type { ObjectId, FilterParams } from "./common";

export type UserRole = "admin" | "user";

export interface UserBooks {
  borrowed: ObjectId[];
  read: ObjectId[];
  favorites: ObjectId[];
}

export interface User {
  _id: ObjectId;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  borrowLimit: number;
  fines: number;
  books: UserBooks;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithBorrowedBooks extends User {
  borrowedBooks?: import("./book").Book[];
}

export interface UserFilterParams extends FilterParams {
  role?: UserRole;
  isActive?: boolean;
}

export interface UserFormInput {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  borrowLimit?: number;
  isActive?: boolean;
}
