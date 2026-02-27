import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

import { User } from "../../../views/system/models/user.model";

interface LoginResponse {
  token: string;
  success?: boolean;
  message?: string;
}

interface DecodedToken {
  name: string;
  family_name: string;
  unique_name: string;
  id: string;
  roles: string;
  exp: number;
  iss: string;
  aud: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthRepository {
  private apiUrl = environment.urlApiLogin;
  private tenantId = environment.tenantId;
  private jwtHelper = new JwtHelperService();
  
  // Mantén los usuarios de prueba para modo fallback (en caso de que la API no esté disponible)
  private image = 'data:image/png;base64,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';
  constructor(private http: HttpClient) {}

  authenticate(userName: string, password: string): Observable<User> {
    // Configurar headers para la petición
    const headers = new HttpHeaders({
      'accept': '*/*',
      'X-TenantId': this.tenantId,
      'Content-Type': 'application/json'
    });

    // Crear el cuerpo de la petición
    const body = {
      userName: userName,
      password: password
    };

    // Realizar la petición a la API
    return this.http.post<LoginResponse>(this.apiUrl, body, { headers }).pipe(
      map(response => {
        // Si la respuesta tiene un token, procesarlo
        if (response && response.token) {
          // Guardar el token para futuras peticiones
          localStorage.setItem('token', response.token);
          
          // Decodificar el token para obtener la información del usuario
          const decodedToken = this.jwtHelper.decodeToken(response.token) as DecodedToken;
          
          // Crear un objeto de usuario a partir de la información del token
          const user: User = {
            id: decodedToken.id,
            userName: decodedToken.unique_name,
            name: `${decodedToken.name} ${decodedToken.family_name}`,
            active: true,
            //image: this.image,
            // Puedes añadir más propiedades si es necesario
            roles: decodedToken.roles
          };
          
          return user;
        } else {
          // Si no hay token en la respuesta
          throw new Error(response.message || 'Error de autenticación: No se recibió token');
        }
      }),
      catchError(error => {
        console.error('Error al autenticar:', error);
        
        // Modo fallback: Si la API no está disponible o hay otro error,
        // intentar autenticar con usuarios locales (solo para demo/desarrollo)
        if (error.status === 0 || error.status == 404 || error.status >= 500) {
          console.log('API no disponible, intentando autenticación local');
        }
        
        return throwError(() => new Error(
          error.error?.message || 
          error.message || 
          'Error al intentar autenticar. Por favor, intente de nuevo.'
        ));
      })
    );
  }

  // Método para obtener el rol del usuario actual desde el token
  getUserRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const decodedToken = this.jwtHelper.decodeToken(token) as DecodedToken;
      return decodedToken.roles;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  // Método para verificar si el token ha expirado
  isTokenExpired(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return true;
    
    try {
      return this.jwtHelper.isTokenExpired(token);
    } catch (error) {
      console.error('Error al verificar expiración del token:', error);
      return true;
    }
  }
}