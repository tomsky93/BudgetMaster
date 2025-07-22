export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/",
  PROFILE: "/profile",
  BUDGET_LIST: "/budget",
  RECURRING_EXPENSE_LIST: "/recurring-expenses",
  CATEGORY_TREE: "/category-tree",
  STATISTICS: "/stats",
  SAVINGS: "/savings",
} as const;

import React from "react";
import Dashboard from "../pages/Dashboard";
import LoginPage from "../pages/LoginPage";
import RegisterationPage from "../pages/RegistrationPage";
import PrivateRoute from "./PrivateRoute";
import ProfileForm from "../pages/forms/ProfileForm";
import CategoryTree from "../components/CategoryTree";
import BudgetList from "../pages/BudgetList";
import SavingList from "../pages/SavingList";
import RecurringExpenseList from "../pages/RecurringExpenseList";
import { Routes, Route, Navigate } from "react-router";
import AggregateExpensesByYear from "../components/TotalExpense";
import { DateNavigator } from "../components/DateNavigator";
import TotalExpenseCategoryChart from "../components/TotalExpenseCategoryChart";



const Router: React.FC = () => (
  <Routes>
    <Route path={ROUTES.LOGIN} element={<LoginPage />} />
    <Route path={ROUTES.REGISTER} element={<RegisterationPage />} />

    <Route
      path={ROUTES.DASHBOARD}
      element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      }
    />
    <Route
      path={ROUTES.PROFILE}
      element={
        <PrivateRoute>
          <ProfileForm />
        </PrivateRoute>
      }
    />
    <Route
      path={ROUTES.CATEGORY_TREE}
      element={
        <PrivateRoute>
          <CategoryTree />
        </PrivateRoute>
      }
    />
    <Route
      path={ROUTES.BUDGET_LIST}
      element={
        <PrivateRoute>
          <BudgetList />
        </PrivateRoute>
      }
    />
    <Route
      path={ROUTES.RECURRING_EXPENSE_LIST}
      element={
        <PrivateRoute>
          <RecurringExpenseList />
        </PrivateRoute>
      }
    />
    <Route
      path={ROUTES.STATISTICS}
      element={
        <PrivateRoute>
          <DateNavigator>
            {({ year }) => (
              <>
                <AggregateExpensesByYear year={year} />
                <TotalExpenseCategoryChart year={year} />
              </>
            )}
          </DateNavigator>
        </PrivateRoute>
      }
    />
      
      <Route
          path={ROUTES.SAVINGS}
          element={
            <PrivateRoute>
              <SavingList />
            </PrivateRoute>
          }
          />
 
    <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
  </Routes>
);

export default Router;
