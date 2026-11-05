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
│   ├── config/
│   │   └── navigation.ts            # Sidebar menu: sections + pages
│   ├── components/
│   │   ├── layout/                  # Header, Sidebar
│   │   ├── table/                   # Generic DataTable (search / filter / sort)
│   │   │   ├── DataTable.svelte
│   │   │   ├── types.ts             # Column<T>, TableFilter<T>
│   │   │   └── table-utils.ts       # Pure sort/filter/search logic
│   │   └── ui/                      # Button, Modal, PageHeader, PageSection, StatCard,
│   │                                #   StatGrid, Badge, DetailList, LoadingState, ErrorBanner, Icon
│   ├── features/
│   │   └── subscriptions/           # Everything specific to the subscriptions page
│   │       ├── SubscriptionTable.svelte   # DataTable + inline edit + confirm modal
│   │       ├── SubscriptionStats.svelte
│   │       └── status.ts                  # Status options, colours, PUBLIC_ACTION_STATUSES
│   ├── utils/
│   │   ├── format.ts                # Date / currency / label formatting
│   │   └── async-data.svelte.ts     # createAsyncData(): loading / error / reload state
│   ├── client/api.ts                # Browser -> SvelteKit /api routes
│   ├── server/api.ts                # SvelteKit server -> FastAPI
│   └── types/api.ts                 # Shared types
└── routes/
    ├── (app)/                       # Signed-in pages: get the sidebar + auth check
    │   ├── +layout.svelte           # Sidebar shell
    │   ├── +page.server.ts          # "/" redirects to the first menu item
    │   └── subscriptions/+page.svelte
    ├── api/                         # Proxy routes to FastAPI
    └── auth/                        # Sign in
```

### Adding a new page

1. Create `src/routes/(app)/<page>/+page.svelte`. It automatically gets the sidebar and requires sign-in.
2. Add an entry to `src/lib/config/navigation.ts` (label, `href: '/<page>'`, icon from
   `src/lib/components/ui/icons.ts`). `href` is type-checked against real routes, so
   `npm run check` fails if it points at a page that doesn't exist.
3. Build the page from the shared pieces, e.g.:

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import DataTable from '$lib/components/table/DataTable.svelte';
	import type { Column } from '$lib/components/table/types';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import LoadingState from '$lib/components/ui/LoadingState.svelte';
	import ErrorBanner from '$lib/components/ui/ErrorBanner.svelte';
	import { createAsyncData } from '$lib/utils/async-data.svelte';
	import { formatDate, dateSortValue } from '$lib/utils/format';
	import { clientApi } from '$lib/client/api';

	const payments = createAsyncData(() => clientApi.getPayments(), []);
	onMount(payments.reload);

	const columns: Column<Payment>[] = [
		{ id: 'customer', header: 'Customer', value: (r) => r.customer_name,
		  sortValue: (r) => r.customer_name, searchValue: true },
		{ id: 'paid', header: 'Paid', format: (r) => formatDate(r.paid_at),
		  sortValue: (r) => dateSortValue(r.paid_at) }
	];
</script>

<PageHeader title="Payments" />
{#if payments.error}<ErrorBanner error={payments.error} onRetry={payments.reload} />{/if}
{#if payments.isLoading}
	<LoadingState />
{:else}
	<DataTable rows={payments.data} {columns} rowKey={(r) => r.id} itemLabel="payments" />
{/if}
```

For custom cell content (badges, buttons, inline inputs), define a `{#snippet}` in the page
and pass it as the column's `cell` (see `features/subscriptions/SubscriptionTable.svelte`).
Dropdown filters are passed via `filters` (`TableFilter<T>`).

## Technology Stack

- **Frontend**: SvelteKit 2.0 with TypeScript
- **Styling**: Tailwind CSS 4.0
- **Database**: Supabase (PostgreSQL)
- **Backend**: FastAPI (Python)
- **Build Tool**: Vite 7.0

## License

Private - Internal tool for Nappio nappy laundry service.
