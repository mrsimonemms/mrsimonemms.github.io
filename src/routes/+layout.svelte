<script lang="ts">
  import Navbar from '../lib/components/navbar.svelte';
  import PageHeader from '../lib/components/page-header.svelte';
  import '../app.scss';

  const subtitle = 'Software Engineer, Technical Leader, Solutions Designer';
  const currentYear = new Date().getUTCFullYear();
</script>

<PageHeader title={subtitle} />

<section class="hero is-large">
  <div class="hero-head">
    <Navbar />
  </div>

  <div class="hero-body has-text-weight-light has-text-white">
    <p class="is-size-1 is-size-3-mobile">Simon Emms</p>
    <p class="is-size-5 is-size-6-mobile">{subtitle}</p>
  </div>
</section>

<div class="site-content">
  <slot />
</div>

<footer class="footer has-background-black-ter has-text-white has-text-centered">
  <div class="content">
    <div>@todo</div>
    <hr class="has-background-grey-dark" />
    <div class="is-size-7">
      &copy; {currentYear}
      <span class="px-2">|</span>
      Simon Emms
    </div>
  </div>
</footer>

<style lang="scss">
  .hero {
    background: {
      image: url('/img/devopsdays.jpg');
      position: center center;
      size: cover;
    }
  }

  .site-content {
    flex: 1;
  }

  .footer {
    hr {
      height: 1px;
    }
  }
</style>
