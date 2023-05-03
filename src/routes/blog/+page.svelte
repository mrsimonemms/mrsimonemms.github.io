<script lang="ts">
  import type { PageData } from './$types';
  import { page } from '$app/stores';
  import { afterNavigate } from '$app/navigation';
  import PageHeader from '$lib/components/page-header.svelte';
  import BlogCard from '$lib/components/blog-card.svelte';
  import PageTitle from '$lib/components/page-title.svelte';

  export let data: PageData;

  let filteredPosts = false;
  let { posts } = data;
  let tag: string | null = null;

  afterNavigate(() => {
    tag = $page.url.searchParams.get('tag');

    filteredPosts = tag !== null;
    posts = data.posts;

    if (filteredPosts) {
      posts = posts.filter(({ attributes }) => attributes.tags.includes(tag));
    }
  });
</script>

<PageHeader title="Blog" />

<div class="container mb-5">
  <div class="my-6">
    <PageTitle addPadding={false}>Blog Posts</PageTitle>

    {#if filteredPosts}
      <span class="tag is-large">{tag}</span>

      <a class="button pb-2" href="/blog" data-sveltekit-noscroll>
        <span> Clear filters </span>
        <span class="icon is-small">
          <i class="mdi mdi-close" />
        </span>
      </a>
    {/if}
  </div>

  <div class="columns is-multiline">
    {#each posts as post, i}
      <div class="column" class:is-half={i < 2} class:is-one-third={i >= 2}>
        <BlogCard {post} />
      </div>
    {/each}
  </div>
</div>
