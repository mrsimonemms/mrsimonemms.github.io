<script lang="ts">
  import type { Post } from '$lib/blog';
  import { DateTime } from 'luxon';
  import DateFormat from './date-format.svelte';

  export let post: Post;
</script>

<a href={post.route}>
  <div class="card">
    <div class="card-image">
      <figure class="image is-3by1" style="background-image: url('{post.attributes.image}')" />
    </div>
    <p class="card-header-title has-background-info-dark has-text-white-bis">
      {post.attributes.title}
    </p>
    <div class="card-content">
      <div class="content">
        <p>{post.attributes.excerpt}</p>

        <div class="tags are-medium">
          {#each post.attributes.tags as tag}
            <a href="/blog?tag={tag}" class="tag" data-sveltekit-noscroll>{tag}</a>
          {/each}
        </div>

        <p class="is-size-7 has-text-grey has-text-right">
          Published: <DateFormat date={post.attributes.date} format={DateTime.DATE_FULL} />
        </p>
      </div>
    </div>
  </div>
</a>

<style lang="scss">
  .image {
    background: {
      position: center center;
      size: cover;
    }
  }
</style>
