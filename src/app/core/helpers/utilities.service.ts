import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import numbers from 'numeros_to_words';
import dayjs from 'dayjs';

import { environment } from 'src/environments/environment';

import { StatusTypeData } from '../enums/status-type-data.enum';
import { TypeParam } from '../enums/type-param.enum';

export type PrimeNGSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
  private readonly http = inject(HttpClient);
  private initialConfiguration = false;

  convertParams(params: Object, typeParams: TypeParam): any {
    switch (typeParams) {
      case TypeParam.QUERY:
        let url = '';
        Object.entries(params).forEach(([key, value], index) => {
          if (key !== 'type') {
            index === 0 ? (url = `${url}?${key}=${value}`) : (url = `${url}&${key}=${value}`);
          }
        });
        return url;
      case TypeParam.FORMDATA:
        const body: any = new FormData();
        Object.entries(params).forEach(([key, value]) => {
          if (key !== 'type') body.append(key, value);
        });
        return body;
      case TypeParam.JSON:
        const genericObject = Object();
        Object.entries(params).forEach(([key, value]) => {
          if (key !== 'type') genericObject[key] = value;
        });
        return genericObject;
    }
  }

  convertNumberToWords(quantity: number): string {
    if (!this.initialConfiguration) {
      const config = (numbers as any)().Config;
      config._setSingular(environment.currency.singular);
      config._setPlural(environment.currency.plural);
      config._setCentsSingular(environment.currency.centsSingular);
      config._setCentsPlural(environment.currency.centsPlural);
      this.initialConfiguration = true;
    }
    return (numbers as any)(quantity).Capitalize().toString();
  }

  formatDate(date: any, format = 'YYYY-MM-DD'): string {
    return date !== null && date !== '' ? dayjs(date).format(format) : '';
  }

  getCurrencyWithoutTax(currency: number): number {
    return currency / this.getTaxWithInteger();
  }

  getTaxWithInteger(): number {
    return environment.taxes.tax / 100 + 1;
  }

  getTaxCollectedInteger(): number {
    return environment.taxes.taxCollected / 100 + 1;
  }

  getCurrencyTax(currency: number): number {
    return currency * (environment.taxes.tax / 100);
  }

  getTaxWithHeld(): number {
    return environment.taxes.taxWithHeld / 100;
  }

  getFromStatus(status: boolean, type = StatusTypeData.COLOR, canceled = false): string {
    if (status) {
      return type == StatusTypeData.COLOR ? 'success' : canceled ? 'Activa' : 'Activo';
    } else {
      return type == StatusTypeData.COLOR ? 'danger' : canceled ? 'Anulada' : 'Inactivo';
    }
  }

  getColorFromInvoiceStatus(status: string): PrimeNGSeverity {
    if (!status) return 'secondary';
    switch (status.toLowerCase().trim()) {
      case 'notificado por email': return 'success';
      case 'procesado por mh':
      case 'procesado en mh': return 'info';
      case 'rechazado por mh':
      case 'invalidado': return 'danger';
      default: return 'warn';
    }
  }

  getColorFromIsPayStatus(statusPay: string): PrimeNGSeverity {
    if (!statusPay) return 'secondary';
    return statusPay.toLowerCase().includes('pendiente') ? 'danger' : 'success';
  }

  downloadFile(url: string, filename: string = 'data', extension: string = 'json'): void {
    this.http.get(`${url}/${filename}.${extension}`, { responseType: 'json' })
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
