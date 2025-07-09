// error-handler.service.ts
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  getErrorData(error: HttpErrorResponse): { title: string, message: string, details: string[] } {
    let title = 'Error';
    let message = 'Ocurrió un error inesperado.';
    let details: string[] = [];

    if (error.status === 400 && error.error && typeof error.error === 'object') {
      // Errores de validación
      title = 'Error de validación';
      message = 'Por favor corrija los siguientes errores:';
      details = Object.entries(error.error).map(([field, errorMsg]) => {
        return `${field}: ${errorMsg}`;
      });
    } else if (error.status === 409) {
      // Error de duplicado
      title = 'Registro duplicado';
      message = error.error.message || 'El registro ya existe';
    } else if (error.status === 404) {
      // Recurso no encontrado
      title = 'No encontrado';
      message = error.error.message || 'El recurso solicitado no existe';
    } else if (error.status >= 500) {
      // Error del servidor
      title = 'Error del servidor';
      message = 'Ocurrió un error en el servidor. Por favor intente más tarde.';
    }

    return { title, message, details };
  }
}