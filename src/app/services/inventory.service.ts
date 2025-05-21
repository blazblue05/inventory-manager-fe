import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface InventoryItem {
  id: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = 'http://localhost:3000/api/inventory';
  
  constructor(private http: HttpClient) { }
  
  // Get all inventory items
  getInventoryItems(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(this.apiUrl);
  }
  
  // Get a single inventory item by ID
  getInventoryItem(id: number): Observable<InventoryItem> {
    return this.http.get<InventoryItem>(`${this.apiUrl}/${id}`);
  }
  
  // Create a new inventory item
  addInventoryItem(item: Omit<InventoryItem, 'id'>): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(this.apiUrl, item);
  }
  
  // Update an inventory item
  updateInventoryItem(item: InventoryItem): Observable<InventoryItem> {
    return this.http.put<InventoryItem>(`${this.apiUrl}/${item.id}`, item);
  }
  
  // Delete an inventory item
  deleteInventoryItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}