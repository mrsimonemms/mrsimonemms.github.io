<script lang="ts">
  export let location: string;
  export let height: string = '100%';
  export let showSatellite: boolean = false;
  export let width: string = '100%';
  export let zoom: number = 9;

  const queryParams = new URLSearchParams({
    q: location,
    t: showSatellite ? 'k' : '',
    z: `${zoom}`,
    ie: 'UTF8',
    output: 'embed',
  });

  const url = `https://maps.google.com/maps?${queryParams.toString()}`;
</script>

<iframe
  class="is-block"
  id="mapcanvas"
  title="Map"
  {height}
  {width}
  frameborder="0"
  scrolling="no"
  marginheight="0"
  marginwidth="0"
  src={url}
/>
