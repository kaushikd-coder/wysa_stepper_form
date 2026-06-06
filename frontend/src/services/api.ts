import axios from "axios";
import { env } from "@/lib/env";

export const api = axios.create({
  baseURL: env.apiUrl,
  headers: {
    "Content-Type": "application/json",
    "X-User-Id": env.userId,
  },
});
