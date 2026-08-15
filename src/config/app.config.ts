import Joi from 'joi';

export const validationSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().default(3000),
    DATABASE_URL: Joi.string().required(),
    R2_ENDPOINT: Joi.string().uri().required(),
    R2_PUBLIC_URL: Joi.string().uri().required(),
    R2_ACCESS_KEY_ID: Joi.string().required(),
    R2_SECRET_ACCESS_KEY: Joi.string().required(),
    R2_BUCKET_NAME: Joi.string().required(),
});

export interface IAppConfig {
    app: {
        nodeEnv: string;
        port: number;
    };
    database: {
        url: string;
    };
    storage: {
        r2: {
            endpoint: string;
            publicUrl: string;
            accessKeyId: string;
            secretAccessKey: string;
            bucketName: string;
        };
    };
}

export default () =>
    ({
        app: {
            nodeEnv: process.env.NODE_ENV,
            port: parseInt(process.env.PORT!, 10) || 3000,
        },
        database: {
            url: process.env.DATABASE_URL,
        },
        storage: {
            r2: {
                endpoint: process.env.R2_ENDPOINT,
                publicUrl: process.env.R2_PUBLIC_URL,
                accessKeyId: process.env.R2_ACCESS_KEY_ID,
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
                bucketName: process.env.R2_BUCKET_NAME,
            },
        },
    }) as IAppConfig;
