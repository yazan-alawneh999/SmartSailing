import {Component, inject, OnInit, signal} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {catchError, single} from 'rxjs';
import {ProductResponse} from '../../response/ProductResponse.type';
import {CommonModule} from '@angular/common';
import {ProductType} from '../../models/Product.type';

@Component({
  selector: 'app-featured',
  imports: [
    CommonModule
  ],
  templateUrl: './featured.component.html',
  styleUrl: './featured.component.css'
})
export class FeaturedComponent  implements OnInit {

  service = inject(ProductService)

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
      }))
      .subscribe(products => {
        console.log(products);
        this.productsSignal.set(products);

        }
      )
  }

  getProductImage(product: ProductType): string {
    return product.productImages?.[0]?.imageUrl || 'https://placehold.co/270x270';
  }

}
