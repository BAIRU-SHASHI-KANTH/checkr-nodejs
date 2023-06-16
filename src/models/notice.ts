import { Schema, model } from "mongoose";
import { INotice } from "../util/types";

const noticeSchema = new Schema<INotice>({
  status: {
    type: String,
    required: true,
  },
  preNotice: {
    type: Date,
    required: true,
  },
  postNoticeSentOn: {
    type: Date,
  },
  candidateId: {
    type: Schema.Types.ObjectId,
    ref: "Candidate",
    required: true,
  },
});

export default model<INotice>("Notice", noticeSchema);
