import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Channel, Connection, connect, ConsumeMessage } from 'amqplib';

/**
 * RabbitMQ Service
 * Manages message queue operations for async jobs (encoding, analytics, etc.)
 */
@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: Connection;
  private channel: Channel;
  private readonly logger = new Logger(RabbitMQService.name);

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.close();
  }

  private async connect() {
    try {
      const url = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
      this.connection = await connect(url);
      this.channel = await this.connection.createChannel();

      this.connection.on('error', (err) => {
        this.logger.error('RabbitMQ connection error:', err);
      });

      this.connection.on('close', () => {
        this.logger.warn('RabbitMQ connection closed');
      });

      this.logger.log('✓ RabbitMQ connected');
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ:', error);
      throw error;
    }
  }

  async close() {
    try {
      if (this.channel) await this.channel.close();
      if (this.connection) await this.connection.close();
      this.logger.log('✓ RabbitMQ closed');
    } catch (error) {
      this.logger.error('Error closing RabbitMQ:', error);
    }
  }

  async assertQueue(queue: string, options = {}) {
    return await this.channel.assertQueue(queue, {
      durable: true,
      ...options,
    });
  }

  async publishToQueue(
    queue: string,
    message: any,
    options = {},
  ): Promise<void> {
    await this.assertQueue(queue);
    const buffer = Buffer.from(JSON.stringify(message));
    this.channel.sendToQueue(queue, buffer, {
      persistent: true,
      contentType: 'application/json',
      ...options,
    });
    this.logger.debug(`Message published to queue: ${queue}`);
  }

  async publishToExchange(
    exchange: string,
    routingKey: string,
    message: any,
    options = {},
  ): Promise<void> {
    await this.channel.assertExchange(exchange, 'direct', { durable: true });
    const buffer = Buffer.from(JSON.stringify(message));
    this.channel.publish(exchange, routingKey, buffer, {
      persistent: true,
      contentType: 'application/json',
      ...options,
    });
    this.logger.debug(
      `Message published to exchange: ${exchange}, routing key: ${routingKey}`,
    );
  }

  async consume(
    queue: string,
    callback: (msg: ConsumeMessage | null) => void,
    options = {},
  ) {
    await this.assertQueue(queue);
    return await this.channel.consume(queue, callback, {
      noAck: false,
      ...options,
    });
  }

  ackMessage(message: ConsumeMessage) {
    this.channel.ack(message);
  }

  nackMessage(message: ConsumeMessage, requeue = false) {
    this.channel.nack(message, false, requeue);
  }

  getChannel(): Channel {
    return this.channel;
  }
}
