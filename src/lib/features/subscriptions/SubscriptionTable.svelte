<!--
	Subscription progress table: search, status filter, sorting (via DataTable)
	plus inline editing of status / meeting date with a confirmation step.
-->
<script lang="ts">
	import type {
		SubscriptionData,
		SubscriptionStatus,
		SubscriptionProgressUpdate
	} from '$lib/types/api';
	import { clientApi } from '$lib/client/api';
	import DataTable from '$lib/components/table/DataTable.svelte';
	import type { Column, TableFilter } from '$lib/components/table/types';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import DetailList from '$lib/components/ui/DetailList.svelte';
	import {
		dateSortValue,
		formatDate,
		formatDateTime,
		fromDateTimeInputValue,
		toDateTimeInputValue
	} from '$lib/utils/format';
	import {
		canAction,
		statusBadgeClass,
		statusLabel,
		statusOptions,
		statusSortValue
	} from './status';

	let { data = [], onDataUpdated }: { data: SubscriptionData[]; onDataUpdated?: () => void } =
		$props();

	// --- Inline editing ---------------------------------------------------
	let editingId = $state<string | null>(null);
	let editForm = $state<{ status?: SubscriptionStatus; meeting_date?: string | null }>({});

	// --- Confirmation modal -----------------------------------------------
	let confirmationData = $state<SubscriptionData | null>(null);
	let pendingUpdate = $state<SubscriptionProgressUpdate | null>(null);
	let isSaving = $state(false);

	function startEdit(row: SubscriptionData) {
		editingId = row.subscription_id;
		editForm = { status: row.progress_status, meeting_date: row.meeting_date };
	}

	function cancelEdit() {
		editingId = null;
		editForm = {};
	}

	function saveEdit() {
		const current = data.find((row) => row.subscription_id === editingId);
		if (!editingId || !current) return;

		const update: SubscriptionProgressUpdate = { subscription_id: editingId };
		if (editForm.status !== undefined) update.status = editForm.status;
		if (editForm.meeting_date !== undefined) update.meeting_date = editForm.meeting_date;

		pendingUpdate = update;
		confirmationData = {
			...current,
			progress_status: editForm.status || current.progress_status,
			meeting_date:
				editForm.meeting_date !== undefined ? editForm.meeting_date : current.meeting_date
		};
	}

	async function confirmSave() {
		if (!pendingUpdate) return;
		try {
			isSaving = true;
			const updateData: SubscriptionProgressUpdate = {
				subscription_id: pendingUpdate.subscription_id,
				...(pendingUpdate.status && { status: pendingUpdate.status }),
				...(pendingUpdate.meeting_date !== undefined && {
					meeting_date: pendingUpdate.meeting_date
				})
			};

			await clientApi.updateSubscriptionProgress(updateData);

			closeConfirmation();
			cancelEdit();
			onDataUpdated?.();
		} catch (error) {
			console.error('Error updating subscription:', error);
			alert(
				'Failed to update subscription: ' +
					(error instanceof Error ? error.message : 'Unknown error')
			);
		} finally {
			isSaving = false;
		}
	}

	/** Close the modal but stay in edit mode so the user can keep editing. */
	function closeConfirmation() {
		confirmationData = null;
		pendingUpdate = null;
	}

	// --- Table configuration ----------------------------------------------
	const columns: Column<SubscriptionData>[] = [
		{
			id: 'customer',
			header: 'Customer',
			subheader: 'subscription_id',
			sortValue: (row) => row.customer_name,
			searchValue: (row) => [row.customer_name, row.subscription_id],
			cell: customerCell
		},
		{
			id: 'email',
			header: 'Email',
			value: (row) => row.customer_email,
			sortValue: (row) => row.customer_email,
			searchValue: true
		},
		{
			id: 'status',
			header: 'Status',
			sortValue: (row) => statusSortValue(row.progress_status),
			cell: statusCell
		},
		{
			id: 'meeting_date',
			header: 'Meeting Date',
			sortValue: (row) => dateSortValue(row.meeting_date),
			cell: meetingDateCell
		},
		{
			id: 'subscribed',
			header: 'Subscribed',
			format: (row) => formatDateTime(row.subscribed_at),
			sortValue: (row) => dateSortValue(row.subscribed_at)
		},
		{
			id: 'baby_dob',
			header: 'Baby DOB',
			subheader: '(weight at start)',
			sortValue: (row) => dateSortValue(row.baby_dob),
			cell: babyCell
		},
		{
			id: 'actions',
			header: 'Actions',
			class: 'font-medium',
			cell: actionsCell
		}
	];

	const filters: TableFilter<SubscriptionData>[] = [
		{
			id: 'status',
			label: 'Filter by status',
			allLabel: 'All Status',
			options: statusOptions.map((status) => ({ value: status, label: statusLabel(status) })),
			match: (row, value) => row.progress_status === value
		}
	];
