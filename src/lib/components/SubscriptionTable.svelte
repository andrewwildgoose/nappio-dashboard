<script lang="ts">
	import { type SubscriptionData, type SubscriptionStatus, type SubscriptionProgressUpdate } from '$lib/api';
	import {PUBLIC_ACTION_STATUSES} from '$env/static/public';

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
	
	// Confirmation modal state
	let showConfirmationModal = $state(false);
	let confirmationData = $state<SubscriptionData | null>(null);
	let pendingUpdate = $state<SubscriptionProgressUpdate | null>(null);
	
	// Sorting state
	let sortColumn = $state<string | null>(null);
	let sortDirection = $state<'asc' | 'desc'>('asc');

	// Filtered data based on search and status
	let filteredData = $derived(() => {
		let filtered = data.filter(row => {
			const matchesText = filterText === '' || 
				row.customer_name.toLowerCase().includes(filterText.toLowerCase()) ||
				row.customer_email.toLowerCase().includes(filterText.toLowerCase()) ||
				row.subscription_id.toLowerCase().includes(filterText.toLowerCase());
			
			const matchesStatus = statusFilter === 'all' || row.progress_status === statusFilter;
			
			return matchesText && matchesStatus;
		});

		// Apply sorting
		if (sortColumn) {
			filtered.sort((a, b) => {
				let aVal: any;
				let bVal: any;

				switch (sortColumn) {
					case 'customer':
						aVal = a.customer_name;
						bVal = b.customer_name;
						break;
					case 'email':
						aVal = a.customer_email;
						bVal = b.customer_email;
						break;
					case 'status':
						// Define status order for sorting
						const statusOrder = ['pending', 'setup_paid', 'meeting_scheduled', 'checkout_sent', 'active', 'canceled'];
						aVal = statusOrder.indexOf(a.progress_status);
						bVal = statusOrder.indexOf(b.progress_status);
						break;
					case 'meeting_date':
						aVal = a.meeting_date ? new Date(a.meeting_date).getTime() : 0;
						bVal = b.meeting_date ? new Date(b.meeting_date).getTime() : 0;
						break;
					case 'subscribed':
						aVal = new Date(a.subscribed_at).getTime();
						bVal = new Date(b.subscribed_at).getTime();
						break;
					case 'baby_dob':
						aVal = a.baby_dob ? new Date(a.baby_dob).getTime() : 0;
						bVal = b.baby_dob ? new Date(b.baby_dob).getTime() : 0;
						break;
					default:
						return 0;
				}

				if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
				if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
				return 0;
			});
		}

		return filtered;
	});

	function startEdit(row: SubscriptionData) {
		editingId = row.subscription_id;
		editForm = {
			status: row.progress_status,
			meeting_date: row.meeting_date
		};
	}

	function handleSort(column: string) {
		if (sortColumn === column) {
			// Toggle direction if same column
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			// New column, default to ascending
			sortColumn = column;
			sortDirection = 'asc';
		}
	}

	function getSortIcon(column: string) {
		if (sortColumn !== column) return '⇅';
		return sortDirection === 'asc' ? '↑' : '↓';
	}

	function cancelEdit() {
		editingId = null;
		editForm = {};
	}

	async function saveEdit() {
		try {
			if (!editingId || !editForm) return;

			// Find the current subscription data
			const currentSubscription = data.find(row => row.subscription_id === editingId);
			if (!currentSubscription) return;

			const update: SubscriptionProgressUpdate = { 
				subscription_id: editingId 
			};
			
			if (editForm.status !== undefined) {
				update.status = editForm.status;
			}
			
			if (editForm.meeting_date !== undefined) {
				update.meeting_date = editForm.meeting_date;
			}

			// Create the preview data with updated values
			const previewData: SubscriptionData = {
				...currentSubscription,
				progress_status: editForm.status || currentSubscription.progress_status,
				meeting_date: editForm.meeting_date !== undefined ? editForm.meeting_date : currentSubscription.meeting_date
			};

			// Store the update and preview data, then show confirmation modal
			pendingUpdate = update;
			confirmationData = previewData;
			showConfirmationModal = true;

		} catch (error) {
			console.error('Error preparing subscription update:', error);
			alert('Failed to prepare update: ' + (error instanceof Error ? error.message : 'Unknown error'));
		}
	}

	async function confirmSave() {
		try {
			if (!pendingUpdate) return;

			// Extract the actual object from the reactive state
			const updateData: SubscriptionProgressUpdate = {
				subscription_id: pendingUpdate.subscription_id,
				...(pendingUpdate.status && { status: pendingUpdate.status }),
				...(pendingUpdate.meeting_date !== undefined && { meeting_date: pendingUpdate.meeting_date })
			};

			// Use real API in production, mock API for development

			let response;
			
			// Import API for production
			const { api } = await import('$lib/api');
			
			response = await api.updateSubscriptionProgress(updateData);

			if (!response.success) {
				throw new Error(response.error || 'Failed to update subscription');
			}

			// Close modal and reset state
			showConfirmationModal = false;
			confirmationData = null;
			pendingUpdate = null;
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

	function cancelConfirmation() {
		// Return to edit mode - just close the modal
		showConfirmationModal = false;
		confirmationData = null;
		pendingUpdate = null;
		// Keep editingId and editForm so user returns to edit view
	}

	function formatDate(dateString: string | null) {
		if (!dateString) return 'Not set';
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			timeZone: 'UTC' // Display in UTC to match database storage
		});
	}

	function formatDateForInput(dateString: string | null): string {
		if (!dateString) return '';
		// Create date in UTC and format for datetime-local input
		const date = new Date(dateString);
		// Get UTC components and format as local datetime-local expects
		const year = date.getUTCFullYear();
		const month = String(date.getUTCMonth() + 1).padStart(2, '0');
		const day = String(date.getUTCDate()).padStart(2, '0');
		const hours = String(date.getUTCHours()).padStart(2, '0');
		const minutes = String(date.getUTCMinutes()).padStart(2, '0');
		return `${year}-${month}-${day}T${hours}:${minutes}`;
	}

	function formatDateFromInput(inputValue: string): string | null {
		if (!inputValue) return null;
		// Treat the input as UTC time
		return new Date(inputValue + 'Z').toISOString();
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
				class="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
			/>
			<select
				bind:value={statusFilter}
				class="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
			>
				<option value="all">All Status</option>
				{#each statusOptions as status}
					<option value={status}>{status.replace('_', ' ').toUpperCase()}</option>
				{/each}
			</select>
		</div>
		<div class="text-sm">
			Showing {filteredData().length} of {data.length} subscriptions
		</div>
	</div>

	<!-- Table -->
	<div class="overflow-x-auto">
		<table class="min-w-full divide-y divide-border">
			<thead class="">
				<tr>
					<th class="px-6 py-3 text-left text-s font-bold tracking-wider uppercase cursor-pointer hover:bg-lightgrey select-none" onclick={() => handleSort('customer')}>
						<div class="flex items-center justify-between">
							<div>
								Customer
								<p class="text-xs">subscription_id</p>
							</div>
							<span class="text-gray-400 ml-2">{getSortIcon('customer')}</span>
						</div>
					</th>
					<th class="px-6 py-3 text-left text-s font-bold tracking-wider uppercase cursor-pointer hover:bg-lightgrey select-none" onclick={() => handleSort('email')}>
						<div class="flex items-center justify-between">
							<span>Email</span>
							<span class="text-gray-400 ml-2">{getSortIcon('email')}</span>
						</div>
					</th>
					<th class="px-6 py-3 text-left text-s font-bold tracking-wider uppercase cursor-pointer hover:bg-lightgrey select-none" onclick={() => handleSort('status')}>
						<div class="flex items-center justify-between">
							<span>Status</span>
							<span class="text-gray-400 ml-2">{getSortIcon('status')}</span>
						</div>
					</th>
					<th class="px-6 py-3 text-left text-s font-bold tracking-wider uppercase cursor-pointer hover:bg-lightgrey select-none" onclick={() => handleSort('meeting_date')}>
						<div class="flex items-center justify-between">
							<span>Meeting Date</span>
							<span class="text-gray-400 ml-2">{getSortIcon('meeting_date')}</span>
						</div>
					</th>
					<th class="px-6 py-3 text-left text-s font-bold tracking-wider uppercase cursor-pointer hover:bg-lightgrey select-none" onclick={() => handleSort('subscribed')}>
						<div class="flex items-center justify-between">
							<span>Subscribed</span>
							<span class="text-gray-400 ml-2">{getSortIcon('subscribed')}</span>
						</div>
					</th>
					<th class="px-6 py-3 text-left text-s font-bold tracking-wider uppercase cursor-pointer hover:bg-lightgrey select-none" onclick={() => handleSort('baby_dob')}>
						<div class="flex items-center justify-between">
							<div>
								Baby DOB
								<p class="text-xs">(weight at start)</p>
							</div>
							<span class="text-gray-400 ml-2">{getSortIcon('baby_dob')}</span>
						</div>
					</th>
					<th class="px-6 py-3 text-left text-s font-bold tracking-wider uppercase">
						Actions
					</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-border">
				{#each filteredData() as row (row.subscription_id)}
					<tr class="hover:bg-lightgrey">
						{#if editingId === row.subscription_id}
							<!-- Editing mode -->
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm font-medium">{row.customer_name}</div>
								<div class="text-xs text-gray-500">{row.subscription_id}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm">{row.customer_email}</div>
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
									oninput={(e) => editForm.meeting_date = formatDateFromInput((e.target as HTMLInputElement).value)}
									class="w-full rounded border border-gray-300 px-2 py-1 text-sm"
								/>
							</td>
							<td class="px-6 py-4 text-sm whitespace-nowrap">
								{formatDate(row.subscribed_at)}
							</td>
							<td class="px-6 py-4 text-sm whitespace-nowrap">
								{formatDate(row.baby_dob)}
							</td>
							<td class="px-6 py-4 text-sm font-medium">
								<div class="flex gap-2 flex-col">
									<button onclick={saveEdit} class="rounded-md px-4 py-2 font-medium text-tertiary transition-colors border-1 border-tertiary hover:bg-lightgrey disabled:opacity-50 hover:cursor-pointer">
										Save
									</button>
									<button onclick={cancelEdit} class="rounded-md px-4 py-2 font-medium text-primary transition-colors border-1 border-primary hover:bg-lightgrey disabled:opacity-50 hover:cursor-pointer">
										Cancel
									</button>
								</div>

							</td>
						{:else}
							<!-- Display mode -->
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm font-medium">{row.customer_name}</div>
								<div class="text-xs text-gray-500">{row.subscription_id}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm">{row.customer_email}</div>
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
							<td class="px-6 py-4 text-sm whitespace-nowrap">
								{formatDate(row.meeting_date)}
							</td>
							<td class="px-6 py-4 text-sm whitespace-nowrap">
								{formatDate(row.subscribed_at)}
							</td>
							<td class="px-6 py-4 text-sm whitespace-nowrap">
								{formatDate(row.baby_dob)}
								{#if row.baby_weight_at_start}
									<div class="text-xs">({row.baby_weight_at_start}kg)</div>
								{/if}
							</td>
							<td class="px-6 py-4 text-sm font-medium whitespace-nowrap">
								{#if PUBLIC_ACTION_STATUSES.split(',').includes(row.progress_status)}
								<button
									onclick={() => startEdit(row)}
									class="rounded-md px-4 py-2 font-medium text-white transition-colors border-1 border-secondary hover:bg-lightgrey hover:text-secondary disabled:opacity-50 hover:cursor-pointer"
								>
									Update
								</button>
								{:else}
								<span class="text-gray-400">N/A</span>
								{/if}
							</td>
						{/if}
					</tr>
				{/each}
				{#if filteredData().length === 0}
					<tr>
						<td colspan="7" class="px-6 py-4 text-center">
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

<!-- Confirmation Modal -->
{#if showConfirmationModal && confirmationData}
	<div 
		class="modal-overlay" 
		onclick={(e) => e.target === e.currentTarget && cancelConfirmation()}
		onkeydown={(e) => e.key === 'Escape' && cancelConfirmation()}
		role="dialog" 
		aria-modal="true"
		aria-labelledby="modal-title"
		tabindex="-1"
	>
		<div class="modal-content" role="document">
			<div class="modal-header">
				<h3 id="modal-title" class="text-lg font-semibold text-color-text">Confirm Subscription Update</h3>
				<button onclick={cancelConfirmation} class="modal-close-button">
					<span class="sr-only">Close</span>
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
			
			<div class="modal-body">
				<p class="text-sm text-color-text mb-4">Please review the changes below and confirm they are correct. Confirming & saving these changes may trigger emails to the customer.</p>
				
				<div class="confirmation-details">
					<div class="detail-group">
						<div class="detail-label">Customer:</div>
						<span class="detail-value">{confirmationData.customer_name}</span>
					</div>
					
					<div class="detail-group">
						<div class="detail-label">Email:</div>
						<span class="detail-value">{confirmationData.customer_email}</span>
					</div>
					
					<div class="detail-group">
						<div class="detail-label">Subscription ID:</div>
						<span class="detail-value">{confirmationData.subscription_id}</span>
					</div>
					
					<div class="detail-group">
						<div class="detail-label">Status:</div>
						<span class="detail-value status-badge">
							{confirmationData.progress_status.replace('_', ' ').toUpperCase()}
						</span>
					</div>
					
					<div class="detail-group">
						<div class="detail-label">Meeting Date:</div>
						<span class="detail-value">{formatDate(confirmationData.meeting_date)}</span>
					</div>
					
					<div class="detail-group">
						<div class="detail-label">Subscribed:</div>
						<span class="detail-value">{formatDate(confirmationData.subscribed_at)}</span>
					</div>
					
					<div class="detail-group">
						<div class="detail-label">Baby DOB:</div>
						<span class="detail-value">
							{formatDate(confirmationData.baby_dob)}
							{#if confirmationData.baby_weight_at_start}
								({confirmationData.baby_weight_at_start}kg)
							{/if}
						</span>
					</div>
				</div>
			</div>
			
			<div class="modal-footer">
				<button onclick={cancelConfirmation} class="btn-cancel">
					Cancel & Continue Editing
				</button>
				<button onclick={confirmSave} class="btn-confirm">
					Confirm & Save Changes
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.subscription-table-container {
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
		overflow: hidden;
		padding: 1rem;
	}

	/* Modal Styles */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
		padding: 1rem;
	}

	.modal-content {
		background-color: #262625;
		border: 1px solid #f7b18a;
		border-radius: 0.75rem;
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
		max-width: 32rem;
		width: 100%;
		max-height: 90vh;
		overflow-y: auto;
		z-index: 1000;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.5rem 1.5rem 1rem 1.5rem;
		border-bottom: 1px solid #f7b18a;
	}

	.modal-close-button {
		color: #6b7280;
		background: none;
		border: 1px solid #6b7280;
		cursor: pointer;
		padding: 0.25rem;
		border-radius: 0.25rem;
	}

	.modal-close-button:hover {
		background-color: #333132;
		color: #f7b18a;
		border: 1px solid #f7b18a;
	}

	.modal-body {
		padding: 1.5rem;
	}

	.confirmation-details {
		display: grid;
		gap: 1rem;
	}

	.detail-group {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.75rem;
		align-items: center;
	}

	.detail-label {
		font-weight: 600;
		color: #7cc4a7;
		font-size: 0.875rem;
		min-width: 120px;
	}

	.detail-value {
		color:  #f4f3ed;
		font-size: 0.875rem;
	}

	.status-badge {
		display: inline-flex;
		align-items: center;
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	.modal-footer {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
		padding: 1rem 1.5rem 1.5rem 1.5rem;
		border-top: 1px solid #f7b18a;
		border-bottom-left-radius: 0.75rem;
		border-bottom-right-radius: 0.75rem;
	}

	.btn-cancel {
		padding: 0.5rem 1rem;
		border: 1px solid #f7b18a;
		color: #f7b18a;
		border-radius: 0.375rem;
		font-weight: 500;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-cancel:hover {
		background-color: #333132;
	}

	.btn-confirm {
		padding: 0.5rem 1rem;
		border: 1px solid #7cc4a7;
		border-radius: 0.375rem;
		color: #7cc4a7;
		font-weight: 500;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-confirm:hover {
		background-color: #333132;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>