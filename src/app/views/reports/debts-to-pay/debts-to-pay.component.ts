import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-debts-to-pay',
  templateUrl: './debts-to-pay.component.html',
  styleUrls: ['./debts-to-pay.component.scss']
})
export class DebtsToPayComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
