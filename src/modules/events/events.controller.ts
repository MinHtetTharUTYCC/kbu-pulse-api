import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
    ApiConsumes,
    ApiHeader,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { MessageResponseDto } from '@/common/dto/message-response.dto';
import { ImageUploadPipe } from '@/common/pipe/upload-image-pipe';
import { EventsService } from './events.service';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { EventsQueryDto } from './dtos/events-query.dto';
import { SavedEventsQueryDto } from './dtos/saved-events-query.dto';
import { PaginatedEventListItemDto } from './dtos/response/paginated-event-list-item.dto';
import { EventDetailDto } from './dtos/response/event-detail-response.dto';
import { UploadImagesResponseDto } from './dtos/response/upload-images-response.dto';
import { ToggleUpvoteResponseDto } from './dtos/response/toggle-upvote-response.dto';
import { ToggleSaveResponseDto } from './dtos/response/toggle-save-response.dto';

@ApiTags('Events')
@ApiHeader({
    name: 'x-user-id',
    description: 'User UUID (from localStorage)',
    required: false,
})
@Controller('api/events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    @Get()
    @ApiOperation({ summary: 'List events with filters and pagination' })
    @ApiResponse({ status: 200, description: 'Paginated list of events', type: PaginatedEventListItemDto })
    async findAll(
        @Query() query: EventsQueryDto,
        @CurrentUser(false) userId?: string,
    ) {
        return this.eventsService.findAll(query, userId);
    }

    @Get('saved')

    @ApiOperation({ summary: 'Get saved/bookmarked events' })
    @ApiResponse({ status: 200, description: 'Paginated list of saved events', type: PaginatedEventListItemDto })
    @ApiResponse({ status: 401, description: 'Unauthorized — missing x-user-id header' })
    async findSaved(
        @Query() query: SavedEventsQueryDto,
        @CurrentUser() userId: string,
    ) {
        return this.eventsService.findSaved(query, userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get event detail and increment view count' })
    @ApiParam({ name: 'id', description: 'Event UUID' })
    @ApiResponse({ status: 200, description: 'Event detail', type: EventDetailDto })
    @ApiResponse({ status: 404, description: 'Event not found' })
    async findOne(
        @Param('id') id: string,
        @CurrentUser(false) userId?: string,
    ) {
        return this.eventsService.findOne(id, userId);
    }

    @Post()

    @ApiOperation({ summary: 'Create a new event' })
    @ApiResponse({ status: 201, description: 'Event created', type: EventDetailDto })
    @ApiResponse({ status: 400, description: 'Validation failed' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async create(
        @Body() dto: CreateEventDto,
        @CurrentUser() userId: string,
    ) {
        return this.eventsService.create(dto, userId);
    }

    @Patch(':id')

    @ApiOperation({ summary: 'Update an event (owner only)' })
    @ApiParam({ name: 'id', description: 'Event UUID' })
    @ApiResponse({ status: 200, description: 'Event updated', type: EventDetailDto })
    @ApiResponse({ status: 400, description: 'Validation failed' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden — not the event owner' })
    @ApiResponse({ status: 404, description: 'Event not found' })
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateEventDto,
        @CurrentUser() userId: string,
    ) {
        return this.eventsService.update(id, dto, userId);
    }

    @Post(':id/images')

    @UseInterceptors(FilesInterceptor('files', 4))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Upload images for an event (max 4)' })
    @ApiParam({ name: 'id', description: 'Event UUID' })
    @ApiResponse({ status: 201, description: 'Images uploaded, URLs returned', type: UploadImagesResponseDto })
    @ApiResponse({ status: 400, description: 'Validation failed or max 4 images exceeded' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden — not the event owner' })
    @ApiResponse({ status: 404, description: 'Event not found' })
    async uploadImages(
        @Param('id') id: string,
        @UploadedFiles(ImageUploadPipe) files: Express.Multer.File[],
        @CurrentUser() userId: string,
    ) {
        const urls = await this.eventsService.uploadImages(id, files, userId);
        return { imageUrls: urls };
    }

    @Delete(':id')

    @ApiOperation({ summary: 'Delete an event (owner only)' })
    @ApiParam({ name: 'id', description: 'Event UUID' })
    @ApiResponse({ status: 200, description: 'Event deleted', type: MessageResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden — not the event owner' })
    @ApiResponse({ status: 404, description: 'Event not found' })
    async remove(
        @Param('id') id: string,
        @CurrentUser() userId: string,
    ) {
        await this.eventsService.remove(id, userId);
        return { message: 'Event deleted' };
    }

    @Post(':id/upvote')

    @ApiOperation({ summary: 'Toggle upvote on an event' })
    @ApiParam({ name: 'id', description: 'Event UUID' })
    @ApiResponse({ status: 200, description: 'Upvote toggled', type: ToggleUpvoteResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Event not found' })
    async toggleUpvote(
        @Param('id') id: string,
        @CurrentUser() userId: string,
    ) {
        return this.eventsService.toggleUpvote(id, userId);
    }

    @Post(':id/save')

    @ApiOperation({ summary: 'Toggle bookmark/save on an event' })
    @ApiParam({ name: 'id', description: 'Event UUID' })
    @ApiResponse({ status: 200, description: 'Save toggled', type: ToggleSaveResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Event not found' })
    async toggleSave(
        @Param('id') id: string,
        @CurrentUser() userId: string,
    ) {
        return this.eventsService.toggleSave(id, userId);
    }
}