</script>

{#snippet customerCell(row: SubscriptionData)}
	<div class="text-sm font-medium">{row.customer_name}</div>
	<div class="text-xs text-gray-500">{row.subscription_id}</div>
{/snippet}

{#snippet statusCell(row: SubscriptionData)}
	{#if editingId === row.subscription_id}
		<select
			bind:value={editForm.status}
			aria-label="Status"
			class="rounded border border-gray-300 px-2 py-1 text-sm"
		>
			{#each statusOptions as status (status)}
				<option value={status}>{statusLabel(status)}</option>
			{/each}
		</select>
	{:else}
		<Badge class={statusBadgeClass(row.progress_status)}>{statusLabel(row.progress_status)}</Badge>
	{/if}
{/snippet}

{#snippet meetingDateCell(row: SubscriptionData)}
	{#if editingId === row.subscription_id}
		<input
			type="datetime-local"
			aria-label="Meeting date"
			value={toDateTimeInputValue(editForm.meeting_date)}
			oninput={(e) => (editForm.meeting_date = fromDateTimeInputValue(e.currentTarget.value))}
			class="w-full rounded border border-gray-300 px-2 py-1 text-sm"
		/>
	{:else}
		{formatDateTime(row.meeting_date)}
	{/if}
{/snippet}

{#snippet babyCell(row: SubscriptionData)}
	{formatDate(row.baby_dob)}
	{#if row.baby_weight_at_start && editingId !== row.subscription_id}
		<div class="text-xs">({row.baby_weight_at_start}kg)</div>
	{/if}
{/snippet}

{#snippet actionsCell(row: SubscriptionData)}
	{#if editingId === row.subscription_id}
		<div class="flex flex-col gap-2">
			<Button variant="tertiary" onclick={saveEdit}>Save</Button>
			<Button variant="primary" onclick={cancelEdit}>Cancel</Button>
		</div>
	{:else if canAction(row.progress_status)}
		<Button variant="secondary" onclick={() => startEdit(row)}>Update</Button>
	{:else}
		<span class="text-gray-400">N/A</span>
	{/if}
{/snippet}

<DataTable
	rows={data}
	{columns}
	{filters}
	rowKey={(row) => row.subscription_id}
	itemLabel="subscriptions"
	searchPlaceholder="Search customers, emails, or subscription IDs..."
/>

<Modal
	open={confirmationData !== null}
	title="Confirm Subscription Update"
	onClose={closeConfirmation}
>
	{#if confirmationData}
		<p class="mb-4 text-sm">
			Please review the changes below and confirm they are correct. Confirming & saving these
			changes may trigger emails to the customer.
		</p>
		<DetailList
			items={[
				{ label: 'Customer', value: confirmationData.customer_name },
				{ label: 'Email', value: confirmationData.customer_email },
				{ label: 'Subscription ID', value: confirmationData.subscription_id },
				{ label: 'Status', value: statusLabel(confirmationData.progress_status) },
				{ label: 'Meeting Date', value: formatDateTime(confirmationData.meeting_date) },
				{ label: 'Subscribed', value: formatDateTime(confirmationData.subscribed_at) },
				{
					label: 'Baby DOB',
					value:
						formatDate(confirmationData.baby_dob) +
						(confirmationData.baby_weight_at_start
							? ` (${confirmationData.baby_weight_at_start}kg)`
							: '')
				}
			]}
		/>
	{/if}

	{#snippet footer()}
		<Button variant="primary" onclick={closeConfirmation} disabled={isSaving}>
			Cancel & Continue Editing
		</Button>
		<Button variant="tertiary" onclick={confirmSave} disabled={isSaving}>
			{isSaving ? 'Saving...' : 'Confirm & Save Changes'}
		</Button>
	{/snippet}
</Modal>
