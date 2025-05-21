import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:3000/api/transactions';

  constructor(private http: HttpClient) { }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  getTransactionById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }

  createTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, transaction);
  }

  updateTransaction(id: number, transaction: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/${id}`, transaction);
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTransactionsByType(type: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/type/${type}`);
  }

  getTransactionsByItem(itemId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/item/${itemId}`);
  }

  getTransactionsByDateRange(startDate: string, endDate: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/date-range?start=${startDate}&end=${endDate}`);
  }
}