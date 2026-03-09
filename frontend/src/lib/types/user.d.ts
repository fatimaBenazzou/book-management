/**
 * User's book collections - tracks borrowed, read, and favorite books
 */
declare interface UserBooks {
  borrowed: string[];
  read: string[];
  favorites: string[];
}

/**
 * Login user credentials
 */
declare interface LoginUserI {
  email: string;
  password: string;
}

/**
 * Register user data
 */
declare interface RegisterUserI extends LoginUserI {
  firstName: string;
  lastName: string;
  phone?: string;
}

/**
 * Basic user data for creating/updating
 */
declare interface BasicUserI {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isActive?: boolean;
  borrowLimit?: number;
  fines?: number;
  books: UserBooks;
}

/**
 * Full user interface with all fields (without password)
 */
declare interface UserI extends BasicUserI {
  _id: string;
  createdAt: string;
  updatedAt: string;
  stats?: {
    totalBorrowedBooks: number;
    totalReadBooks: number;
    totalFavorites: number;
  };
}

/**
 * User with full details (safe to use in client — same as UserI since password is excluded)
 */
declare type SafeUserI = UserI;

/**
 * Data for updating a user profile
 */
declare interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
}
