import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './lib/drizzle',
  schema: './lib/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_C7aSXAcEHPr4@ep-small-fire-a1c9uhex-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require', // put connection string  here ...
  },
})
