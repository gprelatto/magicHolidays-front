import Dashboard from "views/Dashboard/Dashboard.js";

import SupplierForm from "views/Products/SupplierForm.js";
import SupplierTable from "views/Products/SupplierTable.js";
import ProductCategoryForm from "views/Products/ProductCategoryForm.js";
import ProductForm from "views/Products/ProductForm.js";
import ProductCategoryTable from "views/Products/ProductCategoryTable.js";
import ProductTable from "views/Products/ProductTable.js";
import CustomerForm from "views/Customers/CustomerForm.js"
import CustomerTable from "views/Customers/CustomerTable.js"

// @material-ui/icons
import Apps from "@material-ui/icons/Apps";
import DashboardIcon from "@material-ui/icons/Dashboard";
import DateRange from "@material-ui/icons/DateRange";
import GridOn from "@material-ui/icons/GridOn";
import Image from "@material-ui/icons/Image";
import Place from "@material-ui/icons/Place";
import Timeline from "@material-ui/icons/Timeline";
import WidgetsIcon from "@material-ui/icons/Widgets";

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: DashboardIcon,
    component: Dashboard,
    layout: "/admin"
  },
  {
    collapse: true,
    name: "Customers",
    rtlName: "",
    icon: Place,
    state: "customersManagement",
    views: [
      {
        path: "/customerAdd",
        name: "Add Customer",
        rtlName: "",
        mini: "RF",
        rtlMini: "",
        component: CustomerForm,
        layout: "/admin"
      },
      {
        path: "/customerTable",
        name: "List Customers",
        rtlName: "",
        mini: "RF",
        rtlMini: "",
        component: CustomerTable,
        layout: "/admin"
      }
    ]
  },
  {
    collapse: true,
    name: "Suppliers",
    rtlName: "",
    icon: Place,
    state: "suppliersCollapse",
    views: [
      {
        path: "/supplierAdd",
        name: "Add Supplier",
        rtlName: "",
        mini: "RF",
        rtlMini: "",
        component: SupplierForm,
        layout: "/admin"
      },
      {
        path: "/supplierTable",
        name: "List Suppliers",
        rtlName: "",
        mini: "RF",
        rtlMini: "",
        component: SupplierTable,
        layout: "/admin"
      }
    ]
  },
  {
    collapse: true,
    name: "Product Categories",
    rtlName: "",
    icon: Place,
    state: "prodCategoriesCollapse",
    views: [
      {
        path: "/productCategoryAdd",
        name: "Add Product Category",
        rtlName: "",
        mini: "RF",
        rtlMini: "",
        component: ProductCategoryForm,
        layout: "/admin"
      },
      {
        path: "/productCategoryTable",
        name: "List Product Categories",
        rtlName: "",
        mini: "RF",
        rtlMini: "",
        component: ProductCategoryTable,
        layout: "/admin"
      }
    ]
  },
  {
    collapse: true,
    name: "Products",
    rtlName: "",
    icon: Place,
    state: "productsManagement",
    views: [
      {
        path: "/productAdd",
        name: "Add Product",
        rtlName: "",
        mini: "RF",
        rtlMini: "",
        component: ProductForm,
        layout: "/admin"
      },
      {
        path: "/productTable",
        name: "List Products",
        rtlName: "",
        mini: "RF",
        rtlMini: "",
        component: ProductTable,
        layout: "/admin"
      }
    ]
  }
];

export default dashRoutes;