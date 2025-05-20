import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {apiConst} from '../api/api.const';
import {SubCategory} from '../models/SubCategory.type';
import {SubCategoryResponse} from '../response/SubCategoryResponse.type';
import {CategoryResponse} from '../response/CategoryResponse.type';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  baseUrl = apiConst.baseUrl;

  httpClient = inject(HttpClient)

  getSubCategories(storeName :string){
    return this.httpClient.get<SubCategoryResponse>(`/category-service/api/subcategory/public/${storeName}`);
  }


  getCategories(storeName :string){
    return this.httpClient.get<CategoryResponse>(`/category-service/api/category/public/${storeName}`);
  }

}
