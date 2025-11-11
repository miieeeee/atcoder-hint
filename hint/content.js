import { hint_schema } from "./type";
import { chat_completion } from "../utils/gemini";
import { get_all_editorial_link, get_editorial_content, get_problem_statement } from "../utils/scraper";


const editorial_list_url = location.href.endsWith("editorial") ? location.href : location.href + "/editorial";
const problem_url = location.href.endsWith("editorial") ? location.href.substring(0, location.href.length - "editorial".length) : location.href;

function load_prompt(problem, editorial) {
    const prompt = `
    # 競技プログラミングの問題に対するヒントの作成依頼
    ## 概要
    以下で競技プログラミングの問題と、その解説を与えるので、それらを元にヒントを作成してください。
    ヒントは段階的に4から8個作り、各ヒントは答えの核心は付かないあくまでも考察の補助となるようなもの、また、その人の実力が上がるようなものにしてください。
    ## 問題
    ${problem}
    ## 解説
    ${editorial}
    `

    return prompt;
}

async function generate_hints() {
    const all_editorial_url = await get_all_editorial_link(editorial_list_url)
    const all_editorial = await Promise.all(
        all_editorial_url.map(url => get_editorial_content(url))
    );
    const problem_statement = await get_problem_statement(problem_url);
    const prompt = load_prompt(problem_statement, all_editorial[0]);

    const hints = await chat_completion(prompt, hint_schema);

    return hint_schema.parse(JSON.parse(hints));
}

function embed_hints(hints) {
    const targetDiv = document.getElementById('task-statement');

    if (targetDiv) {
        // DocumentFragment: 複数の要素をまとめてDOMに追加するための効率的な方法
        const fragment = document.createDocumentFragment();

        hints.forEach((hintObject, index) => {
            const details = document.createElement('details');

            const summary = document.createElement('summary');
            summary.textContent = `ヒント ${index + 1} を見る`;

            const content = document.createElement('p');

            content.textContent = hintObject.content;

            content.style.margin = "0.5em 0 0 1em";

            details.appendChild(summary);
            details.appendChild(content);

            details.classList.add('custom-hint-details');

            fragment.appendChild(details);
        });

        targetDiv.prepend(fragment);

        console.log('ヒントの挿入が完了しました。');
    } else {
        console.log('ターゲット要素 (div.task-statements) が見つかりませんでした。');
    }
}


async function handleGenerateClick(event) {
    const button = event.target;

    try {
        button.disabled = true;
        button.textContent = "ヒントを生成中...";

        const hints_array = await generate_hints(); // ここで配列が返る
        embed_hints(hints_array);

        button.remove();

    } catch (error) {
        console.error("ヒントの生成に失敗しました:", error);
        button.disabled = false;
        button.textContent = "ヒントを生成 (再試行)";
    }
}

function setupButton() {
    const targetDiv = document.getElementById('task-statement');

    if (targetDiv) {
        // 1. ボタンを作成
        const hintButton = document.createElement('button');
        hintButton.textContent = "AIによるヒントを生成する";
        hintButton.id = "ai-hint-generator-button";

        // (任意) スタイルを適用
        hintButton.style.padding = "8px 12px";
        hintButton.style.margin = "10px 0";
        hintButton.style.cursor = "pointer";
        hintButton.style.display = "block"; // 他の要素と並ばないように

        // 2. クリックイベントリスナーを設定
        hintButton.addEventListener('click', handleGenerateClick);

        // 3. ターゲットの先頭にボタンを挿入
        targetDiv.prepend(hintButton);

    } else {
        console.log("ボタン設置場所 (div#task-statement) が見つかりませんでした。");
    }
}

setupButton();