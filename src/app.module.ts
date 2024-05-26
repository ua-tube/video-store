import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors';
import { ConfigModule } from '@nestjs/config';
import { VideoStoreModule } from './video-store/video-store.module';
import Joi from 'joi';
import { HealthModule } from './health/health.module';
import { CreatorsModule } from './creators/creators.module';
import { VideoManagerModule } from './video-manager/video-manager.module';
import { HistoryModule } from './history/history.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.valid('development', 'production', 'test').required(),
        HTTP_HOST: Joi.string().required(),
        HTTP_PORT: Joi.number().required(),
        CLIENT_URL: Joi.string().required(),
        AUTH_SVC_URL: Joi.string().required(),
        REDIS_URL: Joi.string().required(),
        RABBITMQ_URL: Joi.string().required(),
        RABBITMQ_QUEUE: Joi.string().required(),
        RABBITMQ_HISTORY_QUEUE: Joi.string().required(),
        RABBITMQ_VIDEO_MANAGER_QUEUE: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
      }),
    }),
    VideoStoreModule,
    HealthModule,
    CreatorsModule,
    VideoManagerModule,
    HistoryModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
