import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { ViaCepResponse } from '../model/viacep-response';

@Injectable({
  providedIn: 'root',
})
export class Viacep {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly BASE_URL = 'https://viacep.com.br/ws/';

  getAddress(zipCode: string) {
    const cleanZipCode = zipCode.replace(/\D/g, '');

    if (cleanZipCode.length !== 8) {
      return of(null);
    }

    return this.http.get<ViaCepResponse>(`${this.BASE_URL}${cleanZipCode}/json/`)
      .pipe(
        map(response => {
          if (response.erro) {
            return null;
          }
          return response;
        }),
        catchError(error => {
          return of(null);
        })
      );
  }
}
