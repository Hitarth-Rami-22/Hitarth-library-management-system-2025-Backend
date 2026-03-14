import { Injectable } from '@angular/core';
import { Penalty } from 'src/app/models/penalty.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PenaltyServiceService {
private baseUrl = 'https://localhost:7255/api/Borrow';
  constructor(private http: HttpClient) { }

  getPenalties(): Observable<Penalty[]> {
    return this.http.get<Penalty[]>(`${this.baseUrl}/penalties`);
}
}