<script>
  import PageHeader from '$lib/components/page-header.svelte';
  import PageTitle from '$lib/components/page-title.svelte';

  import { profile } from '$lib/stores/profile';
</script>

<PageHeader title="Contact me" />

<div class="container my-5">
  <div class="content">
    <PageTitle>Contact me</PageTitle>

    <p>So, you think I can help you? Great news.</p>
    <p>
      In the first instance, it's probably a good idea to give me an idea of what you're looking for
      help with and how you think I might be able to do that. Once we're both happy and in agreement
      on everything, then we can begin working together.
    </p>
    <p>
      I'm happy for you to either set up a phone call with me or to drop me an email, it's your
      choice - the reason I prefer to plan my phone calls is to avoid context switching in my daily
      work.
    </p>
  </div>

  <div class="columns has-text-centered">
    <div class="column">
      <a href={profile.calendlyUrl} target="_blank" class="button is-info is-outlined my-5">
        Set up a phone call
      </a>
    </div>
    <div class="column">
      <p>My email:</p>
      <p class="is-size-4">simon@simonemms.com</p>
    </div>
  </div>
</div>
