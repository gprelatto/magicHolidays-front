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

// @material-ui/icons
import Apps from "@material-ui/icons/Apps";
import DashboardIcon from "@material-ui/icons/Dashboard";
import DateRange from "@material-ui/icons/DateRange";
import GridOn from "@material-ui/icons/GridOn";
import Image from "@material-ui/icons/Image";
import Place from "@material-ui/icons/Place";
import Timeline from "@material-ui/icons/Timeline";
import WidgetsIcon from "@material-ui/icons/Widgets";

export const routes = [
  {
    collapse: false,
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
    name: "Customers",
    rtlName: "",
    icon: Place,
    state: "customersManagement",
    permissions: [
      1,2
    ],
    views: [
      {
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
    name: "Suppliers",
    rtlName: "",
    icon: Place,
    state: "suppliersCollapse",
    permissions: [
      1
    ],
    views: [
      {
        path: "/supplierAdd",
        name: "Add Supplier",
        rtlName: "",
        mini: "RF",
        rtlMini: "",
        component: SupplierForm,
        layout: "/admin",
        permissions: [
          1
        ]
      },
      {
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
    name: "Product Categories",
    rtlName: "",
    icon: Place,
    state: "prodCategoriesCollapse",
    permissions: [
      1
    ],
    views: [
      {
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
    name: "Products",
    rtlName: "",
    icon: Place,
    state: "productsManagement",
    permissions: [
      1
    ],
    views: [
      {
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
    collapse: false,
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