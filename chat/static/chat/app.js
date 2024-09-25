var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
document.addEventListener("DOMContentLoaded", function () {
    var chatBox = document.getElementById("chat-box");
    var userInput = document.getElementById("user-input");
    var sendButton = document.getElementById("send-button");
    var temperatureSlider = document.getElementById("temperature-slider");
    var temperatureValue = document.getElementById("temperature-value");
    var speakButton = document.getElementById("speak-button");
    // Array to store the chat history
    var chatHistory = [];
    // Update temperature value display
    temperatureSlider.addEventListener("input", function () {
        temperatureValue.textContent = temperatureSlider.value;
    });
    // Adjust the height of the textarea dynamically
    userInput.addEventListener("input", function () {
        userInput.style.height = "auto";
        userInput.style.height = "".concat(userInput.scrollHeight, "px");
    });
    /**
     * @remark calls the view once the click button is sent or enter is pressed
     *         and then displays streamed response back to the user
     */
    var sendMessage = function () { return __awaiter(_this, void 0, void 0, function () {
        var input, temperature, messages, response, reader, decoder, aiResponse, aiResponseElement, _a, done, value, chunk, formattedChunk, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    input = userInput.value;
                    temperature = parseFloat(temperatureSlider.value);
                    if (!input)
                        return [2 /*return*/];
                    // Add user's input to chat history
                    chatHistory.push({ role: "user", content: input });
                    // Display the user's input in the chat box
                    chatBox.innerHTML += "<p><strong>You:</strong> ".concat(input, "</p>");
                    userInput.value = ""; // Clear the input field
                    userInput.style.height = "auto"; // Reset the height
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, , 7]);
                    messages = chatHistory.slice(-2048 / 2);
                    return [4 /*yield*/, fetch("/api/chat/", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ input: input, messages: messages, temperature: temperature }),
                        })];
                case 2:
                    response = _b.sent();
                    if (!response.body) {
                        throw new Error("No response body");
                    }
                    reader = response.body.getReader();
                    decoder = new TextDecoder("utf-8");
                    aiResponse = "";
                    aiResponseElement = document.createElement("p");
                    aiResponseElement.innerHTML = "<strong>AI:</strong> ";
                    chatBox.appendChild(aiResponseElement);
                    _b.label = 3;
                case 3:
                    if (!true) return [3 /*break*/, 5];
                    return [4 /*yield*/, reader.read()];
                case 4:
                    _a = _b.sent(), done = _a.done, value = _a.value;
                    if (done)
                        return [3 /*break*/, 5];
                    chunk = decoder.decode(value, { stream: true });
                    aiResponse += chunk;
                    formattedChunk = chunk.replace(/\n/g, "<br>");
                    aiResponseElement.innerHTML += formattedChunk;
                    return [3 /*break*/, 3];
                case 5:
                    // Add AI's response to chat history
                    chatHistory.push({ role: "assistant", content: aiResponse });
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _b.sent();
                    console.error("Error:", error_1);
                    chatBox.innerHTML += "<p><strong>Error:</strong> ".concat(error_1.message, "</p>");
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var speakResponse = function () {
        if (chatHistory.length === 0)
            return;
        var lastResponse = chatHistory.filter(function (message) { return message.role === "assistant"; }).pop();
        if (!lastResponse)
            return;
        var utterance = new SpeechSynthesisUtterance(lastResponse.content);
        window.speechSynthesis.speak(utterance);
    };
    sendButton.addEventListener("click", sendMessage);
    speakButton.addEventListener("click", speakResponse);
    userInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });
});
