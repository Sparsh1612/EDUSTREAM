import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ContentService } from './content.service';
import {
  CreateVideoDto,
  UpdateVideoDto,
  VideoResponseDto,
  VideoListQueryDto,
} from './dto/content.dto';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '../../types/user.types';

/**
 * Content Controller
 * Handles video content endpoints
 */
@ApiTags('Content')
@Controller('content')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ContentController {
  constructor(private contentService: ContentService) {}

  /**
   * Upload/Create Video
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new video' })
  @ApiResponse({
    status: 201,
    description: 'Video created successfully',
    type: VideoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(
    @CurrentUser('id') userId: string,
    @Body() createVideoDto: CreateVideoDto,
  ): Promise<VideoResponseDto> {
    return this.contentService.create(userId, createVideoDto);
  }

  /**
   * Get Video by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get video by ID' })
  @ApiResponse({
    status: 200,
    description: 'Video retrieved successfully',
    type: VideoResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Video not found' })
  async findById(@Param('id') id: string): Promise<VideoResponseDto> {
    return this.contentService.findById(id);
  }

  /**
   * Update Video (Owner Only)
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update video metadata (owner only)' })
  @ApiResponse({
    status: 200,
    description: 'Video updated successfully',
    type: VideoResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden - not the owner' })
  @ApiResponse({ status: 404, description: 'Video not found' })
  async update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() updateVideoDto: UpdateVideoDto,
  ): Promise<VideoResponseDto> {
    return this.contentService.update(id, userId, updateVideoDto);
  }

  /**
   * Delete Video (Owner Only)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete video (owner only)' })
  @ApiResponse({ status: 200, description: 'Video deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the owner' })
  @ApiResponse({ status: 404, description: 'Video not found' })
  async delete(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ): Promise<{ message: string }> {
    return this.contentService.delete(id, userId);
  }

  /**
   * List Videos
   */
  @Get()
  @ApiOperation({ summary: 'List videos with filters and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Videos retrieved successfully',
    type: [VideoResponseDto],
  })
  async findAll(@Query() query: VideoListQueryDto): Promise<VideoResponseDto[]> {
    return this.contentService.findAll(query);
  }

  /**
   * Get Trending Videos
   */
  @Get('trending/list')
  @ApiOperation({ summary: 'Get trending videos' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Trending videos retrieved',
    type: [VideoResponseDto],
  })
  async getTrending(@Query('limit') limit?: number): Promise<VideoResponseDto[]> {
    return this.contentService.getTrending(limit ? parseInt(limit.toString()) : 10);
  }

  /**
   * Get User's Videos
   */
  @Get('user/:userId')
  @ApiOperation({ summary: "Get user's videos" })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: "User's videos retrieved",
    type: [VideoResponseDto],
  })
  async getUserVideos(
    @Param('userId') userId: string,
    @Query('skip') skip?: number,
    @Query('limit') limit?: number,
  ): Promise<VideoResponseDto[]> {
    return this.contentService.getUserVideos(
      userId,
      skip ? parseInt(skip.toString()) : 0,
      limit ? parseInt(limit.toString()) : 10,
    );
  }
}
