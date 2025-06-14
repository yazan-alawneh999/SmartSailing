import { Routes } from '@angular/router';

export const routes: Routes = [{
  path : '',
  pathMatch: 'full',
  loadComponent : () => import('./pages/home-page/home-page.component').then(
    m => m.HomePageComponent
  )
}
// ,
  // {
  //   path : 'cart',
  //   loadComponent: () => import('./pages/cart-page/cart-page.component').then(
  //     m => m.CartPageComponent
  //   )
  // }
  ];
