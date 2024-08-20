using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Connectors.Onnx;

// 提供存放 Phi-3 的 ONNX 模型資料夾位置，該資料夾內必須要有 .onnx 檔案
var mode = "cpu";
var modelPath = mode switch
{
    "cpu" => "C:\\Users\\poypo\\Code\\onnx\\Phi-3-mini-4k-instruct-onnx\\cpu_and_mobile\\cpu-int4-rtn-block-32",
    "gpu" => "C:\\Users\\poypo\\Code\\onnx\\Phi-3-mini-4k-instruct-onnx\\cuda\\cuda-int4-rtn-block-32",
    "xpu" => "C:\\Users\\poypo\\Code\\onnx\\Phi-3-mini-4k-instruct-onnx\\directml\\directml-int4-awq-block-128",
    _ => throw new ArgumentException("Invalid mode")
};

var kernel = Kernel.CreateBuilder()
    .AddOnnxRuntimeGenAIChatCompletion(modelId: "Phi3", modelPath: modelPath)
    .Build();
var kernelArguments = new KernelArguments(new OnnxRuntimeGenAIPromptExecutionSettings()
{
    MaxTokens = 2048,
    Temperature = 0.3f,
    PastPresentShareBuffer = true
});

Console.WriteLine("Type Prompt then Press [Enter] or CTRL-C to Exit");
Console.WriteLine("");

while (true)
{
    // 設定 System Prompt 提示 AI 如何回答 User Prompt
    var systemPrompt = "You should answer the following question as concisely as possible.";

    // 取得 User Prompt
    Console.Write("User: ");
    var userPrompt = Console.ReadLine();

    // 組合 Prompt：將 System Prompt 和 User Prompt 組合在一起
    var fullPrompt = $"<|system|>{systemPrompt}<|end|><|user|>{userPrompt}<|end|><|assistant|>";

    // 產生回應
    Console.Write("Assistant: ");
    var response = kernel.InvokePromptStreamingAsync<string>(fullPrompt, kernelArguments);
    await foreach (var chatUpdate in response)
    {
        Console.Write(chatUpdate);
    }
    Console.WriteLine();
    Console.WriteLine();
}
