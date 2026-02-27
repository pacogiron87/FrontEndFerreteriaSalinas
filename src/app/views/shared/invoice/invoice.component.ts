import {Component, OnInit} from '@angular/core';

import jsPDF from "jspdf";
import html2canvas from "html2canvas"

import {Sale} from "src/app/views/income/models/sale.model";

import {environment} from "src/environments/environment";

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  sale: Sale = {
    active: false,
    comment: "",
    customer_id: 0,
    exception_sale: 0,
    invoice_number: 0,
    invoice_status: "",
    invoice_total: 0,
    invoice_total_letters: "",
    invoice_type: "",
    is_pending: false,
    is_pending_pay: "",
    location_id: 0,
    number_resolution_tax: null,
    saleDetails: [],
    sub_total_sale: 0,
    tax_credit_sale: 0,
    tax_non_credit_sale: 0,
    tax_perceived: 0,
    tax_reteined: 0,
    tax_sale: 0,
    total_sale: 0,
    user_id: '0',
    is_retry: false
  };

  constructor() {
  }

  ngOnInit(): void {
  }

  generateInvoice(sale: Sale): void {
    this.sale = sale;

    setTimeout(() => {
      const DATA = document.getElementById('htmlData');
      //const doc = new jsPDF('p', 'pt', [100.00, 200.00]);
      const doc = new jsPDF('l', 'pt', 'letter');
      const options = {
        background: 'white',
        scale: 3,
      };

      // @ts-ignore
      html2canvas(DATA, options)
        .then(canvas => {
          const img = canvas.toDataURL('image/png');
          const bufferX = 15;
          const bufferY = 15;
          const imgProps = doc.getImageProperties(img);
          const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
          return doc;
        })
        .then(result => {
          window.open(URL.createObjectURL(result.output('blob')));
          // @ts-ignore
          this.sale = [];
        });
    }, environment.timeToCreateInvoice);
  }

}
