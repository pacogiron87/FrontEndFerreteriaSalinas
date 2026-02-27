import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from 'rxjs/operators';

import { UtilitiesService } from "../helpers/utilities.service";
import { Api } from "../enums/api.enum";
import { TypeParam } from "../enums/type-param.enum";
import { Method } from "../enums/method.enum";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient,
    private utilitiesService: UtilitiesService,
    private authService: AuthService
  ) {
  }

  private checkTokenExpiration(): boolean {
    // Utilizar el método de AuthService para verificar el token
    return this.authService.checkTokenBeforeRequest();
  }

  private handleApiRequest<T>(request: Observable<HttpResponse<T>>): Observable<HttpResponse<T>> {
    // Verificar si el token ha expirado antes de hacer la petición
    if (!this.checkTokenExpiration()) {
      return throwError(() => new Error('Token ha expirado'));
    }

    // Continuar con la petición si el token es válido
    return request.pipe(
      catchError(error => {
        // Si el error es de autenticación (401), cerrar sesión
        if (error.status === 401) {
          this.authService.logout();
        }
        return throwError(() => error);
      })
    );
  }

  getAll<Entity>(baseUrl: string, urlApi: Api): Observable<HttpResponse<Entity>> {
    return this.handleApiRequest(
      this.httpClient.get<Entity>(`${baseUrl}${urlApi}`, {observe: 'response'})
    );
  }
  getById<Entity>(id: string, baseUrl: string, urlApi: Api): Observable<HttpResponse<Entity>> {
    return this.handleApiRequest(
      this.httpClient.get<Entity>(`${baseUrl}${urlApi}${id}`, {observe: 'response'})
    );
  }

  getByRouteParams<Entity>(params: any[], baseUrl: string, urlApi: Api): Observable<HttpResponse<Entity>> {
    let url: string = `${baseUrl}${urlApi}`;
    params.map(p => url = `${url}/${p}`);
    return this.handleApiRequest(
      this.httpClient.get<Entity>(url, {observe: 'response'})
    );
  }

  getByParams<Entity>(params: Object, baseUrl: string, urlApi: Api, method = Method.GET, typeParam = TypeParam.QUERY): Observable<HttpResponse<Entity>> {
    const newParams = this.utilitiesService.convertParams(params, typeParam);
    const url: string = `${baseUrl}${urlApi}${typeParam === TypeParam.QUERY ? newParams : ''}`;

    if (method === Method.GET) {
      return this.handleApiRequest(
        this.httpClient.get<Entity>(url, {observe: 'response'})
      );
    } else {
    const body = typeParam === TypeParam.QUERY ? null : newParams;

      return method === Method.POST ?
        this.handleApiRequest(
          this.httpClient.post<Entity>(url, body, {observe: 'response'})
        ) :
        this.handleApiRequest(
          this.httpClient.put<Entity>(url, body, {observe: 'response'})
        );
  }
}

  getByUrl<Entity>(url: string): Observable<HttpResponse<Entity>> {
    return this.handleApiRequest(
      this.httpClient.get<Entity>(url, {observe: 'response'})
    );
  }

  create<Entity>(params: Object, baseUrl: string, urlApi: Api, typeParam = TypeParam.JSON): Observable<HttpResponse<Entity>> {
    const newParams = this.utilitiesService.convertParams(params, typeParam);
    const url: string = `${baseUrl}${urlApi}${typeParam === TypeParam.QUERY ? newParams : ''}`;
    const body = typeParam === TypeParam.QUERY ? null : newParams;

    return this.handleApiRequest(
      this.httpClient.post<Entity>(url, body, {observe: 'response'})
    );
  }

  update<Entity>(params: Object, baseUrl: string, urlApi: Api, typeParam = TypeParam.JSON): Observable<HttpResponse<Entity>> {
    const newParams = this.utilitiesService.convertParams(params, typeParam);
    const url: string = `${baseUrl}${urlApi}${typeParam === TypeParam.QUERY ? newParams : ''}`;
    const body = typeParam === TypeParam.QUERY ? null : newParams;

    return this.handleApiRequest(
      this.httpClient.put<Entity>(url, body, {observe: 'response'})
    );
  }
}
