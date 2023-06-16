import { Schema, model } from "mongoose";
import { ICandidate } from "../util/types";

const candidateSchema = new Schema<ICandidate>(
  {
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
    driverLicense: {
      type: String,
    },
    priorDriverLicense: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },

    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    notice: {
      type: Schema.Types.ObjectId,
      ref: "Notice",
    },

    report: {
      type: Schema.Types.ObjectId,
      ref: "Report",
    },
  },
  { timestamps: true }
);

export default model<ICandidate>("Candidate", candidateSchema);
