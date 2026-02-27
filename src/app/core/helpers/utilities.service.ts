import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// @ts-ignore
import numbers from 'numeros_to_words';
import * as dayjs from 'dayjs';

import { environment } from 'src/environments/environment';

import { StatusTypeData } from '../enums/status-type-data.enum';
import { TypeParam } from '../enums/type-param.enum';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
  private initialConfiguration = false;

  constructor(private http: HttpClient) {}

  /**
   * Converts parameter type to the specified type
   * @param params
   * @param typeParams
   */
  convertParams(params: Object, typeParams: TypeParam): any {
    switch (typeParams) {
      case TypeParam.QUERY:
        let url = '';

        Object.entries(params).forEach(([key, value], index) => {
          if (key !== 'type') {
            index === 0
              ? (url = `${url}?${key}=${value}`)
              : (url = `${url}&${key}=${value}`);
          }
        });

        return url;
      case TypeParam.FORMDATA:
        const body: any = new FormData();

        Object.entries(params).forEach(([key, value]) => {
          if (key !== 'type') {
            body.append(key, value);
          }
        });

        return body;
      case TypeParam.JSON:
        const genericObject = Object();

        Object.entries(params).forEach(([key, value]) => {
          if (key !== 'type') {
            genericObject[key] = value;
          }
        });

        return genericObject;
    }
  }

  /**
   * Convert numeric values to text with monetary endings
   * @param quantity
   */
  convertNumberToWords(quantity: number): string {
    if (!this.initialConfiguration) {
      numbers().Config._setSingular(environment.currency.singular);
      numbers().Config._setPlural(environment.currency.plural);
      numbers().Config._setCentsSingular(environment.currency.centsSingular);
      numbers().Config._setCentsPlural(environment.currency.centsPlural);
      this.initialConfiguration = true;
    }

    return numbers(quantity).Capitalize().toString();
  }

  /**
   * Format the date to the specified format
   * @param date
   * @param format
   */
  formatDate(date: any, format = 'YYYY-MM-DD'): string {
    return date !== null && date !== '' ? dayjs(date).format(format) : '';
  }

  /**
   * Get the currency without the tax
   * @param currency
   */
  getCurrencyWithoutTax(currency: number): number {
    return currency / this.getTaxWithInteger();
  }

  getCurrencyCollectedTax(currency: number): number {
    return currency / this.getTaxCollectedInteger();
  }

  /**
   * Get the tax with integer value
   */
  getTaxWithInteger(): number {
    return environment.taxes.tax / 100 + 1;
  }

  getTaxCollectedInteger(): number {
    return environment.taxes.taxCollected / 100 + 1;
  }

  /**
   * Get the currency tax
   * @param currency
   */
  getCurrencyTax(currency: number): number {
    const tax = environment.taxes.tax / 100;
    return currency * tax;
  }

  /**
   * Get the tax with held
   */
  getTaxWithHeld(): number {
    return environment.taxes.taxWithHeld / 100;
  }

  /**
   * Get color or name from status
   * @param status
   * @param type
   * @param canceled
   */
  getFromStatus(
    status: boolean,
    type = StatusTypeData.COLOR,
    canceled = false
  ): string {
    if (status) {
      return type == StatusTypeData.COLOR
        ? 'success'
        : canceled
        ? 'Activa'
        : 'Activo';
    } else {
      return type == StatusTypeData.COLOR
        ? 'danger'
        : canceled
        ? 'Anulada'
        : 'Inactivo';
    }
  }

  /**
   * Get color from status of the invoice
   * @param status
   */
  getColorFromInvoiceStatus(status: string): string {
    if (status) {
      switch (status.toLowerCase().trim()) {
        case 'notificado por email':
          return 'success';
        case 'procesado por mh':
          return 'info';
        case 'rechazado por mh':
          return 'danger';
        default:
          return 'warning';
      }
    } else {
      return 'light';
    }
  }

  getColorFromIsPayStatus(statusPay: string): string {
    if (statusPay) {
      switch (statusPay.toLowerCase().trim()) {
        case 'pendiente de pago':
          return 'danger';

        default:
          return 'success';
      }
    } else {
      return 'light';
    }
  }

  /**
   * Download the specified file
   * @param url The base URL of the JSON
   * @param filename The file name without extension
   * @param extension The extension of the file 
   */
  downloadFile(url: string, filename: string = 'data', extension: string = 'json'): void {
    this.http
      .get(`${url}/${filename}.${extension}`, { responseType: 'json' })
      .subscribe((data) => {
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const urlBlob = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = urlBlob;
        link.download = `${filename}.${extension}`;
        link.click();

        window.URL.revokeObjectURL(urlBlob);
      });
  }
}
