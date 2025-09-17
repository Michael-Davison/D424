class TransactionsController < ApplicationController
  include JwtAuthenticatable

  # GET /transactions
  def index
  transactions = Transaction.where(user_id: params[:user_id])
  render json: transactions.as_json(methods: [], except: [], only: [:id, :date, :description, :amount, :type, :category, :user_id])
end

  # GET /transactions/:id
  def show
    transaction = Transaction.find_by(id: params[:id], user_id: current_user.id)
    if transaction
      render json: transaction
    else
      render json: { error: 'Not found' }, status: :not_found
    end
  end

  # POST /transactions
  def create
    transaction = Transaction.new(transaction_params.merge(user_id: current_user.id))
    if transaction.save
      render json: transaction, status: :created
    else
      render json: { errors: transaction.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /transactions/:id
  def update
    transaction = Transaction.find_by(id: params[:id], user_id: current_user.id)
    if transaction&.update(transaction_params)
      render json: transaction
    else
      render json: { errors: transaction&.errors&.full_messages || ['Not found'] }, status: :unprocessable_entity
    end
  end

  # DELETE /transactions/:id
  def destroy
    transaction = Transaction.find_by(id: params[:id], user_id: current_user.id)
    if transaction&.destroy
      render json: { success: true }
    else
      render json: { error: 'Not found' }, status: :not_found
    end
  end

  private

  def transaction_params
    params.require(:transaction).permit(:date, :description, :amount, :type, :category)
  end
end
