import { Schema, model } from "mongoose";
import { ICourtSearch } from "../util/types";

const courtSearchSchema = new Schema<ICourtSearch>({
  status: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  violation: {
    type: String,
    required: true,
  },
  reportedDate: {
    type: Date,
    required: true,
  },
  candidateId: {
    type: Schema.Types.ObjectId,
    ref: "Candidate",
    required: true,
  },
});

export default model<ICourtSearch>("CourtSearch", courtSearchSchema);
