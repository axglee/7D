<script lang="ts">
  import Popout from './Popout.svelte';
  let isOpen = false;
  let buttonElement: HTMLButtonElement;
  let rect: DOMRect;

  function toggleMenu() {
    rect = buttonElement.getBoundingClientRect();
    isOpen = !isOpen;
  }
</script>

<button 
  bind:this={buttonElement} 
  class="sd-button" 
  on:click={toggleMenu}
>
  <span class="sd-text">7D</span>
</button>

{#if isOpen && rect}
  <Popout anchorRect={rect} close={() => (isOpen = false)} />
{/if}

<style>
  .sd-button {
    color: var(--background-gradient-highest, var(--chat-background-default));
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: none;
    padding: 0;
    margin: 0 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background-color: transparent;
    overflow: visible;
  }

  .sd-button::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: var(--interactive-text-default);
    border-radius: 50%;
    z-index: 1; 
    transition: transform 0.15s ease, background-color 0.15s ease;
  }

  .sd-text {
    position: relative;
    z-index: 2;
    pointer-events: none;
    font-weight: 800;
  }

  .sd-button:hover::before {
    transform: scale(1.1);
    background-color: var(--interactive-text-hover);
  }
  </style>