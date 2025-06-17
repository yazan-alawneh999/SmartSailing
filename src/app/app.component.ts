import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { DrawerService } from './services/drawer.service';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SmartSailing';
  drawerOpen = false;
  cartItemCount = 0;

  constructor(
    private drawerService: DrawerService,
    private cartService: CartService,
    private router: Router
  ) {
    this.drawerService.isOpen$.subscribe(open => this.drawerOpen = open);
    this.cartService.cart$.subscribe(cart => {
      this.cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    });
  }

  closeDrawer() {
    this.drawerService.close();
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
