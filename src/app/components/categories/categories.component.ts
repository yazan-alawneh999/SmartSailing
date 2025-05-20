import {
  AfterViewChecked,
  Component,
  inject,
  NgZone,
  OnInit,
  signal
} from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { catchError } from 'rxjs';
import { SubCategoryResponse } from '../../response/SubCategoryResponse.type';
import { CommonModule } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit, AfterViewChecked {
  categoryService = inject(CategoryService);
  ngZone = inject(NgZone); // ✅

  subCategories = signal<SubCategoryResponse>({
    _embedded: {
      subCategoryDtoList: [],
      page: {
        size: 0,
        totalElements: 0,
        totalPages: 0,
        number: 0
      }
    }
  });

  hasInitialized = false;

  ngOnInit(): void {
    this.getSubCategories('Example Store');
  }

  getSubCategories(storeName: string) {
    this.categoryService
      .getSubCategories(storeName)
      .pipe(
        catchError((err) => {
          console.error(err);
          throw err;
        })
      ) .subscribe((category: SubCategoryResponse) => {
      this.subCategories.set(category);
      this.hasInitialized = false; // allow view check to run again
    });
  }

  ngAfterViewChecked(): void {
    const list = this.subCategories()?._embedded?.subCategoryDtoList ?? [];

    if (list.length > 0 && !this.hasInitialized) {
      this.hasInitialized = true;

      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          // ✅ Make sure previous instance is destroyed (optional)
          if ($('.categories__slider').hasClass('owl-loaded')) {
            $('.categories__slider').trigger('destroy.owl.carousel').removeClass('owl-loaded');
            $('.categories__slider').find('.owl-stage-outer').children().unwrap();
          }

          // ✅ This matches the Ogani JS file setup
          $('.categories__slider').owlCarousel({
            loop: true,
            margin: 0,
            items: 4,
            dots: false,
            nav: true,
            navText: [
              "<span class='fa fa-angle-left'><span/>",
              "<span class='fa fa-angle-right'><span/>"
            ],
            animateOut: 'fadeOut',
            animateIn: 'fadeIn',
            smartSpeed: 1200,
            autoHeight: false,
            autoplay: true,
            responsive: {
              0: { items: 1 },
              480: { items: 2 },
              768: { items: 3 },
              992: { items: 4 }
            }
          });

          // ✅ Set background images
          $('.set-bg').each((_: any, element: any) => {
            const bg = $(element).data('setbg');
            $(element).css('background-image', 'url(' + bg + ')');
          });
        }, 0); // delay 0ms to allow DOM update
      });
    }
  }

  //     .subscribe((category: SubCategoryResponse) => {
  //       console.log('API Response:', category);
  //       this.subCategories.set(category);
  //       this.hasInitialized = false; // Allow re-init after data arrives
  //     });
  // }
  //
  // ngAfterViewChecked(): void {
  //   const list = this.subCategories()._embedded.subCategoryDtoList;
  //   if (list.length > 0 && !this.hasInitialized) {
  //     this.hasInitialized = true;
  //
  //     // ✅ Wait for DOM to finish updating after Angular change detection
  //     this.ngZone.runOutsideAngular(() => {
  //       setTimeout(() => {
  //         console.log('Initializing Owl Carousel...');
  //         $('.categories__slider').owlCarousel({
  //           loop: true,
  //           margin: 10,
  //           items: 4,
  //           autoplay: true,
  //           autoplayTimeout: 3000,
  //           nav: true,
  //           dots: false,
  //           responsive: {
  //             0: { items: 1 },
  //             600: { items: 2 },
  //             1000: { items: 4 }
  //           }
  //         });
  //
  //         $('.set-bg').each((_: any, element: any) => {
  //           const bg = $(element).data('setbg');
  //           $(element).css('background-image', 'url(' + bg + ')');
  //         });
  //       }, 100); // slight delay ensures DOM is ready
  //     });
  //   }
  // }
}
