# API Architecture Documentation

## Overview

This application uses a secure three-tier API architecture to protect sensitive credentials and enable proper authentication.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Components (.svelte)               │
│                  Import from: $lib/client/api                │
└───────────────────────────┬─────────────────────────────────┘
                            │ fetch('/api/*')
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              SvelteKit API Routes (/api/*)                   │
│              - Authentication checks (locals.session)        │
│              - Input validation                              │
│              - Error handling                                │
│              Import from: $lib/server/api                    │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP requests
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Server API Client ($lib/server/api)             │
│              - Uses FASTAPI_BASE_URL (private env var)       │
│              - Handles FastAPI communication                 │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP
                            ↓
                    ┌───────────────┐
                    │  FastAPI      │
                    │  Backend      │
                    └───────────────┘
```

## File Structure

```
src/
├── lib/
│   ├── types/
│   │   └── api.ts                    # Shared TypeScript types
│   ├── server/
│   │   └── api.ts                    # Server-only API (uses private env vars)
│   ├── client/
│   │   └── api.ts                    # Client-safe API (calls SvelteKit routes)
│   └── api.ts                        # Mock data for development only
├── routes/
│   └── api/                          # SvelteKit API routes (proxy layer)
│       ├── subscriptions/
│       │   ├── +server.ts            # GET /api/subscriptions
│       │   └── progress/
│       │       └── +server.ts        # POST /api/subscriptions/progress
│       ├── team-data/
│       │   ├── +server.ts            # GET, POST /api/team-data
│       │   └── [id]/
│       │       └── +server.ts        # PUT, DELETE /api/team-data/:id
│       └── inventory/
│           ├── +server.ts            # GET /api/inventory
│           └── [id]/
│               └── +server.ts        # PUT /api/inventory/:id
```

## Security Features

✅ **Private Environment Variables** - `FASTAPI_BASE_URL` never exposed to client  
✅ **Authentication Required** - All API routes check `locals.session`  
✅ **Type Safety** - Shared TypeScript types across all layers  
✅ **Input Validation** - Server-side validation of all requests  
✅ **Error Handling** - Consistent error responses with proper status codes  

## Usage Examples

### Server-Side (in +page.server.ts or +server.ts)

```typescript
import { api } from '$lib/server/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const result = await api.getSubscriptions();
	return { 
		subscriptions: result.data || [],
		error: result.success ? null : result.error
	};
};
```

### Client-Side (in .svelte components)

```typescript
import { clientApi } from '$lib/client/api';

async function loadData() {
	try {
		const subscriptions = await clientApi.getSubscriptions();
		// Use subscriptions...
	} catch (error) {
		console.error('Failed to load data:', error);
	}
}
```

### Types (anywhere)

```typescript
import type { SubscriptionData, TeamDataItem } from '$lib/types/api';

let subscription: SubscriptionData;
let teamItem: TeamDataItem;
```

## API Endpoints

### Subscriptions

- **GET** `/api/subscriptions` - Get all subscriptions
- **POST** `/api/subscriptions/progress` - Update subscription progress

### Team Data

- **GET** `/api/team-data` - Get all team data items
- **POST** `/api/team-data` - Create new team data item
- **PUT** `/api/team-data/:id` - Update team data item
- **DELETE** `/api/team-data/:id` - Delete team data item

### Inventory

- **GET** `/api/inventory` - Get all inventory items
- **PUT** `/api/inventory/:id` - Update inventory item quantity

## Adding New Endpoints

### 1. Add method to server API (`src/lib/server/api.ts`)

```typescript
async getNewData(): Promise<ApiResponse<NewType[]>> {
	return this.request<NewType[]>('/api/new-endpoint');
}
```

### 2. Create SvelteKit route (`src/routes/api/new-endpoint/+server.ts`)

```typescript
import { json, error } from '@sveltejs/kit';
import { api } from '$lib/server/api';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.session) {
		error(401, 'Unauthorized');
	}
	
	const result = await api.getNewData();
	
	if (!result.success) {
		error(500, result.error || 'Failed to fetch data');
	}
	
	return json(result.data);
};
```

### 3. Add to client API (`src/lib/client/api.ts`)

```typescript
async getNewData(): Promise<NewType[]> {
	return this.fetchJson<NewType[]>('/api/new-endpoint');
}
```

### 4. Add types to (`src/lib/types/api.ts`)

```typescript
export interface NewType {
	id: string;
	name: string;
	// ...
}
```

## Development vs Production

### Mock Data
For development and testing, use the mock API from `$lib/api`:

```typescript
import { mockApi } from '$lib/api';

const response = await mockApi.getSubscriptions();
if (response.success) {
	// Use response.data
}
```

### Production API
In production, components should use `clientApi`:

```typescript
import { clientApi } from '$lib/client/api';

const subscriptions = await clientApi.getSubscriptions();
```

## Environment Variables

Required in `.env`:

```
FASTAPI_BASE_URL=your_fastapi_url_here
```

This variable is only accessible server-side and never exposed to the client.

## Benefits

1. **Security** - FastAPI credentials stay server-side
2. **Authentication** - Centralized session checks in SvelteKit routes
3. **Type Safety** - Same types used everywhere
4. **Flexibility** - Easy to add caching, rate limiting, or logging in SvelteKit layer
5. **Testing** - Mock API available for development
6. **Error Handling** - Consistent error responses across all endpoints

## Common Patterns

### Error Handling in Components

```typescript
try {
	const data = await clientApi.getSubscriptions();
	// Success handling
} catch (error) {
	console.error('Error:', error);
	// Error handling
}
```

### Loading States

```typescript
let isLoading = $state(true);
let error = $state<string | null>(null);

async function loadData() {
	isLoading = true;
	error = null;
	
	try {
		const data = await clientApi.getSubscriptions();
		// Use data
	} catch (err) {
		error = err instanceof Error ? err.message : 'Unknown error';
	} finally {
		isLoading = false;
	}
}
```

### Form Submission

```typescript
async function handleSubmit(formData: FormData) {
	try {
		await clientApi.createTeamData({
			title: formData.get('title'),
			description: formData.get('description'),
			// ...
		});
		// Success handling
	} catch (error) {
		// Error handling
	}
}
```
