document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chat-box") as HTMLDivElement;
    const userInput = document.getElementById("user-input") as HTMLTextAreaElement;
    const sendButton = document.getElementById("send-button") as HTMLButtonElement;
    const temperatureSlider = document.getElementById("temperature-slider") as HTMLInputElement;
    const temperatureValue = document.getElementById("temperature-value") as HTMLSpanElement;
    const speakButton = document.getElementById("speak-button") as HTMLButtonElement;

    // Array to store the chat history
    const chatHistory: { role: string; content: string }[] = [];

    // Update temperature value display
    temperatureSlider.addEventListener("input", () => {
        temperatureValue.textContent = temperatureSlider.value;
    });

    // Adjust the height of the textarea dynamically
    userInput.addEventListener("input", () => {
        userInput.style.height = "auto";
        userInput.style.height = `${userInput.scrollHeight}px`;
    });
    
    /**
     * @remark calls the view once the click button is sent or enter is pressed
     *         and then displays streamed response back to the user 
     */
    const sendMessage = async () => {
        const input = userInput.value;
        const temperature = parseFloat(temperatureSlider.value);
        if (!input) return;

        // Add user's input to chat history
        chatHistory.push({ role: "user", content: input });

        // Display the user's input in the chat box
        chatBox.innerHTML += `<p><strong>You:</strong> ${input}</p>`;
        userInput.value = ""; // Clear the input field
        userInput.style.height = "auto"; // Reset the height

        try {
            // Prepare the messages array with the recent chat history
            const messages = chatHistory.slice(-2048 / 2); // Assuming max tokens is 2048

            const response = await fetch("/api/chat/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ input, messages, temperature }),
            });

            if (!response.body) {
                throw new Error("No response body");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let aiResponse = "";

            // Create a paragraph element for the AI response
            const aiResponseElement = document.createElement("p");
            aiResponseElement.innerHTML = "<strong>AI:</strong> ";
            chatBox.appendChild(aiResponseElement);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                aiResponse += chunk;

                // Replace newline characters with <br> tags for proper display
                const formattedChunk = chunk.replace(/\n/g, "<br>");
                aiResponseElement.innerHTML += formattedChunk;
            }

            // Add AI's response to chat history
            chatHistory.push({ role: "assistant", content: aiResponse });
        } catch (error) {
            console.error("Error:", error);
            chatBox.innerHTML += `<p><strong>Error:</strong> ${error.message}</p>`;
        }
    };

    const speakResponse = () => {
        if (chatHistory.length === 0) return;

        const lastResponse = chatHistory.filter(message => message.role === "assistant").pop();
        if (!lastResponse) return;

        const utterance = new SpeechSynthesisUtterance(lastResponse.content);
        window.speechSynthesis.speak(utterance);
    };

    sendButton.addEventListener("click", sendMessage);
    speakButton.addEventListener("click", speakResponse);

    userInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });
});
