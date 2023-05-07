<script lang="ts">
  export let title: string;
</script>

<div class="card mb-5">
  <div class="card-content">
    <p class="title is-3 has-text-weight-light">{title}</p>

    <div class="content">
      <slot />
    </div>
  </div>
</div>
