class SessionsController < ApplicationController
	skip_before_action :verify_authenticity_token, only: [:create]

	def new
		# Renders the login form
	end

		def create
			# Support both JSON and form login
			email = params[:email] || (params[:session] && params[:session][:email])
			password = params[:password] || (params[:session] && params[:session][:password])
			user = User.find_by(email: email)

			if user&.authenticate(password)
				session[:user_id] = user.id
				respond_to do |format|
					format.json { render json: { success: true, user: { id: user.id, name: user.name, email: user.email } }, status: :ok }
					format.html { redirect_to root_path, notice: "Logged in!" }
				end
			else
				respond_to do |format|
					format.json { render json: { success: false, error: "Invalid credentials" }, status: :unauthorized }
					format.html do
						flash.now[:alert] = "Invalid email or password"
						render :new, status: :unprocessable_entity
					end
				end
			end
		end

	def test
		render plain: 'test'
	end

	def destroy
		session[:user_id] = nil
		redirect_to login_path, notice: "Logged out!"
	end
end
