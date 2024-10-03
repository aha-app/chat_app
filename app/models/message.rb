class Message < ApplicationRecord
  BOT_NAMES = { 
    "ChatBot" => "Default",
    "BelleBot" => "Southern Belle",
    "PirateBot" => "Pirate"
  }

  validates :role, presence: true, inclusion: { in: %w[user assistant] }
  validates :content, presence: true
  validates :bot, presence: true, inclusion: { in: BOT_NAMES.keys}

  scope :for_bot, ->(bot) { where(bot: bot) }

  # When creating the message we prepend the list of messages which is reversed in the DOM
  after_create_commit -> { broadcast_prepend_to [bot, "messages"], action: :prepend, target: :messages }

  # When updating the message we replace the message in the DOM
  after_update_commit -> { broadcast_replace_to [bot, "messages"], target: ActionView::RecordIdentifier.dom_id(self) }

end