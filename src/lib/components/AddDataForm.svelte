<script lang="ts">
	let { onDataAdded }: { onDataAdded?: () => void } = $props();

	let formData = $state({
		title: '',
		description: '',
		status: 'Pending',
		assigned_to: ''
	});

	let isSubmitting = $state(false);

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (isSubmitting) return;

		// Basic validation
		if (!formData.title.trim() || !formData.description.trim() || !formData.assigned_to.trim()) {
			alert('Please fill in all fields');
			return;
		}

		isSubmitting = true;

		try {
			// Import the API service
			const { mockApi } = await import('$lib/api');

			const response = await mockApi.createTeamData(formData);

			if (!response.success) {
				throw new Error(response.error || 'Failed to add data');
			}

			// Reset form
			formData = {
				title: '',
				description: '',
				status: 'Pending',
				assigned_to: ''
			};

			if (onDataAdded) {
				onDataAdded();
			}

			alert('Data added successfully!');
		} catch (error) {
			console.error('Error adding data:', error);
			alert('Failed to add data: ' + (error instanceof Error ? error.message : 'Unknown error'));
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="add-data-form">
	<h2 class="mb-4 text-xl font-semibold text-gray-900">Add New Item</h2>

	<form onsubmit={handleSubmit} class="space-y-4">
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<div>
				<label for="title" class="mb-1 block text-sm font-medium text-gray-700"> Title * </label>
				<input
					id="title"
					type="text"
					bind:value={formData.title}
					required
					class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					placeholder="Enter title"
				/>
			</div>

			<div>
				<label for="assigned_to" class="mb-1 block text-sm font-medium text-gray-700">
					Assigned To *
				</label>
				<input
					id="assigned_to"
					type="text"
					bind:value={formData.assigned_to}
					required
					class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					placeholder="Enter assignee name"
				/>
			</div>
		</div>

		<div>
			<label for="description" class="mb-1 block text-sm font-medium text-gray-700">
				Description *
			</label>
			<textarea
				id="description"
				bind:value={formData.description}
				required
				rows="3"
				class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				placeholder="Enter description"
			></textarea>
		</div>

		<div>
			<label for="status" class="mb-1 block text-sm font-medium text-gray-700"> Status </label>
			<select
				id="status"
				bind:value={formData.status}
				class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			>
				<option value="Pending">Pending</option>
				<option value="Active">Active</option>
				<option value="In Progress">In Progress</option>
				<option value="Completed">Completed</option>
			</select>
		</div>

		<div class="flex justify-end">
			<button
				type="submit"
				disabled={isSubmitting}
				class="rounded-md bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:bg-blue-400"
			>
				{isSubmitting ? 'Adding...' : 'Add Item'}
			</button>
		</div>
	</form>
</div>

<style>
	.add-data-form {
		max-width: 100%;
	}
</style>
