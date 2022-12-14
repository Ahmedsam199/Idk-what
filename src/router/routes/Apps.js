// ** React Imports
import { element } from 'prop-types'
import { lazy } from 'react'
const Customer = lazy(() => import('../../views/App/Customer'))
const CustomerPOST = lazy(() => import('../../views/App/Customer/post'))
const Permissions = lazy(() => import('../../views/App/Permissions'))
const Permissions_POST = lazy(() => import('../../views/App/Permissions/post'))
const Contract_contract=lazy(()=>import('../../views/App/contract/contracts'))
const Contract_Payment=lazy(()=>import('../../views/App/contract/payment'))
const Contract_New=lazy(()=>import('../../views/App/contract/contracts/post'))
const Contract_Payment_New=lazy(()=>import('../../views/App/contract/payment/post'))
const Properity_Owner=lazy(()=>import('../../views/App/Property/party'))
const Properity_Attribute=lazy(()=>import('../../views/App/Property/Property_Attribute'))
const Properity_Property=lazy(()=>import('../../views/App/Property/Property'))
const Properity_Property_New=lazy(()=>import('../../views/App/Property/Property/post'))
const Properity_Terrority=lazy(()=>import('../../views/App/Property/Terrority'))
const Setup_Branches=lazy(()=>import('../../views/App/Setup/Branches'))
const UOM = lazy(() => import('../../views/App/UOM'))
const Setup_Template=lazy(()=>import('../../views/App/Setup/contractTemplate'))
const Setup_ContractType=lazy(()=>import('../../views/App/Setup/ContractType'))
const Setup_Permission=lazy(()=>import('../../views/App/Setup/Permissions'))
const Setup_Purpose=lazy(()=>import('../../views/App/Setup/Purpose'))
const Setup_User_Role=lazy(()=>import('../../views/App/Setup/UserRole'))
const Setup_User=lazy(()=>import('../../views/App/Setup/User'))
const Editor=lazy(()=>import('../../views/App/Setup/contractTemplate/post'))
const Dashboad=lazy(()=>import('../../views/App/Dashboard/index'))
const AppRoutes = [
  {
    element: <Customer />,
    path: "/App/Customer",
  },{
element:<Dashboad />,
path: "/DashBoard"
  },
  {
    element :<Editor />,
    path:"/newTemp"
  },
  {
    element: <Contract_New />,
    path: "/contract/New",
  },
  {
    element: <Setup_User />,
    path: "/Setup/User",
  },
  {
    element: <Setup_User_Role />,
    path: "/Setup/UserRole",
  },
  {
    element: <Setup_Purpose />,
    path: "/Setup/Purpose",
  },
  {
    element: <Setup_Permission />,
    path: "/Setup/Permission",
  },
  {
    element: <Setup_ContractType />,
    path: "/Setup/ContractType",
  },
  {
    element: <Setup_Template />,
    path: "/Setup/Template",
  },
  {
    element: <Properity_Terrority />,
    path: "/Properity/Terrority",
  },
  {
    element: <Properity_Property_New />,
    path: "/Properity/Property/New",
  },
  {
    element: <Properity_Property />,
    path: "Properity/Properity",
  },
  {
    element: <Properity_Owner />,
    path: "/Properity/Owner",
  },
  {
    element: <Properity_Attribute />,
    path: "/Properity/Attribute",
  },
  {
    element: <Setup_Branches />,
    path: "/Setup/Branchies",
  },
  {
    path: "/App/NewCustomer",
    element: <CustomerPOST />,
  },
  {
    path: "/App/Contract/Contract",
    element: <Contract_contract />,
  },
  {
    element: <CustomerPOST />,
    path: "/App/UpdateCustomer/:series",
  },
  {
    element: <Contract_Payment_New />,
    path: "/App/Contract/Payment/new",
  },
  {
    element: <Contract_Payment />,
    path: "/App/Contract/Payment",
  },
  // {
  //   element: lazy(() => import('../../views/App/GeneralLedger')),
  //   path: '/App/GeneralLedger',
  //   meta: {
  //     appLayout: true,
  //   }
  // },
  {
    element: <Permissions />,
    path: "/App/Permissions",
    meta: {
      appLayout: true,
    },
  },
  {
    element: <Permissions_POST />,
    path: "/App/NewPermissions",
    meta: {
      appLayout: true,
    },
  },
  {
    element: <Permissions_POST />,
    path: "/App/UpdatePermissions/:series",
    meta: {
      appLayout: true,
    },
  },
  {
    element: <UOM />,
    path: "/App/UOM",
  },
];

export default AppRoutes
