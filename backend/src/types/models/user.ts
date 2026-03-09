import type { Types } from "mongoose";
import type { BaseDocument, UserRole } from "../common.js";

/**
 * User's book collections - tracks borrowed, read, and favorite books
 */
export interface UserBooks {
  /** Currently borrowed books */
  borrowed: Types.ObjectId[];
  /** Books the user has read */
  read: Types.ObjectId[];
  /** User's favorite books */
  favorites: Types.ObjectId[];
}

/**
 * User document interface
 * Represents a registered user in the system
 */
export interface IUser extends BaseDocument {
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** User's email address (unique) */
  email: string;
  /** Hashed password */
  password: string;
  /** User's phone number (optional) */
  phone?: string;
  /** User's avatar URL (optional) */
  avatar?: string;
  /** User's role in the system */
  role: UserRole;
  /** Maximum number of books user can borrow at once */
  borrowLimit: number;
  /** Outstanding fines */
  fines: number;
  /** User's book collections */
  books: UserBooks;
}

/**
 * User document with Mongoose methods
 */
export interface IUserDocument extends IUser {
  /** Compare a plain text password with the hashed password */
  comparePassword(requestedPassword: string): Promise<boolean>;
}
