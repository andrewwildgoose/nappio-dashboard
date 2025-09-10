<script lang="ts">
	import SubscriptionTable from '$lib/components/SubscriptionTable.svelte';
	import { onMount } from 'svelte';
	import { mockApi, type SubscriptionData } from '$lib/api';

	let data = $state<SubscriptionData[]>([]);
	let isLoading = $state(true);
	let error = $state<string | null>(null);

	async function loadData() {
		try {
			isLoading = true;
			error = null;

			// Use real API in production, mock API for development
			const isProduction = import.meta.env.PROD;
			let response;
			
			if (isProduction) {
				// Import real API for production
				const { api } = await import('$lib/api');
				response = await api.getSubscriptions();
			} else {
				// Use mock API for development
				response = await mockApi.getSubscriptions();
			}

			if (response.success && response.data) {
				data = response.data;
			} else {
				throw new Error(response.error || 'Failed to load subscription data');
			}
		} catch (err) {
			console.error('Error loading subscriptions:', err);
			error = err instanceof Error ? err.message : 'Unknown error occurred';
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		loadData();
	});
</script>

<svelte:head>
	<title>Nappio Subscription Dashboard</title>
	<meta name="description" content="Subscription management dashboard for Nappio nappy laundry service" />
</svelte:head>

<div class="dashboard">
	<div class="dashboard-header">
		<h1 class="mb-2 text-3xl font-bold text-gray-900">Nappio Subscription Dashboard</h1>
		<p class="mb-6 text-gray-600">Manage customer subscriptions and track progress</p>

		<div class="header-actions">
			<button
				onclick={loadData}
				disabled={isLoading}
				class="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
			>
				{isLoading ? 'Loading...' : 'Refresh'}
			</button>
		</div>
	</div>

	{#if error}
		<div class="error-banner">
			<p class="text-red-800">
				<strong>Error:</strong>
				{error}
			</p>
			<button onclick={loadData} class="ml-4 text-red-600 underline hover:text-red-800">
				Retry
			</button>
		</div>
	{/if}

	<div class="content-area">
		{#if isLoading}
			<div class="loading-state">
				<div class="spinner"></div>
				<p class="mt-4 text-gray-600">Loading subscription data...</p>
			</div>
		{:else}
			<div class="table-container">
				<SubscriptionTable {data} onDataUpdated={loadData} />
			</div>
		{/if}
	</div>

	<!-- Stats Cards -->
	<div class="stats-grid">
		<div class="stat-card">
			<h3 class="text-lg font-semibold text-gray-900">Total Subscriptions</h3>
			<p class="text-3xl font-bold text-blue-600">{data.length}</p>
		</div>

		<div class="stat-card">
			<h3 class="text-lg font-semibold text-gray-900">Active</h3>
			<p class="text-3xl font-bold text-green-600">
				{data.filter((item) => item.progress_status === 'active').length}
			</p>
		</div>

		<div class="stat-card">
			<h3 class="text-lg font-semibold text-gray-900">Pending</h3>
			<p class="text-3xl font-bold text-yellow-600">
				{data.filter((item) => item.progress_status === 'pending').length}
			</p>
		</div>

		<div class="stat-card">
			<h3 class="text-lg font-semibold text-gray-900">Meeting Scheduled</h3>
			<p class="text-3xl font-bold text-purple-600">
				{data.filter((item) => item.progress_status === 'meeting_scheduled').length}
			</p>
		</div>
	</div>
</div>

<style>
	.dashboard {
		max-width: 100%;
		padding: 1rem;
	}

	.dashboard-header {
		margin-bottom: 2rem;
	}

	.header-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.error-banner {
		background-color: #fee2e2;
		border: 1px solid #fca5a5;
		border-radius: 0.5rem;
		padding: 1rem;
		margin-bottom: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.content-area {
		margin-bottom: 2rem;
	}

	.loading-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem 2rem;
		background-color: white;
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
	}

	.spinner {
		width: 2rem;
		height: 2rem;
		border: 3px solid #e5e7eb;
		border-top: 3px solid #2563eb;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.table-container {
		background-color: white;
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin-top: 2rem;
	}

	.stat-card {
		background-color: white;
		padding: 1.5rem;
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
		text-align: center;
	}

	@media (min-width: 768px) {
		.dashboard {
			padding: 2rem;
		}

		.header-actions {
			flex-wrap: nowrap;
		}
	}
</style>
