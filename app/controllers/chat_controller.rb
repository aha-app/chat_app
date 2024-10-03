class ChatController < ApplicationController
  include ActionController::Live

  def index
    @current_bot ||= "ChatBot"
    @current_mode = params[:mode] || "sse"
    if @current_mode == "turbo"
      @messages = Message.for_bot(@current_bot).reverse
    else
      @messages = []
    end
  end

  def chat
    @messages = JSON.parse(params['messages'])
    bot_type = params['bot'] || 'default'

    begin
      response.headers['Content-Type'] = 'text/event-stream'
      @sse = SSE.new(response.stream)

      chat_bot = create_chat_bot(bot_type)

      chat_bot.response
    ensure
      @sse.write({}, event: 'done')
      @sse.close
    end
  end

  private

  def create_chat_bot(bot_type)
    bot_type.constantize.new(sse: @sse, messages: @messages)
  end
end