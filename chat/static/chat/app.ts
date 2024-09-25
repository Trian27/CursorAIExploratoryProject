document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chat-box") as HTMLDivElement;
    const userInput = document.getElementById("user-input") as HTMLInputElement;
    const sendButton = document.getElementById("send-button") as HTMLButtonElement;

    /**
     * @remarks
     * This calls my view after the send button is clicked and then appends the chunks returned from the view to display onto the webpage
     */
    sendButton.addEventListener("click", async () => {
        const input = userInput.value;
        if (!input) return;

        // Display the user's input in the chat box
        chatBox.innerHTML += `<p><strong>You:</strong> ${input}</p>`;
        userInput.value = ""; // Clear the input field

        try {
            const response = await fetch("/api/chat/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ input }),
            });

            if (!response.body) {
                throw new Error("No response body");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let aiResponse = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                aiResponse += chunk;
            }

            // Display the AI's response as a single paragraph
            chatBox.innerHTML += `<p><strong>AI:</strong> ${aiResponse}</p>`;
        } catch (error) {
            console.error("Error:", error);
            chatBox.innerHTML += `<p><strong>Error:</strong> ${error.message}</p>`;
        }
    });
});
