<script lang="ts">
  import type { PageData } from './$types';
  import { page } from '$app/stores';
  import { afterNavigate } from '$app/navigation';
  import PageHeader from '$lib/components/page-header.svelte';
  import BlogCard from '$lib/components/blog-card.svelte';

  export let data: PageData;

  let filteredPosts = false;
  let { posts } = data;

  afterNavigate(() => {
    const tag = $page.url.searchParams.get('tag');

    filteredPosts = tag !== null;
    posts = data.posts;

    if (filteredPosts) {
      posts = posts.filter(({ attributes }) => attributes.tags.includes(tag));
    }
  });
</script>

<PageHeader title="Blog" />

<div class="container mb-5">
  <h1 class="is-size-1">Blog Posts</h1>

  {#if filteredPosts}
    <div class="pb-2">
      <a href="/blog" data-sveltekit-noscroll>Clear filters</a>
    </div>
  {/if}

  <div class="columns is-multiline">
    {#each posts as post, i}
      <div class="column" class:is-half={i < 2} class:is-one-third={i >= 2}>
        <BlogCard {post} />
      </div>
    {/each}
  </div>
</div>
