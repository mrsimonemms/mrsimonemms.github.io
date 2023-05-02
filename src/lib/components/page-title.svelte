<script lang="ts">
  export let centeredTitle: boolean = true;
  export let additionalStyles: string = '';
</script>

<h3
  class="is-size-3 has-text-weight-light {additionalStyles}"
  class:has-text-centered={centeredTitle}
>
  <slot />
</h3>
