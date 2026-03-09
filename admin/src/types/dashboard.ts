// Dashboard types — matches GET /admin/dashboard response

export interface DashboardStats {
  users: {
    total: number;
    admins: number;
    active: number;
    newThisMonth: number;
  };
  books: {
    total: number;
    active: number;
    outOfStock: number;
    categories: number;
    authors: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
    revenue: number;
    revenueThisMonth: number;
  };
  borrows: {
    total: number;
    pending: number;
    active: number;
    overdue: number;
    returned: number;
  };
  ratings: {
    total: number;
    average: number;
  };
}
