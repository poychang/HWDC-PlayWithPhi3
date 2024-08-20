# 使用 Phi3、ONNX Runtime 和 SemanticKernel 運行 SLM

使用 [SemanticKernel](https://github.com/microsoft/onnxruntime) 和 [OnnxRuntimeGenAI] Nuget 套件，讓 .NET 開發者能開發運行 [microsoft/Phi-3-mini-4k-instruct-onnx](https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-onnx) SLM 模型的應用程式。

## 啟動方式

1. 下載 Phi-3-mini-4k-instruct-onnx 模型
```bash
git clone https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-onnx
```
2. 建置專案
```sh
dotnet build
```
3. 執行專案
```sh
dotnet run
```

## 備註

## 參考資料

* [Hugging Face - Downloading models](https://huggingface.co/docs/hub/models-downloading)
