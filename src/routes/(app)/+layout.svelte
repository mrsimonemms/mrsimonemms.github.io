<script lang="ts">
  import Navbar from '$lib/components/navbar.svelte';
  import { cv } from '$lib/stores/cv';

  const subtitle = 'Software Engineer, Technical Leader, Solutions Designer';
  const currentYear = new Date().getUTCFullYear();
</script>

<section class="hero is-medium">
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
    {#each cv.basics.profiles as profile}
      <a
        class="has-tooltip-arrow has-tooltip-bottom"
        href={profile.url}
        target="_blank"
        data-tooltip={profile.network}
      >
        <span class="icon is-large has-text-white mx-3">
          <i class="mdi mdi-24px mdi-{profile.network.toLowerCase()}" />
        </span>
      </a>
    {/each}
    <hr class="has-background-grey-dark" />
    <div class="is-size-6">
      &copy; {currentYear}
      <span class="px-2">|</span>
      Simon Emms
      <p>
        This site is open source.
        <a
          href="https://github.com/mrsimonemms/mrsimonemms.github.io/edit/main/README.md"
          class="has-text-link-light"
          target="_blank"
        >
          Improve this page.
        </a>
      </p>
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
