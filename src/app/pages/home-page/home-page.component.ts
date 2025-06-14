import { Component } from '@angular/core';
import {FeaturedComponent} from '../../components/featured/featured.component';
import {PannerComponent} from '../../components/panner/panner.component';
import {LatestProductComponent} from '../../components/latest-product/latest-product.component';
import {CategoriesComponent} from '../../components/categories/categories.component';
import {DepartmentsComponent} from '../../components/departments/departments.component';

@Component({
  selector: 'app-home-page',
  imports: [
    FeaturedComponent,
    PannerComponent,
    LatestProductComponent,
    CategoriesComponent,
    DepartmentsComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
