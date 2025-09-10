# Nappio Subscription Dashboard

A comprehensive subscription management dashboard for the Nappio nappy laundry service, built with SvelteKit and TypeScript.

![Nappio Subscription Dashboard](https://github.com/user-attachments/assets/8d553014-04fc-40cd-a152-dd2700523509)

## Features

### 📊 Subscription Management
- **Customer Overview**: Display customer names, emails, and subscription details from linked database tables
- **Status Tracking**: Monitor subscription progress through predefined status stages
- **Meeting Scheduling**: Set and update meeting dates with datetime picker functionality
- **Real-time Statistics**: Live dashboard cards showing subscription counts by status

### 🔍 Filtering & Search
- **Text Search**: Search by customer name, email, or subscription ID
- **Status Filtering**: Filter subscriptions by any status (pending, setup_paid, meeting_scheduled, checkout_sent, active, canceled)
- **Combined Filtering**: Use text and status filters simultaneously
- **Live Counter**: Shows "X of Y subscriptions" based on active filters

### ✏️ Inline Editing
- **Status Updates**: Change subscription status via dropdown with all valid options
- **Meeting Date**: Set or update meeting dates using datetime-local input
- **Instant Save**: Updates are sent to FastAPI backend immediately
- **Data Persistence**: Changes persist across page refreshes

### 🗄️ Database Schema Integration

The dashboard integrates with these Supabase tables:

#### `user_subscriptions`
- `id` (uuid) - Primary key
- `user_id` (uuid) - Foreign key to Supabase auth.users
- `status` - Subscription status
- `subscribed_at` - Subscription start date
- `cancelled_at` - Cancellation date (if applicable)
- `baby_dob` - Baby's date of birth
- `baby_weight_at_start` - Baby's initial weight

#### `subscription_progress` 
- `id` (uuid) - Primary key
- `subscription_id` (uuid) - Foreign key to user_subscriptions.id
- `status` - Current progress status
- `meeting_date` - Scheduled meeting date/time
- `last_updated` - Last update timestamp

#### Status Options
- `pending` - Initial subscription state
- `setup_paid` - Setup payment completed
- `meeting_scheduled` - Meeting arranged with customer
- `checkout_sent` - Checkout/payment link sent
- `active` - Subscription fully active
- `canceled` - Subscription cancelled

## API Integration

### FastAPI Backend Endpoints

#### Get Subscriptions
```http
GET /v1/admin/subscriptions
```
Returns joined data from user_subscriptions, subscription_progress, and auth.users tables.

#### Update Subscription Progress
```http
POST /v1/admin/subscription-progress-update
Content-Type: application/json

{
  "subscription_id": "uuid",
  "status": "meeting_scheduled",  // optional
  "meeting_date": "2024-01-30T15:00:00Z"  // optional, ISO 8601 format
}
```

### Environment Variables

```env
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
VITE_FASTAPI_BASE_URL=http://localhost:8000
```

## Development

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase project with the required tables
- FastAPI backend running (for production functionality)

### Setup

1. **Clone and Install**
```bash
git clone <repo-url>
cd nappio-dashboard
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your actual values
```

3. **Development Mode**
```bash
npm run dev
```
Uses mock data for development - no backend required.

4. **Production Build**
```bash
npm run build
npm run preview
```
Uses real API endpoints in production mode.

### Project Structure

```
src/
├── lib/
│   ├── components/
│   │   └── SubscriptionTable.svelte  # Main subscription management UI
│   ├── api.ts                       # API client and mock data
│   └── supabase.ts                 # Database type definitions
└── routes/
    └── +page.svelte                # Main dashboard page
```

## Technology Stack

- **Frontend**: SvelteKit 2.0 with TypeScript
- **Styling**: Tailwind CSS 4.0
- **Database**: Supabase (PostgreSQL)
- **Backend**: FastAPI (Python)
- **Build Tool**: Vite 7.0

## License

Private - Internal tool for Nappio nappy laundry service.
