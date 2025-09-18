
# Base Transaction model (STI parent)
class Transaction < ApplicationRecord
	INCOME_CATEGORIES = [
		'Job', 'Side Hustle', 'Investments', 'Gifts', 'Interest', 'Other'
	].freeze

	EXPENSE_CATEGORIES = [
		'Groceries', 'Housing', 'Utilities', 'Transportation', 'Healthcare',
		'Education', 'Childcare', 'Restaurants', 'Gifts', 'Entertainment',
		'Shopping', 'Other'
	].freeze

	# Encapsulation: validations
	validates :date, :description, :amount, :type, :category, :user_id, presence: true
	validates :amount, numericality: true

	def summary
		"#{date}: #{description} (#{category}) - $#{'%.2f' % amount}"
	end
end
