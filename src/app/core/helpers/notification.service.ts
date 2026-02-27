import {Injectable} from '@angular/core';

import {MessageService} from "primeng/api";


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private messageService: MessageService,
  ) {
  }

  /**
   * Show success notification
   * @param body
   * @param title
   */
  success(body: string, title = '¡Exito!'): void {
    this.messageService.add({severity: 'success', summary: title, detail: body});
  }

  /**
   * Show information notification
   * @param body
   * @param title
   */
  info(body: string, title = '¡Informacion!'): void {
    this.messageService.add({severity: 'info', summary: title, detail: body});
  }

  /**
   * Show warning notification
   * @param body
   * @param title
   */
  warning(body: string, title = '¡Advertencia!'): void {
    this.messageService.add({severity: 'warn', summary: title, detail: body});
  }

  /**
   * Show error notification
   * @param body
   * @param title
   */
  error(body: string, title = '¡Error!'): void {
    this.messageService.add({severity: 'error', summary: title, detail: body});
  }

  /**
   * Clear all notifications
   */
  clear(): void {
    this.messageService.clear();
  }

}
