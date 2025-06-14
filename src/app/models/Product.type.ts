import {SubCategory} from './SubCategory.type';
import {Images} from './Images.type';

export type ProductType = {
  id : number
  salePrice: number ;
  subCategory: SubCategory ;
  productImages : Images[]
  deliveryServiceAvailable: boolean ;
  productDescription: string ;
  productName: string ;
}
