import { config } from 'dotenv';
import Joi from 'joi';

// Load environment variables
config();

interface Config {
  // App
  NODE_ENV: 'development' | 'staging' | 'production';
  APP_NAME: string;
  APP_VERSION: string;

  // Server
  API_HOST: string;
  API_PORT: number;
  API_URL: string;

  // Database
  DATABASE_URL: string;
  DATABASE_POOL_SIZE: number;
  DATABASE_POOL_TIMEOUT: number;

  // Redis
  REDIS_URL: string;
  REDIS_CLUSTER_ENABLED: boolean;

  // Kafka
  KAFKA_BROKERS: string;
  KAFKA_CLIENT_ID: string;
  KAFKA_CONSUMER_GROUP: string;

  // Auth
  JWT_SECRET: string;
  JWT_EXPIRATION: string;
  REFRESH_TOKEN_SECRET: string;
  REFRESH_TOKEN_EXPIRATION: string;

  // OAuth
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  DISCORD_CLIENT_ID: string;
  DISCORD_CLIENT_SECRET: string;
  REDDIT_CLIENT_ID: string;
  REDDIT_CLIENT_SECRET: string;
  APPLE_CLIENT_ID: string;
  APPLE_TEAM_ID: string;
  APPLE_KEY_ID: string;

  // AI & ML
  OPENAI_API_KEY: string;
  OPENAI_ORG_ID?: string;
  ANTHROPIC_API_KEY: string;
  HUGGINGFACE_API_KEY?: string;

  // AWS
  AWS_REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  S3_BUCKET: string;
  CLOUDFRONT_DOMAIN: string;

  // Elasticsearch
  ELASTICSEARCH_HOST: string;
  ELASTICSEARCH_PORT: number;
  ELASTICSEARCH_USERNAME?: string;
  ELASTICSEARCH_PASSWORD?: string;

  // Storage
  STORAGE_PROVIDER: 'local' | 's3' | 'gcs';
  MAX_FILE_SIZE: number;

  // Feature Flags
  FEATURE_FLAGS_API_KEY: string;

  // Stripe
  STRIPE_SECRET_KEY: string;
  STRIPE_PUBLISHABLE_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;

  // Email
  EMAIL_PROVIDER: 'sendgrid' | 'resend' | 'mailgun';
  SENDGRID_API_KEY?: string;
  RESEND_API_KEY?: string;
  MAILGUN_API_KEY?: string;

  // SMS
  TWILIO_ACCOUNT_SID?: string;
  TWILIO_AUTH_TOKEN?: string;

  // Monitoring
  SENTRY_DSN?: string;
  LOG_LEVEL: string;

  // CORS
  CORS_ORIGIN: string;

  // Rate Limiting
  RATE_LIMIT_WINDOW: number;
  RATE_LIMIT_MAX_REQUESTS: number;

  // Media Processing
  FFMPEG_PATH: string;
  MAX_VIDEO_DURATION: number;
  MAX_IMAGE_DIMENSION: number;

  // Moderation
  MODERATION_ENABLED: boolean;
  MODERATION_API_KEY?: string;

  // Analytics
  CLICKHOUSE_HOST: string;
  CLICKHOUSE_PORT: number;
  CLICKHOUSE_USERNAME: string;
  CLICKHOUSE_PASSWORD: string;
  CLICKHOUSE_DATABASE: string;
}

