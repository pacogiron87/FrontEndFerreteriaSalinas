import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";

import {CategoryService} from "../services/category.service";
import {UtilitiesService} from "src/app/core/helpers/utilities.service";

import {Category} from "../models/category.model";
import {StatusTypeData} from "src/app/core/enums/status-type-data.enum";


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {
  // @ts-ignore
  categoryForm: FormGroup;
  categories: Category[] = [];
  categoryId = 0;
  categoryIsActive = true;
  loading = true;
  isModalVisible = false;
  modalTitle: string | undefined;
  subscriptions: Subscription[] = [];
  statusTypeData = StatusTypeData;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    public utilitiesService: UtilitiesService,
  ) {
  }

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
    });

    this.categoryService.getAllCategories();
    this.subscriptions[0] = this.categoryService.selectCategories().subscribe(categories => [...this.categories] = categories);
    this.subscriptions[1] = this.categoryService.selectIsLoading().subscribe(isLoading => this.loading = isLoading);
    this.subscriptions[2] = this.categoryService.selectSavedCategory().subscribe(category => this.updateCategory(category));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  toggleModal(category: Category | undefined = undefined): void {
    this.isModalVisible = !this.isModalVisible;

    if (category) {
      this.categoryId = category.id;
      this.categoryIsActive = category.active;
      this.modalTitle = 'Editar categoria';
      this.setFormData(category);
    } else {
      this.categoryId = 0;
      this.categoryIsActive = true;
      this.modalTitle = 'Agregar categoria';
    }
  }

  handleModalChange(event: boolean): void {
    this.isModalVisible = event;

    if (!event) {
      this.categoryForm.reset();
      this.categoryId = 0;
      this.categoryIsActive = true;
    }
  }

  saveChanges(): void {
    const category = this.buildCategory();

    if (this.categoryId > 0) {
      this.categoryService.updateCategory(category);
    } else {
      this.categoryService.createCategory(category);
    }

    this.isModalVisible = false;
  }

  changeStatus(category: Category, active: boolean): void {
    this.categoryService.changeStatusCategory(category.id, active);
  }

  updateCategory(category: Category): void {
    if (category) {
      const index = this.categories.findIndex(c => c.id === category.id);

      const categories = [...this.categories];
      if (index >= 0) {

        if (!category.name) {
          category = {...categories[index]};
          category.active = !category.active;
          categories[index] = category;
          this.categoryService.updateCategories(categories);
        } else {
          categories[index] = category;
          this.categoryService.updateCategories(categories);
        }

      } else {
        categories.push(category);
        this.categoryService.updateCategories(categories);
      }
    }
  }

  setFormData(category: Category): void {
    this.categoryForm.setValue({
      name: category.name === 'null' ? null : category.name,
      description: category.description === 'null' ? null : category.description,
    });
  }

  buildCategory(): Category {
    const category: Category = this.categoryForm.value;
    category.id = this.categoryId;
    category.active = this.categoryIsActive;

    return category;
  }

}
