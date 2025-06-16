import {Component, inject, OnInit, signal} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {catchError, single} from 'rxjs';
import {ProductResponse} from '../../response/ProductResponse.type';
import {CommonModule} from '@angular/common';
import {ProductType} from '../../models/Product.type';
import {CartService} from '../../services/cart.service';
import {RouterLink} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

@Component({
  selector: 'app-featured',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './featured.component.html',
  styleUrl: './featured.component.css'
})
export class FeaturedComponent  implements OnInit {

  service = inject(ProductService)
  cartService = inject(CartService)
  snackBar = inject(MatSnackBar)
  router = inject(Router)


  productsSignal = signal<ProductResponse>({
    _embedded: {
      productPublicDtoList: [
        {
          id: 0,
          salePrice: 0,
          subCategory: {
            id: 0,
            subCategoryName: '',
            imageUrl: '',
            category: {
              id: 0,
              categoryName: '',
              imageUrl: '',

              createdAt:  '',
              updatedAt: '',
              storeId: 0
            }
          },
          productImages: [],
          deliveryServiceAvailable: false,
          productDescription: '',
          productName: ''
        }
      ],
      page: {
        size: 0,
        totalElements: 0,
        totalPages: 0,
        number: 0
      }
    }
  });


  ngOnInit(): void {
    this.getAllProducts("Example Store")
  }


  getAllProducts(storeName: string) {
    this.service.getAllProducts(storeName)
      .pipe(catchError((err)=>{
        throw err
      })).subscribe(products => {
        console.log(products);
        this.productsSignal.set(products);

        }
      )
  }

  getProductImage(product: ProductType): string {
    return product.productImages?.[0]?.imageUrl || 'https://placehold.co/270x270';
  }

  addProduct(product: ProductType) {
    this.cartService.addToCart(product);
    this.showCartNotification();
  }

  private showCartNotification() {
    const snackBarRef = this.snackBar.open(
      'Product added to cart successfully!',
      'View Cart',
      {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['success-snackbar']
      }
    );

    snackBarRef.onAction().subscribe(() => {
      this.router.navigate(['/cart']);
    });
  }

}
