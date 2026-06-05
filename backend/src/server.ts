import "dotenv/config";

import app from "./app";
import { connectDatabase } from "./config/database";
import { seedWellnessIntakeForm } from "./seeds/runSeed";

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    await seedWellnessIntakeForm();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to start server:", message);
    process.exit(1);
  }
};

void startServer();
