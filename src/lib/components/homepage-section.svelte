<script lang="ts">
  export let title: string | null = null;
  export let centeredTitle: boolean = true;
  export let sectionClass: string = '';
  export let expandOnSlot: boolean = true;
</script>

<section class="section {sectionClass}">
  {#if title}
    <!-- svelte-ignore a11y-missing-content -->
    <a
      id={title
        .toLowerCase()
        .replace(/\W/g, '--')
        .replace(/(-{1,})/g, '-')
        .replace(/-$/, '')}
    />
    <h3
      class="is-size-3 has-text-weight-light"
      class:mb-6={$$slots.default && expandOnSlot}
      class:has-text-centered={centeredTitle}
    >
      {title}
    </h3>
  {/if}

  <slot />
</section>
