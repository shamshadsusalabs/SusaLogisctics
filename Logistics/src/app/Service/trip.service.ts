import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  private baseUrl = 'http://localhost:3000/api/v1/trip'; // Update with your actual API URL

  constructor(private http: HttpClient) {}

  // Create a new trip
  createTrip(tripData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, tripData);
  }

  // Get all trips
  getAllTrips(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getAll`);
  }

  // Get a single trip by ID
  getTripById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/getById/${id}`);
  }

  // Update a trip by ID
  updateTrip(id: string, tripData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, tripData);
  }

  // Delete a trip by ID
  deleteTrip(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }


}
