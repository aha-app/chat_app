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

      respond_to do |format|
        format.html
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace(partial: "messages/index", locals: { messages: @messages, current_bot: @current_bot })
        end
      end
    end

    def bot_delete
      bot = params[:bot] || 'ChatBot'
      Message.where(bot:).destroy_all
      redirect_to messages_path(bot:)
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
  