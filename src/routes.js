import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { useAuth } from "./context/auth";

import Dashboard from "views/Dashboard/Dashboard.js";

import SupplierForm from "views/Products/SupplierForm.js";
import SupplierTable from "views/Products/SupplierTable.js";
import ProductCategoryForm from "views/Products/ProductCategoryForm.js";
import ProductForm from "views/Products/ProductForm.js";
import ProductCategoryTable from "views/Products/ProductCategoryTable.js";
import ProductTable from "views/Products/ProductTable.js";
import CustomerForm from "views/Customers/CustomerForm.js"
import CustomerTable from "views/Customers/CustomerTable.js"
import LogOut from "views/Pages/LogOut.js"
import UserProfile from "views/Pages/UserProfile.js"

// @material-ui/icons
import Apps from "@material-ui/icons/Apps";
import DashboardIcon from "@material-ui/icons/Dashboard";
import DateRange from "@material-ui/icons/DateRange";
import GridOn from "@material-ui/icons/GridOn";
import Image from "@material-ui/icons/Image";
import Place from "@material-ui/icons/Place";
import Timeline from "@material-ui/icons/Timeline";
import WidgetsIcon from "@material-ui/icons/Widgets";
import UsersTable from 'views/User/usersTable';
import UserForm from 'views/User/userForm';
import RezForm from 'views/Rez/rezForm';
import RezTable from 'views/Rez/rezTable';

export const routes = [
  {
    collapse: false,
    render: true,
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: DashboardIcon,
    component: Dashboard,
    layout: "/admin",
    permissions: [
      1,2,3
    ]
  },
  {
    collapse: true,
    render: false,
    name: "User Profile",
    rtlName: "",
    icon: DashboardIcon,
    layout: "/admin",
    permissions: [
      1,2,3
    ],
    views: [
      {
        render: true,
        path: "/userProfile",
        name: "Edit Profile",
        rtlName: "",
        mini: "RF",
        rtlMini: "",
        component: UserProfile,
        layout: "/admin",
        permissions: [
          1,2,3
        ]
      }
    ]
  },
  {
    collapse: true,
    render: true,
    name: "Customers",
    rtlName: "",
    icon: Place,
    state: "customersManagement",
    permissions: [
      1,2
    ],
    views: [
      {
        render: true,
        path: "/customerAdd",
        name: "Add Customer",
        rtlName: "",
        mini: "RF",
        rtlMini: "",
        component: CustomerForm,
        layout: "/admin",
        permissions: [
          1,2
        ]
      },
      {
        render: true,
        path: "/customerTable",
        name: "List Customers",
        rtlName: "",
        mini: "RF",
        rtlMini: "",
        component: CustomerTable,
        layout: "/admin",
        permissions: [
          1,2
        ]
      }
    ]
  },
  {
    collapse: true,
    render: true,
    name: "Suppliers",
    rtlName: "",
    icon: Place,
    state: "suppliersCollapse",
    permissions: [
      1,2
    ],
    views: [
      {
        render: true,
        path: "/supplierAdd",
        name: "Add Supplier",
        rtlName: "",
        mini: "RF",
        rtlMini: "",
        component: SupplierForm,
        layout: "/admin",
        permissions: [
          1,2
        ]
      },
      {
        render: true,
        path: "/supplierTable",
        name: "List Suppliers",
        rtlName: "",
        mini: "RF",
        rtlMini: "",
        component: SupplierTable,
        layout: "/admin",
        permissions: [
          1
        ]
      }
    ]
  },
  {
    collapse: true,
    render: true,
    name: "Product Categories",
    rtlName: "",
    icon: Place,
    state: "prodCategoriesCollapse",
    permissions: [
      1
    ],
    views: [
      {
        render: true,
        path: "/productCategoryAdd",
        name: "Add Product Category",
        rtlName: "",
        mini: "RF",
        rtlMini: "",
        component: ProductCategoryForm,
        layout: "/admin",
        permissions: [
          1
        ]
      },
      {
        render: true,
        path: "/productCategoryTable",
        name: "List Product Categories",
        rtlName: "",
        mini: "RF",
        rtlMini: "",
        component: ProductCategoryTable,
        layout: "/admin",
        permissions: [
          1
        ]
      }
    ]
  },
  {
    collapse: true,
    render: true,
    name: "Products",
    rtlName: "",
    icon: Place,
    state: "productsManagement",
    permissions: [
      1
    ],
    views: [
      {
        render: true,
        path: "/productAdd",
        name: "Add Product",
        rtlName: "",
        mini: "RF",
        rtlMini: "",
        component: ProductForm,
        layout: "/admin",
        permissions: [
          1
        ]
      },
      {
        render: true,
        path: "/productTable",
        name: "List Products",
        rtlName: "",
        mini: "RF",
        rtlMini: "",
        component: ProductTable,
        layout: "/admin",
        permissions: [
          1
        ]
      }
    ]
  },
  {
    collapse: true,
    render: true,
    name: "Users",
    rtlName: "",
    icon: Place,
    state: "usersManagement",
    permissions: [
      1
    ],
    views: [
      {
        render: true,
        path: "/userForm",
        name: "Add User",
        rtlName: "",
        mini: "RF",
        rtlMini: "",
        component: UserForm,
        layout: "/admin",
        permissions: [
          1
        ]
      },
      {
        render: true,
        path: "/usersTable",
        name: "List Users",
        rtlName: "",
        mini: "RF",
        rtlMini: "",
        component: UsersTable,
        layout: "/admin",
        permissions: [
          1
        ]
      }
    ]
  },
  {
    collapse: true,
    render: true,
    name: "Reservations",
    rtlName: "",
    icon: Place,
    state: "rezManagement",
    permissions: [
      1,2
    ],
    views: [
      {
        render: true,
        path: "/rezTable",
        name: "List Reservations",
        rtlName: "",
        mini: "RF",
        rtlMini: "",
        component: RezTable,
        layout: "/admin",
        permissions: [
          1,2
        ]
      },
      {
        render: true,
        path: "/rezForm",
        name: "Add Reservation",
        rtlName: "",
        mini: "RF",
        rtlMini: "",
        component: RezForm,
        layout: "/admin",
        permissions: [
          1,2
        ]
      }
    ]
  },
  {
    collapse: false,
    render: true,
    path: "/logOut",
    name: "Log Out",
    rtlName: "",
    icon: DashboardIcon,
    component: LogOut,
    layout: "/admin",
    permissions: [
      1,2,3
    ]
  },
];

function PrivateRoute({ component: Component, ...rest }) { 
  const isAuthenticated = useAuth();
  
  return(
    <Route
      {...rest}
      render={props =>
        isAuthenticated.auth.token !== null && isAuthenticated.auth.token !== undefined && isAuthenticated.auth.token !== '' ? (
          <Component {...props} />
        ) : (
          <Redirect to="/auth/login-page" />
        )
      }
    />
  );
}

export default PrivateRoute;