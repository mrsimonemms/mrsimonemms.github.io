<script lang="ts">
  import { DateTime } from 'luxon';

  export let date: Date;

  export let format: Intl.DateTimeFormatOptions = DateTime.DATETIME_SHORT;
</script>

<time datetime={date.toISOString()}>
  {DateTime.fromJSDate(date).toLocaleString(format)}
</time>
