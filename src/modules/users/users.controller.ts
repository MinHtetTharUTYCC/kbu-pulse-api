import {
    Controller,
    Get,
    Post,
    Query,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiConsumes,
    ApiHeader,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { ImageUploadPipe } from '@/common/pipe/upload-image-pipe';
import { UsersService } from './users.service';
import { EventsService } from '@/modules/events/events.service';
import { CommentsService } from '@/modules/comments/comments.service';
import { UserResponseDto } from './dtos/response/user-response.dto';

@ApiTags('Users')
@ApiHeader({
    name: 'x-user-id',
    description: 'User UUID (from localStorage)',
    required: false,
})
@Controller('api/users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly eventsService: EventsService,
        private readonly commentsService: CommentsService,
    ) {}

    @Get('me')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'User profile', type: UserResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getProfile(@CurrentUser() userId: string): Promise<UserResponseDto> {
        return this.usersService.getProfile(userId);
    }

    @Post('upload-profile')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Upload profile avatar (10MB max)' })
    @ApiResponse({ status: 201, description: 'Avatar uploaded' })
    @ApiResponse({ status: 400, description: 'Validation failed or file too large' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async uploadAvatar(
        @CurrentUser() userId: string,
        @UploadedFile(ImageUploadPipe) file: Express.Multer.File,
    ) {
        return this.usersService.uploadAvatar(userId, file);
    }

    @Get('me/events')
    @ApiOperation({ summary: 'Get events created by current user' })
    @ApiResponse({ status: 200, description: 'Paginated list of user events' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getMyEvents(
        @CurrentUser() userId: string,
        @Query() query: PaginationQueryDto,
    ) {
        return this.eventsService.getMyEvents(userId, query.page!, query.limit!);
    }

    @Get('me/comments')
    @ApiOperation({ summary: 'Get comments made by current user' })
    @ApiResponse({ status: 200, description: 'Paginated list of user comments' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getMyComments(
        @CurrentUser() userId: string,
        @Query() query: PaginationQueryDto,
    ) {
        return this.commentsService.getMyComments(userId, query.page!, query.limit!);
    }
}