<script lang="ts">
  import { portal } from "./portal";
  import { emoteState } from "./state.svelte";
  import EmoteImage from "./EmoteImage.svelte";
  import { searchGlobalEmotes } from "./globalEmotes";
  import { type CompactEmote } from "./emotes";

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

  function send7DEmote(text: string) {
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
    send7DEmote(`[${emote.name}](${url})`);
    close();
  }

  let selectedSize = $state(1);
  const sizes = [1, 2, 3, 4];

  chrome.storage.sync.get("size", (result) => {
    if (result.size) selectedSize = result.size as number;
  });

  let globalEmotes = $state<CompactEmote[]>([]);
  let globalLoading = $state(false);

  async function loadGlobalEmotes() {
    globalLoading = true;
    globalEmotes = await searchGlobalEmotes();
    globalLoading = false;
  }

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
</script>

<div use:portal>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="sd-backdrop" onclick={close}></div>

  <div class="sd-popout" style="top: {top}px; left: {left}px;">
    <div class="sd-header">
      <div class="sd-tabs">
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
      <div class="sd-search-container">
        <input
          type="text"
          id="sd-search"
          name="sd-search"
          placeholder={activeTab === "global" ? "Search 7TV..." : "Search emotes..."}
          bind:value={searchQuery}
          onkeydown={(e) => e.key === "Enter" && activeTab === "global" && searchGlobal()}
          autocomplete="off"
        />

        {#if activeTab === "global"}
          <div class="sd-search-btn-wrapper">
            <button
              class="sd-search-btn"
              onmousedown={(e) => { e.preventDefault(); searchGlobal(); }}
            >Search</button>
          </div>
        {/if}

        <div class="sd-size-wrapper">
          <div class="sd-size-switcher">
            <div class="sd-size-indicator" style="left: {(selectedSize - 1) * 25}%"></div>
            {#each sizes as size}
              <button
                class="sd-size-option"
                class:active={selectedSize === size}
                onmousedown={(e) => { e.preventDefault(); selectedSize = size; chrome.storage.sync.set({ size }); }}
              >{size}x</button>
            {/each}
          </div>
        </div>
      </div>
    </div>

    <div class="sd-content">
      {#if emoteState.isLoading && emoteState.list.length === 0}
        <div style="text-align: center; padding: 16px; color: var(--text-muted);">Loading emotes...</div>
      {:else}
        <div class="sd-emotes-grid">
          {#if activeTab === "local"}
            {#each filteredEmotes as emote (emote.id)}
              <button
                class="sd-emote-item"
                title={emote.name}
                onmousedown={(e) => {
                  e.preventDefault();
                  onEmoteClick(emote);
                }}
              >
                <EmoteImage
                  url={emote.url}
                  alt={emote.name}
                  lazy={searchQuery === ""}
                />
              </button>
            {:else}
              <div style="text-align: center; padding: 16px; color: var(--text-muted);">No emotes found :(</div>
            {/each}
          {:else if globalLoading}
            <div style="text-align: center; padding: 16px; color: var(--text-muted);">Loading...</div>
          {:else}
            {#each globalEmotes as emote (emote.id)}
              <button
                class="sd-emote-item"
                title={emote.name}
                onmousedown={(e) => {
                  e.preventDefault();
                  onEmoteClick(emote);
                }}
              >
                <EmoteImage url={emote.url} alt={emote.name} lazy={false} />
              </button>
            {:else}
              <div
                style="text-align: center; padding: 16px; color: var(--text-muted);">No emotes found :(</div>
            {/each}
          {/if}
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

  .sd-search-container {    display: flex;
    align-items: stretch;
    gap: 8px;
    width: 100%;
    box-sizing: border-box;
    padding: 8px;
    border-bottom: 1px solid var(--border-subtle);
    height: 48px;
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

    transition: border-color 0.1s ease;
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

  .sd-size-switcher {
    position: relative;
    display: flex;
    background: var(--background-secondary);
    border-radius: 6px;
    padding: 2px;
    flex-shrink: 0;
  }

  .sd-size-indicator {
    position: absolute;
    top: 2px;
    bottom: 2px;
    width: 25%;
    background: var(--control-primary-background-default);
    border-radius: 4px;
    transition: left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .sd-size-option {
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

  .sd-size-option.active {
    color: var(--text-strong);
  }

  .sd-tabs {
    display: flex;
    gap: 18px;
    padding: 6px;
    border-bottom: 1px solid var(--border-subtle);
    justify-content: center;
  }

  .sd-tabs button {
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

  .sd-tabs button:hover {
    color: var(--text-strong);
  }

  .sd-tabs button.active {
    color: var(--text-strong);
    cursor: default;
  }

  .sd-tabs button::after {
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

  .sd-tabs button.active::after {
    transform: scaleX(1);
  }

  .sd-search-btn-wrapper {
    display: flex;
    align-items: stretch;
    padding-right: 8px;
    flex-shrink: 0;
  }

  .sd-search-btn {
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

  .sd-search-btn:hover {
    background-color: var(--control-primary-background-hover);
  }

  .sd-search-btn:active {
    background-color: var(--control-primary-background-active);
  }

  .sd-size-wrapper {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
</style>