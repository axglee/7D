<script lang="ts">
  import { portal } from "./portal";
  import { emoteState } from "./state.svelte";
  import EmoteImage from "./EmoteImage.svelte";
  import { searchGlobalEmotes } from "./globalEmotes";
  import { type CompactEmote } from "./emotes";
  import { storage } from './storage'

  let { anchorRect, close } = $props<{ anchorRect: DOMRect; close: () => void; }>();

  const top = $derived(anchorRect.top - 480);
  const left = $derived(anchorRect.left - 520 + anchorRect.width);

  $effect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  let activeTab = $state("local");
  let searchQuery = $state("");

  let filteredEmotes = $derived(
    emoteState.list.filter((e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );

  function send7deEmote(text: string) {
    const input = document.querySelector(
      'div[data-slate-editor="true"]',
    ) as HTMLElement;
    if (!input) return;
    input.focus();
    input.dispatchEvent(
      new InputEvent("beforeinput", {
        inputType: "insertText",
        data: text,
        bubbles: true,
        cancelable: true,
      }),
    );
    setTimeout(() => {
      input.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Enter",
          code: "Enter",
          keyCode: 13,
          which: 13,
          bubbles: true,
          cancelable: true,
        }),
      );
    }, 100);
  }

  function onEmoteClick(emote: { name: string; url: string }) {
    const url = emote.url.replace("/1x.", `/${selectedSize}x.`);
    send7deEmote(`[${emote.name}](${url})`);
    close();
  }

  let selectedSize = $state(1);
  const sizes = [1, 2, 3, 4];

  storage.get("size", (result) => {
    if (result) selectedSize = result
  })


  let globalEmotes = $state<CompactEmote[]>([]);
  let globalLoading = $state(false);

  function switchTab(tab: string) {
    activeTab = tab;
    searchQuery = "";
    if (tab === "global" && globalEmotes.length === 0) {
      loadGlobalEmotes();
    }
  }

  async function searchGlobal() {
    globalLoading = true;
    globalEmotes = await searchGlobalEmotes(searchQuery);
    globalLoading = false;
  }

  let globalPage = $state(1);
  let globalHasMore = $state(true);
  let globalLoadingMore = $state(false);
  let sentinelEl = $state<HTMLDivElement>();

  async function loadGlobalEmotes() {
    globalLoading = true;
    globalPage = 1;
    globalEmotes = await searchGlobalEmotes(searchQuery, 1);
    globalHasMore = globalEmotes.length === 50;
    globalLoading = false;
  }

  async function loadMore() {
    if (globalLoadingMore || !globalHasMore) return;
    globalLoadingMore = true;
    const next = await searchGlobalEmotes(searchQuery, globalPage + 1);
    globalEmotes = [...globalEmotes, ...next];
    globalPage += 1;
    globalHasMore = next.length === 50;
    globalLoadingMore = false;
  }

  $effect(() => {
    if (!sentinelEl) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadMore();
    }, { rootMargin: '100px' });
    observer.observe(sentinelEl);
    return () => observer.disconnect();
  });
</script>

