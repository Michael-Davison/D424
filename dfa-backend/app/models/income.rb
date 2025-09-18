class Income < Transaction

  before_save :make_amount_positive

  validates :category, inclusion: { in: Transaction::INCOME_CATEGORIES }

  scope :this_month, -> { where(date: Date.current.beginning_of_month..Date.current.end_of_month) }

  def make_amount_positive
    self.amount = amount.abs
  end

  def self.monthly_total(user_id, month = Date.current.month, year = Date.current.year)
    where(user_id: user_id, date: Date.new(year, month, 1)..Date.new(year, month, -1)).sum(:amount)
  end
end