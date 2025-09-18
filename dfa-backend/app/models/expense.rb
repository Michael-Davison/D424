class Expense < Transaction

  before_save :make_amount_negative

  validates :category, inclusion: { in: ['Food', 'Housing', 'Utilities', 'Entertainment', 'Other'] }

  scope :by_category, ->(cat) { where(category: cat) }

  def make_amount_negative
    self.amount = -amount.abs
  end

  def self.monthly_total(user_id, month = Date.current.month, year = Date.current.year)
    where(user_id: user_id, date: Date.new(year, month, 1)..Date.new(year, month, -1)).sum(:amount)
  end
end