using Microsoft.ML.OnnxRuntimeGenAI;
using System.Diagnostics;

// 提供存放 Phi-3 的 ONNX 模型資料夾位置，該資料夾內必須要有 .onnx 檔案
var mode = "cpu";
var modelPath = mode switch
{
    "cpu" => "C:\\Users\\poypo\\Code\\onnx\\Phi-3-mini-4k-instruct-onnx\\cpu_and_mobile\\cpu-int4-rtn-block-32",
    "gpu" => "C:\\Users\\poypo\\Code\\onnx\\Phi-3-mini-4k-instruct-onnx\\cuda\\cuda-int4-rtn-block-32",
    "xpu" => "C:\\Users\\poypo\\Code\\onnx\\Phi-3-mini-4k-instruct-onnx\\directml\\directml-int4-awq-block-128",
    _ => throw new ArgumentException("Invalid mode")
};

// 載入模型和 Tokenizer
var model = new Model(modelPath);
var tokenizer = new Tokenizer(model);

// 設定 System Prompt 提示 AI 如何回答 User Prompt
var systemPrompt = "You should answer the following question as concisely as possible.";

Console.WriteLine("Type Prompt then Press [Enter] or CTRL-C to Exit");
Console.WriteLine("");

// 模擬使用者和 AI　一問一答
while (true)
{
    // 取得 User Prompt
    Console.Write("User: ");
    var userPrompt = Console.ReadLine();

    // 組合 Prompt：將 System Prompt 和 User Prompt 組合在一起
    var fullPrompt = $"<|system|>{systemPrompt}<|end|><|user|>{userPrompt}<|end|><|assistant|>";

    // 將 Prompt 編碼成 Token
    var tokens = tokenizer.Encode(fullPrompt);
    Debug.WriteLine($"Prompt: {tokens}");

    // 設定生成器參數，完整參數列表請參考： https://onnxruntime.ai/docs/genai/reference/config.html
    var generatorParams = new GeneratorParams(model);
    generatorParams.SetSearchOption("max_length", 2048);
    generatorParams.SetSearchOption("temperature", 0.3);
    generatorParams.SetSearchOption("past_present_share_buffer", true);  // 使用 DirectML 必須設定為 true
    generatorParams.SetInputSequences(tokens);

    // 產生回應
    Console.Write("Assistant: ");
    var generator = new Generator(model, generatorParams);
    // 將生成的每個 Token 逐一解碼成文字並輸出回應
    while (!generator.IsDone())
    {
        generator.ComputeLogits();
        generator.GenerateNextToken();
        var outputTokens = generator.GetSequence(0);
        var newToken = outputTokens.Slice(outputTokens.Length - 1, 1);
        var output = tokenizer.Decode(newToken);
        Console.Write($"{output}");
    }
    Console.WriteLine();
    Console.WriteLine();
}