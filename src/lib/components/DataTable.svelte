<script lang="ts">
	interface DataRow {
		id: number;
		title: string;
		description: string;
		status: string;
		assigned_to: string;
		created_at: string;
		updated_at: string;
	}

	let { data = [], onDataUpdated }: { data: DataRow[]; onDataUpdated?: () => void } = $props();

	let editingId = $state<number | null>(null);
	let editForm = $state<Partial<DataRow>>({});

	function startEdit(row: DataRow) {
		editingId = row.id;
		editForm = { ...row };
	}

	function cancelEdit() {
		editingId = null;
		editForm = {};
	}

	async function saveEdit() {
		try {
			if (!editingId || !editForm) return;

			// Import the API service
			const { mockApi } = await import('$lib/api');

			const response = await mockApi.updateTeamData(editingId, editForm);

			if (!response.success) {
				throw new Error(response.error || 'Failed to update data');
			}

			editingId = null;
			editForm = {};

			if (onDataUpdated) {
				onDataUpdated();
			}
		} catch (error) {
			console.error('Error updating data:', error);
			alert('Failed to update data: ' + (error instanceof Error ? error.message : 'Unknown error'));
		}
	}

	async function deleteRow(id: number) {
		if (confirm('Are you sure you want to delete this item?')) {
			try {
				// Import the API service
				const { mockApi } = await import('$lib/api');

				const response = await mockApi.deleteTeamData(id);

				if (!response.success) {
					throw new Error(response.error || 'Failed to delete data');
				}

				if (onDataUpdated) {
					onDataUpdated();
				}
			} catch (error) {
				console.error('Error deleting data:', error);
				alert(
					'Failed to delete data: ' + (error instanceof Error ? error.message : 'Unknown error')
				);
			}
		}
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getStatusClass(status: string) {
		switch (status.toLowerCase()) {
			case 'active':
				return 'bg-green-100 text-green-800';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'in progress':
				return 'bg-blue-100 text-blue-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<div class="overflow-x-auto">
	<table class="min-w-full divide-y divide-gray-200">
		<thead class="bg-gray-50">
			<tr>
				<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
					Title
				</th>
				<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
					Description
				</th>
				<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
					Status
				</th>
				<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
					Assigned To
				</th>
				<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
					Updated
				</th>
				<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
					Actions
				</th>
			</tr>
		</thead>
		<tbody class="divide-y divide-gray-200 bg-white">
			{#each data as row (row.id)}
				<tr class="hover:bg-gray-50">
					{#if editingId === row.id}
						<!-- Editing mode -->
						<td class="px-6 py-4 whitespace-nowrap">
							<input
								type="text"
								bind:value={editForm.title}
								class="w-full rounded border border-gray-300 px-2 py-1 text-sm"
							/>
						</td>
						<td class="px-6 py-4">
							<textarea
								bind:value={editForm.description}
								rows="2"
								class="w-full rounded border border-gray-300 px-2 py-1 text-sm"
							></textarea>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<select
								bind:value={editForm.status}
								class="rounded border border-gray-300 px-2 py-1 text-sm"
							>
								<option value="Active">Active</option>
								<option value="Pending">Pending</option>
								<option value="In Progress">In Progress</option>
								<option value="Completed">Completed</option>
							</select>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<input
								type="text"
								bind:value={editForm.assigned_to}
								class="w-full rounded border border-gray-300 px-2 py-1 text-sm"
							/>
						</td>
						<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
							{formatDate(row.updated_at)}
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
							<div class="text-sm font-medium text-gray-900">{row.title}</div>
						</td>
						<td class="px-6 py-4">
							<div class="max-w-xs truncate text-sm text-gray-900">{row.description}</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<span
								class="inline-flex rounded-full px-2 py-1 text-xs font-semibold {getStatusClass(
									row.status
								)}"
							>
								{row.status}
							</span>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm text-gray-900">{row.assigned_to}</div>
						</td>
						<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
							{formatDate(row.updated_at)}
						</td>
						<td class="px-6 py-4 text-sm font-medium whitespace-nowrap">
							<button
								onclick={() => startEdit(row)}
								class="mr-3 text-indigo-600 hover:text-indigo-900"
							>
								Edit
							</button>
							<button onclick={() => deleteRow(row.id)} class="text-red-600 hover:text-red-900">
								Delete
							</button>
						</td>
					{/if}
				</tr>
			{/each}
			{#if data.length === 0}
				<tr>
					<td colspan="6" class="px-6 py-4 text-center text-gray-500">
						No data available. Add some items to get started.
					</td>
				</tr>
			{/if}
		</tbody>
	</table>
</div>
