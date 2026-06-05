import "dotenv/config";

import { connectDatabase, disconnectDatabase } from "../config/database";
import { FormConfig } from "../models";
import { formConfigSchema } from "../validations/form.validation";
import { wellnessIntakeFormConfig } from "./wellnessIntake.seed";

export const seedWellnessIntakeForm = async (): Promise<void> => {
  const parsedConfig = formConfigSchema.parse(wellnessIntakeFormConfig);

  await FormConfig.findOneAndUpdate(
    { slug: parsedConfig.slug },
    parsedConfig,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(`Seeded form config: ${parsedConfig.title}`);
};

export const runSeed = async (): Promise<void> => {
  try {
    await connectDatabase();
    await seedWellnessIntakeForm();
  } finally {
    await disconnectDatabase();
  }
};

if (require.main === module) {
  runSeed()
    .then(() => {
      console.log("Seed completed successfully");
      process.exit(0);
    })
    .catch((error: Error) => {
      console.error("Seed failed:", error.message);
      process.exit(1);
    });
}
