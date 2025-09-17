module JwtAuthenticatable
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_jwt!
  end

  def authenticate_jwt!
    header = request.headers['Authorization']
    token = header&.split(' ')&.last
    jwt_secret = Rails.application.secret_key_base
    begin
      decoded = JWT.decode(token, jwt_secret, true, { algorithm: 'HS256' })
      @current_user = User.find(decoded[0]['user_id'])
    rescue JWT::DecodeError, ActiveRecord::RecordNotFound
      render json: { success: false, error: 'Unauthorized' }, status: :unauthorized
    end
  end

  def current_user
    @current_user
  end
end
