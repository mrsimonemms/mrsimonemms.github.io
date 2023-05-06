<script lang="ts">
  import type { PageData } from './$types';
  import markdown from '$lib/components/markdown';
  import PageHeader from '$lib/components/page-header.svelte';
  import { cv } from '$lib/stores/cv';
  import { profile } from '$lib/stores/profile';
  import BlogCard from '$lib/components/blog-card.svelte';
  import Gmap from '$lib/components/gmap.svelte';
  import HomepageSection from '$lib/components/homepage-section.svelte';

  export let data: PageData;

  const references = cv.references.sort((a, b) => {
    const [, aLastName] = a.name.split(' ');
    const [, bLastName] = b.name.split(' ');

    if (aLastName < bLastName) {
      return -1;
    }
    if (aLastName > bLastName) {
      return 1;
    }
    return 0;
  });

  const companies = profile.companies.sort((a, b) => {
    const { name: aName } = a;
    const { name: bName } = b;

    if (aName < bName) {
      return -1;
    }
    if (aName > bName) {
      return 1;
    }
    return 0;
  });
</script>

<PageHeader title="Software Engineer, Technical Leader, Solutions Designer" />

<HomepageSection>
  <div class="container my-5">
    <div class="columns">
      <div class="column is-one-third">
        <h3 class="is-size-3 has-text-weight-light has-text-centered">Engineering</h3>

        <p class="my-5">
          I've got a wealth of experience in engineering, both on the back-end and front-end through
          to emerging concepts such as the Internet of Things (IoT) and Serverless. Whether you're
          after someone to help plan a new project or rescue an existing project, I can help you
          achieve your aims.
        </p>

        <p class="my-5">
          Typically, I join teams for short periods, helping to clear the backlog and establish
          better processes so that the team is empowered and self-sufficient after I've left.
        </p>
      </div>

      <div class="column is-one-third">
        <h3 class="is-size-3 has-text-weight-light has-text-centered">DevOps</h3>

        <p class="my-5">
          No matter how good your software is, you'll find yourself in trouble if you can't deploy
          is quickly, easily and reliably. With my experience across the software development life
          cycle (SDLC), I can provide advice and guidance on creating a useful DevOps strategy for
          your requirements.
        </p>

        <p class="my-5">
          I look to establish repeatable processes to create disposable systems and do so at a
          sustainable cost that can be run by anyone on your software teams.
        </p>
      </div>

      <div class="column is-one-third">
        <h3 class="is-size-3 has-text-weight-light has-text-centered">Consultancy</h3>

        <p class="my-5">
          Sometimes we all need a bit of help to make sure we're on the right track or a hand to
          point us back in the right direction. I've done most roles in software and used all the
          most popular technologies, so I can utilise that experience to help make your projects
          successful.
        </p>

        <p class="my-5">
          Whether it's planning a system architecture, auditing your existing codebase, advising on
          which tech to invest in or helping you decide on the feasibility of a large upgrade, I can
          help.
        </p>
      </div>
    </div>
  </div>
</HomepageSection>

<HomepageSection title="Think I can help you?" expandOnSlot={false}>
  <div class="has-text-centered">
    <a href="/contact" class="button is-large is-info is-outlined my-5">Hire me</a>
  </div>
</HomepageSection>

<HomepageSection title="Testimonials" sectionClass="has-background-info-dark has-text-white-bis">
  <div class="columns is-multiline">
    {#each references as ref}
      <div class="column is-full">
        <div class="card">
          <div class="card-content">
            <div class="media">
              <div class="media-left">
                <a href={ref.link} target="_blank">
                  <figure class="image is-96x96">
                    <img class="is-rounded" src={ref.img} alt={ref.name} />
                  </figure>
                </a>
              </div>
              <div class="media-content">
                <p class="title is-4">{ref.name}</p>
                <p class="subtitle is-6">{ref.position}, {ref.company}</p>
              </div>
            </div>
            <div class="content">
              {@html markdown(ref.reference)}
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</HomepageSection>

<HomepageSection title="Blog">
  <div class="columns is-multiline">
    {#each data.posts as post, i}
      <div class="column is-one-third">
        <BlogCard {post} />
      </div>
    {/each}
  </div>
</HomepageSection>

<HomepageSection
  title="Some of the people I've worked with"
  sectionClass="has-background-info-dark has-text-white-bis"
>
  <div class="columns is-multiline is-mobile is-centered">
    {#each companies as company}
      <div class="column is-half-mobile is-1-tablet has-text-centered">
        <a
          href={company.url}
          target="_blank"
          class="has-tooltip-arrow has-tooltip-bottom is-flex has-tooltip-hidden-touch"
          data-tooltip={company.name}
        >
          <img class="image is-64x64 mx-auto mb-5" src={company.src} alt={company.name} />
        </a>
      </div>
    {/each}
  </div>
</HomepageSection>

<div class="location">
  <HomepageSection title="Location">
    <p>
      I work from an office in the beautiful Shropshire countryside on the outskirts of Telford. I
      also regularly commute to client's offices in Birmingham and the West Midlands and can make
      visits further afield should the need arise.
    </p>
  </HomepageSection>

  <Gmap location="{cv.basics.location.city}, {cv.basics.location.countryCode}" height="500px" />
</div>
