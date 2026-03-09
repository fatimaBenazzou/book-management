/**
 * Book price structure
 */
declare interface BookPrice {
  /** Original price (before discount) */
  original?: number;
  /** Current selling price */
  current: number;
}

/**
 * Basic book data for creating/updating
 */
declare interface BasicBookI {
  title: string;
  author?: string | { _id: string; name: string; bio?: string };
  serialNumber?: string;
  description?: string;
  price?: BookPrice;
  rentalPrice?: number;
  lateFeePerDay?: number;
  totalStock?: number;
  availableStock?: number;
  status?: BookStatus;
  cover?: string;
  avgRating?: number;
  ratingCount?: number;
  keywords?: string[];
  category?: string | { _id: string; name: string };
  contributedBy?: string;
}

/**
 * Full book interface with all fields
 */
declare interface BookI extends BasicBookI {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Book with populated author and category
 */
declare interface BookPopulatedI extends Omit<BookI, "author" | "category"> {
  author: {
    _id: string;
    name: string;
    bio?: string;
  };
  category?: {
    _id: string;
    name: string;
  };
}

/**
 * Data required to create a new book
 */
declare interface CreateBookData {
  title: string;
  author: string;
  serialNumber: string;
  description: string;
  price: BookPrice;
  rentalPrice: number;
  lateFeePerDay: number;
  totalStock?: number;
  cover?: string;
  keywords?: string[];
  category?: string;
}

/**
 * Data for updating a book (all fields optional)
 */
declare type UpdateBookData = Partial<CreateBookData>;
