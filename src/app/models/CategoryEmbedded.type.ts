import {CategoryItem} from './category.type';
import {Page} from './page.type';
import {SubCategory} from './SubCategory.type';

export  type CategoryEmbedded= {
  categoryDtoList: Array<CategoryItem>,
  page :Page

}
