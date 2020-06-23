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
import EditProfilePassword from 'views/Pages/EditProfilePassword';
import PrepaidTable from 'views/Payment/prepaidTable';
import PaymentTable from 'views/Payment/paymentTable';
import PaymentListTable from 'views/Payment/paymentListTable';
import monthlySalesTable from 'views/Reports/monthlySalesTable';
import collectedTable from 'views/Cobranzas/collectedTable';
import toCollectTable from 'views/Cobranzas/toCollectTable';


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
    render: true,
    path: "/userProfile",
    name: "menu.label.profile.edit",
    rtlName: "",
    mini: "RF",
    rtlMini: "",
    component: UserProfile,
    layout: "/admin",
    isProfile: true,
    permissions: [
      1,2,3
    ]
  },
  {
    render: true,
    path: "/editProfilePassword",
    name: "menu.label.profile.editPw",
    rtlName: "",
    mini: "RF",
    rtlMini: "",
    component: EditProfilePassword,
    layout: "/admin",
    isProfile: true,
    permissions: [
      1,2,3
    ]
  },
  {
    collapse: true,
    render: true,
    name: "menu.label.customer",
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
        name: "menu.label.customer.add",
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
        name: "menu.label.customer.list",
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
    name: "menu.label.supplier",
    rtlName: "",
    icon: Place,
    state: "suppliersCollapse",
    permissions: [
      1
    ],
    views: [
      {
        render: true,
        path: "/supplierAdd",
        name: "menu.label.supplier.add",
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
        render: true,
        path: "/supplierTable",
        name: "menu.label.supplier.list",
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
    name: "menu.label.prodCat",
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
        name: "menu.label.prodCat.add",
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
        name: "menu.label.prodCat.list",
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
    name: "menu.label.product",
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
        name: "menu.label.product.add",
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
        name: "menu.label.product.list",
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
    name: "menu.label.users",
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
        name: "menu.label.users.add",
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
        name: "menu.label.users.list",
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
    name: "menu.label.rez",
    rtlName: "",
    icon: Place,
    state: "rezManagement",
    permissions: [
      1,2
    ],
    views: [
      {
        render: true,
        path: "/rezForm",
        name: "menu.label.rez.add",
        rtlName: "",
        mini: "RF",
        rtlMini: "",
        component: RezForm,
        layout: "/admin",
        permissions: [
          1,2
        ]
      },
      {
        render: true,
        path: "/rezTable",
        name: "menu.label.rez.list",
        rtlName: "",
        mini: "RF",
        rtlMini: "",
        component: RezTable,
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
    name: "menu.label.cobranzas",
    rtlName: "",
    icon: Place,
    state: "cobranzasManagement",
    permissions: [
      1,2
    ],
    views: [
      {
        render: true,
        path: "/collectedTable",
        name: "menu.label.cobranzas.cobrado",
        rtlName: "",
        mini: "RF",
        rtlMini: "",
        component: collectedTable,
        layout: "/admin",
        permissions: [
          1,2
        ]
      },
      {
        render: true,
        path: "/toCollectTable",
        name: "menu.label.cobranzas.aCobrar",
        rtlName: "",
        mini: "RF",
        rtlMini: "",
        component: toCollectTable,
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
    name: "menu.label.payments",
    rtlName: "",
    icon: Place,
    state: "paymentsManagement",
    permissions: [
      1
    ],
    views: [
      {
        render: true,
        path: "/prepaidTable",
        name: "menu.label.payments.prepay",
        rtlName: "",
        mini: "RF",
        rtlMini: "",
        component: PrepaidTable,
        layout: "/admin",
        permissions: [
          1
        ]
      },
      {
        render: true,
        path: "/paymentTable",
        name: "menu.label.payments.pay",
        rtlName: "",
        mini: "RF",
        rtlMini: "",
        component: PaymentTable,
        layout: "/admin",
        permissions: [
          1
        ]
      },
      {
        render: true,
        path: "/paymentListTable",
        name: "Listado de pagos",
        rtlName: "",
        mini: "RF",
        rtlMini: "",
        component: PaymentListTable,
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
    name: "menu.label.reports",
    rtlName: "",
    icon: Place,
    state: "reportsManagement",
    permissions: [
      1
    ],
    views: [
      {
        render: true,
        path: "/montlySales",
        name: "menu.label.reports.monthlySales",
        rtlName: "",
        mini: "RF",
        rtlMini: "",
        component: monthlySalesTable,
        layout: "/admin",
        permissions: [
          1
        ]
      }
    ]
  },
  {
    collapse: false,
    render: true,
    path: "/logOut",
    name: "menu.label.logout",
    rtlName: "",
    icon: DashboardIcon,
    component: LogOut,
    layout: "/admin",
    permissions: [
      1,2,3
    ]
  },
];

export const profileRoutes = [
  {
    render: true,
    path: "/userProfile",
    name: "menu.label.profile.edit",
    rtlName: "",
    mini: "RF",
    rtlMini: "",
    component: UserProfile,
    layout: "/admin"
  },
  {
    render: true,
    path: "/editProfilePassword",
    name: "menu.label.profile.editPw",
    rtlName: "",
    mini: "RF",
    rtlMini: "",
    component: EditProfilePassword,
    layout: "/admin"
  }
]

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