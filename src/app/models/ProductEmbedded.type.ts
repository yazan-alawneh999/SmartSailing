import {CategoryItem} from './category.type';
import {Page} from './page.type';
import {SubCategory} from './SubCategory.type';
import {ProductType} from './Product.type';

export  type ProductEmbedded= {
  productPublicDtoList: Array<ProductType>,
  page :Page

}
