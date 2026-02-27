import {Component, OnInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {IconSetService} from '@coreui/icons-angular';
import {Title} from '@angular/platform-browser';

import {iconSubset} from './icons/icon-subset';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'body',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  title = 'Tipografía Cerna';

  constructor(
    private router: Router,
    private titleService: Title,
    private iconSetService: IconSetService
  ) {
    titleService.setTitle(this.title);
    // iconSet singleton
    iconSetService.icons = {...iconSubset};
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });
  }
}
