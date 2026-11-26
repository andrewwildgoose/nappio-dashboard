<script lang="ts">
	interface Props {
		error: string;
		onRetry?: () => void;
	}

	let { error, onRetry }: Props = $props();
</script>

<div class="error-banner" role="alert">
	<p class="text-red-800">
		<strong>Error:</strong>
		{error}
	</p>
	{#if onRetry}
		<button
			type="button"
			onclick={onRetry}
			class="ml-4 text-red-600 underline hover:cursor-pointer hover:text-red-800"
		>
			Retry
		</button>
	{/if}
</div>

<style>
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
</style>
