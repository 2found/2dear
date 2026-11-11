import { z } from 'zod'

const envSchema = z.object({
  // Server-side base URL of the backend API. Defaults to the hono-bun starter's local port.
  API_URL: z.url().default('http://localhost:8120'),
})

export const parseEnv = (input: Record<string, string | undefined>) => envSchema.parse(input)
