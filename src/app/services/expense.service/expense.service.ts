import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { format } from 'date-fns';
import { Observable } from 'rxjs';
import { Expense } from '../../../app/model/Expense';
import { environment } from '../../../environments/environment';
import { ITotalExpenseByMonth } from '../../model/ITotalExpenseByMonth';
import authorizationBearer from '../authorizationBearer/authorizationBearer';
import { InsertExpensePayload } from './../../model/payloads/InsertExpensePayload';

@Injectable()
export class ExpenseService {
  private dateFormat = 'yyyy-MM-dd';

  constructor(private http: HttpClient) {}

  public getExpensesAtMonth(
    startIntervalDate: Date,
    endIntervalDate: Date
  ): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${environment.backend_url}/expense/`, {
      headers: {
        Authorization: authorizationBearer(),
        'Content-type': 'application/json'
      },
      params: {
        startIntervalDate: format(startIntervalDate, this.dateFormat),
        endIntervalDate: format(endIntervalDate, this.dateFormat)
      }
    });
  }


  public getExpensesAtMonth1(
    startIntervalDate: Date,
    endIntervalDate: Date
  ): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${environment.backend_url}/expense/`, {
      headers: {
        Authorization: authorizationBearer(),
        'Content-type': 'application/json'
      },
      params: {
        startIntervalDate: format(startIntervalDate, this.dateFormat),
        endIntervalDate: format(endIntervalDate, this.dateFormat)
      }
    });
  }

  public getTotalExpensesByMonth(): Observable<ITotalExpenseByMonth[]> {
    return this.http.get<ITotalExpenseByMonth[]>(
      `${environment.backend_url}/expense/getTotalExpensesByMonth`,
      {
        headers: {
          Authorization: authorizationBearer(),
          'Content-type': 'application/json'
        }
      }
    );
  }

  public getTotalExpensesByMonth1(): Observable<ITotalExpenseByMonth[]> {
    return this.http.get<ITotalExpenseByMonth[]>(
      `${environment.backend_url}/expense/getTotalExpensesByMonth`,
      {
        headers: {
          Authorization: authorizationBearer(),
          'Content-type': 'application/json'
        }
      }
    );
  }

  public getTotalExpensesByMonthByLabelId(
    labelId: number
  ): Observable<ITotalExpenseByMonth[]> {
    return this.http.get<ITotalExpenseByMonth[]>(
      `${environment.backend_url}/expense/getTotalExpensesByMonthByLabelId?labelId=${labelId}`,
      {
        headers: {
          Authorization: authorizationBearer(),
          'Content-type': 'application/json'
        }
      }
    );
  }

  public getTotalExpensesByMonthByLabelId1(
    labelId: number
  ): Observable<ITotalExpenseByMonth[]> {
    return this.http.get<ITotalExpenseByMonth[]>(
      `${environment.backend_url}/expense/getTotalExpensesByMonthByLabelId?labelId=${labelId}`,
      {
        headers: {
          Authorization: authorizationBearer(),
          'Content-type': 'application/json'
        }
      }
    );
  }

  public addExpense(expense: InsertExpensePayload): Observable<Expense> {
    return this.http.post<Expense>(
      `${environment.backend_url}/expense/addExpense`,
      { ...expense },
      {
        headers: {
          Authorization: authorizationBearer(),
          'Content-type': 'application/json'
        }
      }
    );
  }

  public deleteExpense(expenseId: number): Observable<void> {
    return this.http.delete<void>(
      `${environment.backend_url}/expense/deleteExpense/?expenseId=${expenseId}`,
      {
        headers: {
          Authorization: authorizationBearer(),
          'Content-type': 'application/json'
        }
      }
    );
  }

newFunction(){

  let myarray = [80, 3, 9, 34, 23, 5, 1];

  myarray.sort();
  console.log(myarray); // outputs: [1, 23, 3, 34, 5, 80, 9]
}


}
