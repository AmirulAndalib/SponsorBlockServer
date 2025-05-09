import { PoolConfig } from "pg";
import * as redis from "redis";
import { DeArrowType } from "./segments.model";

interface RedisConfig extends redis.RedisClientOptions {
    enabled: boolean;
    expiryTime: number;
    getTimeout: number;
    maxConnections: number;
    maxWriteConnections: number;
    stopWritingAfterResponseTime: number;
    responseTimePause: number;
    maxReadResponseTime: number;
    disableHashCache: boolean;
    clientCacheSize: number;
    useCompression: boolean;
    dragonflyMode: boolean;
}

interface RedisReadOnlyConfig extends redis.RedisClientOptions {
    enabled: boolean;
    weight: number;
}

export interface CustomPostgresConfig extends PoolConfig {
    enabled: boolean;
    maxTries: number;
}

export interface CustomWritePostgresConfig extends CustomPostgresConfig {
    maxActiveRequests: number;
    timeout: number;
    highLoadThreshold: number;
    redisTimeoutThreshold: number;
}

export interface CustomPostgresReadOnlyConfig extends CustomPostgresConfig {
    weight: number;
    readTimeout: number;
    fallbackOnFail: boolean;
    stopRetryThreshold: number;
}

export type ValidatorPattern = string | [string, string];
export interface RequestValidatorRule {
    ruleName?: string;
    // mostly universal
    userAgent?: ValidatorPattern;
    userAgentHeader?: ValidatorPattern;
    videoDuration?: ValidatorPattern;
    videoID?: ValidatorPattern;
    userID?: ValidatorPattern;
    service?: ValidatorPattern;
    endpoint?: ValidatorPattern;
    // sb postSkipSegments
    startTime?: ValidatorPattern;
    endTime?: ValidatorPattern;
    category?: ValidatorPattern;
    actionType?: ValidatorPattern;
    description?: ValidatorPattern;
    // dearrow postBranding
    title?: ValidatorPattern;
    titleOriginal?: boolean;
    thumbnailTimestamp?: ValidatorPattern;
    thumbnailOriginal?: boolean;
    dearrowDownvote?: boolean;
    // postCasual
    casualCategory?: ValidatorPattern;
    // setUsername
    newUsername?: ValidatorPattern;
}

export interface SBSConfig {
    [index: string]: any
    port: number;
    mockPort?: number;
    globalSalt: string;
    adminUserID: string;
    newLeafURLs?: string[];
    discordReportChannelWebhookURL?: string;
    discordFailedReportChannelWebhookURL?: string;
    discordFirstTimeSubmissionsWebhookURL?: string;
    discordCompletelyIncorrectReportWebhookURL?: string;
    discordMaliciousReportWebhookURL?: string;
    discordDeArrowLockedWebhookURL?: string,
    discordDeArrowWarnedWebhookURL?: string,
    discordNewUserWebhookURL?: string;
    neuralBlockURL?: string;
    discordNeuralBlockRejectWebhookURL?: string;
    discordRejectedNewUserWebhookURL?: string;
    minReputationToSubmitChapter: number;
    minReputationToSubmitFiller: number;
    userCounterURL?: string;
    userCounterRatio: number;
    proxySubmission?: string;
    behindProxy: string | boolean;
    db: string;
    privateDB: string;
    createDatabaseIfNotExist: boolean;
    schemaFolder: string;
    dbSchema: string;
    privateDBSchema: string;
    mode: string;
    readOnly: boolean;
    webhooks: WebhookConfig[];
    categoryList: string[];
    casualCategoryList: string[];
    deArrowTypes: DeArrowType[];
    categorySupport: Record<string, string[]>;
    maxTitleLength: number;
    getTopUsersCacheTimeMinutes: number;
    maxNumberOfActiveWarnings: number;
    hoursAfterWarningExpires: number;
    rateLimit: {
        vote: RateLimitConfig;
        view: RateLimitConfig;
    };
    requestValidatorRules: RequestValidatorRule[];
    minimumPrefix?: string;
    maximumPrefix?: string;
    redis?: RedisConfig;
    redisRead?: RedisReadOnlyConfig;
    redisRateLimit: boolean;
    maxRewardTimePerSegmentInSeconds?: number;
    postgres?: CustomWritePostgresConfig;
    postgresReadOnly?: CustomPostgresReadOnlyConfig;
    postgresPrivateMax?: number;
    dumpDatabase?: DumpDatabase;
    diskCacheURL: string;
    crons: CronJobOptions;
    patreon: {
        clientId: string,
        clientSecret: string,
        minPrice: number,
        redirectUri: string
    }
    gumroad: {
        productPermalinks: string[],
    },
    tokenSeed: string,
    minUserIDLength: number,
    deArrowPaywall: boolean,
    useCacheForSegmentGroups: boolean
    maxConnections: number;
    maxResponseTime: number;
    maxResponseTimeWhileLoadingCache: number;
    etagExpiry: number;
    youTubeKeys: {
        visitorData: string | null;
        poToken: string | null;
        floatieUrl: string | null;
        floatieAuth: string | null;
    }
}

export interface WebhookConfig {
    url: string;
    key: string;
    scopes: string[];
}

export interface RateLimitConfig {
    windowMs: number;
    max: number;
    message: string;
    statusCode: number;
}

export interface PostgresConfig {
    dbSchemaFileName: string;
    dbSchemaFolder: string;
    fileNamePrefix: string;
    readOnly: boolean;
    createDbIfNotExists: boolean;
    enableWalCheckpointNumber: boolean;
    postgres: PoolConfig;
}

export interface DumpDatabase {
    enabled: boolean;
    minTimeBetweenMs: number;
    appExportPath: string;
    tables: DumpDatabaseTable[];
}

export interface DumpDatabaseTable {
    name: string;
    order?: string;
}

export interface CronJobDefault {
    schedule: string;
}

export interface CronJobOptions {
    enabled: boolean;
    downvoteSegmentArchive: CronJobDefault & DownvoteSegmentArchiveCron;
}

export interface DownvoteSegmentArchiveCron {
    voteThreshold: number;
    timeThresholdInDays: number;
}
