import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { useAuth } from "./context/auth";

import Dashboard from "views/Dashboard/Dashboard.js";
import MailGenerator from "views/MailGenerator/mailsGenerator.js";

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
import DashboardIcon from "@material-ui/icons/Dashboard";
import Face from "@material-ui/icons/Face";
import Book from "@material-ui/icons/Book";
import Payment from "@material-ui/icons/Payment";
import ExitToApp from "@material-ui/icons/ExitToApp";
import Public from "@material-ui/icons/Public";
import Folder from "@material-ui/icons/Folder";
import CardTravel from "@material-ui/icons/CardTravel";
import People from "@material-ui/icons/People";
import MonetizationOn from "@material-ui/icons/MonetizationOn";
import Note from "@material-ui/icons/Note";
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';

import UsersTable from 'views/User/usersTable';
import UserForm from 'views/User/userForm';
import RezForm from 'views/Rez/rezForm';
import RezTable from 'views/Rez/rezTable';
import EditProfilePassword from 'views/Pages/EditProfilePassword';
import PrepaidTable from 'views/Payment/prepaidTable';
import PaymentTable from 'views/Payment/paymentTable';
import PaymentListTable from 'views/Payment/paymentListTable';
import monthlySalesTable from 'views/Reports/monthlySalesTable';
import CollectedTable from 'views/Cobranzas/collectedTable';
import ToCollectTable from 'views/Cobranzas/toCollectTable';
import UserTypeForm from 'views/User/userTypeForm';
import UserTypesTable from 'views/User/userTypesTable';
import SalesReportByDate from 'views/Reports/salesReportByDate';
import NewAlertForm from 'views/CustomAlerts/NewAlertForm';
import AlertsTable from 'views/CustomAlerts/NewAlertTable';
import WizardView from 'views/MailGenerator/MailWizard';


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
    collapse: false,
    render: true,
    path: "/MailWizard",
    name: "Presupuestos",
    rtlName: "",
    icon: DashboardIcon,
    component: WizardView,
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
    mini: "UP",
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
    mini: "EP",
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
    icon: Face,
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
        mini: "AC",
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
        mini: "LC",
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
    icon: Public,
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
        mini: "AP",
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
        mini: "LP",
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
    icon: Folder,
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
        mini: "AC",
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
        mini: "LC",
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
    icon: CardTravel,
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
        mini: "AP",
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
        mini: "LP",
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
    icon: People,
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
        mini: "AU",
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
        mini: "LU",
        rtlMini: "",
        component: UsersTable,
        layout: "/admin",
        permissions: [
          1
        ]
      },
      {
        render: true,
        path: "/userTypeForm",
        name: "menu.label.userTypes.add",
        rtlName: "",
        mini: "AU",
        rtlMini: "",
        component: UserTypeForm,
        layout: "/admin",
        permissions: [
          1
        ]
      },
      {
        render: true,
        path: "/userTypesTable",
        name: "menu.label.userTypes.table",
        rtlName: "",
        mini: "AU",
        rtlMini: "",
        component: UserTypesTable,
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
    name: "menu.label.newAlert",
    rtlName: "",
    icon: NotificationsActiveIcon,
    state: "newAlertManagement",
    permissions: [
      1
    ],
    views: [
      {
        render: true,
        path: "/newAlertForm",
        name: "menu.label.newAlert.add",
        rtlName: "",
        mini: "AU",
        rtlMini: "",
        component: NewAlertForm,
        layout: "/admin",
        permissions: [
          1
        ]
      },
      {
        render: true,
        path: "/customAlerts",
        name: "menu.label.newAlert.list",
        rtlName: "",
        mini: "AU",
        rtlMini: "",
        component: AlertsTable,
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
    icon: Book,
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
        mini: "AR",
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
        mini: "LR",
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
    icon: Payment,
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
        mini: "LC",
        rtlMini: "",
        component: CollectedTable,
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
        mini: "LN",
        rtlMini: "",
        component: ToCollectTable,
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
    icon: MonetizationOn,
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
        mini: "PP",
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
        mini: "PA",
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
        mini: "AP",
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
    icon: Note,
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
        mini: "MS",
        rtlMini: "",
        component: monthlySalesTable,
        layout: "/admin",
        permissions: [
          1
        ]
      },
      {
        render: true,
        path: "/salesReportByDate",
        name: "menu.label.reports.salesReportByDate",
        rtlName: "",
        mini: "MS",
        rtlMini: "",
        component: SalesReportByDate,
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
    icon: ExitToApp,
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
    mini: "US",
    rtlMini: "",
    component: UserProfile,
    layout: "/admin"
  },
  {
    render: true,
    path: "/editProfilePassword",
    name: "menu.label.profile.editPw",
    rtlName: "",
    mini: "EP",
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