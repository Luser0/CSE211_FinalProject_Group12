# Event-X GU Web Project

A full-stack event management and registration platform built with modern web technologies. This project allows users to browse events, calculate event budgets, and register as attendees.

## Features

- 📋 **Event Management** - View and manage events with detailed information
- 💰 **Budget Calculator** - Calculate event budgets with interactive tools
- 👥 **Event Registration** - Register for events and manage attendee information
- 📱 **Responsive Design** - Mobile-friendly interface built with Tailwind CSS
- 🗄️ **Database Integration** - SQLite database with Drizzle ORM for type-safe queries
- ⚡ **Modern Build Tools** - Vite for fast development and optimized builds
- 🔗 **RESTful API** - Serverless API endpoints for event and registration management

## Tech Stack

### Frontend
- **HTML/CSS/TypeScript** - Core web technologies
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Next-generation frontend build tool

### Backend
- **Node.js** - Runtime environment
- **Drizzle ORM** - Type-safe database ORM
- **SQLite** - Lightweight database
- **Vercel Functions** - Serverless API deployment

### Database
- **libSQL** - SQLite-compatible database client
- **Drizzle Kit** - Database schema management

## Project Structure

```
Part2_Website_project/
├── api/                          # Serverless API endpoints
│   ├── events.ts                 # Event management endpoints
│   └── registration.ts           # Registration endpoints
├── pages/                        # HTML pages
│   ├── about.html
│   ├── contact.html
│   ├── events.html
│   ├── registration.html
│   ├── budget-calculator.html
│   ├── css/                      # Stylesheets
│   ├── images/                   # Image assets
│   ├── scripts/                  # Page-specific scripts
│   └── videos/                   # Video assets
├── src/
│   ├── lib/
│   │   └── db/
│   │       ├── client.ts         # Database client configuration
│   │       └── schema.ts         # Database schema definitions
│   └── services/
│       ├── budget-calculator/
│       │   └── EventBudgetCalculator.ts
│       └── events/
│           └── events.ts
├── drizzle/                      # Database migrations
├── index.html                    # Main HTML entry point
├── vite.config.ts                # Vite configuration
├── drizzle.config.ts             # Drizzle configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

## Database Schema

### Events Table
- `id` - Primary key
- `name` - Event name
- `description` - Event description
- `slug` - URL-friendly identifier
- `location` - Event location
- `date` - Event date/time
- `categoryId` - Reference to event category

### Event Categories Table
- `id` - Primary key
- `name` - Category name

### Attendees Table
- `id` - Primary key
- `name` - Attendee name
- `email` - Email address (unique)
- `phonenumber` - Phone number (unique)
- `eventId` - Reference to event

### Event Media Table
- `id` - Primary key
- `eventId` - Reference to event
- `url` - Media URL
- `type` - Media type (image | video)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
cd Part2_Website_project
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with your database configuration:
```env
DATABASE_URL=your_libsql_connection_string
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build TypeScript and create optimized production bundle
- `npm run preview` - Preview the production build locally
- `npm run db:pull` - Pull database schema from remote
- `npm run db:gen` - Generate database migration files
- `npm run db:push` - Push database changes to the database

## API Endpoints

### Events API (`/api/events`)
- **GET** `/api/events` - Retrieve all events
- **POST** `/api/events` - Create a new event
  - Required fields: `name`, `description`, `date`, `categoryId`, `location`

### Registration API (`/api/registration`)
- Manage event registrations and attendee information

## Features in Detail

### Event Management
Browse a curated list of events with full details including date, location, category, and media (images/videos).

### Budget Calculator
An interactive tool to calculate event budgets based on various factors and attendee counts.

### Event Registration
Simple registration flow allowing users to sign up for events with their personal information.

### Responsive Design
The entire application is built mobile-first and works seamlessly across all device sizes.

## Deployment

This project is configured for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect the Vite configuration
4. Configure your environment variables in Vercel dashboard
5. Deploy automatically on push to main branch

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## License

This project is part of the Event-X GU portfolio project series.

## Support

For support or questions about this project, please refer to the project documentation or create an issue in the repository.
