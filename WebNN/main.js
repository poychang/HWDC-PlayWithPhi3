import { env, AutoTokenizer } from '@xenova/transformers';
import { LLM } from './llm.js';

const chatHistory = document.getElementById('chat-history');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

const config = {
    model: { name: "phi3", path: "microsoft/Phi-3-mini-4k-instruct-onnx-web", externaldata: true },
    use_local_model: false,
    provider: "webgpu",
    profiling: false,
    verbose: false,
    skip_special_tokens: true,
    max_tokens: 999,
};

function log(i) { console.log(i); document.getElementById('status').innerText += `${i}\n`; }

// 使用者按下送出按鈕或按下 Ctrl+Enter
async function submitRequest(e) {
    document.getElementById('chat-container').style.display = 'block';

    // 停止運行
    if (sendButton.innerHTML == "Stop") {
        llm.abort();
        return;
    }

    // 輸入空字串，表示清空歷史紀錄
    if (userInput.value.length == 0) {
        chatHistory.context = "";
        while (chatHistory.firstChild) {
            chatHistory.firstChild.remove();
        }
        return;
    }

    if (chatHistory.context === undefined) chatHistory.context = "";

    // append user message to chat history
    let userMessage = document.createElement('div');
    userMessage.className = 'text-bg-primary p-1 mb-2';
    userMessage.innerText = userInput.value;
    chatHistory.appendChild(userMessage);

    // append llm response to chat history
    let llmResponse = document.createElement('div');
    llmResponse.className = 'text-bg-success p-1 mb-2';
    llmResponse.style.minHeight = '3em';
    chatHistory.appendChild(llmResponse);

    // 將按鈕設定成 Stop 用於停止運行
    sendButton.innerHTML = "Stop";

    Query(userInput.value, (word) => { llmResponse.innerHTML = word; })
        .then(() => {
            chatHistory.context = llmResponse.innerHTML;
            sendButton.innerHTML = "Send";
        })
        .catch(error => {
            console.error(error);
            sendButton.innerHTML = "Send";
        });

    // 清空輸入框
    userInput.value = '';
}

// 使用者按下 Ctrl+Enter 則送出對話
userInput.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.key === 'Enter') submitRequest(e);
});

// setup for transformers.js tokenizer
let tokenizer;

const llm = new LLM();

function token_to_text(tokenizer, tokens, startidx) {
    const text = tokenizer.decode(tokens.slice(startidx), { skip_special_tokens: config.skip_special_tokens, });
    return text;
}

async function Query(query, callback) {
    let prompt = `<|system|>\nYou are a friendly assistant.<|end|>\n<|user|>\n${query}<|end|>\n<|assistant|>\n`;

    const { input_ids } = await tokenizer(prompt, { return_tensor: false, padding: true, truncation: true });

    llm.initilize_feed();

    const start_timer = performance.now();
    const output_index = llm.output_tokens.length + input_ids.length;
    const output_tokens = await llm.generate(
        input_ids,
        (output_tokens) => {
            if (output_tokens.length == input_ids.length + 1) {
                // time to first token
                const took = (performance.now() - start_timer) / 1000;
                log(`time to first token in ${took.toFixed(1)}sec, ${input_ids.length} tokens`);
            }
            callback(token_to_text(tokenizer, output_tokens, output_index));
        },
        { max_tokens: config.max_tokens });

    const took = (performance.now() - start_timer) / 1000;
    callback(token_to_text(tokenizer, output_tokens, output_index));
    const seqlen = output_tokens.length - output_index;
    log(`${seqlen} tokens in ${took.toFixed(1)}sec, ${(seqlen / took).toFixed(2)} tokens/sec`);
}

// 初始化，載入模型與 tokenizer
async function Init(hasFP16) {
    try {
        tokenizer = await AutoTokenizer.from_pretrained(config.model.path);

        log("Loading model...");
        await llm.load(config.model, {
            provider: config.provider,
            profiling: config.profiling,
            verbose: config.verbose,
            use_local_model: config.use_local_model,
            max_tokens: config.max_tokens,
            hasFP16: hasFP16,
        });
        log("Ready.");
    } catch (error) {
        log(error);
    }
}

// 檢查是否有 webgpu 以及 fp16
async function hasWebGPU() {
    // 0: webgpu with f16
    // 1: webgpu without f16
    // 2: no webgpu
    if (!("gpu" in navigator)) return 2;
    try {
        const adapter = await navigator.gpu.requestAdapter()
        if (adapter.features.has('shader-f16')) return 0;
        return 1;
    } catch (e) {
        return 2;
    }
}

window.onload = () => {
    hasWebGPU().then((supported) => {
        let ready = () => {
            sendButton.addEventListener('click', submitRequest);
            userInput.focus();
        };
        let hasFP16 = supported === 0;
        switch (supported) {
            case 1: //webgpu without f16
                log("Your GPU or Browser does not support webgpu with fp16, using fp32 instead.");
            case 0: // webgpu with f16
                Init(hasFP16).then(ready);
                break;
            case 2: //no webgpu
            default:
                log("Your GPU or Browser does not support webgpu");
                break;
        }
    });
}