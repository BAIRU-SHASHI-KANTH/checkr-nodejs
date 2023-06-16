import { Schema, model } from "mongoose";
import { IUser } from "../util/types";

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
});

export default model<IUser>("User", userSchema);
