<script lang="ts">
  let nickname = $state("");
  let savedNickname = $state("");

  chrome.storage.sync.get('nickname', (result) => {
    if (result.nickname) {
      nickname = result.nickname as string;
      savedNickname = result.nickname as string;
    }
  });

  function save() {
    if (!nickname.trim()) return;
    chrome.storage.sync.set({ nickname: nickname.trim() });
    savedNickname = nickname.trim();
  }
</script>

<div class="container">
  <h1>7D Emotes</h1>
  <p class="current">Current nickname: <span>{savedNickname || '-'}</span></p>
  <input
    type="text"
    placeholder="Twitch nickname"
    bind:value={nickname}
    onkeydown={(e) => e.key === 'Enter' && save()}
  />
  <button onclick={save}>Save</button>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background: #0f172a; 
    color: #f8fafc;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .container {
    width: 280px;
    padding: 24px;
    background: linear-gradient(145deg, #1e293b, #0f172a);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  h1 {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    background: linear-gradient(90deg, #60a5fa, #a78bfa);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 0.5px;
    text-align: center;
  }

  input {
    padding: 10px 14px;
    background: #020617; 
    border: 1px solid #334155;
    border-radius: 8px;
    color: #e2e8f0;
    font-size: 14px;
    outline: none;
    transition: all 0.2s ease;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2); 
  }

  input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  input::placeholder {
    color: #64748b;
  }

  button {
    padding: 10px;
    background: linear-gradient(135deg, #3b82f6, #4f46e5); 
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3); 
  }

  button:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4);
    filter: brightness(1.1);
  }

  button:active {
    transform: translateY(1px);
    box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
  }

  .current {
    margin: 0;
    font-size: 13px;
    color: #94a3b8;
    text-align: center;
  }

  .current span {
    color: #60a5fa;
    font-weight: bold;
  }
</style>