<script lang="ts">
  import { portal } from './portal';
  export let anchorRect: DOMRect;

  const top = anchorRect.top - 490; 
  const left = anchorRect.left - 520 + anchorRect.width;
</script>

<div use:portal class="sd-popout" style="top: {top}px; left: {left}px;">
  <div class="sd-search-container">
    <input type="text" id="sd-search" name="sd-search" placeholder="Search...">
  </div>
</div>

<style>
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
    padding: 8px;
  }

  .sd-search-container {
    width: 100%;
    box-sizing: border-box;
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