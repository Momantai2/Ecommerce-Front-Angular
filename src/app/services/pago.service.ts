// pago.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private stripePromise = loadStripe('pk_test_51Rg6FMQTlLjUzs6SxBfkWWXVMehaTD0cP9N3IhIbWdGiM7lnPm86qHGGmYtKEqjLEcRyAuX5GBjdsNQ77MJyiciW00P7hbT4d2'); // tu clave pública

  constructor(private http: HttpClient) {}

  async checkout(items: any[]) {
    const stripe = await this.stripePromise;

    this.http.post<any>(`${environment.apispirngUrl}/pago/crear-sesion`, items).subscribe(async res => {
      const result = await stripe?.redirectToCheckout({
        sessionId: res.id,
      });
      if (result?.error) {
        alert(result.error.message);
      }
    });
    
  }
}
