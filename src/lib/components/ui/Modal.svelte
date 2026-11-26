<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		open: boolean;
		title: string;
		onClose: () => void;
		children: Snippet;
		footer?: Snippet;
	}

	let { open, title, onClose, children, footer }: Props = $props();

	const titleId = `modal-title-${Math.random().toString(36).slice(2, 9)}`;

	function handleKeydown(event: KeyboardEvent) {
		if (open && event.key === 'Escape') onClose();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="modal-overlay"
		onclick={(e) => e.target === e.currentTarget && onClose()}
		role="dialog"
		aria-modal="true"
		aria-labelledby={titleId}
		tabindex="-1"
	>
		<div class="modal-content" role="document">
			<div class="modal-header">
				<h3 id={titleId} class="text-lg font-semibold">{title}</h3>
				<button type="button" onclick={onClose} class="modal-close-button">
					<span class="sr-only">Close</span>
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<div class="modal-body">
				{@render children()}
			</div>

			{#if footer}
				<div class="modal-footer">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 50;
		padding: 1rem;
	}

	.modal-content {
		background-color: #262625;
		border: 1px solid #f7b18a;
		border-radius: 0.75rem;
		box-shadow:
			0 20px 25px -5px rgba(0, 0, 0, 0.1),
			0 10px 10px -5px rgba(0, 0, 0, 0.04);
		max-width: 32rem;
		width: 100%;
		max-height: 90vh;
		overflow-y: auto;
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

	.modal-footer {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
		padding: 1rem 1.5rem 1.5rem 1.5rem;
		border-top: 1px solid #f7b18a;
	}
</style>
