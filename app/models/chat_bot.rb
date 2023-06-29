class ChatBot < RubyBots::OpenAIStreamingTool
  def initialize(sse:, messages: [])
    @sse = sse
    super(name: 'ChatBot', description: 'A streaming assistant', messages:)
  end

  def stream_proc
    proc do |chunk, _bytesize|
      message = chunk.dig('choices', 0, 'delta', 'content')
      @sse.write({ text: message }, event: 'text')
    end
  end
end
