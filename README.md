# KBU PULSE API

Backend REST API for **KBU PULSE** — a university events platform for Kasem Bundit University students.

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** NestJS 11
- **Database:** PostgreSQL (Neon Serverless) + Prisma 7 ORM
- **Storage:** Cloudflare R2 (S3-compatible) for images
- **Auth:** Header-based (`x-user-id`), bcrypt password hashing
- **API Docs:** Swagger at `/api/docs`

## Prerequisites

- Node.js 22+
- pnpm 10+
- Neon PostgreSQL database
- Cloudflare R2 bucket

## Setup

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Push schema to database
pnpm db:push

# Generate Prisma client
pnpm db:generate

# Start dev server
pnpm start:dev
```

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

## API Endpoints

### Auth (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user (returns OTP) |
| POST | `/verify-registration` | Verify email with OTP |
| POST | `/login` | Login with email + password |
| POST | `/forgot-password` | Request password reset OTP |
| POST | `/reset-password` | Reset password with OTP |

### Events (`/api/events`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List events (paginated, filtered) |
| GET | `/:id` | Get event detail |
| POST | `/` | Create event |
| PATCH | `/:id` | Update event |
| DELETE | `/:id` | Delete event |
| POST | `/:id/images` | Upload event images (max 4) |
| POST | `/:id/upvote` | Toggle upvote |
| POST | `/:id/save` | Toggle save |
| GET | `/saved` | Get saved events |

### Comments (`/api/events/:eventId/comments`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List comments (paginated) |
| POST | `/` | Create comment |
| POST | `/:commentId/like` | Toggle like |
| DELETE | `/:commentId` | Delete comment |

### Users (`/api/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/me` | Get current user profile |
| POST | `/upload-profile` | Upload avatar |
| GET | `/me/events` | Get my events |
| GET | `/me/comments` | Get my comments |

### Reports (`/api/reports`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/user` | Report a user |
| POST | `/event` | Report an event |
| POST | `/comment` | Report a comment |

## Database Schema

- **User** — id, email, password, fullName, major, avatarUrl, emailVerified, createdAt
- **Event** — id, title, description, category, imageUrls, viewCount, userId, createdAt
- **Comment** — id, content, eventId, userId, createdAt
- **Upvote** — userId + eventId (composite PK)
- **SavedEvent** — userId + eventId (composite PK)
- **CommentLike** — userId + commentId (composite PK)
- **Otp** — id, email, code, purpose, expiresAt
- **Report** — id, reason, note, status, reporterId, reportedUserId/eventId/commentId

## Enums

- **Major:** DTI, BBA, APDI, CIVIL, MECHANICAL, ELECTRICAL, ARCHITECTURE, IT
- **Category:** HACKATHON, CAPSTONE, STUDY_GROUP, WORKSHOP, SEMINAR, CLUB_EVENT, COMPETITION, OTHER
- **ReportReason:** SPAM, INAPPROPRIATE_CONTENT, HARASSMENT, MISINFORMATION, OTHER

## Project Structure

```
src/
├── main.ts                      # Bootstrap
├── app.module.ts                # Root module
├── config/                      # App config (Joi + typed service)
├── modules/
│   ├── prisma/                  # Database client
│   ├── auth/                    # Authentication
│   ├── events/                  # Events CRUD
│   ├── comments/                # Comments
│   ├── users/                   # User profiles
│   ├── reports/                 # Reporting system
│   └── storage/                 # R2 file uploads
└── common/                      # Decorators, filters, DTOs
```

## License

UNLICENSED
