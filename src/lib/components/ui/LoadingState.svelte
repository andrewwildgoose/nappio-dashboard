<script lang="ts">
	let { message = 'Loading...' }: { message?: string } = $props();
</script>

<div class="loading-state" role="status" aria-live="polite">
	<div class="spinner" aria-hidden="true"></div>
	<p class="mt-4">{message}</p>
</div>

<style>
	.loading-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem 2rem;
		border: 1px solid #f4f3ed;
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
	}

	.spinner {
		width: 2rem;
		height: 2rem;
		border: 3px solid #aedbd9;
		border-top: 3px solid #ffe670;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
