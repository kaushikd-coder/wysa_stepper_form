import mongoose from "mongoose";

export const isValidObjectId = (id: string): boolean =>
  mongoose.Types.ObjectId.isValid(id);

export const toObjectId = (id: string): mongoose.Types.ObjectId =>
  new mongoose.Types.ObjectId(id);
