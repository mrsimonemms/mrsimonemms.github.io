<script lang="ts">
  export let title: string;
</script>

<div class="card mb-5">
  <div class="card-content">
    <p class="title is-6">{title}</p>

    <div class="content">
      <slot />
    </div>
  </div>
</div>
