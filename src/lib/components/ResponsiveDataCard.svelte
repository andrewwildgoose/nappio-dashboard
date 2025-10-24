<script lang="ts">
	import type { Delivery } from '$lib/types';

	interface Props {
		delivery: Delivery;
	}

	let { delivery }: Props = $props();
	let itemsExpanded = $state(false);

	function toggleItems() {
		itemsExpanded = !itemsExpanded;
	}

	// Format address for display
	const fullAddress = [
		delivery.address.line1,
		delivery.address.line2,
		delivery.address.city,
		delivery.address.postcode
	]
		.filter(Boolean)
		.join(', ');
</script>

<article
	class="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200"
	aria-label="Delivery information for {delivery.customer.name}"
>
	<!-- Customer Name Header -->
	<h2 class="text-xl font-bold text-gray-800 mb-4">{delivery.customer.name}</h2>

	<!-- Contact Information -->
	<div class="space-y-3 mb-4">
		<div class="flex items-start gap-2">
			<svg
				class="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
				/>
			</svg>
			<a
				href="mailto:{delivery.customer.email}"
				class="text-blue-600 hover:text-blue-800 hover:underline break-all"
			>
				{delivery.customer.email}
			</a>
		</div>

		<div class="flex items-start gap-2">
			<svg
				class="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
				/>
			</svg>
			<a
				href="tel:{delivery.customer.phone}"
				class="text-blue-600 hover:text-blue-800 hover:underline"
			>
				{delivery.customer.phone}
			</a>
		</div>

		<div class="flex items-start gap-2">
			<svg
				class="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
				/>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
				/>
			</svg>
			<p class="text-gray-700">{fullAddress}</p>
		</div>
	</div>

	<!-- Items Section -->
	<div class="border-t pt-4">
		<button
			onclick={toggleItems}
			class="flex items-center justify-between w-full text-left font-semibold text-gray-800 hover:text-gray-600 transition-colors"
			aria-expanded={itemsExpanded}
			aria-controls="items-{delivery.id}"
		>
			<span>Items ({delivery.items.length})</span>
			<svg
				class="w-5 h-5 transform transition-transform duration-200 {itemsExpanded
					? 'rotate-180'
					: ''}"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</button>

		{#if itemsExpanded}
			<ul id="items-{delivery.id}" class="mt-3 space-y-2">
				{#each delivery.items as item}
					<li class="flex justify-between items-center text-sm">
						<span class="text-gray-700">{item.name}</span>
						<span class="text-gray-500 font-medium">×{item.quantity}</span>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</article>
