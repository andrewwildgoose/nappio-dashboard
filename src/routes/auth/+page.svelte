<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let isLogin = $state(true);
	let isLoading = $state(false);
	let errorMessage = $state('');

	async function handleAuth(event: Event) {
		event.preventDefault();

		if (!email || !password) {
			errorMessage = 'Please fill in all fields';
			return;
		}

		isLoading = true;
		errorMessage = '';

		try {
			if (isLogin) {
				// Mock login for demonstration
				console.log('Logging in with:', { email, password });

				// Simulate API call delay
				await new Promise((resolve) => setTimeout(resolve, 1000));

				// For demo purposes, accept any credentials
				localStorage.setItem(
					'nappio_session',
					JSON.stringify({
						user: { email },
						token: 'demo-token'
					})
				);

				goto('/');
			} else {
				// Mock signup for demonstration
				console.log('Signing up with:', { email, password });

				// Simulate API call delay
				await new Promise((resolve) => setTimeout(resolve, 1000));

				alert('Account created successfully! Please log in.');
				isLogin = true;
			}
		} catch (error) {
			console.error('Auth error:', error);
			errorMessage = 'Authentication failed. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	function toggleMode() {
		isLogin = !isLogin;
		errorMessage = '';
	}
</script>

<svelte:head>
	<title>Authentication - Nappio Dashboard</title>
	<meta name="description" content="Login to Nappio team dashboard" />
</svelte:head>

<div class="auth-container">
	<div class="auth-card">
		<div class="auth-header">
			<h1 class="mb-2 text-3xl font-bold text-gray-900">
				{isLogin ? 'Welcome Back' : 'Create Account'}
			</h1>
			<p class="text-gray-600">
				{isLogin ? 'Sign in to your Nappio dashboard' : 'Join the Nappio team portal'}
			</p>
		</div>

		<form onsubmit={handleAuth} class="auth-form">
			{#if errorMessage}
				<div class="error-message">
					{errorMessage}
				</div>
			{/if}

			<div class="form-group">
				<label for="email" class="form-label">Email Address</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					class="form-input"
					placeholder="Enter your email"
				/>
			</div>

			<div class="form-group">
				<label for="password" class="form-label">Password</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					required
					class="form-input"
					placeholder="Enter your password"
				/>
			</div>

			<button type="submit" disabled={isLoading} class="auth-button">
				{#if isLoading}
					Processing...
				{:else}
					{isLogin ? 'Sign In' : 'Create Account'}
				{/if}
			</button>

			<div class="auth-toggle">
				<p>
					{isLogin ? "Don't have an account?" : 'Already have an account?'}
					<button type="button" onclick={toggleMode} class="toggle-link">
						{isLogin ? 'Sign up' : 'Sign in'}
					</button>
				</p>
			</div>
		</form>

		<div class="demo-notice">
			<p class="text-sm text-gray-500">
				<strong>Demo Mode:</strong> Use any email and password to sign in.
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
		background: white;
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
		color: #374151;
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
		border-color: #2563eb;
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
	}

	.auth-button {
		background: #2563eb;
		color: white;
		padding: 0.75rem;
		border: none;
		border-radius: 0.5rem;
		font-weight: 600;
		font-size: 1rem;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.auth-button:hover:not(:disabled) {
		background: #1d4ed8;
	}

	.auth-button:disabled {
		background: #93c5fd;
		cursor: not-allowed;
	}

	.auth-toggle {
		text-align: center;
		margin-top: 1rem;
	}

	.toggle-link {
		color: #2563eb;
		font-weight: 600;
		background: none;
		border: none;
		cursor: pointer;
		text-decoration: underline;
	}

	.toggle-link:hover {
		color: #1d4ed8;
	}

	.error-message {
		background: #fee2e2;
		color: #dc2626;
		padding: 0.75rem;
		border-radius: 0.5rem;
		text-align: center;
		font-size: 0.875rem;
	}

	.demo-notice {
		margin-top: 1.5rem;
		padding: 1rem;
		background: #f3f4f6;
		border-radius: 0.5rem;
		text-align: center;
	}
</style>
