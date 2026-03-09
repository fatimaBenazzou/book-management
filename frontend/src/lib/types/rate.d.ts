/**
 * Basic rating data
 */
declare interface BasicRateI {
  bookId: string;
  rating: number;
}

/**
 * Full rating interface with all fields
 */
declare interface RateI extends BasicRateI {
  _id: string;
  ratedBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Rating with populated user
 */
declare interface RatePopulatedI extends Omit<RateI, "ratedBy"> {
  ratedBy: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

/**
 * Data required to create a new rating
 */
declare interface CreateRateData {
  rating: number;
}
