<script>
  import { page } from '$app/stores';
  import PageHeader from '$lib/components/page-header.svelte';
  import PageTitle from '$lib/components/page-title.svelte';

  const errorMessage = $page.error?.message ?? 'Unknown error';
</script>

<PageHeader title={errorMessage} />

<section class="hero is-fullheight">
  <div class="hero-body is-justify-content-center">
    <div class="has-background-danger has-text-white p-3 has-text-centered">
      <PageTitle addPadding={false}>There's been an error</PageTitle>

      <div class=" content">
        <p class="is-size-4 has-text-weight-light">{errorMessage}</p>

        <p>
          The best thing you can do now is go back to the
          <a href="/" class="is-link">homepage</a>
        </p>
      </div>
    </div>
  </div>
</section>

<style lang="scss">
  .hero {
    background: {
      image: url('/img/error.jpg');
      position: center center;
      size: cover;
    }
  }
</style>
