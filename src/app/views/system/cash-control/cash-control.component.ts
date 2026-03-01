import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-cash-control',
  templateUrl: './cash-control.component.html',
  styleUrls: ['./cash-control.component.scss']
})
export class CashControlComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
