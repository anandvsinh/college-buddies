document.addEventListener("DOMContentLoaded", () => {
    // --- DOM Elements ---
    const chatInput = document.getElementById("cb-chat-input");
    const sendButton = document.getElementById("cb-send-button");
    const chatHistory = document.getElementById("cb-chat-history");
    const heroScreen = document.getElementById("cb-hero-screen");
    const actionCards = document.querySelectorAll(".cb-action-card");
    const chatBody = document.querySelector(".cb-body");

    let isFirstMessage = true;

    // --- Auto-growing textarea ---
    chatInput.addEventListener("input", function() {
        this.style.height = "auto";
        this.style.height = (this.scrollHeight) + "px";
        
        // Reset to default if empty
        if (this.value === "") {
            this.style.height = "auto";
        }
    });

    // --- Event Listeners ---
    
    // Handle Enter key (send) and Shift+Enter (new line)
    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Prevent new line
            sendMessage();
        }
    });

    // Handle Send Button click
    sendButton.addEventListener("click", () => {
        sendMessage();
    });

    // Handle Action Cards click
    actionCards.forEach(card => {
        card.addEventListener("click", () => {
            const message = card.getAttribute("data-message");
            if (message) {
                chatInput.value = message;
                // Trigger input event to resize textarea if necessary
                chatInput.dispatchEvent(new Event('input'));
                sendMessage();
            }
        });
    });

    // --- Core Logic ---

    function sendMessage() {
        const messageText = chatInput.value.trim();
        if (!messageText) return;

        // 1. Transition UI if it's the first message
        if (isFirstMessage) {
            transitionToChatScreen();
            isFirstMessage = false;
        }

        // 2. Add User Message to UI
        appendMessage(messageText, "user");

        // 3. Clear Input
        chatInput.value = "";
        chatInput.style.height = "auto";
        
        // 4. Show Typing Indicator for AI
        const typingIndicatorId = showTypingIndicator();
        scrollToBottom();

        // 5. Send to Backend
        fetchBackendResponse(messageText, typingIndicatorId);
    }

    function transitionToChatScreen() {
        heroScreen.classList.add("cb-hidden");
        // Wait for the opacity transition to finish, then hide it structurally
        setTimeout(() => {
            heroScreen.style.display = "none";
            chatHistory.classList.add("cb-active");
        }, 400); // Matches CSS transition duration
    }

    function appendMessage(text, sender) {
        const messageRow = document.createElement("div");
        messageRow.classList.add("cb-message-row", sender === "user" ? "cb-user" : "cb-ai");

        const bubble = document.createElement("div");
        bubble.classList.add("cb-message-bubble");
        
        // Use textContent to prevent XSS if necessary, though innerHTML can support formatting later
        bubble.textContent = text;

        messageRow.appendChild(bubble);
        chatHistory.appendChild(messageRow);
        
        scrollToBottom();
    }

    function showTypingIndicator() {
        const id = "cb-typing-" + Date.now();
        const messageRow = document.createElement("div");
        messageRow.id = id;
        messageRow.classList.add("cb-message-row", "cb-ai");

        const bubble = document.createElement("div");
        bubble.classList.add("cb-message-bubble", "cb-typing-bubble");
        
        const typingDiv = document.createElement("div");
        typingDiv.classList.add("cb-typing-indicator");
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement("div");
            dot.classList.add("cb-typing-dot");
            typingDiv.appendChild(dot);
        }

        bubble.appendChild(typingDiv);
        messageRow.appendChild(bubble);
        chatHistory.appendChild(messageRow);

        return id;
    }

    function removeTypingIndicator(id) {
        const indicator = document.getElementById(id);
        if (indicator) {
            indicator.remove();
        }
    }

    function scrollToBottom() {
        // Use requestAnimationFrame to ensure DOM is updated before scrolling
        requestAnimationFrame(() => {
            chatBody.scrollTop = chatBody.scrollHeight;
        });
    }

    async function fetchBackendResponse(message, typingIndicatorId) {
        try {
            const response = await fetch("http://localhost:3000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: message })
            });

            removeTypingIndicator(typingIndicatorId);

            if (!response.ok) {
                throw new Error(`Server returned status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success && data.reply) {
                appendMessage(data.reply, "ai");
            } else {
                appendMessage("Received an unexpected response from the server.", "ai");
            }

        } catch (error) {
            console.error("Chat API Error:", error);
            removeTypingIndicator(typingIndicatorId);
            appendMessage("Couldn't connect to College Buddies AI. [error: server_offline]", "ai");
        }
    }
});
