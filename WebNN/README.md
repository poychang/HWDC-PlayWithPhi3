# 使用 Phi3、ONNX Runtime Web 和 WebGPU 在瀏覽器中運行 SLM

使用 [ONNX Runtime Web](https://github.com/microsoft/onnxruntime) 和 WebGPU 在瀏覽器中運行 [microsoft/Phi-3-mini-4k-instruct-onnx-web](https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-onnx-web) SLM 模型。

這個範例直接使用 onnxruntime-web API。ONNX Runtime Web 一直在為像 [transformers.js](https://github.com/xenova/transformers.js) 這樣的高級框架提供支持。

## 啟動方式

先決條件，請確保您的機器上已安裝 [Node.js](https://nodejs.org/)。

步驟：

1. 安裝所需的相依 npm 套件:
```sh
npm install
```
2. 建置專案，建置後的檔案會輸出到 ***dist*** 資料夾中
```sh
npm run build
```
3. 運行專案並啟動開發用的 Web Server
```sh
npm run dev
```
4. 使用瀏覽器開啟 http://localhost:8080/

### Phi3 ONNX 模型

本示例中使用的模型託管在 [Hugging Face](https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-onnx-web) 上。它是針對 Web 優化的 ONNX 版本，與 CUDA 或 CPU 的 ONNX 模型略有不同：

1. 模型輸出 'logits' 保持為 float32 (即使對於 float16 模型)，因為 Javascript 不支持 float16。
2. 我們的 WebGPU 實現使用自定義的多頭注意力運算符，而不是群查詢注意力。
3. Phi3 大於 2GB，我們需要使用外部數據文件。為了保持它們在瀏覽器中可緩存， model.onnx 和 model.onnx.data 都保持在 2GB 以下。

如果您想優化您的微調 pytorch Phi-3-min 模型，您可以使用 [Olive](https://github.com/microsoft/Olive/)，它支持浮點數據類型轉換和 [ONNX genai 模型構建工具包](https://github.com/microsoft/onnxruntime-genai/tree/main/src/python/py/models)。

可以從[這裡](https://github.com/microsoft/Olive/tree/main/examples/phi3)找到如何使用 Olive 為 ONNX Runtime Web 優化 Phi-3-min 模型的範例。

## 備註

WebNN API 是一個 W3C 候選推薦版本，處於開發人員預覽版早期階段，你可能需要手動為瀏覽器啟用 WebNN API 的功能。

以 Microsoft Edge 為例，在網址列中輸入 `edge://flags`，搜尋 `WebNN API` 點選該選項的下拉選單，並設定成 `Enabled` 即可。

## 參考資料

- [WebNN API](https://webmachinelearning.github.io/)
- [Microsoft Learn - WebNN 概觀](https://learn.microsoft.com/zh-tw/windows/ai/directml/webnn-overview)
- [microsoft/onnxruntime-inference-examples](https://github.com/microsoft/onnxruntime-inference-examples)
