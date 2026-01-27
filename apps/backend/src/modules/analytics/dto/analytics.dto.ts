import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsObject } from 'class-validator';
import { AnalyticsEventType } from '../../../types/analytics.types';

export class TrackEventDto {
  @ApiProperty({ description: 'Video ID' })
  @IsString()
  @IsNotEmpty()
  videoId: string;

  @ApiProperty({ enum: AnalyticsEventType, description: 'Event type' })
  @IsEnum(AnalyticsEventType)
  eventType: AnalyticsEventType;

  @ApiPropertyOptional({ description: 'Event data' })
  @IsObject()
  @IsOptional()
  eventData?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Bandwidth in kbps' })
  @IsOptional()
  bandwidth?: number;

  @ApiPropertyOptional({ description: 'Device type' })
  @IsString()
  @IsOptional()
  deviceType?: string;

  @ApiPropertyOptional({ description: 'Platform' })
  @IsString()
  @IsOptional()
  platform?: string;
}

export class VideoMetricsResponseDto {
  @ApiProperty()
  videoId: string;

  @ApiProperty()
  totalViews: number;

  @ApiProperty()
  totalMinutesWatched: number;

  @ApiProperty()
  averageQuality: string;

  @ApiProperty()
  bufferingEventCount: number;

  @ApiProperty()
  averageStartupTime: number;

  @ApiProperty()
  completionRate: number;
}
