import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';
import { DrawerService } from '../../services/drawer.service';

interface NavItem {
  path: string;
  label: string;
}

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  cartItemCount = 0;
  isMobileMenuOpen = false;

  navItems: NavItem[] = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/cart', label: 'Cart' },
    // { path: '/checkout', label: 'Checkout' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' }
  ];

  constructor(
    private router: Router,
    private cartService: CartService,
    private drawerService: DrawerService
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    });
  }

  openDrawer() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.drawerService.open();
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
