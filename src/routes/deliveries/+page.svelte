<script lang="ts">
	import type { PageData } from './$types';
	import ResponsiveDataCard from '$lib/components/ResponsiveDataCard.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Deliveries - Nappio Dashboard</title>
	<meta name="description" content="View and manage customer delivery information" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Page Header -->
		<header class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">Deliveries</h1>
			<p class="mt-2 text-gray-600">Customer delivery information and subscription details</p>
		</header>

		<!-- Error State -->
		{#if data.error}
			<div
				class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
				role="alert"
				aria-live="polite"
			>
				<div class="flex items-start gap-3">
					<svg
						class="w-6 h-6 text-red-600 flex-shrink-0"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<div>
						<h2 class="text-red-800 font-semibold">Error loading deliveries</h2>
						<p class="text-red-700 mt-1">{data.error}</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- Empty State -->
		{#if !data.error && data.deliveries.length === 0}
			<div class="bg-white rounded-lg shadow-sm p-12 text-center">
				<svg
					class="w-16 h-16 text-gray-400 mx-auto mb-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
					/>
				</svg>
				<h2 class="text-xl font-semibold text-gray-700 mb-2">No deliveries found</h2>
				<p class="text-gray-500">There are currently no deliveries to display.</p>
			</div>
		{/if}

		<!-- Deliveries Grid -->
		{#if !data.error && data.deliveries.length > 0}
			<div
				class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
				role="list"
				aria-label="Delivery cards"
			>
				{#each data.deliveries as delivery (delivery.id)}
					<ResponsiveDataCard {delivery} />
				{/each}
			</div>
		{/if}
	</div>
</div>