const envVarsSchema = Joi.object()
  .keys({
    // App
    NODE_ENV: Joi.string()
      .valid('development', 'staging', 'production')
      .default('development'),
    APP_NAME: Joi.string().default('MemeGag'),
    APP_VERSION: Joi.string().default('0.1.0'),

    // Server
    API_HOST: Joi.string().default('0.0.0.0'),
    API_PORT: Joi.number().default(3000),
    API_URL: Joi.string().required(),

    // Database
    DATABASE_URL: Joi.string().required(),
    DATABASE_POOL_SIZE: Joi.number().default(10),
    DATABASE_POOL_TIMEOUT: Joi.number().default(30000),

    // Redis
    REDIS_URL: Joi.string().required(),
    REDIS_CLUSTER_ENABLED: Joi.boolean().default(false),

    // Kafka
    KAFKA_BROKERS: Joi.string().default('localhost:9092'),
    KAFKA_CLIENT_ID: Joi.string().default('memegag-app'),
    KAFKA_CONSUMER_GROUP: Joi.string().default('memegag-consumers'),

    // Auth
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRATION: Joi.string().default('24h'),
    REFRESH_TOKEN_SECRET: Joi.string().required(),
    REFRESH_TOKEN_EXPIRATION: Joi.string().default('7d'),

    // OAuth
    GOOGLE_CLIENT_ID: Joi.string().required(),
    GOOGLE_CLIENT_SECRET: Joi.string().required(),
    DISCORD_CLIENT_ID: Joi.string().required(),
    DISCORD_CLIENT_SECRET: Joi.string().required(),
    REDDIT_CLIENT_ID: Joi.string().required(),
    REDDIT_CLIENT_SECRET: Joi.string().required(),
    APPLE_CLIENT_ID: Joi.string().required(),
    APPLE_TEAM_ID: Joi.string().required(),
    APPLE_KEY_ID: Joi.string().required(),

    // AI & ML
    OPENAI_API_KEY: Joi.string().required(),
    OPENAI_ORG_ID: Joi.string().optional(),
    ANTHROPIC_API_KEY: Joi.string().required(),
    HUGGINGFACE_API_KEY: Joi.string().optional(),

    // AWS
    AWS_REGION: Joi.string().default('us-east-1'),
    AWS_ACCESS_KEY_ID: Joi.string().required(),
    AWS_SECRET_ACCESS_KEY: Joi.string().required(),
    S3_BUCKET: Joi.string().required(),
    CLOUDFRONT_DOMAIN: Joi.string().required(),

    // Elasticsearch
    ELASTICSEARCH_HOST: Joi.string().default('localhost'),
    ELASTICSEARCH_PORT: Joi.number().default(9200),
    ELASTICSEARCH_USERNAME: Joi.string().optional(),
    ELASTICSEARCH_PASSWORD: Joi.string().optional(),

    // Storage
    STORAGE_PROVIDER: Joi.string()
      .valid('local', 's3', 'gcs')
      .default('s3'),
    MAX_FILE_SIZE: Joi.number().default(104857600), // 100MB

    // Feature Flags
    FEATURE_FLAGS_API_KEY: Joi.string().required(),

    // Stripe
    STRIPE_SECRET_KEY: Joi.string().required(),
    STRIPE_PUBLISHABLE_KEY: Joi.string().required(),
    STRIPE_WEBHOOK_SECRET: Joi.string().required(),

    // Email
    EMAIL_PROVIDER: Joi.string()
      .valid('sendgrid', 'resend', 'mailgun')
      .default('resend'),
    SENDGRID_API_KEY: Joi.string().optional(),
    RESEND_API_KEY: Joi.string().optional(),
    MAILGUN_API_KEY: Joi.string().optional(),

    // SMS
    TWILIO_ACCOUNT_SID: Joi.string().optional(),
    TWILIO_AUTH_TOKEN: Joi.string().optional(),

    // Monitoring
    SENTRY_DSN: Joi.string().optional(),
    LOG_LEVEL: Joi.string().default('info'),

    // CORS
    CORS_ORIGIN: Joi.string().default('*'),

    // Rate Limiting
    RATE_LIMIT_WINDOW: Joi.number().default(900000), // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: Joi.number().default(100),

    // Media Processing
    FFMPEG_PATH: Joi.string().default('ffmpeg'),
    MAX_VIDEO_DURATION: Joi.number().default(3600), // 1 hour
    MAX_IMAGE_DIMENSION: Joi.number().default(8000),

    // Moderation
    MODERATION_ENABLED: Joi.boolean().default(true),
    MODERATION_API_KEY: Joi.string().optional(),

    // Analytics
    CLICKHOUSE_HOST: Joi.string().default('localhost'),
    CLICKHOUSE_PORT: Joi.number().default(8123),
    CLICKHOUSE_USERNAME: Joi.string().default('default'),
    CLICKHOUSE_PASSWORD: Joi.string().default(''),
    CLICKHOUSE_DATABASE: Joi.string().default('memegag'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config: Config = {
  NODE_ENV: envVars.NODE_ENV,
  APP_NAME: envVars.APP_NAME,
  APP_VERSION: envVars.APP_VERSION,
  API_HOST: envVars.API_HOST,
  API_PORT: envVars.API_PORT,
  API_URL: envVars.API_URL,
  DATABASE_URL: envVars.DATABASE_URL,
  DATABASE_POOL_SIZE: envVars.DATABASE_POOL_SIZE,
  DATABASE_POOL_TIMEOUT: envVars.DATABASE_POOL_TIMEOUT,
  REDIS_URL: envVars.REDIS_URL,
  REDIS_CLUSTER_ENABLED: envVars.REDIS_CLUSTER_ENABLED,
  KAFKA_BROKERS: envVars.KAFKA_BROKERS,
  KAFKA_CLIENT_ID: envVars.KAFKA_CLIENT_ID,
  KAFKA_CONSUMER_GROUP: envVars.KAFKA_CONSUMER_GROUP,
  JWT_SECRET: envVars.JWT_SECRET,
  JWT_EXPIRATION: envVars.JWT_EXPIRATION,
  REFRESH_TOKEN_SECRET: envVars.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRATION: envVars.REFRESH_TOKEN_EXPIRATION,
  GOOGLE_CLIENT_ID: envVars.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: envVars.GOOGLE_CLIENT_SECRET,
  DISCORD_CLIENT_ID: envVars.DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET: envVars.DISCORD_CLIENT_SECRET,
  REDDIT_CLIENT_ID: envVars.REDDIT_CLIENT_ID,
  REDDIT_CLIENT_SECRET: envVars.REDDIT_CLIENT_SECRET,
  APPLE_CLIENT_ID: envVars.APPLE_CLIENT_ID,
  APPLE_TEAM_ID: envVars.APPLE_TEAM_ID,
  APPLE_KEY_ID: envVars.APPLE_KEY_ID,
  OPENAI_API_KEY: envVars.OPENAI_API_KEY,
  OPENAI_ORG_ID: envVars.OPENAI_ORG_ID,
  ANTHROPIC_API_KEY: envVars.ANTHROPIC_API_KEY,
  HUGGINGFACE_API_KEY: envVars.HUGGINGFACE_API_KEY,
  AWS_REGION: envVars.AWS_REGION,
  AWS_ACCESS_KEY_ID: envVars.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: envVars.AWS_SECRET_ACCESS_KEY,
  S3_BUCKET: envVars.S3_BUCKET,
  CLOUDFRONT_DOMAIN: envVars.CLOUDFRONT_DOMAIN,
  ELASTICSEARCH_HOST: envVars.ELASTICSEARCH_HOST,
  ELASTICSEARCH_PORT: envVars.ELASTICSEARCH_PORT,
  ELASTICSEARCH_USERNAME: envVars.ELASTICSEARCH_USERNAME,
  ELASTICSEARCH_PASSWORD: envVars.ELASTICSEARCH_PASSWORD,
  STORAGE_PROVIDER: envVars.STORAGE_PROVIDER,
  MAX_FILE_SIZE: envVars.MAX_FILE_SIZE,
  FEATURE_FLAGS_API_KEY: envVars.FEATURE_FLAGS_API_KEY,
  STRIPE_SECRET_KEY: envVars.STRIPE_SECRET_KEY,
  STRIPE_PUBLISHABLE_KEY: envVars.STRIPE_PUBLISHABLE_KEY,
  STRIPE_WEBHOOK_SECRET: envVars.STRIPE_WEBHOOK_SECRET,
  EMAIL_PROVIDER: envVars.EMAIL_PROVIDER,
  SENDGRID_API_KEY: envVars.SENDGRID_API_KEY,
  RESEND_API_KEY: envVars.RESEND_API_KEY,
  MAILGUN_API_KEY: envVars.MAILGUN_API_KEY,
  TWILIO_ACCOUNT_SID: envVars.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: envVars.TWILIO_AUTH_TOKEN,
  SENTRY_DSN: envVars.SENTRY_DSN,
  LOG_LEVEL: envVars.LOG_LEVEL,
  CORS_ORIGIN: envVars.CORS_ORIGIN,
  RATE_LIMIT_WINDOW: envVars.RATE_LIMIT_WINDOW,
  RATE_LIMIT_MAX_REQUESTS: envVars.RATE_LIMIT_MAX_REQUESTS,
  FFMPEG_PATH: envVars.FFMPEG_PATH,
  MAX_VIDEO_DURATION: envVars.MAX_VIDEO_DURATION,
  MAX_IMAGE_DIMENSION: envVars.MAX_IMAGE_DIMENSION,
  MODERATION_ENABLED: envVars.MODERATION_ENABLED,
  MODERATION_API_KEY: envVars.MODERATION_API_KEY,
  CLICKHOUSE_HOST: envVars.CLICKHOUSE_HOST,
  CLICKHOUSE_PORT: envVars.CLICKHOUSE_PORT,
  CLICKHOUSE_USERNAME: envVars.CLICKHOUSE_USERNAME,
  CLICKHOUSE_PASSWORD: envVars.CLICKHOUSE_PASSWORD,
  CLICKHOUSE_DATABASE: envVars.CLICKHOUSE_DATABASE,
};

export default config;
export type { Config };
