import { z } from "zod";
import { FIELD_TYPES } from "../constants";

const fieldOptionSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

const fieldValidationSchema = z.object({
  minLength: z.number().int().min(0).optional(),
  maxLength: z.number().int().min(1).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  pattern: z.string().optional(),
});

const formFieldSchema = z
  .object({
    id: z.string().min(1),
    type: z.enum([FIELD_TYPES.TEXT, FIELD_TYPES.SELECT, FIELD_TYPES.RADIO]),
    label: z.string().min(1),
    required: z.boolean(),
    placeholder: z.string().optional(),
    options: z.array(fieldOptionSchema).optional(),
    validation: fieldValidationSchema.optional(),
  })
  .superRefine((field, ctx) => {
    const needsOptions =
      field.type === FIELD_TYPES.SELECT || field.type === FIELD_TYPES.RADIO;

    if (needsOptions && (!field.options || field.options.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${field.type} fields must include at least one option`,
        path: ["options"],
      });
    }
  });

export const formStepSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  order: z.number().int().min(0),
  fields: z.array(formFieldSchema).min(1),
});

export const formConfigSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, or hyphens"),
  title: z.string().min(1),
  description: z.string().optional(),
  steps: z.array(formStepSchema).min(1),
  isActive: z.boolean().default(true),
});

export type FormConfigInput = z.infer<typeof formConfigSchema>;
export type FormFieldInput = z.infer<typeof formFieldSchema>;
export type FormStepInput = z.infer<typeof formStepSchema>;
