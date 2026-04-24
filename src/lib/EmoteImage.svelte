<script lang="ts">
  import { getBlobUrl } from './blobCache';

  let { url, alt, lazy = true } = $props<{ url: string, alt: string, lazy?: boolean }>();
  let blobUrl = $state("");
  let el = $state<HTMLDivElement>();

  $effect(() => {
    if (!lazy) {
      getBlobUrl(url).then(u => blobUrl = u);
      return;
    }
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        observer.disconnect();
        getBlobUrl(url).then(u => blobUrl = u);
      }
    }, { rootMargin: '100px' });
    observer.observe(el);
    return () => observer.disconnect();
  });
</script>

{#if blobUrl}
  <img src={blobUrl} {alt} />
{:else}
  <div class="placeholder" bind:this={el}></div>
{/if}

<style>
  img {
    height: 32px;
    width: auto;
    object-fit: contain;
  }
  .placeholder {
    width: 32px;
    height: 32px;
    background: rgba(255,255,255,0.05);
  }
</style>