<script lang="ts">
  import type { PageData } from './$types';
  import { page } from '$app/stores';
  import { afterNavigate } from '$app/navigation';
  import DateFormat from '$lib/components/date-format.svelte';
  import PageHeader from '$lib/components/page-header.svelte';
  import { DateTime } from 'luxon';

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
        <a href={post.route}>
          <div class="card">
            <div class="card-image">
              <figure
                class="image is-3by1"
                style="background-image: url('{post.attributes.image}')"
              />
            </div>
            <p class="card-header-title has-background-info-dark has-text-white-bis">
              {post.attributes.title}
            </p>
            <div class="card-content">
              <div class="content">
                <p>{post.attributes.excerpt}</p>

                <div class="tags are-medium">
                  {#each post.attributes.tags as tag}
                    <a href="?tag={tag}" class="tag" data-sveltekit-noscroll>{tag}</a>
                  {/each}
                </div>

                <p class="is-size-7 has-text-grey has-text-right">
                  Published: <DateFormat date={post.attributes.date} format={DateTime.DATE_FULL} />
                </p>
              </div>
            </div>
          </div>
        </a>
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .image {
    background: {
      position: center center;
      size: cover;
    }
  }
</style>
