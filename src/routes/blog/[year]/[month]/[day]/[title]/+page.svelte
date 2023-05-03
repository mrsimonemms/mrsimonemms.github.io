<script lang="ts">
  import type { PageData } from './$types';
  import PageHeader from '$lib/components/page-header.svelte';
  import { profile } from '../../../../../../stores/profile';
  import markdown from '$lib/components/markdown';
  import DateFormat from '$lib/components/date-format.svelte';
  import { DateTime } from 'luxon';
  import BlogCard from '$lib/components/blog-card.svelte';
  import HomepageSection from '$lib/components/homepage-section.svelte';

  export let data: PageData;
</script>

<PageHeader title={data.post.attributes.title} />

<div class="container blog-page">
  <div class="columns">
    <div class="column is-8 mainbar mt-5">
      <div class="card mb-5">
        <div class="card-image">
          <figure
            class="image blog-image is-3by1"
            style="background-image: url('{data.post.attributes.image}')"
          />
        </div>
        <p class="card-header-title has-background-info-dark has-text-white-bis">
          {data.post.attributes.title}
        </p>

        <div class="card-content">
          <p class="is-size-7 has-text-grey has-text-right">
            Published: <DateFormat date={data.post.attributes.date} format={DateTime.DATE_FULL} />
          </p>

          <div class="content">
            {@html markdown(data.post.body)}

            {#if data.post.attributes.credits}
              <hr />

              <div class="columns">
                {#if data.previous}
                  <div class="column is-6">
                    <p class="title is-6">Previous</p>
                    <p>
                      <a href={data.previous.route}>
                        {data.previous.attributes.title}
                      </a>
                    </p>
                  </div>
                {/if}

                {#if data.next}
                  <div
                    class="column is-6 shas-text-right-desktop"
                    class:is-offset-6={!data.previous}
                  >
                    <p class="title is-6">Next</p>
                    <p>
                      <a href={data.next.route}>
                        {data.next.attributes.title}
                      </a>
                    </p>
                  </div>
                {/if}
              </div>

              <h3 class="title is-4">Credits</h3>

              {@html markdown(data.post.attributes.credits)}
            {/if}
          </div>
        </div>
      </div>

      <HomepageSection title="Do you like this article?" expandOnSlot={false}>
        <div class="has-text-centered">
          <a href="/contact" class="button is-large is-info is-outlined my-5">Hire me</a>
        </div>
      </HomepageSection>
    </div>

    <div class="column is-4 sidebar mt-5">
      <div class="card mb-5">
        <div class="card-content">
          <h3 class="title is-5">About the Author</h3>

          <div class="has-text-weight-light content">
            {@html markdown(profile.about)}
          </div>
        </div>
      </div>

      <div class="card mb-5">
        <div class="card-content">
          <h3 class="title is-5">Tags</h3>

          <div class="tags are-medium">
            {#each data.post.attributes.tags as tag}
              <a href="/blog?tag={tag}" class="tag" data-sveltekit-noscroll>{tag}</a>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .mainbar {
    .blog-image {
      background: {
        position: center center;
        size: cover;
      }
    }
  }
</style>
