class DiscountValidationBuilder {
  constructor({
    discount_start_date, discount_end_date, userId,
    discount_users_used, discount_max_uses_per_user, discount_max_users,
  }) {
    this.discount_start_date = discount_start_date;
    this.discount_end_date = discount_end_date;
    this.discount_max_users = discount_max_users;
    this.discount_users_used = discount_users_used;
    this.discount_max_uses_per_user = discount_max_uses_per_user;
    this.userId = userId;
    this.messages = [];
  }

  validateTime() {
    if (!this.discount_start_date || !this.discount_end_date) {
      this.messages('Missing input start_date and end_date');
      return this;
    }

    if (!new Date(this.discount_start_date) > new Date(this.discount_end_date)) {
      this.messages.push('start_date must be before end_date');
    }

    return this;
  }

  checkExpire() {
    if (!new Date() > new Date(this.discount_end_date)) {
      this.messages.push('Discount expire');
    }

    return this;
  }

  checkAvailable() {
    if (!this.discount_max_users) {
      this.messages.push('Discount isn\'t available');
    }

    return this;
  }

  checkMaxUserPerDiscount() {
    if (this.discount_max_uses_per_user > 0 && this.userId) {
      const userUseDiscount = this.discount_users_used.find(u => u.userId == this.userId) || [];
      if (userUseDiscount.length > this.discount_max_uses_per_user) {
        this.messages.push('Discount has been used up');
      }
    }

    return this;
  }

  build() {
    return this.messages;
  }
}

module.exports = DiscountValidationBuilder;
