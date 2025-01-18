<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import { page } from '$app/stores';

  let displayNav = false;

  interface IMenu {
    name: string;
    link: string;
    icon?: string;
    exactMatch: boolean;
    newWindow?: boolean;
  }

  const menuBar: IMenu[] = [
    {
      name: 'Home',
      link: '/',
      exactMatch: true,
    },
    {
      name: 'Blog',
      link: '/blog',
      exactMatch: false,
    },
    {
      name: 'Speaking',
      link: '/speaking',
      exactMatch: true,
    },
    {
      name: 'Profile',
      link: '/profile',
      exactMatch: true,
    },
    {
      name: 'Contact',
      link: '/contact',
      exactMatch: true,
    },
    {
      name: 'CV',
      link: '/simonemms_leadengineer_cv.pdf',
      icon: 'mdi-download',
      exactMatch: true,
      newWindow: true,
    },
  ];

  afterNavigate(() => {
    displayNav = false;
  });
</script>

<nav class="navbar is-dark">
  <div class="container">
    <div class="navbar-brand">
      <a href="/" class="navbar-item">
        <figure class="image is-36x36">
          <img class="is-rounded" src="/img/face-and-hat.jpg" alt="Logo" />
        </figure>
      </a>

      <span
        class="navbar-burger"
        data-target="navbarMenu"
        aria-hidden="true"
        on:click={() => (displayNav = !displayNav)}
      >
        <span />
        <span />
        <span />
      </span>
    </div>

    <div id="navbarMenu" class="navbar-menu" class:is-active={displayNav}>
      <div class="navbar-end">
        {#each menuBar as item}
          <a
            href={item.link}
            target={item.newWindow ? '_blank' : null}
            class="navbar-item"
            class:is-active={item.exactMatch
              ? $page.route.id === item.link
              : $page.route.id?.startsWith(item.link)}
          >
            {item.name}

            {#if item.icon}
              <i class="pl-2 mdi {item.icon}" />
            {/if}
          </a>
        {/each}
      </div>
    </div>
  </div>
</nav>
