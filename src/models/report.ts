import { Schema, model } from "mongoose";
import { IReport } from "../util/types";

const reportSchema = new Schema<IReport>(
  {
    status: {
      type: String,
      required: true,
    },
    adjudication: {
      type: String,
      required: true,
    },
    package: {
      type: String,
      required: true,
    },
    completedAt: {
      type: Date,
      required: true,
    },
    EstimatedCompletionTime: {
      type: Date,
      required: true,
    },
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
  },
  { timestamps: true }
);
export default model<IReport>("Report", reportSchema);
