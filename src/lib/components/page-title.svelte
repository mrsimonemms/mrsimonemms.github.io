<script lang="ts">
  export let centeredTitle: boolean = false;
  export let addPadding: boolean = true;
</script>

<h3
  class="is-size-1 has-text-weight-light"
  class:my-6={addPadding}
  class:has-text-centered={centeredTitle}
>
  <slot />
</h3>
