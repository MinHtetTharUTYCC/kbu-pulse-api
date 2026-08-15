import * as dotenv from 'dotenv';
import { defineConfig } from 'prisma/config';

if (process.env.NODE_ENV !== 'production') {
    const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
    const result = dotenv.config({ path: envFile });

    if (result.error) {
        console.warn('Could not load .env file:', result.error.message);
    }
}

export default defineConfig({
    schema: 'prisma/schema.prisma',
    datasource: {
        url: process.env.DATABASE_URL,
    },
});
