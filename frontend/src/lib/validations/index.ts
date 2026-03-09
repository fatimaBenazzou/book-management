/**
 * Validation schemas barrel export
 */

export { bookSchema, bookPriceSchema, type BookFormData } from "./book";
export { authorSchema, type AuthorFormData } from "./author";
export { categorySchema, type CategoryFormData } from "./category";
export {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  updateProfileSchema,
  type LoginFormData,
  type RegisterFormData,
  type ChangePasswordFormData,
  type UpdateProfileFormData,
} from "./auth";
export {
  borrowSchema,
  borrowUpdateSchema,
  type BorrowFormData,
  type BorrowUpdateFormData,
} from "./borrow";
export {
  orderSchema,
  orderUpdateSchema,
  shippingAddressSchema,
  type OrderFormData,
  type OrderUpdateFormData,
  type ShippingAddressFormData,
} from "./order";
