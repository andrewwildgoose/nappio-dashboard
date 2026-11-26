<script lang="ts">
	import type { SubscriptionData } from '$lib/types/api';
	import StatGrid from '$lib/components/ui/StatGrid.svelte';
	import StatCard from '$lib/components/ui/StatCard.svelte';

	let { data }: { data: SubscriptionData[] } = $props();

	const countBy = (status: SubscriptionData['progress_status']) =>
		data.filter((item) => item.progress_status === status).length;
</script>

<StatGrid>
	<StatCard label="Total Subscriptions" value={data.length} tone="secondary" />
	<StatCard label="Active" value={countBy('active')} tone="tertiary" />
	<StatCard label="Pending" value={countBy('pending')} tone="accent2" />
	<StatCard label="Meeting Scheduled" value={countBy('meeting_scheduled')} tone="accent" />
</StatGrid>
