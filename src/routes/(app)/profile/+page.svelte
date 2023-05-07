<script lang="ts">
  import BlogCard from '$lib/components/blog-card.svelte';
  import HistoryEvent from '$lib/components/history-event.svelte';
  import PageHeader from '$lib/components/page-header.svelte';
  import PageTitle from '$lib/components/page-title.svelte';
  import ProfileCard from '$lib/components/profile-card.svelte';

  import { cv } from '$lib/stores/cv';

  interface IContent {
    icon: string;
    link: string;
    content: string;
  }

  const contact: IContent[] = [
    {
      icon: 'phone',
      link: `tel:${cv.basics.phone}`,
      content: cv.basics.phone,
    },
    {
      icon: 'email',
      link: `mailto:${cv.basics.email}`,
      content: cv.basics.email,
    },
    {
      icon: 'map-marker',
      link: `https://www.google.com/maps/place/${cv.basics.location.city}, ${cv.basics.location.countryCode}`,
      content: `${cv.basics.location.city}, ${cv.basics.location.countryCode}`,
    },
    ...cv.basics.profiles.map(
      (item): IContent => ({
        icon: item.network.toLowerCase(),
        link: item.url,
        content: item.username,
      }),
    ),
  ];
</script>

<PageHeader title="Profile" />

<div class="container my-5">
  <div class="content">
    <PageTitle>Profile</PageTitle>
  </div>

  <div class="columns">
    <div class="column is-4">
      <ProfileCard title="Contact">
        {#each contact as item}
          <div class="mb-5">
            <a class="has-text-dark" href={item.link}>
              <span class="icon is-medium has-text-danger">
                <i class="mdi mdi-{item.icon} mdi-24px" />
              </span>
              {item.content}
            </a>
          </div>
        {/each}
      </ProfileCard>

      <ProfileCard title="Skills">
        <div class="columns is-multiline">
          {#each cv.skills as item, i}
            {#if i > 0}
              <div class="column is-full">
                <hr />
              </div>
            {/if}

            <div class="column is-full">
              <p class="subtitle is-6 has-text-danger">
                {item.name}
              </p>
            </div>

            {#each item.keywords as key}
              <div class="column is-half">
                {key}
              </div>
            {/each}
          {/each}
        </div>
      </ProfileCard>

      <ProfileCard title="Education">
        {#each cv.education as item}
          <HistoryEvent
            position={item.area}
            place={item.institution}
            startDate={item.startDate}
            endDate={item.endDate}
            yearOnly
          />
        {/each}
      </ProfileCard>

      <ProfileCard title="Interests">
        <div class="columns is-multiline">
          {#each cv.interests as item}
            <div class="column is-half">
              {item.name}
            </div>
          {/each}
        </div>
      </ProfileCard>
    </div>

    <div class="column is-8">
      <ProfileCard title="Profile">{cv.basics.summary}</ProfileCard>

      <ProfileCard title="Projects">
        {#each cv.projects as project, i}
          {#if i > 0}
            <hr />
          {/if}

          <HistoryEvent
            position={project.name}
            place={project.publisher}
            link={project.website}
            summary={project.summary}
            highlights={project.highlights}
            skills={project.skills}
          />
        {/each}
      </ProfileCard>

      <ProfileCard title="Work Experience">
        {#each cv.work as work, i}
          {#if i > 0}
            <hr />
          {/if}

          <HistoryEvent
            position={work.position}
            place={work.company}
            link={work.website}
            startDate={work.startDate}
            endDate={work.endDate}
            summary={work.summary}
            highlights={work.highlights}
            skills={work.skills}
          />
        {/each}
      </ProfileCard>
    </div>
  </div>
</div>
