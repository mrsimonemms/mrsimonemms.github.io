<script lang="ts">
  import PageTitle from './page-title.svelte';

  export let title: string | null = null;
  export let centeredTitle: boolean = true;
  export let sectionClass: string = '';
  export let expandOnSlot: boolean = true;

  const conditionalAttributes: {
    additionalStyles?: string;
  } = {};

  if ($$slots.default && expandOnSlot) {
    conditionalAttributes.additionalStyles = 'mb-6';
  }
</script>

<section class="section {sectionClass}">
  {#if title}
    <PageTitle {centeredTitle} {...conditionalAttributes}>
      {title}
    </PageTitle>
  {/if}

  <slot />
</section>
