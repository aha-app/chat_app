class MessagesController < ApplicationController
    def create
      Message.create(message_params)
    
      @messages = Message.for_bot(@bot)

      @message = Message.create(role: 'assistant', content: '', bot: @bot)
      
      chat_bot = create_chat_bot(@bot)

      chat_bot.response
    end

    def index
      @messages = Message.for_bot(params[:bot]).reverse
      @current_bot = params[:bot]
    end
  
    private
  
    def message_params
      content, @bot, role = params.merge(role: 'user').require([:content, :bot, :role])
      {content: content}.merge({bot: @bot, role: role})
    end

    def create_chat_bot(bot)
      bot.constantize.new(messages: @messages, message: @message)
    end
  end
  