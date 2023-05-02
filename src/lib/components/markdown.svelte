<script lang="ts">
  import { marked } from 'marked';

  export let content: string;
</script>

{@html marked.parse(content, {
  gfm: true,
})}
