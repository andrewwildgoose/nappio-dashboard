<script lang="ts">
	import { page } from '$app/state';
</script>

<header class="border-b border-gray-200 bg-white px-6 py-4">
	<div class="mx-auto flex max-w-7xl items-center justify-between">
		<div class="flex items-center">
			<h1 class="text-2xl font-bold text-blue-600">Nappio</h1>
			<span class="ml-2 text-sm text-gray-500">Admin Dashboard</span>
		</div>

		<nav class="flex space-x-8">
			<a href="/" class="nav-link {page.url.pathname === '/' ? 'active' : ''}"> Dashboard </a>
			<a href="/auth" class="nav-link {page.url.pathname === '/auth' ? 'active' : ''}"> Login </a>
		</nav>

		<div class="text-sm text-gray-500">Team Portal</div>
	</div>
</header>

<style>
	.nav-link {
		color: #6b7280;
		font-weight: 500;
		text-decoration: none;
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		transition: all 0.2s ease;
	}

	.nav-link:hover {
		color: #2563eb;
		background-color: #eff6ff;
	}

	.nav-link.active {
		color: #2563eb;
		background-color: #dbeafe;
		font-weight: 600;
	}
</style>
