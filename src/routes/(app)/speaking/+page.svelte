<script lang="ts">
  import DateFormat from '$lib/components/date-format.svelte';
  import markdown from '$lib/components/markdown';
  import PageHeader from '$lib/components/page-header.svelte';
  import PageTitle from '$lib/components/page-title.svelte';
  import { speaking } from '$lib/stores/speaking';

  const format: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
  };
</script>

<PageHeader title="Speaking" />

<div class="container my-5">
  <div class="content">
    <PageTitle>Speaking</PageTitle>

    <div class="columns is-multiline">
      {#each speaking as item}
        <div class="column is-full">
          <div class="card">
            <div class="card-image">
              <div class="video-container">
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/{item.youtube}"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                />
              </div>
            </div>

            <div class="card-content has-background-info-dark">
              <div class="media">
                <div class="media-content">
                  <p class="title is-4 has-text-white-bis">{item.title}</p>
                  <p class="subtitle is-6 has-text-white-bis">
                    {item.event}, <DateFormat date={item.date} {format} />
                  </p>
                </div>
              </div>
            </div>
            {#if item.note}
              <div class="card-content">
                <article class="message is-medium">
                  <div class="message-body">
                    {@html markdown(item.note)}
                  </div>
                </article>
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
  .video-container {
    position: relative;
    padding-bottom: 56.25%;
    padding-top: 30px;
    height: 0;
    overflow: hidden;

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
</style>
