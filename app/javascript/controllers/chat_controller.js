import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["chatForm", "chatInput", "chatMessages", "submitButton", "turboForm", "turboInput"];

  connect() {
    this.messages = [];
    this.createStreamingMessageElement();
    this.turboFormTarget.addEventListener("submit", this.submitTurboForm.bind(this));
  }

  submitTurboForm(event) {
    event.preventDefault();
    event.stopPropagation();

    this.turboFormTarget.submit();
    this.turboFormTarget.reset();
    this.turboInputTarget.focus();
  }

  createStreamingMessageElement() {
    this.streamingMessageElement = document.createElement("div");
    this.streamingMessageElement.classList.add("message", "assistant-message", "streaming-message");
    this.streamingMessageElement.style.display = "none";

    // Create spinner element
    this.spinnerElement = document.createElement("div");
    this.spinnerElement.classList.add("spinner");
    this.streamingMessageElement.appendChild(this.spinnerElement);
  }

  handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    const userMessage = this.chatInputTarget.value.trim();

    if (!userMessage) {
      return;
    }

    const userMessageElement = this.createMessageElement(userMessage, "user");
    this.chatMessagesTarget.appendChild(userMessageElement);
    this.chatMessagesTarget.scrollTop = this.chatMessagesTarget.scrollHeight;
    this.messages.push({ role: "user", content: userMessage });

    this.chatInputTarget.value = "";
    this.submitButtonTarget.disabled = true;
    this.chatInputTarget.disabled = true;

    // Get all radio buttons in the group
    const radioButtons = document.querySelectorAll('input[name="bot"]');

    // Find the selected radio button
    let selectedBotType;
    for (const radioButton of radioButtons) {
      if (radioButton.checked) {
        selectedBotType = radioButton.value;
        break;
      }
    }

    const formData = new FormData(this.chatFormTarget);
    formData.append("messages", JSON.stringify(this.messages));
    formData.append("bot", selectedBotType);

    const queryString = new URLSearchParams(formData);
    const url = "http://localhost:3000/chat?"  + queryString.toString();
    this.eventSource = new EventSource(url);

    // Insert the streaming message element after the user message
    this.streamingMessageElement.style.display = "block";
    this.spinnerElement.style.display = "block"; // Show spinner
    userMessageElement.insertAdjacentElement('afterend', this.streamingMessageElement);
    this.chatMessagesTarget.scrollTop = this.chatMessagesTarget.scrollHeight;

    this.eventSource.addEventListener('text', event => {
      const data = JSON.parse(event.data);
      if (this.spinnerElement.style.display !== "none") {
        // First response received, hide spinner and create text container
        this.spinnerElement.style.display = "none";
        this.textContainer = document.createElement("div");
        this.streamingMessageElement.appendChild(this.textContainer);
      }
      this.textContainer.textContent += (data.text || "");
      this.chatMessagesTarget.scrollTop = this.chatMessagesTarget.scrollHeight;
    });

    this.eventSource.addEventListener('done', () => {
      const assistantMessage = this.textContainer ? this.textContainer.textContent : "";
      
      // Replace the streaming message with a permanent assistant message
      const assistantMessageElement = this.createMessageElement(assistantMessage, "assistant");
      this.streamingMessageElement.replaceWith(assistantMessageElement);
      
      // Reset the streaming message element
      this.streamingMessageElement.textContent = "";
      this.streamingMessageElement.style.display = "none";
      this.streamingMessageElement.appendChild(this.spinnerElement);
      this.spinnerElement.style.display = "block";

      this.chatMessagesTarget.scrollTop = this.chatMessagesTarget.scrollHeight;

      this.messages.push({ role: "assistant", content: assistantMessage });

      this.eventSource.close();

      // Re-enable input and submit button, and focus on input
      this.submitButtonTarget.disabled = false;
      this.chatInputTarget.disabled = false;
      this.chatInputTarget.focus();
    });
  }

  createMessageElement(content, role) {
    const message = document.createElement("div");
    message.textContent = content;
    message.classList.add("message", role + "-message");
    return message;
  }

  // handleTurboSubmit(event) {
  //   console.log("We did a thing!");
  //   this.turboInputTarget.value = "";
  // }
}