Rails.application.routes.draw do


  get "transactions/index"
  get "transactions/show"
  get "transactions/create"
  get "transactions/update"
  get "transactions/destroy"
  get "users/new"
  get "users/create"
  
  resources :users do
  resources :transactions, only: [:index]
end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  root "incomes#index"

  resources :incomes
  resources :expenses

  resources :users, only: [:new, :create]
  get    'login',  to: 'sessions#new'
  post   'login',  to: 'sessions#create'
  delete 'logout', to: 'sessions#destroy'
end
