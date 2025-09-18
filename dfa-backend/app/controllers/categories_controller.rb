class CategoriesController < ApplicationController
  def index
    render json: {
      income: Transaction::INCOME_CATEGORIES,
      expense: Transaction::EXPENSE_CATEGORIES
    }
  end
end