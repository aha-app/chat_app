Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "chat#index"

  get "/chat", to: "chat#chat"

  resources :messages, only: [:create, :index] do
    collection do
      get :bot_delete
    end
  end
end
