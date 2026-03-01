import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-charges-to-collect',
  templateUrl: './charges-to-collect.component.html',
  styleUrls: ['./charges-to-collect.component.scss']
})
export class ChargesToCollectComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
