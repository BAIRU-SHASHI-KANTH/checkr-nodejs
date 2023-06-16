import { Types, Document } from "mongoose";

export type IUser = Document & UserData;

interface UserData {
  name: string;
  email: string;
  password: string;
  companyId: Types.ObjectId;
}

export interface ICompany {
  name: string;
}
export type ICandidate = Document & Candidate
export interface Candidate {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: Date;
  zip: string;
  driverLicense?: string;
  priorDriverLicense?: string;
  phoneNumber: string;
  email: string;
  companyId: Types.ObjectId;
  notice?: Types.ObjectId;
  report?: Types.ObjectId;
  courtSearches?: Types.ObjectId[];
  
}

export interface IReport {
  status: string;
  adjudication: string;
  package: string;
  completedAt: Date;
  EstimatedCompletionTime: Date;
  candidateId: Types.ObjectId;
}

export interface INotice {
  status: string;
  preNotice: Date;
  postNoticeSentOn: Date;
  candidateId: Types.ObjectId;
}

export type ICourtSearch = Document & CourtSearchData;

interface CourtSearchData {
  status: string;
  location: string;
  violation: string;
  reportedDate: Date;
  candidateId: Types.ObjectId;
}

export interface CustomError extends Error {
  statusCode?: number;
  data?: any
}
