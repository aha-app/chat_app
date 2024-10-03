import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["turboForm", "turboInput"];

  connect() {
    this.turboFormTarget.addEventListener("submit", this.submitTurboForm.bind(this));
    this.turboInputTarget.focus();
  }

  submitTurboForm(event) {
    event.preventDefault();
    event.stopPropagation();

    this.turboFormTarget.submit();
    this.turboFormTarget.reset();
    this.turboInputTarget.focus();
  }
}