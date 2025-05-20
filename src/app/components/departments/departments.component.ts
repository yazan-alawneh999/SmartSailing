import {Component, inject, OnInit, signal} from '@angular/core';
import {CategoryService} from '../../services/category.service';
import {catchError} from 'rxjs';
import {CategoryResponse} from '../../response/CategoryResponse.type';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-departments',
  imports: [
    CommonModule
  ],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css'
})
export class DepartmentsComponent implements OnInit {
  service = inject(CategoryService);
  showCategories = signal(true)

 categories = signal<CategoryResponse>({
    _embedded: {
      categoryDtoList: [],
      page: {
        size: 0,
        totalElements: 0,
        totalPages: 0,
        number: 0
      }
    }
  });

  ngOnInit(): void {
    this.getCategories("Example Store")
  }

  getCategories(storeName :string){
    this.service.getCategories(storeName)
      .pipe(catchError((err:any)=>{
        throw  err
      }))
    .subscribe(
      data => {
        this.categories.set(data)
      }
    )
  }


  toggleCategories(){
    this.showCategories.update(val => !val);
  }


}
