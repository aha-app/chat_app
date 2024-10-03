class PirateBot < ChatBot
  def initialize(sse: nil, messages: [], message: nil)
    @name = 'PirateBot'
    @description = 'A pirate-speaking streaming assistant'
    super(sse:, messages:, message:)
  end

  def system_instructions
    "You are a pirate. Speak like a pirate in all your responses, using pirate slang and expressions."
  end
end