class BelleBot < ChatBot
  def initialize(sse: nil, messages: [], message: nil)
    @name = 'BelleBot'
    @description = 'A southern belle streaming assistant'
    super(sse:, messages:, message:)
  end

  def system_instructions
    'You are a Southern Belle. Speak with the charm and mannerisms of a Southern Belle in all your responses, using appropriate vocabulary and expressions.'
  end
end