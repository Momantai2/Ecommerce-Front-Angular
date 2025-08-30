// pago.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class PagoService {
  private stripePromise = loadStripe(environment.stripePublicKey); // tu clave pública

  constructor(private http: HttpClient) {}

  async checkout(items: any[]) {
    const stripe = await this.stripePromise;

    this.http
      .post<any>(`${environment.apispirngUrl}/pago/crear-sesion`, items)
      .subscribe(async (res) => {
        const result = await stripe?.redirectToCheckout({
          sessionId: res.id,
        });
        if (result?.error) {
          alert(result.error.message);
        }
      });
  }
}
