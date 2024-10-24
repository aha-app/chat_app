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

  # broadcasts_to ->(message) { [message.bot, "messages"] }, action: :prepend

  # Ideally we would be using the above line instead of the two below, but there is a bug in rails/turbo
  after_create_commit -> { broadcast_prepend_to [bot, "messages"]}
  after_update_commit -> { broadcast_prepend_to [bot, "messages"]}
end
