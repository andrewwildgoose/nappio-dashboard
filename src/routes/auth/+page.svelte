<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { goto } from '$app/navigation';

	let { data, form }: { data: any; form?: ActionData } = $props();

	let isLoading = $state(false);

	// Watch for successful sign in and redirect
	$effect(() => {
		if (form?.success) {
			goto('/');
		}
	});
</script>

<svelte:head>
	<title>Sign In - Nappio Dashboard</title>
	<meta name="description" content="Sign in to Nappio team dashboard" />
</svelte:head>

<div class="auth-container">
	<div class="auth-card">
		<div class="auth-header">
			<h1 class="mb-2 text-3xl font-bold text-color-text">Welcome Back</h1>
			<p class="text-color-text">Sign in to your Nappio admin dashboard</p>
		</div>

		<form method="POST" action="?/signin" use:enhance={() => {
			isLoading = true;
			return async ({ update }) => {
				isLoading = false;
				await update();
			};
		}} class="auth-form">
			{#if form?.error}
				<div class="error-message">
					{form.error}
				</div>
			{/if}

			<div class="form-group">
				<label for="email" class="form-label">Email Address</label>
				<input
					id="email"
					name="email"
					type="email"
					required
					class="form-input"
					placeholder="Enter your team email"
				/>
			</div>

			<div class="form-group">
				<label for="password" class="form-label">Password</label>
				<input
					id="password"
					name="password"
					type="password"
					required
					class="form-input"
					placeholder="Enter your password"
				/>
			</div>

			<button type="submit" disabled={isLoading} class="auth-button">
				{#if isLoading}
					Signing In...
				{:else}
					Sign In
				{/if}
			</button>
		</form>

		<div class="team-notice">
			<p class="text-sm text-gray-600">
				<strong>Team Access Only:</strong> This dashboard is restricted to authorized team members.
				Contact your administrator if you need access.
			</p>
		</div>
	</div>
</div>

<style>
	.auth-container {
		min-height: calc(100vh - 200px);
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 2rem 1rem;
	}

	.auth-card {
		width: 100%;
		max-width: 400px;
		border: 1px solid #f4f3ed;
		border-radius: 0.75rem;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
		padding: 2rem;
	}

	.auth-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.auth-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.form-label {
		font-weight: 600;
		color: #f4f3ed;
		font-size: 0.875rem;
	}

	.form-input {
		padding: 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 0.5rem;
		font-size: 1rem;
		transition: all 0.2s ease;
	}

	.form-input:focus {
		outline: none;
		border-color: #7cc4a7;
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
	}

	.auth-button {
		background: #ffe670;
		color: #262625;
		padding: 0.75rem;
		border: none;
		border-radius: 0.5rem;
		font-weight: 600;
		font-size: 1rem;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.auth-button:hover:not(:disabled) {
		background: #fde04d;
	}

	.auth-button:disabled {
		background: #fdf0ab;
		cursor: not-allowed;
	}

	.error-message {
		background: #f7b18a;
		color: #262625;
		padding: 0.75rem;
		border-radius: 0.5rem;
		text-align: center;
		font-size: 0.875rem;
	}

	.team-notice {
		margin-top: 1.5rem;
		padding: 1rem;
		background: #f3f4f6;
		border-radius: 0.5rem;
		text-align: center;
	}
</style>
