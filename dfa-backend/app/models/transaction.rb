
# Base Transaction model (STI parent)
class Transaction < ApplicationRecord
	# Encapsulation: validations
	validates :date, :description, :amount, :type, :category, :user_id, presence: true
	validates :amount, numericality: true

	# Example of encapsulated business logic
	def summary
		"#{date}: #{description} (#{category}) - $#{'%.2f' % amount}"
	end
end
