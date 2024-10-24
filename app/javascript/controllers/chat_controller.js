import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['chatForm', 'chatInput', 'chatMessages', 'submitButton'];

  connect() {
    this.messages = [];
    this.createStreamingMessageElement();
  }

  createStreamingMessageElement() {
    this.streamingMessageElement = document.createElement('div');
    this.streamingMessageElement.classList.add('message', 'assistant-message', 'streaming-message');
    this.streamingMessageElement.style.display = 'none';

    this.spinnerElement = document.createElement('div');
    this.spinnerElement.classList.add('spinner');
    this.streamingMessageElement.appendChild(this.spinnerElement);
  }

  clearMessages() {
    this.chatMessagesTarget.innerHTML = '';
    this.messages = [];
    this.chatInputTarget.focus();
  }

  handleSubmit(event) {
    event.preventDefault();
    const userMessage = this.chatInputTarget.value.trim();
    if (!userMessage) return;

    this.appendMessage(userMessage, 'user');
    this.messages.push({ role: 'user', content: userMessage });

    this.chatInputTarget.value = '';
    this.toggleInputs(true);

    const selectedBotType = document.querySelector('input[name="bot"]:checked').value;
    const formData = new FormData(this.chatFormTarget);
    formData.append('messages', JSON.stringify(this.messages));
    formData.append('bot', selectedBotType);

    const url = `http://localhost:3000/chat?${new URLSearchParams(formData)}`;
    this.eventSource = new EventSource(url);

    this.showStreamingMessage();

    this.eventSource.addEventListener('text', this.handleTextEvent.bind(this));
    this.eventSource.addEventListener('done', this.handleDoneEvent.bind(this));
  }

  appendMessage(content, role) {
    const messageElement = this.createMessageElement(content, role);
    this.chatMessagesTarget.appendChild(messageElement);
    this.scrollToBottom();
    return messageElement;
  }

  createMessageElement(content, role) {
    const message = document.createElement('div');
    message.textContent = content;
    message.classList.add('message', `${role}-message`);
    return message;
  }

  toggleInputs(disabled) {
    this.submitButtonTarget.disabled = disabled;
    this.chatInputTarget.disabled = disabled;
  }

  showStreamingMessage() {
    this.streamingMessageElement.style.display = 'block';
    this.spinnerElement.style.display = 'block';
    this.chatMessagesTarget.appendChild(this.streamingMessageElement);
    this.scrollToBottom();
  }

  handleTextEvent(event) {
    const data = JSON.parse(event.data);
    if (this.spinnerElement.style.display !== 'none') {
      this.spinnerElement.style.display = 'none';
      this.textContainer = document.createElement('div');
      this.streamingMessageElement.appendChild(this.textContainer);
    }
    this.textContainer.textContent += (data.text || '');
    this.scrollToBottom();
  }

  handleDoneEvent() {
    const assistantMessage = this.textContainer ? this.textContainer.textContent : '';
    this.appendMessage(assistantMessage, 'assistant');
    this.messages.push({ role: 'assistant', content: assistantMessage });

    this.resetStreamingMessage();
    this.eventSource.close();
    this.toggleInputs(false);
    this.chatInputTarget.focus();
  }

  resetStreamingMessage() {
    this.streamingMessageElement.textContent = '';
    this.streamingMessageElement.style.display = 'none';
    this.streamingMessageElement.appendChild(this.spinnerElement);
    this.spinnerElement.style.display = 'block';
  }

  scrollToBottom() {
    this.chatMessagesTarget.scrollTop = this.chatMessagesTarget.scrollHeight;
  }
}