import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';
import { TrackingModule } from './tracking/tracking.module';
import { TrackingCorreiosModule } from './tracking_correios/tracking_correios.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env`],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      // synchronize: process.env.MIGRATION_SYNCHRONIZE === 'true',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      logging: false,
      migrationsRun: process.env.MIGRATION_RUN === 'true',
    }),
    TypeOrmModule.forFeature([User]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*'],
    }),
    AuthModule,
    TrackingModule,
    TrackingCorreiosModule,
  ],
})
export class AppModule {}
