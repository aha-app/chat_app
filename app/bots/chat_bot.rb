class ChatBot < RubyBots::OpenAIStreamingTool
  def initialize(sse: nil, messages: [], message: nil)
    @name ||= 'ChatBot'
    @description ||= 'A streaming assistant'
    @sse = sse
    @message = message
    super(name: @name, description: @description, messages:)
  end

  def stream_proc
    proc do |chunk, _bytesize|
      message = chunk.dig('choices', 0, 'delta', 'content') || ''
      if @sse
        @sse.write({ text: message }, event: 'text')
      else
        @message.update(content: @message.content + message)
      end
    end
  end
end