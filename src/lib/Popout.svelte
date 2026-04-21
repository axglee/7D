<script lang="ts">
  import { portal } from './portal';
  export let anchorRect: DOMRect;

  const top = anchorRect.top - 490; 
  const left = anchorRect.left - 520 + anchorRect.width;
</script>

<div use:portal class="sd-popout" style="top: {top}px; left: {left}px;">
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
</style>