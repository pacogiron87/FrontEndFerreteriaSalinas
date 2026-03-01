import { Component, OnInit, signal, inject, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

// PrimeNG 21 Standalone Components
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';

// Services
import { CategoryService } from "../services/category.service";
import { UtilitiesService } from "src/app/core/helpers/utilities.service";

// Models & Enums
import { Category } from "../models/category.model";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    TooltipModule,
    ToastModule,
    TagModule,
    CardModule,
    RippleModule,
    SelectModule
  ],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);
  public readonly utilitiesService = inject(UtilitiesService);

  readonly isModalVisible = signal(false);
  readonly categoryId = signal(0);
  readonly categoryIsActive = signal(true);
  readonly modalTitle = signal('Agregar categoría');

  readonly categories = toSignal(this.categoryService.selectCategories(), { initialValue: [] });
  readonly loading = toSignal(this.categoryService.selectIsLoading(), { initialValue: true });

  categoryForm!: FormGroup;

  readonly savedCategory = toSignal(this.categoryService.selectSavedCategory());

  constructor() {
    this.initForm();
    effect(() => {
      const saved = this.savedCategory();
      if (saved) this.handleCategoryUpdate(saved);
    });
  }

  ngOnInit(): void { this.categoryService.getAllCategories(); }

  private initForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
    });
  }

  toggleModal(category?: Category): void {
    if (category) {
      this.categoryId.set(category.id); this.categoryIsActive.set(category.active); this.modalTitle.set('Editar categoría');
      this.categoryForm.patchValue({ name: category.name !== 'null' ? category.name : '', description: category.description !== 'null' ? category.description : '' });
    } else {
      this.categoryId.set(0); this.categoryIsActive.set(true); this.modalTitle.set('Agregar categoría');
      this.categoryForm.reset();
    }
    this.isModalVisible.set(true);
  }

  saveChanges(): void {
    if (this.categoryForm.valid) {
      const category: Category = { ...this.categoryForm.value, id: this.categoryId(), active: this.categoryIsActive() };
      if (this.categoryId() > 0) this.categoryService.updateCategory(category);
      else this.categoryService.createCategory(category);
      this.isModalVisible.set(false);
    }
  }

  changeStatus(category: Category, active: boolean): void { this.categoryService.changeStatusCategory(category.id, active); }

  private handleCategoryUpdate(c: Category): void {
    const list = [...this.categories()];
    const idx = list.findIndex(x => x.id === c.id);
    if (idx >= 0) { if (!c.name) list[idx] = { ...list[idx], active: !list[idx].active }; else list[idx] = c; }
    else list.push(c);
    this.categoryService.updateCategories(list);
  }

  handleModalChange(event: boolean): void { this.isModalVisible.set(event); if (!event) { this.categoryForm.reset(); this.categoryId.set(0); } }
}
