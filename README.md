# Nappio Dashboard

An internal team dashboard for managing Nappio's nappy laundry service operations.

## Features

- **Data Management**: View, add, edit, and delete team data in a clean table interface
- **Authentication**: Supabase integration for secure team member access
- **Real-time Updates**: Responsive UI with loading states and error handling
- **Mobile Friendly**: Responsive design that works on all devices
- **API Integration**: Ready for FastAPI backend integration

## Tech Stack

- **Frontend**: SvelteKit + TypeScript
- **Styling**: TailwindCSS with custom components
- **Authentication**: Supabase (configured for future use)
- **Backend**: FastAPI integration ready
- **Build Tools**: Vite, ESLint, Prettier

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/andrewwildgoose/nappio-dashboard.git
cd nappio-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Environment Variables

Create a `.env` file in the root directory:

```env
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
FASTAPI_BASE_URL=http://localhost:8000
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint and Prettier checks
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── lib/
│   ├── components/     # Reusable UI components
│   │   ├── DataTable.svelte
│   │   └── AddDataForm.svelte
│   ├── api.ts         # API service layer
│   └── supabase.ts    # Supabase configuration
├── routes/
│   ├── +layout.svelte # Main layout
│   ├── +page.svelte   # Dashboard home
│   ├── auth/          # Authentication pages
│   └── Header.svelte  # Navigation component
└── app.html           # HTML template
```

## Features Overview

### Dashboard
- Clean, professional interface for team data management
- Sortable table with inline editing capabilities
- Add new items with validation
- Status tracking with color-coded badges
- Real-time statistics cards

### Authentication
- Supabase integration ready
- Demo mode for development
- Clean login/signup forms
- Protected routes (ready for implementation)

### API Integration
- Structured service layer for FastAPI communication
- Mock data for development
- Error handling and loading states
- TypeScript interfaces for type safety

## Development

The app is currently set up with mock data for development. To integrate with real backends:

1. **Supabase**: Update credentials in `.env` and uncomment Supabase calls in components
2. **FastAPI**: The API service layer is ready - just update the base URL

## Deployment

This project can be deployed to any platform that supports Node.js:

- **Vercel**: `npm run build` (automatic with SvelteKit adapter)
- **Netlify**: `npm run build` 
- **Docker**: Dockerfile can be added for containerized deployment

## License

MIT License - see LICENSE file for details.
