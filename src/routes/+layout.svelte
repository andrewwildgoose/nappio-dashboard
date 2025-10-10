<script lang="ts">
	import Header from '../lib/components/Header.svelte';
	import '../app.css';
	import { user } from '$lib/stores/auth';
	import { onMount } from 'svelte';

	let { children, data } = $props();

	// Initialize the user store with session data from the server
	onMount(() => {
		if (data.session?.user) {
			user.set({
				id: data.session.user.id,
				email: data.session.user.email,
				email_verified: data.session.user.email_confirmed_at ? true : false
			});
		} else {
			user.set(null);
		}
	});
</script>

<div class="app">
	<Header />

	<main>
		{@render children()}
	</main>

	<footer>
		<p>© 2024 Nappio - Internal Team Dashboard</p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		/* background-color: #f9fafb; */
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 1rem;
		/* background-color: white; */
		border-top: 1px solid #e5e7eb;
		/* color: #6b7280; */
		font-size: 0.875rem;
	}
</style>
