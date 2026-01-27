import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video } from './schemas/video.schema';
import { CreateVideoDto, UpdateVideoDto, VideoResponseDto, VideoListQueryDto } from './dto/content.dto';
import { VideoStatus } from '../../types/content.types';
import { RabbitMQService } from '../../config/rabbitmq.service';

/**
 * Content Service
 * Handles video content CRUD operations and upload processing
 */
@Injectable()
export class ContentService {
  private readonly logger = new Logger(ContentService.name);
  private readonly ENCODING_QUEUE = 'video-encoding';

  constructor(
    @InjectModel(Video.name) private videoModel: Model<Video>,
    private rabbitMQService: RabbitMQService,
  ) {
    // RabbitMQService is injected via global module
  }

  /**
   * Create a new video record
   */
  async create(userId: string, createVideoDto: CreateVideoDto): Promise<VideoResponseDto> {
    this.logger.debug(`Creating video: ${createVideoDto.title} by user: ${userId}`);

    const video = new this.videoModel({
      ...createVideoDto,
      uploadedBy: userId,
      status: VideoStatus.UPLOADING,
    });

    const savedVideo = await video.save();

    // Publish encoding job to queue
    await this.publishEncodingJob(savedVideo._id.toString(), createVideoDto.originalUrl);

    this.logger.log(`Video created: ${savedVideo._id} - ${createVideoDto.title}`);
    return this.toResponseDto(savedVideo);
  }

  /**
   * Get video by ID
   */
  async findById(id: string): Promise<VideoResponseDto> {
    const video = await this.videoModel.findById(id);
    if (!video) {
      throw new NotFoundException('Video not found');
    }
    return this.toResponseDto(video);
  }

  /**
   * Update video (owner only)
   */
  async update(
    id: string,
    userId: string,
    updateVideoDto: UpdateVideoDto,
  ): Promise<VideoResponseDto> {
    const video = await this.videoModel.findById(id);
    if (!video) {
      throw new NotFoundException('Video not found');
    }

    // Check ownership
    if (video.uploadedBy.toString() !== userId) {
      throw new ForbiddenException('You can only update your own videos');
    }

    const updatedVideo = await this.videoModel.findByIdAndUpdate(id, updateVideoDto, {
      new: true,
      runValidators: true,
    });

    this.logger.log(`Video updated: ${id}`);
    return this.toResponseDto(updatedVideo);
  }

  /**
   * Delete video (owner only)
   */
  async delete(id: string, userId: string): Promise<{ message: string }> {
    const video = await this.videoModel.findById(id);
    if (!video) {
      throw new NotFoundException('Video not found');
    }

    // Check ownership
    if (video.uploadedBy.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own videos');
    }

    await this.videoModel.findByIdAndDelete(id);
    this.logger.log(`Video deleted: ${id}`);
    return { message: 'Video deleted successfully' };
  }

  /**
   * List videos with filters and pagination
   */
  async findAll(query: VideoListQueryDto): Promise<VideoResponseDto[]> {
    const { skip = 0, limit = 10, courseId, userId, status, search } = query;

    const filter: any = {};

    if (courseId) filter.courseId = courseId;
    if (userId) filter.uploadedBy = userId;
    if (status) filter.status = status;

    if (search) {
      filter.$text = { $search: search };
    }

    const videos = await this.videoModel
      .find(filter)
      .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('uploadedBy', 'firstName lastName email');

    return videos.map((video) => this.toResponseDto(video));
  }

  /**
   * Get trending videos
   */
  async getTrending(limit = 10): Promise<VideoResponseDto[]> {
    // Simple implementation: most recent ready videos
    // In production, this would use analytics data
    const videos = await this.videoModel
      .find({ status: VideoStatus.READY })
      .sort({ createdAt: -1 })
      .limit(limit);

    return videos.map((video) => this.toResponseDto(video));
  }

  /**
   * Get user's videos
   */
  async getUserVideos(userId: string, skip = 0, limit = 10): Promise<VideoResponseDto[]> {
    const videos = await this.videoModel
      .find({ uploadedBy: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return videos.map((video) => this.toResponseDto(video));
  }

  /**
   * Update video status (used by encoding service)
   */
  async updateStatus(id: string, status: VideoStatus): Promise<void> {
    await this.videoModel.findByIdAndUpdate(id, { status });
    this.logger.debug(`Video status updated: ${id} -> ${status}`);
  }

  /**
   * Publish encoding job to RabbitMQ
   */
  private async publishEncodingJob(videoId: string, originalUrl: string): Promise<void> {
    try {
      const job = {
        videoId,
        originalUrl,
        qualities: ['240p', '360p', '480p', '720p'],
        timestamp: new Date().toISOString(),
      };

      await this.rabbitMQService.publishToQueue(this.ENCODING_QUEUE, job);
      this.logger.log(`Encoding job published for video: ${videoId}`);
    } catch (error) {
      this.logger.error(`Failed to publish encoding job for video ${videoId}:`, error);
      // Update status to failed
      await this.updateStatus(videoId, VideoStatus.FAILED);
      throw new BadRequestException('Failed to queue video for encoding');
    }
  }

  /**
   * Convert Mongoose document to response DTO
   */
  private toResponseDto(video: Video): VideoResponseDto {
    return {
      id: video._id.toString(),
      title: video.title,
      description: video.description,
      courseId: video.courseId,
      uploadedBy: video.uploadedBy.toString(),
      duration: video.duration,
      thumbnail: video.thumbnail,
      status: video.status,
      originalUrl: video.originalUrl,
      fileSize: video.fileSize,
      resolution: video.resolution,
      createdAt: video.createdAt,
      updatedAt: video.updatedAt,
    };
  }
}
