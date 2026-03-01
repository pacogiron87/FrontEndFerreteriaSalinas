import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  title = 'Ferretería Salinas - Billing System';
  
  private readonly titleService = inject(Title);

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
  }
}
