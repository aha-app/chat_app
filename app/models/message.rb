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

  broadcasts_to ->(message) { [message.bot, "messages"] }, inserts_by: :prepend
end
