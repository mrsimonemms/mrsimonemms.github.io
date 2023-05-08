<script lang="ts">
  import { page } from '$app/stores';

  const metadata: App.MetaTags[] = [];

  if ($page?.data?.defaultMetadata) {
    for (let [key, value] of $page.data.defaultMetadata) {
      // Check for any overridden data
      const override = $page.data.metadata?.get(key);
      if (override) {
        value = override;
      }

      metadata.push(value);
    }
  }
</script>

<svelte:head>
  {#each metadata as tag}
    <meta name={tag.name} property={tag.property} content={tag.content} />
  {/each}
</svelte:head>
