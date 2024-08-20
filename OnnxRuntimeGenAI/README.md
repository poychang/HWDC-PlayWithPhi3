# 使用 Phi3、ONNX Runtime 和 C# 運行 SLM

使用 [ONNX Runtime](https://github.com/microsoft/onnxruntime) 和 [OnnxRuntimeGenAI] Nuget 套件，讓 .NET 開發者能開發運行 [microsoft/Phi-3-mini-4k-instruct-onnx](https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-onnx) SLM 模型的應用程式。

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

關於 ONNX 的 .NET 函示庫，會有以下四個套件，分別的用途：

1. **Microsoft.ML.OnnxRuntimeGenAI**:
   - 這是 ONNX Runtime 的通用套件，包含執行 ONNX 模型所需的核心功能
   - 支援 CPU 執行，並且可以擴展支援其他硬體加速（例如 GPU）

2. **Microsoft.ML.OnnxRuntimeGenAI.Managed**:
   - 這是完全托管的版本，適用於純 .NET 環境
   - 不依賴原生程式庫，確保跨平台的一致性，適合在不需要特定硬體加速的情境下使用

3. **Microsoft.ML.OnnxRuntimeGenAI.Cuda**:
   - 這個版本專門針對使用 NVIDIA CUDA GPU 進行硬體加速
   - 適合需要高效能運算的深度學習模型，在 NVIDIA GPU 上可獲得顯著的性能提升

4. **Microsoft.ML.OnnxRuntimeGenAI.DirectML**:
   - 這個版本利用 Microsoft 的 DirectML API，專為 Windows 平台設計
   - 支援多種硬體加速裝置，包括 NVIDIA 和 AMD GPU，適用於 Windows 環境中的高效能運算需求

這些套件的主要差別在於它們針對不同的硬體加速需求和環境進行優化，選擇哪個套件取決於你的應用場景和硬體設置。一般來說，純 .NET 環境可使用 Managed 版本，如有 GPU 且需要用到 GPU 加速，則選擇 CUDA 或 DirectML 版本。

## 參考資料

* [Hugging Face - Downloading models](https://huggingface.co/docs/hub/models-downloading)
* [使用 C# 和 ONNX 來玩 Phi-3 SLM](https://blog.poychang.net/build-local-ai-chat-app-in-csharp-with-phi-3-mini-llm-and-onnx/)