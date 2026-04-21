<script lang="ts">
  import { portal } from './portal';
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
</script>

<div use:portal>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="sd-backdrop" onclick={close}></div>

  <div class="sd-popout" style="top: {top}px; left: {left}px;">
    <div class="sd-search-container">
      <input type="text" id="sd-search" name="sd-search" placeholder="Search...">
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
    z-index: 9999;
    width: 520px;
    height: 480px;
    background: var(--background-floating, #2b2d31);
    border-radius: 8px;
    box-shadow: var(--elevation-high, 0 8px 16px rgba(0,0,0,0.24));
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
</style>