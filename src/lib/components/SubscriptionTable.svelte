<script lang="ts">
	import { type SubscriptionData, type SubscriptionStatus, mockApi } from '$lib/api';

	let { 
		data = [], 
		onDataUpdated 
	}: { 
		data: SubscriptionData[]; 
		onDataUpdated?: () => void 
	} = $props();

	let editingId = $state<string | null>(null);
	let editForm = $state<{ status?: SubscriptionStatus; meeting_date?: string | null }>({});
	let filterText = $state('');
	let statusFilter = $state<SubscriptionStatus | 'all'>('all');

	// Filtered data based on search and status
	let filteredData = $derived(data.filter(row => {
		const matchesText = filterText === '' || 
			row.customer_name.toLowerCase().includes(filterText.toLowerCase()) ||
			row.customer_email.toLowerCase().includes(filterText.toLowerCase()) ||
			row.subscription_id.toLowerCase().includes(filterText.toLowerCase());
		
		const matchesStatus = statusFilter === 'all' || row.progress_status === statusFilter;
		
		return matchesText && matchesStatus;
	}));

	function startEdit(row: SubscriptionData) {
		editingId = row.subscription_id;
		editForm = {
			status: row.progress_status,
			meeting_date: row.meeting_date
		};
	}

	function cancelEdit() {
		editingId = null;
		editForm = {};
	}

	async function saveEdit() {
		try {
			if (!editingId || !editForm) return;

			const update: any = { subscription_id: editingId };
			
			if (editForm.status !== undefined) {
				update.status = editForm.status;
			}
			
			if (editForm.meeting_date !== undefined) {
				update.meeting_date = editForm.meeting_date;
			}

			// Use real API in production, mock API for development
			const isProduction = import.meta.env.PROD;
			let response;
			
			if (isProduction) {
				// Import real API for production
				const { api } = await import('$lib/api');
				response = await api.updateSubscriptionProgress(update);
			} else {
				// Use mock API for development
				response = await mockApi.updateSubscriptionProgress(update);
			}

			if (!response.success) {
				throw new Error(response.error || 'Failed to update subscription');
			}

			editingId = null;
			editForm = {};

			if (onDataUpdated) {
				onDataUpdated();
			}
		} catch (error) {
			console.error('Error updating subscription:', error);
			alert('Failed to update subscription: ' + (error instanceof Error ? error.message : 'Unknown error'));
		}
	}

	function formatDate(dateString: string | null) {
		if (!dateString) return 'Not set';
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function formatDateForInput(dateString: string | null): string {
		if (!dateString) return '';
		// Convert ISO date to datetime-local format (YYYY-MM-DDTHH:MM)
		return new Date(dateString).toISOString().slice(0, 16);
	}

	function formatDateFromInput(inputValue: string): string | null {
		if (!inputValue) return null;
		// Convert datetime-local format back to ISO string
		return new Date(inputValue).toISOString();
	}

	function getStatusClass(status: SubscriptionStatus) {
		switch (status) {
			case 'active':
				return 'bg-green-100 text-green-800';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'setup_paid':
				return 'bg-blue-100 text-blue-800';
			case 'meeting_scheduled':
				return 'bg-purple-100 text-purple-800';
			case 'checkout_sent':
				return 'bg-orange-100 text-orange-800';
			case 'canceled':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	const statusOptions: SubscriptionStatus[] = [
		'pending', 
		'setup_paid', 
		'meeting_scheduled', 
		'checkout_sent', 
		'active', 
		'canceled'
	];
</script>

<div class="subscription-table-container">
	<!-- Filters -->
	<div class="filters mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
			<input
				type="text"
				placeholder="Search customers, emails, or subscription IDs..."
				bind:value={filterText}
				class="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
			/>
			<select
				bind:value={statusFilter}
				class="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
			>
				<option value="all">All Status</option>
				{#each statusOptions as status}
					<option value={status}>{status.replace('_', ' ').toUpperCase()}</option>
				{/each}
			</select>
		</div>
		<div class="text-sm text-gray-600">
			Showing {filteredData.length} of {data.length} subscriptions
		</div>
	</div>

	<!-- Table -->
	<div class="overflow-x-auto">
		<table class="min-w-full divide-y divide-gray-200">
			<thead class="bg-gray-50">
				<tr>
					<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
						Customer
					</th>
					<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
						Email
					</th>
					<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
						Status
					</th>
					<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
						Meeting Date
					</th>
					<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
						Subscribed
					</th>
					<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
						Baby DOB
					</th>
					<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
						Actions
					</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200 bg-white">
				{#each filteredData as row (row.subscription_id)}
					<tr class="hover:bg-gray-50">
						{#if editingId === row.subscription_id}
							<!-- Editing mode -->
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm font-medium text-gray-900">{row.customer_name}</div>
								<div class="text-xs text-gray-500">{row.subscription_id}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-900">{row.customer_email}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<select
									bind:value={editForm.status}
									class="rounded border border-gray-300 px-2 py-1 text-sm"
								>
									{#each statusOptions as status}
										<option value={status}>{status.replace('_', ' ').toUpperCase()}</option>
									{/each}
								</select>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<input
									type="datetime-local"
									value={formatDateForInput(editForm.meeting_date || null)}
									oninput={(e) => editForm.meeting_date = formatDateFromInput(e.target.value)}
									class="w-full rounded border border-gray-300 px-2 py-1 text-sm"
								/>
							</td>
							<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
								{formatDate(row.subscribed_at)}
							</td>
							<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
								{formatDate(row.baby_dob)}
							</td>
							<td class="px-6 py-4 text-sm font-medium whitespace-nowrap">
								<button onclick={saveEdit} class="mr-3 text-green-600 hover:text-green-900">
									Save
								</button>
								<button onclick={cancelEdit} class="text-gray-600 hover:text-gray-900">
									Cancel
								</button>
							</td>
						{:else}
							<!-- Display mode -->
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm font-medium text-gray-900">{row.customer_name}</div>
								<div class="text-xs text-gray-500">{row.subscription_id}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-900">{row.customer_email}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span
									class="inline-flex rounded-full px-2 py-1 text-xs font-semibold {getStatusClass(
										row.progress_status
									)}"
								>
									{row.progress_status.replace('_', ' ').toUpperCase()}
								</span>
							</td>
							<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
								{formatDate(row.meeting_date)}
							</td>
							<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
								{formatDate(row.subscribed_at)}
							</td>
							<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
								{formatDate(row.baby_dob)}
								{#if row.baby_weight_at_start}
									<div class="text-xs">({row.baby_weight_at_start}kg)</div>
								{/if}
							</td>
							<td class="px-6 py-4 text-sm font-medium whitespace-nowrap">
								<button
									onclick={() => startEdit(row)}
									class="text-indigo-600 hover:text-indigo-900"
								>
									Edit
								</button>
							</td>
						{/if}
					</tr>
				{/each}
				{#if filteredData.length === 0}
					<tr>
						<td colspan="7" class="px-6 py-4 text-center text-gray-500">
							{filterText || statusFilter !== 'all' 
								? 'No subscriptions match your filters.' 
								: 'No subscriptions available.'}
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</div>

<style>
	.subscription-table-container {
		background-color: white;
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
		overflow: hidden;
		padding: 1rem;
	}
</style>