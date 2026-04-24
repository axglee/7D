<script lang="ts">
  import { portal } from './portal';
  import { emoteState } from './state.svelte';
  import EmoteImage from './EmoteImage.svelte';

  let { anchorRect, close } = $props<{ anchorRect: DOMRect, close: () => void }>();

  const top = $derived(anchorRect.top - 480);
  const left = $derived(anchorRect.left - 520 + anchorRect.width);

  $effect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  let searchQuery = $state("");

  let filteredEmotes = $derived(
    emoteState.list.filter(e => 
      e.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
</script>

<div use:portal>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="sd-backdrop" onclick={close}></div>

  <div class="sd-popout" style="top: {top}px; left: {left}px;">
    <div class="sd-header">
      <div class="sd-search-container">
        <input 
          type="text" 
          id="sd-search" 
          name="sd-search" 
          placeholder="Search emotes..." 
          bind:value={searchQuery}
          autocomplete="off">
      </div>
    </div>

    <div class="sd-content">
      {#if emoteState.isLoading && emoteState.list.length === 0}
        <div style="text-align: center; padding: 16px;">Loading emotes...</div>
      {:else}
        <div class="sd-emotes-grid">
          {#each filteredEmotes as emote (emote.id)}
            <button class="sd-emote-item" title={emote.name}>
              <EmoteImage url={emote.url} alt={emote.name} lazy={searchQuery === ""} />
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .sd-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9998;
    background: transparent;
    cursor: default;
  }

  .sd-popout {
    position: fixed;
    width: 520px;
    height: 450px;
    background: var(--background-surface-high);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-sm);
    z-index: 9999;
    box-shadow: 0 8px 16px var(--shadow-high);
    display: flex;
    flex-direction: column;
  }

  .sd-search-container {
    width: 100%;
    box-sizing: border-box;
    padding: 8px; 
    border-bottom: 1px solid var(--border-subtle);
  }

  #sd-search {
    width: 100%;
    height: 32px;
    padding: 8px;
    
    background-color: var(--input-background-default, #1e1f22);
    color: var(--text-normal, #dbdee1);
    
    border: 1px solid var(--input-border-default, transparent);
    border-radius: var(--radius-xs, 4px);
    
    font-family: inherit;
    font-size: 14px;
    line-height: 32px;
    
    outline: none;
    box-sizing: border-box;
    
    transition: border-color .1s ease;
  }

  #sd-search:hover {
    border-color: var(--input-border-hover, #000);
  }

  #sd-search:focus {
    border-color: var(--blue-345, #00a8fc);
  }

  #sd-search::placeholder {
    color: var(--text-muted, #80848e);
    font-size: 14px;
  }

  .sd-content {
    overflow-y: auto;
    flex: 1;
    padding: 4px;
    scrollbar-width: thin;
    scrollbar-color: var(--scrollbar-thin-thumb) var(--scrollbar-thin-track);
  }

  .sd-content::-webkit-scrollbar {
    width: 8px;
  }

  .sd-content::-webkit-scrollbar-track {
    background-color: var(--scrollbar-thin-track);
  }
  .sd-content::-webkit-scrollbar-thumb {
    background-color: var(--scrollbar-thin-thumb);
  }

  .sd-emotes-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
    justify-content: center;
  }

  .sd-emote-item {
    height: 44px;
    min-width: 44px;
    width: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    padding: 2px;
    transition: background 0.1s ease;
  }

  .sd-emote-item:hover {
    background-color: var(--interactive-background-selected);
  }
</style>