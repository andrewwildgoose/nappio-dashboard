<script lang="ts">
	import { onMount } from 'svelte';
	import { clientApi } from '$lib/client/api';
	import type { SubscriptionData } from '$lib/types/api';
	import { createAsyncData } from '$lib/utils/async-data.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import ErrorBanner from '$lib/components/ui/ErrorBanner.svelte';
	import LoadingState from '$lib/components/ui/LoadingState.svelte';
	import SubscriptionTable from '$lib/features/subscriptions/SubscriptionTable.svelte';
	import SubscriptionStats from '$lib/features/subscriptions/SubscriptionStats.svelte';

	const subscriptions = createAsyncData<SubscriptionData[]>(() => clientApi.getSubscriptions(), []);

	onMount(() => {
		subscriptions.reload();
	});
</script>

<svelte:head>
	<title>Subscriptions - Nappio Dashboard</title>
	<meta
		name="description"
		content="Subscription management dashboard for Nappio nappy laundry service"
	/>
</svelte:head>

<PageHeader
	title="Nappio Subscription Dashboard"
	description="Manage customer subscriptions and track progress"
>
	{#snippet actions()}
		<Button onclick={subscriptions.reload} disabled={subscriptions.isLoading}>
			{subscriptions.isLoading ? 'Loading...' : 'Refresh'}
		</Button>
	{/snippet}
</PageHeader>

{#if subscriptions.error}
	<ErrorBanner error={subscriptions.error} onRetry={subscriptions.reload} />
{/if}

<div class="mb-8">
	{#if subscriptions.isLoading}
		<LoadingState message="Loading subscription data..." />
	{:else}
		<SubscriptionTable data={subscriptions.data} onDataUpdated={subscriptions.reload} />
	{/if}
</div>

<SubscriptionStats data={subscriptions.data} />
