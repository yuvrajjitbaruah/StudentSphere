(() => {
    const widget = document.getElementById("supportChatWidget");
    if (!widget) return;

    const toggleBtn = document.getElementById("supportChatToggle");
    const panel = document.getElementById("supportChatPanel");
    const closeBtn = document.getElementById("supportChatClose");
    const form = document.getElementById("supportChatForm");
    const input = document.getElementById("supportChatInput");
    const messages = document.getElementById("supportChatMessages");
    const promptChipWrap = document.getElementById("supportPromptChips");

    function addMessage(text, role, extraClass) {
        const el = document.createElement("div");
        el.className = role === "user" ? "user-msg" : "ai-msg";
        if (extraClass) el.classList.add(extraClass);
        const textNode = document.createElement("div");
        textNode.className = "msg-text";
        textNode.textContent = text;
        el.appendChild(textNode);
        if (role !== "user") {
            const actionRow = document.createElement("div");
            actionRow.className = "chat-msg-actions";
            const copyBtn = document.createElement("button");
            copyBtn.type = "button";
            copyBtn.className = "copy-msg-btn";
            copyBtn.textContent = "Copy";
            copyBtn.addEventListener("click", async () => {
                try {
                    await navigator.clipboard.writeText(textNode.textContent || "");
                    copyBtn.textContent = "Copied";
                    setTimeout(() => {
                        copyBtn.textContent = "Copy";
                    }, 1100);
                } catch (_err) {
                    copyBtn.textContent = "Failed";
                    setTimeout(() => {
                        copyBtn.textContent = "Copy";
                    }, 1100);
                }
            });
            actionRow.appendChild(copyBtn);
            el.appendChild(actionRow);
        }
        messages.appendChild(el);
        messages.scrollTop = messages.scrollHeight;
    }

    function setOpen(isOpen) {
        panel.classList.toggle("open", isOpen);
        if (isOpen) input.focus();
    }

    async function sendMessage(messageText) {
        const response = await fetch("/api/support-chat/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: messageText }),
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            const fallback = "Student Support AI is unavailable right now.";
            throw new Error(data.error || data.reply || fallback);
        }
        return data.reply || "I could not generate a response right now.";
    }

    toggleBtn.addEventListener("click", () => {
        setOpen(!panel.classList.contains("open"));
    });

    closeBtn.addEventListener("click", () => {
        setOpen(false);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && panel.classList.contains("open")) {
            setOpen(false);
        }
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, "user");
        input.value = "";
        input.disabled = true;

        addMessage("Thinking", "ai", "thinking");
        const pending = messages.lastElementChild;
        let dotCount = 0;
        let thinkingTimer = setInterval(() => {
            if (!pending.isConnected) return;
            dotCount = (dotCount + 1) % 4;
            const dots = ".".repeat(dotCount);
            const textEl = pending.querySelector(".msg-text");
            if (textEl) {
                textEl.textContent = `Thinking${dots}`;
            } else {
                // Fallback: if DOM got altered, still update the bubble.
                pending.textContent = `Thinking${dots}`;
            }
        }, 350);

        try {
            const reply = await sendMessage(text);
            clearInterval(thinkingTimer);
            thinkingTimer = null;
            pending.classList.remove("thinking");
            const textEl = pending.querySelector(".msg-text");
            if (textEl) textEl.textContent = reply;
        } catch (err) {
            if (thinkingTimer) clearInterval(thinkingTimer);
            thinkingTimer = null;
            pending.classList.remove("thinking");
            const textEl = pending.querySelector(".msg-text");
            if (textEl) textEl.textContent = err.message || "Failed to get response.";
            if (window.portalToast) window.portalToast("Support AI request failed.", "error");
        } finally {
            if (thinkingTimer) clearInterval(thinkingTimer);
            input.disabled = false;
            input.focus();
            messages.scrollTop = messages.scrollHeight;
        }
    });

    if (promptChipWrap) {
        promptChipWrap.addEventListener("click", (event) => {
            const target = event.target;
            if (!target || !target.classList.contains("prompt-chip")) return;
            const prompt = target.getAttribute("data-prompt");
            if (!prompt) return;
            input.value = prompt;
            form.dispatchEvent(new Event("submit", { cancelable: true }));
        });
    }
})();
