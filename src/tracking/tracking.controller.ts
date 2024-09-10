import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async getTrackingInfo(@Body() body: { numEncCli: string[] }) {
    return await this.trackingService.makeRequest(body.numEncCli);
  }

  @UseGuards(JwtAuthGuard)
  @Post('import')
  async importClients(@Body() body: any[]) {
    return await this.trackingService.importClients(body);
  }
}
