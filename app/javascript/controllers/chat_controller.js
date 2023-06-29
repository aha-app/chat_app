import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["chatForm", "chatInput", "chatMessages", "submitButton", "streamingMessage"];

  connect() {
    this.chatMessagesTarget.scrollTop = this.chatMessagesTarget.scrollHeight;
    this.messages = [];
  }

  handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    const userMessage = this.chatInputTarget.value.trim();

    // Check if userMessage is empty or consists of only whitespace
    if (!userMessage) {
      return;
    }

    // Display user message
    this.chatMessagesTarget.appendChild(
      this.createMessageElement(userMessage, "user")
    );
    this.chatMessagesTarget.scrollTop = this.chatMessagesTarget.scrollHeight;
    this.messages.push({ role: "user", content: userMessage });

    // Clear input and disable input and submit button
    this.chatInputTarget.value = "";
    this.submitButtonTarget.disabled = true;
    this.chatInputTarget.disabled = true;

    // Get form params for authentication and append messages
    const formData = new FormData(this.chatFormTarget);
    formData.append("messages", JSON.stringify(this.messages));

    // Create EventSource
    const queryString = new URLSearchParams(formData);
    const url = this.chatFormTarget.action + "?"  + queryString.toString();
    this.eventSource = new EventSource(url);

    // Add event listener for text received from EventSource
    this.eventSource.addEventListener('text', event => {
      const data = JSON.parse(event.data);

      // Display streaming message, append the text to the content
      this.streamingMessageTarget.style.display = "block";
      this.streamingMessageTarget.textContent = (this.streamingMessageTarget.textContent || "") + (data.text || "");
    });

    // Add event listener for done event from EventSource
    this.eventSource.addEventListener('done', () => {
      // Hide streaming message and display assistant message
      this.streamingMessageTarget.style.display = "none";
      const assistant_message = this.streamingMessageTarget.textContent;
      this.streamingMessageTarget.textContent = "";

      this.chatMessagesTarget.appendChild(
        this.createMessageElement(assistant_message, "assistant")
      );
      this.chatMessagesTarget.scrollTop = this.chatMessagesTarget.scrollHeight;

      // Add assistant response to messages
      this.messages.push({ role: "assistant", content: assistant_message });

      // Close EventSource
      this.eventSource.close();

      // Enable input and submit button
      this.submitButtonTarget.disabled = false;
      this.chatInputTarget.disabled = false;
      this.chatInputTarget.focus();
    });
  }

  createMessageElement(content, role) {
    const message = document.createElement("div");
    message.textContent = content;
    message.classList.add(
      role === "user" ? "user-message" : "assistant-message"
    );
    return message;
  }
}
