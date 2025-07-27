# Do Not Say Goodbye

[中文版](README.md) | English

An application that helps you preserve beautiful memories and find new horizons.

## Project Overview

"Do Not Say Goodbye" is an emotional recording application built with Nuxt 3 and Supabase, designed to help users handle farewells and memories in a positive way. The application includes two core features:

### 🎭 Moment Capsule
- Preserve beautiful moments, upload photos, record text, and associate music
- Create your own memory timeline
- Support capsule sealing and timed opening features
- Private personal memory space

### 🌅 Horizon Echo
- Guide self-dialogue through inspirational questions
- Record mood scores and growth trajectories
- Help users make the psychological leap from "not saying goodbye" to "finding new horizons"

## Tech Stack

- **Frontend Framework**: Nuxt 3
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI + Heroicons
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Package Manager**: pnpm

## Requirements

- Node.js 18+
- pnpm 8+

## Quick Start

### 1. Clone the Project

```bash
git clone https://github.com/zym9863/Do-Not-Say-Goodbye.git
cd Do-Not-Say-Goodbye
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Configuration

Create a `.env` file and configure Supabase connection information:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Start Development Server

```bash
pnpm dev
```

The application will start at `http://localhost:3000`.

## Database Setup

The project includes complete database migration scripts, including:

- User authentication tables
- Moment capsules table (`moment_capsules`)
- Timelines table (`timelines`)
- User echoes table (`user_echoes`)
- Inspiration questions table (`inspiration_questions`)
- Growth milestones table (`growth_milestones`)

All tables are configured with RLS (Row Level Security) policies to ensure data security.

## Features

### 🔐 User Authentication
- Email registration/login
- Secure session management
- Protected routes

### 📸 Moment Capsule
- Multimedia content support (photos, text, music)
- Tag system
- Capsule sealing/opening mechanism
- Timeline display

### 💭 Horizon Echo
- Categorized inspirational questions
- Mood scoring system
- Tags and categories
- Growth trajectory visualization

### 🎨 User Experience
- Responsive design
- Smooth animation effects
- Intuitive navigation
- Elegant error handling

## Deployment

### Build Production Version

```bash
pnpm build
```

### Preview Production Version

```bash
pnpm preview
```

## Project Structure

```
├── assets/          # Static assets
├── components/      # Vue components
├── composables/     # Composable functions
├── layouts/         # Layout components
├── middleware/      # Middleware
├── pages/           # Page components
├── public/          # Public static files
└── server/          # Server-side code
```

## Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions or suggestions, please contact us through Issues.