<div use:portal>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="sde-backdrop" onclick={close}></div>

  <div class="sde-popout" style="top: {top}px; left: {left}px;">
    <div class="sde-header">
      <div class="sde-tabs">
        <button
          class:active={activeTab === "local"}
          onmousedown={(e) => {
            e.preventDefault();
            switchTab("local");
          }}>Local</button
        >
        <button
          class:active={activeTab === "global"}
          onmousedown={(e) => {
            e.preventDefault();
            switchTab("global");
          }}>Global</button
        >
      </div>
      <div class="sde-search-container">
        <input
          type="text"
          id="sde-search"
          name="sde-search"
          placeholder={activeTab === "global" ? "Search 7TV..." : "Search emotes..."}
          bind:value={searchQuery}
          onkeydown={(e) => e.key === "Enter" && activeTab === "global" && searchGlobal()}
          autocomplete="off"
        />

        {#if activeTab === "global"}
          <div class="sde-search-btn-wrapper">
            <button
              class="sde-search-btn"
              onmousedown={(e) => { e.preventDefault(); searchGlobal(); }}
            >Search</button>
          </div>
        {/if}

        <div class="sde-size-wrapper">
          <div class="sde-size-switcher">
            <div class="sde-size-indicator" style="left: {(selectedSize - 1) * 25}%"></div>
            {#each sizes as size}
              <button
                class="sde-size-option"
                class:active={selectedSize === size}
                onmousedown={(e) => { e.preventDefault(); selectedSize = size; storage.set("size", size); }}
              >{size}x</button>
            {/each}
          </div>
        </div>
      </div>
    </div>

    <div class="sde-content">
      {#if emoteState.isLoading && emoteState.list.length === 0}
        <div style="text-align: center; padding: 16px; color: var(--text-muted);">Loading emotes...</div>
      {:else}
        <div class="sde-emotes-grid">
          {#if activeTab === "local"}
            {#each filteredEmotes as emote (emote.id)}
              <button class="sde-emote-item" title={emote.name} onmousedown={(e) => { e.preventDefault(); onEmoteClick(emote); }}>
                <EmoteImage url={emote.url} alt={emote.name} lazy={searchQuery === ""} />
              </button>
            {:else}
              <div style="text-align: center; padding: 16px; color: var(--text-muted);">No emotes found :(</div>
            {/each}
          {:else if globalLoading}
            <div style="text-align: center; padding: 16px; color: var(--text-muted);">Loading...</div>
          {:else}
            {#each globalEmotes as emote (emote.id)}
              <button class="sde-emote-item" title={emote.name} onmousedown={(e) => { e.preventDefault(); onEmoteClick(emote); }}>
                <EmoteImage url={emote.url} alt={emote.name} lazy={false} />
              </button>
            {:else}
              <div style="text-align: center; padding: 16px; color: var(--text-muted);">No emotes found :(</div>
            {/each}
            {#if globalHasMore}
              <div bind:this={sentinelEl} style="width: 100%; height: 1px;"></div>
            {/if}
            {#if globalLoadingMore}
              <div style="text-align: center; padding: 8px; color: var(--text-muted); width: 100%;">Loading...</div>
            {/if}
          {/if}
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .sde-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9998;
    background: transparent;
    cursor: default;
  }

  .sde-popout {
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

  .sde-search-container {    display: flex;
    align-items: stretch;
    gap: 8px;
    width: 100%;
    box-sizing: border-box;
    padding: 8px;
    border-bottom: 1px solid var(--border-subtle);
    height: 48px;
  }

  #sde-search {
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

    transition: border-color 0.1s ease;
  }

  #sde-search:hover {
    border-color: var(--input-border-hover, #000);
  }

  #sde-search:focus {
    border-color: var(--blue-345, #00a8fc);
  }

  #sde-search::placeholder {
    color: var(--text-muted, #80848e);
    font-size: 14px;
  }

  .sde-content {
    overflow-y: auto;
    flex: 1;
    padding: 4px;
    scrollbar-width: thin;
    scrollbar-color: var(--scrollbar-thin-thumb) var(--scrollbar-thin-track);
  }

  .sde-content::-webkit-scrollbar {
    width: 8px;
  }

  .sde-content::-webkit-scrollbar-track {
    background-color: var(--scrollbar-thin-track);
  }
  .sde-content::-webkit-scrollbar-thumb {
    background-color: var(--scrollbar-thin-thumb);
  }

  .sde-emotes-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
    justify-content: center;
  }

  .sde-emote-item {
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

  .sde-emote-item:hover {
    background-color: var(--interactive-background-selected);
  }

  .sde-size-switcher {
    position: relative;
    display: flex;
    background: var(--background-secondary);
    border-radius: 6px;
    padding: 2px;
    flex-shrink: 0;
  }

  .sde-size-indicator {
    position: absolute;
    top: 2px;
    bottom: 2px;
    width: 25%;
    background: var(--control-primary-background-default);
    border-radius: 4px;
    transition: left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .sde-size-option {
    position: relative;
    z-index: 1;
    width: 36px;
    padding: 4px 0;
    background: none;
    border: none;
    border-radius: 4px;
    color: var(--text-muted);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s;
  }

  .sde-size-option.active {
    color: var(--text-strong);
  }

  .sde-tabs {
    display: flex;
    gap: 18px;
    padding: 6px;
    border-bottom: 1px solid var(--border-subtle);
    justify-content: center;
  }

  .sde-tabs button {
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 14px;
    cursor: pointer;
    padding: 6px 0;
    position: relative;
    transition: color 0.1s ease;
    font-weight: bold;
  }

  .sde-tabs button:hover {
    color: var(--text-strong);
  }

  .sde-tabs button.active {
    color: var(--text-strong);
    cursor: default;
  }

  .sde-tabs button::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: var(--text-strong);
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .sde-tabs button.active::after {
    transform: scaleX(1);
  }

  .sde-search-btn-wrapper {
    display: flex;
    align-items: stretch;
    padding-right: 8px;
    flex-shrink: 0;
  }

  .sde-search-btn {
    padding: 0 10px;
    background: var(--control-primary-background-default);
    border: none;
    border-radius: 4px;
    color: var(--text-strong);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: filter 0.1s ease;
  }

  .sde-search-btn:hover {
    background-color: var(--control-primary-background-hover);
  }

  .sde-search-btn:active {
    background-color: var(--control-primary-background-active);
  }

  .sde-size-wrapper {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
</style>