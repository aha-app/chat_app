class ChatController < ApplicationController
  include ActionController::Live

  def index
    @messages = []
  end

  def chat
    @messages = JSON.parse(params['messages'])

    begin
      response.headers['Content-Type'] = 'text/event-stream'
      @sse = SSE.new(response.stream)

      chat_bot = ChatBot.new(sse: @sse, messages: @messages)

      chat_bot.response
    ensure
      @sse.write({}, event: 'done')
      @sse.close
    end
  end
end
