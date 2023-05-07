<script lang="ts">
  import DateFormat from './date-format.svelte';

  export let endDate: Date | null = null;
  export let highlights: string[] = [];
  export let link: string | null = null;
  export let position: string;
  export let place: string | null = null;
  export let skills: string[] = [];
  export let startDate: Date | null = null;
  export let summary: string | null = null;
  export let yearOnly: boolean = false;

  const format: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: yearOnly ? undefined : 'short',
  };
</script>

<div class="history-event">
  {#if startDate}
    <div class="has-text-danger is-size-5">
      <DateFormat date={startDate} {format} />
      <span class="px-2">-</span>
      {#if endDate}
        <DateFormat date={endDate} {format} />
      {:else}
        Present
      {/if}
    </div>
  {/if}

  {#if link}
    <a class="has-text-grey" href={link} target="_blank">
      <span class="has-text-black-ter has-text-weight-medium">{position}</span>
      {#if place}
        <span class="px-2">|</span>
        <span>{place}</span>
      {/if}
      <sup class="icon is-small pl-2">
        <i class="mdi mdi-open-in-new" />
      </sup>
    </a>
  {:else}
    <span class="has-text-black-ter has-text-weight-medium">{position}</span>
    {#if place}
      <span class="px-2">|</span>
      <span>{place}</span>
    {/if}
  {/if}

  {#if skills}
    <div class="tags are-medium mt-2">
      {#each skills as skill}
        <span class="tag">{skill}</span>
      {/each}
    </div>
  {/if}

  {#if summary}
    <div class="mt-2 has-text-weight-medium">{summary}</div>
  {/if}

  {#if highlights}
    <ul>
      {#each highlights as highlight}
        <li class="pl-4 pt-2">
          {highlight}
        </li>
      {/each}
    </ul>
  {/if}
</div>
