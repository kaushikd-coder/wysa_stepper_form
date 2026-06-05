import { FIELD_TYPES } from "../constants";
import { FormConfigInput } from "../validations/form.validation";

export const wellnessIntakeFormConfig: FormConfigInput = {
  slug: "wellness-intake",
  title: "Wellness Intake",
  description: "Multi-step wellness intake form",
  isActive: true,
  steps: [
    {
      id: "personal-details",
      title: "Personal Details",
      order: 0,
      fields: [
        {
          id: "fullName",
          type: FIELD_TYPES.TEXT,
          label: "Full Name",
          required: true,
          placeholder: "Enter your full name",
          validation: {
            minLength: 2,
            maxLength: 100,
          },
        },
        {
          id: "age",
          type: FIELD_TYPES.TEXT,
          label: "Age",
          required: true,
          placeholder: "Enter your age",
          validation: {
            min: 1,
            max: 120,
          },
        },
      ],
    },
    {
      id: "wellness-preferences",
      title: "Wellness Preferences",
      order: 1,
      fields: [
        {
          id: "primaryGoals",
          type: FIELD_TYPES.SELECT,
          label: "Primary Goals",
          required: false,
          options: [
            { label: "Sleep better", value: "sleep-better" },
            { label: "Improve focus", value: "improve-focus" },
            { label: "Reduce stress", value: "reduce-stress" },
            { label: "Build habits", value: "build-habits" },
          ],
        },
        {
          id: "preferredSupportType",
          type: FIELD_TYPES.RADIO,
          label: "Preferred Support Type",
          required: true,
          options: [
            { label: "Self-Guided", value: "self-guided" },
            { label: "Coach Support", value: "coach-support" },
            { label: "Not Sure", value: "not-sure" },
          ],
        },
        {
          id: "notes",
          type: FIELD_TYPES.TEXT,
          label: "Notes",
          required: false,
          placeholder: "Any additional notes",
          validation: {
            maxLength: 500,
          },
        },
      ],
    },
    {
      id: "availability",
      title: "Availability",
      order: 2,
      fields: [
        {
          id: "preferredTime",
          type: FIELD_TYPES.SELECT,
          label: "Preferred Time",
          required: false,
          options: [
            { label: "Morning", value: "morning" },
            { label: "Afternoon", value: "afternoon" },
            { label: "Evening", value: "evening" },
          ],
        },
        {
          id: "preferredContactMethod",
          type: FIELD_TYPES.RADIO,
          label: "Preferred Contact Method",
          required: true,
          options: [
            { label: "Email", value: "email" },
            { label: "Phone", value: "phone" },
            { label: "SMS", value: "sms" },
          ],
        },
        {
          id: "additionalDetails",
          type: FIELD_TYPES.TEXT,
          label: "Additional Details",
          required: false,
          placeholder: "Available mostly after 6 PM",
          validation: {
            maxLength: 500,
          },
        },
      ],
    },
  ],
};
