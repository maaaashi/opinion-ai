<script>
	import '../app.postcss';
	import Header from '$components/Header.svelte';
</script>

<Header />

<svelte:head>
	<title>感想文ジェネレーター</title>
</svelte:head>

<main class="mx-10 mt-3 overflow-y-auto" style="height: calc(100vh - 70px);">
	<slot />
</main>
