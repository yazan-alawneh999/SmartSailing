import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './components/header/header.component';
import {CategoriesComponent} from './components/categories/categories.component';
import {FeaturedComponent} from './components/featured/featured.component';
import {PannerComponent} from './components/panner/panner.component';
import {LatestProductComponent} from './components/latest-product/latest-product.component';
import {FooterComponent} from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, CategoriesComponent, FeaturedComponent, PannerComponent, LatestProductComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SmartSailing';
}
