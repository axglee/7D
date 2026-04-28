<script lang="ts">
  let nickname = $state("");
  let savedNickname = $state("");
  let error = $state("");

  chrome.storage.sync.get('nickname', (result) => {
    if (result.nickname) {
      nickname = result.nickname as string;
      savedNickname = result.nickname as string;
    }
  });

  async function save() {
    const nick = nickname.trim();
    if (!nick) return;

    const res = await fetch(`https://api.ivr.fi/v2/twitch/user?login=${nick}`);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      error = 'Twitch user not found';
      return;
    }

    error = '';
    chrome.storage.sync.set({ nickname: nick });
    savedNickname = nick;
  }
</script>

<div class="container">
  <h1>7DE</h1>
  <p class="current">Current nickname: <span>{savedNickname || '-'}</span></p>
  <input
    type="text"
    placeholder="Twitch nickname"
    bind:value={nickname}
    onkeydown={(e) => e.key === 'Enter' && save()}
  />
  {#if error}
    <p class="error">{error}</p>
  {/if}
  <button onclick={save} disabled={!nickname.trim() || nickname.trim() === savedNickname}>
    Save
  </button>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background: #0f0d0a; 
    color: #fef3c7;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .container {
    width: 280px;
    padding: 24px;
    background: linear-gradient(145deg, #1e1b16, #0f0d0a);
    display: flex;
    flex-direction: column;
    gap: 16px;
    border: 1px solid rgba(255, 165, 0, 0.1);
    border-radius: 0; 
  }

h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 900;
    text-align: center;
    letter-spacing: 2px;
    
    background: linear-gradient(
      to right, 
      #ff8a00 20%, 
      #ffc107 40%, 
      #ffffff 50%, 
      #ffc107 60%, 
      #ff8a00 80%
    );
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shine 4s linear infinite;
  }

  @keyframes shine {
    0% {
      background-position: 200% center;
    }
    20% {
      background-position: 0% center;
    }
    100% {
      background-position: 0% center;
    }
  }

  input {
    padding: 10px 14px;
    background: #050402; 
    border: 1px solid #453015;
    border-radius: 4px;
    color: #ffedd5;
    font-size: 14px;
    outline: none;
    transition: all 0.2s ease;
  }

  input:focus {
    border-color: #f59e0b;
    box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
  }

  input::placeholder {
    color: #78350f;
  }

  button {
    padding: 10px;
    background: linear-gradient(135deg, #f59e0b, #d97706); 
    border: none;
    border-radius: 4px;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  button:hover:not(:disabled) {
    filter: brightness(1.1);
    box-shadow: 0 0 15px rgba(245, 158, 11, 0.4);
  }

  button:disabled {
    background: #2d2418;
    color: #574332;
    cursor: not-allowed;
  }

  .current {
    margin: 0;
    font-size: 12px;
    color: #927b6c;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .current span {
    color: #fbbf24;
    font-weight: bold;
  }

  .error {
    margin: -8px 0 0 0; 
    padding: 8px;
    background: rgba(220, 38, 38, 0.1);
    border-left: 3px solid #dc2626;
    color: #fca5a5;
    font-size: 12px;
  }
</style>