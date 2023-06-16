import { Schema, model } from "mongoose";
import { ICompany } from "../util/types";

const companySchema = new Schema<ICompany>({
  name: {
    type: String,
    required: true,
  },
});

export default model<ICompany>("Company", companySchema);
