import { z } from "zod";

export const objectIdParamSchema = z.object({
  id: z.string().min(1),
});

export type ObjectIdParam = z.infer<typeof objectIdParamSchema>;
