<script lang="ts">
  import type { PageData } from './$types';
  import PageHeader from '$lib/components/page-header.svelte';

  export let data: PageData;
</script>

<PageHeader title={data.attributes.title} />

blog post {data.body}
