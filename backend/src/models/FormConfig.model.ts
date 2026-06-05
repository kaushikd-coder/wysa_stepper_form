import mongoose from "mongoose";
import { FIELD_TYPES } from "../constants";
import { FormConfigDocument } from "../types";

const fieldOptionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const fieldValidationSchema = new mongoose.Schema(
  {
    minLength: { type: Number },
    maxLength: { type: Number },
    min: { type: Number },
    max: { type: Number },
    pattern: { type: String },
  },
  { _id: false }
);

const formFieldSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: Object.values(FIELD_TYPES),
    },
    label: { type: String, required: true, trim: true },
    required: { type: Boolean, required: true, default: false },
    placeholder: { type: String, trim: true },
    options: { type: [fieldOptionSchema], default: undefined },
    validation: { type: fieldValidationSchema, default: undefined },
  },
  { _id: false }
);

const formStepSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    order: { type: Number, required: true, min: 0 },
    fields: { type: [formFieldSchema], required: true },
  },
  { _id: false }
);

const formConfigSchema = new mongoose.Schema<FormConfigDocument>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    steps: { type: [formStepSchema], required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

formConfigSchema.index({ isActive: 1 });

export const FormConfig = mongoose.model<FormConfigDocument>(
  "FormConfig",
  formConfigSchema
);
