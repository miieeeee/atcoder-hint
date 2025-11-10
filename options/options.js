// APIキーを保存する関数
function saveOptions() {
    const apiKey = document.getElementById('gemini-api-key').value;

    // chrome.storage.sync を使って保存
    // (sync は同じGoogleアカウントでログインしていれば別PCのChromeとも同期される)
    // (同期したくない場合は chrome.storage.local を使う)
    chrome.storage.local.set(
        { llmApiKey: apiKey },
        () => {
            // 保存完了後にメッセージを表示
            const status = document.getElementById('status');
            status.style.display = 'inline';

            // 2秒後にメッセージを消す
            setTimeout(() => {
                status.style.display = 'none';
            }, 2000);
        }
    );
}

// 保存された設定をページに復元する関数
function restoreOptions() {
    // chrome.storageから 'llmApiKey' を読み出す (デフォルト値は空文字)
    chrome.storage.local.get({ llmApiKey: '' }, (items) => {
        document.getElementById('gemini-api-key').value = items.llmApiKey;
    });
}

// --- イベントリスナー ---

// ページが読み込まれたら、保存された設定を復元
document.addEventListener('DOMContentLoaded', restoreOptions);

// "保存"ボタンがクリックされたら、saveOptionsを実行
document.getElementById('save-button').addEventListener('click', saveOptions);

// APIキーの表示/非表示トグル
const toggleButton = document.getElementById('toggle-visibility');
const apiKeyInput = document.getElementById('gemini-api-key');

toggleButton.addEventListener('click', () => {
    if (apiKeyInput.type === 'password') {
        apiKeyInput.type = 'text';
        toggleButton.textContent = '非表示にする';
    } else {
        apiKeyInput.type = 'password';
        toggleButton.textContent = '表示する';
    }
});