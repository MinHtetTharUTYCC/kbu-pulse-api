# KBU PULSE API - Agent Guidelines

## Build & Run

```bash
pnpm build              # Compile TypeScript
pnpm start:dev          # Start dev server with watch
pnpm start:prod         # Start production
pnpm db:push            # Push Prisma schema to DB
pnpm db:generate        # Regenerate Prisma client
pnpm db:studio          # Open Prisma Studio
```

## Tech Stack

- **Framework:** NestJS 11
- **ORM:** Prisma 7 (with `@prisma/adapter-pg` driver adapter)
- **Database:** PostgreSQL (Neon Serverless)
- **File Storage:** Cloudflare R2 (S3-compatible)
- **Image Processing:** sharp (WebP, 80% quality, max 10MB)
- **Validation:** class-validator + class-transformer + Joi (config)
- **API Docs:** Swagger at `/api/docs`

## Architecture

### Module Structure

```
src/
├── main.ts                          # Bootstrap, CORS, Swagger, ValidationPipe
├── app.module.ts                    # Root module (imports all feature modules)
├── config/                          # Global config (Joi + typed AppConfigService)
│   ├── app.config.ts
│   ├── app-config.service.ts
│   └── config.module.ts
├── modules/
│   ├── prisma/                      # Global PrismaService
│   ├── auth/                        # Register, login, OTP, forgot/reset password
│   ├── events/                      # CRUD, images, upvote, save, saved list
│   ├── comments/                    # List, create, like, delete
│   ├── users/                       # Profile, avatar, my-events, my-comments
│   ├── reports/                     # Report user/event/comment
│   └── storage/                     # R2 upload via S3 SDK
└── common/
    ├── decorators/                  # @CurrentUser()
    ├── filters/                     # HttpExceptionFilter
    ├── interceptors/                # ResponseInterceptor
    ├── pipe/                        # ImageUploadPipe
    └── dto/                         # PaginationQueryDto, PaginationMetaDto
```

### Auth Model

- **Header-based:** `x-user-id` (UUID from localStorage)
- **No JWT** — custom `@CurrentUser()` decorator reads the header
- **Password:** bcrypt hashed
- **Email:** `@ms.kbu.ac.th` only

### API Conventions

- All endpoints return `{ data, meta }` for lists (paginated)
- `PaginationQueryDto`: `?page=1&limit=20` (max 50)
- `PaginationMetaDto`: `{ total, page, limit, totalPages }`
- Date fields: `type: 'string', format: 'date-time'`
- Nullable fields: `@ApiProperty({ nullable: true })`
- Optional fields: `@ApiPropertyOptional()`
- Every endpoint must have `@ApiResponse()` decorators

### Enums

- **Major:** DTI, BBA, APDI, CIVIL, MECHANICAL, ELECTRICAL, ARCHITECTURE, IT
- **Category:** HACKATHON, CAPSTONE, STUDY_GROUP, WORKSHOP, SEMINAR, CLUB_EVENT, COMPETITION, OTHER
- **OtpPurpose:** SIGNUP, FORGOT_PASSWORD
- **ReportReason:** SPAM, INAPPROPRIATE_CONTENT, HARASSMENT, MISINFORMATION, OTHER
- **ReportStatus:** PENDING, REVIEWED, RESOLVED, DISMISSED

## Code Style

- 4-space indentation
- Single quotes for strings
- Trailing commas
- No semicolons (except where required)
- Path aliases: `@/*` maps to `src/*`
- File naming: `kebab-case` (e.g., `events.service.ts`)
- DTO classes with `@ApiProperty` decorators
- Services use `PrismaService` for DB access
- Controllers use `@CurrentUser()` for auth

## Prisma 7 Notes

- URL configured in `prisma.config.ts` (not in schema)
- Requires driver adapter: `@prisma/adapter-pg` + `pg`
- `PrismaClient` constructor needs `adapter` option
- Run `pnpm db:push` after schema changes

## Environment Variables

```env
PORT=3000
DATABASE_URL=postgresql://...
R2_ENDPOINT=https://...r2.cloudflarestorage.com
R2_PUBLIC_URL=https://pub-....r2.dev
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=kbu-pulse
```
