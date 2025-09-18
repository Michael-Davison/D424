class Expense < Transaction
  
  validates :category, inclusion: { in: Transaction::EXPENSE_CATEGORIES }

  scope :by_category, ->(cat) { where(category: cat) }
  
  def self.monthly_total(user_id, month = Date.current.month, year = Date.current.year)
    where(user_id: user_id, date: Date.new(year, month, 1)..Date.new(year, month, -1)).sum(:amount)
  end
end