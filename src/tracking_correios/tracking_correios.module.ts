import { Module } from '@nestjs/common';
import { TrackingCorreiosService } from './tracking_correios.service';
import { TrackingCorreiosController } from './tracking_correios.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [TrackingCorreiosController],
  providers: [TrackingCorreiosService],
})
export class TrackingCorreiosModule {}