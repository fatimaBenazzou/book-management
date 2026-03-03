import { Schema, model, type Model } from "mongoose";
import bcrypt from "bcrypt";
import type { IUserDocument } from "../types/models/user.js";

/**
 * User schema definition
 * Defines the structure of user documents in MongoDB
 */
const userSchema = new Schema<IUserDocument>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    avatar: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    borrowLimit: {
      type: Number,
      default: 3,
      min: 1,
    },
    fines: {
      type: Number,
      default: 0,
      min: 0,
    },
    books: {
      borrowed: [
        {
          type: Schema.Types.ObjectId,
          ref: "books",
        },
      ],
      read: [
        {
          type: Schema.Types.ObjectId,
          ref: "books",
        },
      ],
      favorites: [
        {
          type: Schema.Types.ObjectId,
          ref: "books",
        },
      ],
    },
  },
  {
    toJSON: {
      versionKey: false,
    },
    toObject: {
      versionKey: false,
    },
    timestamps: true,
  },
);

/**
 * Pre-save hook to hash password
 * Hashes password before saving if it's new or modified
 */
userSchema.pre("save", async function () {
  if (this.isNew || this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

/**
 * Compare password method
 * Compares a plain text password with the hashed password
 */
userSchema.methods.comparePassword = async function (
  requestedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(requestedPassword, this.password);
};

const userModel: Model<IUserDocument> = model<IUserDocument>(
  "users",
  userSchema,
);

export default userModel;
