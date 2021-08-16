import bcrypt from "bcryptjs";
import { Schema, model } from "mongoose";
import { Status } from "../types/user";

// Create an interface representing a document in MongoDB.
export interface UserInterface {
  firstName: string;
  fatherName: string;
  middleName: string;
  lastName: string;
  password: string;
  email: string;
  role: string;
  agreeOnTerms: boolean;
  status: string;
  matchPassword: (enteredPassword: string) => {};
}

// Create a Schema corresponding to the document interface.
const schema = new Schema<UserInterface>(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 255,
    },
    middleName: {
      type: String,
      required: false,
    },
    fatherName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 255,
    },
    role: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      min: 6,
      max: 255,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      min: 8,
    },
    status: {
      type: String,
      required: true,
      default: Status.NOT_VERIFIED,
    },
    agreeOnTerms: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

schema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

schema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  } else {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

const UserModel = model<UserInterface>("User", schema);

export default UserModel;
