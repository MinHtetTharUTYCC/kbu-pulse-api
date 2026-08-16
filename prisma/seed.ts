import { PrismaClient, User, Event } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import * as bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'

dotenv.config()

const AVATAR_URL = 'https://pub-692423b3a9eb42988748e01e42daf395.r2.dev/avatars/kbu.webp'
const EVENT_IMAGE_URL = 'https://pub-692423b3a9eb42988748e01e42daf395.r2.dev/events/library.webp'

const USERS = [
    { email: 'alice@ms.kbu.ac.th', fullName: 'Alice Johnson', major: 'DTI' as const },
    { email: 'bob@ms.kbu.ac.th', fullName: 'Bob Smith', major: 'IT' as const },
    { email: 'charlie@ms.kbu.ac.th', fullName: 'Charlie Davis', major: 'BBA' as const },
    { email: 'diana@ms.kbu.ac.th', fullName: 'Diana Lee', major: 'ARCHITECTURE' as const },
    { email: 'eve@ms.kbu.ac.th', fullName: 'Eve Martinez', major: 'MECHANICAL' as const },
]

const CATEGORIES = [
    'HACKATHON', 'CAPSTONE', 'STUDY_GROUP', 'WORKSHOP',
    'SEMINAR', 'CLUB_EVENT', 'COMPETITION', 'OTHER',
] as const

const MAJORS = ['DTI', 'BBA', 'APDI', 'CIVIL', 'MECHANICAL', 'ELECTRICAL', 'ARCHITECTURE', 'IT'] as const

const EVENT_TITLES = [
    'Hackathon 2026', 'Capstone Project Meetup', 'Study Group: Algorithms',
    'Workshop: React Basics', 'Seminar: AI in Education', 'Club Event: Movie Night',
    'Competition: Code Golf', 'Open Mic Night', 'Design Thinking Session',
    'Cloud Computing Workshop', 'Mobile App Dev Meetup', 'Data Science Talk',
    'Cybersecurity Seminar', 'Startup Pitch Night', 'Game Dev Workshop',
    'IoT Hands-on Lab', 'UX Research Session', 'DevOps Deep Dive',
    'Blockchain Seminar', 'Robotics Club Meeting', 'Photography Walk',
    'Music Production Workshop', 'Public Speaking Practice', 'Networking Mixer',
    'Portfolio Review Day', 'Resume Workshop', 'Career Fair Prep',
    'Startup Idea Jam', 'Mini Hackathon', 'Tech Talk: Rust',
    'Web3 Workshop', 'API Design Seminar', 'Database Optimization Talk',
    'Agile Methodology Session', 'Git Advanced Workshop', 'Linux Admin Lab',
    'Flutter Workshop', 'Python Data Analysis', 'ML Model Training',
    'AR/VR Demo Day', 'Sustainability Tech Talk', 'Green Coding Workshop',
    'Accessibility Seminar', 'Open Source Contribution Day', 'Code Review Session',
]

const EVENT_DESCRIPTIONS = [
    'Join us for an exciting event focused on hands-on learning and collaboration.',
    'A great opportunity to network with fellow students and industry professionals.',
    'Learn new skills and expand your knowledge in a supportive environment.',
    'Connect with like-minded peers and work on real-world projects together.',
    'An interactive session with practical exercises and takeaways.',
    'Explore new technologies and trends in the tech industry.',
    'Build something amazing while learning from experienced mentors.',
    'A casual gathering for knowledge sharing and community building.',
    'Develop your skills with guided workshops and peer learning.',
    'An event designed to inspire creativity and innovation among students.',
]

const COMMENT_CONTENTS = [
    'Great event, looking forward to it!',
    'Is this open to all majors?',
    'Can I bring a friend?',
    'Will there be food provided?',
    'Thanks for organizing this!',
    'What time does it start?',
    'Is there a registration fee?',
    'Can I present my project there?',
    'Looking for team members!',
    'Count me in!',
    'This sounds amazing!',
    'Will the slides be shared afterward?',
    'Is parking available nearby?',
    'Can beginners attend?',
    'Really needed this, signing up now.',
    'Will there be a recording available?',
    'How many spots are left?',
    'Can we get attendance certificates?',
    'Excited for this one!',
    'Will there be any prizes?',
]

function pick<T>(arr: readonly T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
}

function randomDate(daysBack: number): Date {
    const now = new Date()
    const offset = Math.floor(Math.random() * daysBack * 24 * 60 * 60 * 1000)
    return new Date(now.getTime() - offset)
}

async function main() {
    const adapter = new PrismaPg(new Pool({ connectionString: process.env.DATABASE_URL }))
    const prisma = new PrismaClient({ adapter: adapter as any })

    console.log('Seeding database...')

    // Clean existing data
    await prisma.comment.deleteMany()
    await prisma.event.deleteMany()
    await prisma.user.deleteMany()

    // Create 5 users
    const hashedPassword = await bcrypt.hash('password123', 10)
    const createdUsers: User[] = []
    for (const u of USERS) {
        const user = await prisma.user.create({
            data: {
                email: u.email,
                password: hashedPassword,
                fullName: u.fullName,
                major: u.major,
                avatarUrl: AVATAR_URL,
                emailVerified: true,
            },
        })
        createdUsers.push(user)
        console.log(`  Created user: ${u.fullName}`)
    }

    // Create 100 events (20 per user)
    const createdEvents: Event[] = []
    for (let i = 0; i < 100; i++) {
        const user = createdUsers[i % 5]
        const event = await prisma.event.create({
            data: {
                title: EVENT_TITLES[i % EVENT_TITLES.length],
                description: pick(EVENT_DESCRIPTIONS),
                category: pick(CATEGORIES),
                imageUrls: [EVENT_IMAGE_URL, EVENT_IMAGE_URL, EVENT_IMAGE_URL, EVENT_IMAGE_URL],
                major: Math.random() < 0.7 ? pick(MAJORS) : null,
                userId: user.id,
                createdAt: randomDate(30),
            },
        })
        createdEvents.push(event)
    }
    console.log(`  Created ${createdEvents.length} events`)

    // Create 40 comments per event
    let commentCount = 0
    for (const event of createdEvents) {
        for (let j = 0; j < 40; j++) {
            await prisma.comment.create({
                data: {
                    content: pick(COMMENT_CONTENTS),
                    eventId: event.id,
                    userId: pick(createdUsers).id,
                    createdAt: randomDate(30),
                },
            })
            commentCount++
        }
    }
    console.log(`  Created ${commentCount} comments`)

    await prisma.$disconnect()
    console.log('Seeding complete!')
}

main().catch(async (e) => {
    console.error('Seed failed:', e)
    process.exit(1)
})

