import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from '../../config/rabbitmq.service';
import { EncodingService } from './encoding.service';
import { EncodingStatus } from '../../types/content.types';
import { ConsumeMessage } from 'amqplib';

/**
 * Encoding Consumer
 * Consumes encoding jobs from RabbitMQ and processes them
 * In production, this would trigger FFmpeg encoding
 */
@Injectable()
export class EncodingConsumer implements OnModuleInit {
  private readonly logger = new Logger(EncodingConsumer.name);
  private readonly ENCODING_QUEUE = 'video-encoding';

  constructor(
    private rabbitMQService: RabbitMQService,
    private encodingService: EncodingService,
  ) {}

  async onModuleInit() {
    await this.consumeEncodingJobs();
  }

  /**
   * Consume encoding jobs from queue
   */
  private async consumeEncodingJobs() {
    await this.rabbitMQService.consume(
      this.ENCODING_QUEUE,
      async (msg: ConsumeMessage | null) => {
        if (!msg) return;

        try {
          const job = JSON.parse(msg.content.toString());
          this.logger.log(`Processing encoding job for video: ${job.videoId}`);

          // Process each quality
          for (const quality of job.qualities) {
            const settings = this.encodingService.getQualitySettings(quality);

            // Create encoding record
            const encoding = await this.encodingService.createEncoding(
              job.videoId,
              quality as any,
              settings.bitrate,
              settings.resolution,
            );

            // Update status to encoding
            await this.encodingService.updateStatus(encoding._id.toString(), EncodingStatus.ENCODING);

            // Simulate encoding process (in production, this would call FFmpeg)
            // For now, we'll mark as completed after a delay
            setTimeout(async () => {
              await this.encodingService.updateStatus(encoding._id.toString(), EncodingStatus.COMPLETED, {
                fileSize: 1000000, // Placeholder
                duration: 120, // Placeholder
              });
              this.logger.log(`Encoding completed: ${job.videoId} - ${quality}`);
            }, 5000); // 5 second delay for demo
          }

          this.rabbitMQService.ackMessage(msg);
        } catch (error) {
          this.logger.error(`Error processing encoding job:`, error);
          this.rabbitMQService.nackMessage(msg, false);
        }
      },
    );

    this.logger.log(`Encoding consumer started, listening on queue: ${this.ENCODING_QUEUE}`);
  }
}
