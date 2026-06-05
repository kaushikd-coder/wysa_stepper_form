import { FormConfig } from "../models";
import { FormConfigDocument } from "../types";
import { BadRequestError, NotFoundError, ValidationError } from "../utils/AppError";
import { isValidObjectId } from "../utils/mongooseHelpers";
import { validateFormConfigStructure } from "./fieldValidation.service";
import { formConfigSchema } from "../validations/form.validation";

const assertValidFormConfig = (formConfig: FormConfigDocument): void => {
  const parsed = formConfigSchema.safeParse({
    slug: formConfig.slug,
    title: formConfig.title,
    description: formConfig.description,
    steps: formConfig.steps,
    isActive: formConfig.isActive,
  });

  if (!parsed.success) {
    throw new ValidationError("Form configuration is invalid", parsed.error.flatten());
  }

  const structuralIssues = validateFormConfigStructure(formConfig.steps);

  if (structuralIssues.length > 0) {
    throw new ValidationError("Form configuration is broken", structuralIssues);
  }
};

export const listActiveFormConfigs = async () => {
  const formConfigs = await FormConfig.find({ isActive: true })
    .select("slug title description steps isActive createdAt updatedAt")
    .sort({ title: 1 })
    .lean();

  return formConfigs.map((config) => ({
    id: config._id.toString(),
    slug: config.slug,
    title: config.title,
    description: config.description,
    stepCount: config.steps.length,
    isActive: config.isActive,
    createdAt: config.createdAt,
    updatedAt: config.updatedAt,
  }));
};

export const getFormConfigById = async (id: string) => {
  if (!isValidObjectId(id)) {
    throw new BadRequestError("Invalid form config id");
  }

  const formConfig = await FormConfig.findById(id).lean();

  if (!formConfig || !formConfig.isActive) {
    throw new NotFoundError("Form configuration not found");
  }

  assertValidFormConfig(formConfig as FormConfigDocument);

  return {
    id: formConfig._id.toString(),
    slug: formConfig.slug,
    title: formConfig.title,
    description: formConfig.description,
    steps: formConfig.steps,
    isActive: formConfig.isActive,
    createdAt: formConfig.createdAt,
    updatedAt: formConfig.updatedAt,
  };
};

export const getActiveFormConfigDocument = async (
  id: string
): Promise<FormConfigDocument & { _id: { toString(): string } }> => {
  if (!isValidObjectId(id)) {
    throw new BadRequestError("Invalid form config id");
  }

  const formConfig = await FormConfig.findById(id);

  if (!formConfig || !formConfig.isActive) {
    throw new NotFoundError("Form configuration not found");
  }

  assertValidFormConfig(formConfig);

  return formConfig;
};
