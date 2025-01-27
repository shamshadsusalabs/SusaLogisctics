import { Routes } from '@angular/router';

export const routes: Routes = [



  {
    path: '',
    loadComponent: () => import('./Authentication/login/login.component').then(c => c.LoginComponent)
  },


  {
    path: 'registation',
    loadComponent: () => import('./Authentication/registation/registation.component').then(c => c.RegistationComponent)
  },

  {
    path: 'Super-Admin-dashboard',

    loadComponent: () => import('./SuperAdmin/dashboard/dashboard.component').then(c => c.DashboardComponent),
    children: [
      {
        path: '',
        redirectTo: 'main-content-SuperAdmin',
        pathMatch: 'full'
      },
      {
        path: 'main-content-SuperAdmin',
        loadComponent: () => import('./SuperAdmin/main-component/main-component.component').then(c => c.MainComponentComponent)
      },

      {
        path: 'drive-getAll',
        loadComponent: () => import('./SuperAdmin/driver/driver.component').then(c => c.DriverComponent)
      },
      {
        path: 'driver-selectedDriver/:_id',
        loadComponent: () => import('./SuperAdmin/driver-details/driver-details.component').then(c => c.DriverDetailsComponent)
      },
      {
        path: 'vendor-getAll',
        loadComponent: () => import('./SuperAdmin/vendor/vendor.component').then(c => c.VendorComponent)
      },
      {
        path: 'vendor-selectedventor/:_id',
        loadComponent: () => import('./SuperAdmin/vendor-details/vendor-details.component').then(c => c.VendorDetailsComponent)
      },
      {
        path: 'operator-getAll',
        loadComponent: () => import('./SuperAdmin/operator/operator.component').then(c => c.OperatorComponent )
      },
      {
        path: 'operator-selectedoperator/:_id',
        loadComponent: () => import('./SuperAdmin/operator-details/operator-details.component').then(c => c.OperatorDetailsComponent)
      },
      {
        path: 'All-Vehicals',
        loadComponent: () => import('./SuperAdmin/all-vehicals/all-vehicals.component').then(c => c.AllVehicalsComponent )
      },
      {
        path: 'Vehical-request',
        loadComponent: () => import('./SuperAdmin/vehicalrequest/vehicalrequest.component').then(c => c.VehicalrequestComponent)
      },
      {
        path: 'patner-getAll',
        loadComponent: () => import('./SuperAdmin/patner/patner.component').then(c => c.PatnerComponent)
      },
      {
        path: 'patner-selectedpatner/:_id',
        loadComponent: () => import('./SuperAdmin/patner-deatails/patner-deatails.component').then(c => c.PatnerDeatailsComponent)
      },
      {
        path: 'invoices',
        loadComponent: () => import('./SuperAdmin/invoices/invoices.component').then(c => c.InvoicesComponent)
      },

    ]
  },

  {
    path: 'Vendor-Admin-dashboard',

    loadComponent: () => import('./Vendor/dashboard/dashboard.component').then(c => c.DashboardComponent),
    children: [
      {
        path: '',
        redirectTo: 'main-content-Vendor',
        pathMatch: 'full'
      },
      {
        path: 'main-content-Vendor',
        loadComponent: () => import('./Vendor/main-component/main-component.component').then(c => c.MainComponentComponent)
      },

      {
        path: 'vendor-profile',
        loadComponent: () => import('./Vendor/profile/profile.component').then(c => c.ProfileComponent)
      },
      {
        path: 'All-Vendor-Vehical',
        loadComponent: () => import('./Vendor/all-vehicals/all-vehicals.component').then(c => c.AllVehicalsComponent)
      },
      {
        path: 'Add-vehical',
        loadComponent: () => import('./Vendor/vehical/vehical.component').then(c => c.VehicalComponent)
      },
      {
        path: 'history',
        loadComponent: () => import('./Vendor/history/history.component').then(c => c.HistoryComponent)
      },


    ]
  },

  {
    path: 'Operator-Admin-dashboard',

    loadComponent: () => import('./Operator/dashboard/dashboard.component').then(c => c.DashboardComponent),
    children: [
      // {
      //   path: '',
      //   redirectTo: 'main-content-SuperAdmin',
      //   pathMatch: 'full'
      // },
      // {
      //   path: 'main-content-SuperAdmin',
      //   loadComponent: () => import('./Super_Admin/super-main-componet/super-main-componet.component').then(c => c.SuperMainComponetComponent)
      // },


      {
        path: 'Operator-All-Vehical',
        loadComponent: () => import('./Operator/all-vehicals/all-vehicals.component').then(c => c.AllVehicalsComponent)
      },



    ]
  },
  {
    path: 'Patner-Admin-dashboard',

    loadComponent: () => import('./Patner/dashboard/dashboard.component').then(c => c.DashboardComponent),
    children: [
      {
        path: '',
        redirectTo: 'main-content-Patner',
        pathMatch: 'full'
      },
      {
        path: 'main-content-Patner',
        loadComponent: () => import('./Patner/main-content/main-content.component').then(c => c.MainContentComponent)
      },


      {
        path: 'Patner-Order-vehical',
        loadComponent: () => import('./Patner/order-vehical/order-vehical.component').then(c => c.OrderVehicalComponent)
      },
      {
        path: 'History',
        loadComponent: () => import('./Patner/history/history.component').then(c => c.HistoryComponent)
      },
      {
        path: 'Invoices',
        loadComponent: () => import('./Patner/invoices/invoices.component').then(c => c.InvoicesComponent)
      },



    ]
  },
];
