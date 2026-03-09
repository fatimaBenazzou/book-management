import { Navigate, Route, Routes } from "react-router";
import { useAuth } from "./hooks/useAuth";
import { AuthLayout } from "./layouts/AuthLayout";
import { LoginPage } from "./pages/Login/LoginPage";
import { ForgotPasswordPage } from "./pages/Auth/ForgotPasswordPage";
import { RootLayout } from "./layouts/RootLayout";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { BooksPage } from "./pages/Books/BooksPage";
import { BorrowingsPage } from "./pages/Borrowings/BorrowingsPage";
import { BookDetailPage } from "./pages/Books/BookDetailPage";
import { BorrowingDetailPage } from "./pages/Borrowings/BorrowingDetailPage";
import { OrdersPage } from "./pages/Orders/OrdersPage";
import { OrderDetailPage } from "./pages/Orders/OrderDetailPage";
import { UsersPage } from "./pages/Users/UsersPage";
import { UserDetailPage } from "./pages/Users/UserDetailPage";
import { CategoriesPage } from "./pages/Categories/CategoriesPage";
import { CategoryDetailPage } from "./pages/Categories/CategoryDetailPage";
import { AuthorsPage } from "./pages/Authors/AuthorsPage";
import { AuthorDetailPage } from "./pages/Authors/AuthorDetailPage";
import { ReportsPage } from "./pages/Reports/ReportsPage";
import { SettingsPage } from "./pages/Settings/SettingsPage";
import { ProfilePage } from "./pages/Profile/ProfilePage";
import { Unauthorized } from "./pages/Unauthorized";
import { NotFound } from "./pages/NotFound";

export default function Routers() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Routes>
      {/* auth routes */}
      <Route
        path="/auth"
        element={
          isAuthenticated ? <Navigate to={"/"} replace /> : <AuthLayout />
        }
      >
        <Route index element={<Navigate to={"/auth/login"} />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Admin routes */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            isAdmin ? (
              <RootLayout />
            ) : (
              <Navigate to={"/unauthorized"} />
            )
          ) : (
            <Navigate to={"/auth"} replace />
          )
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="books" element={<BooksPage />} />
        <Route path="books/:id" element={<BookDetailPage />} />
        <Route path="authors" element={<AuthorsPage />} />
        <Route path="authors/:id" element={<AuthorDetailPage />} />
        <Route path="borrowings" element={<BorrowingsPage />} />
        <Route path="borrowings/:id" element={<BorrowingDetailPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:id" element={<OrderDetailPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="users/:id" element={<UserDetailPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="categories/:id" element={<CategoryDetailPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
