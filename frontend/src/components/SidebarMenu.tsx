import React from "react";
import { NavLink } from "react-router";
import { ROUTES } from "../routes/paths";

const SidebarMenu: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const baseLinkClasses =
    "flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors";
  const activeLinkClasses = "bg-gray-200 font-semibold text-gray-900";

  return (
    <nav className="flex flex-col h-full">
      <ul className="flex flex-col space-y-1 flex-1 overflow-y-auto">
        <li>
          <NavLink
            to={ROUTES.DASHBOARD}
            end
            className={({ isActive }) =>
              `${baseLinkClasses} ${isActive ? activeLinkClasses : ""}`
            }
          >
            <i className="pi pi-home mr-3 text-lg"></i>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to={ROUTES.PROFILE}
            className={({ isActive }) =>
              `${baseLinkClasses} ${isActive ? activeLinkClasses : ""}`
            }
          >
            <i className="pi pi-user mr-3 text-lg"></i>
            Profile
          </NavLink>
        </li>
        <li>
          <NavLink
            to={ROUTES.CATEGORY_TREE}
            className={({ isActive }) =>
              `${baseLinkClasses} ${isActive ? activeLinkClasses : ""}`
            }
          >
            <i className="pi pi-tags mr-3 text-lg"></i>
            Categories
          </NavLink>
        </li>
        <li>
          <NavLink
            to={ROUTES.BUDGET_LIST}
            className={({ isActive }) =>
              `${baseLinkClasses} ${isActive ? activeLinkClasses : ""}`
            }
          >
            <i className="pi pi-wallet mr-3 text-lg"></i>
            Budgets
          </NavLink>
        </li>
        <li>
          <NavLink
            to={ROUTES.RECURRING_EXPENSE_LIST}
            className={({ isActive }) =>
              `${baseLinkClasses} ${isActive ? activeLinkClasses : ""}`
            }
          >
            <i className="pi pi-calendar mr-3 text-lg"></i>
            Recurring Expenses
          </NavLink>
        </li>
        <li>
          <NavLink
            to={ROUTES.SAVINGS}
            className={({ isActive }) =>
              `${baseLinkClasses} ${isActive ? activeLinkClasses : ""}`
            }
          >
            <i className="pi pi-building-columns mr-3 text-lg"></i>
            Savings
          </NavLink>
        </li>

        <li>
          <NavLink
            to={ROUTES.STATISTICS}
            className={({ isActive }) =>
              `${baseLinkClasses} ${isActive ? activeLinkClasses : ""}`
            }
          >
            <i className="pi pi-chart-bar mr-3 text-lg"></i>
            Statistics
          </NavLink>
        </li>

        <li>
          <hr className="my-2 border-gray-200" />
        </li>

        <li>
          <button
            onClick={() => {
              onLogout();
            }}
            className={`${baseLinkClasses} w-full text-left`}
          >
            <i className="pi pi-sign-out mr-3 text-lg"></i>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default SidebarMenu;
