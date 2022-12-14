import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ChartData,
  ChartTypeRegistry,
  ChartConfiguration,
  ChartEvent
} from 'chart.js';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component';
import { Expense } from '../model/Expense';
import { Label } from '../model/Label';
import { ErrorHandlerService } from '../services/error.handler.service';
import { ExpenseService } from '../services/expense.service/expense.service';
import { LabelService } from '../services/label.service/label.service';
import { DIALOG_SMALL_HEIGHT, DIALOG_SMALL_WIDTH } from '../utils/Constants';

@Component({
  selector: 'app-expense-list-by-month',
  templateUrl: './expense-list-by-month.component.html',
  styleUrls: ['./expense-list-by-month.component.scss']
})
export class ExpenseListByMonthComponent {
  public labels: Label[] = [];
  public expenses: Expense[] = [];
  public monthsWithExpenses: string[] = [];

  public currentSelectedMonth = startOfMonth(new Date());

  public expensesByLabelChart:
    | ChartData<keyof ChartTypeRegistry, number[], string>
    | undefined = undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true
      }
    }
  };

  private EXPENSES_CHART_LABEL = 'Dépenses';
  public pastMonths: Date[] = Array.from(
    Array(new Date().getMonth() + 1).keys()
  ).map((month) => new Date(new Date().getFullYear(), month, 1));

  constructor(
    public dialog: MatDialog,
    private labelService: LabelService,
    private expenseService: ExpenseService,
    private errorHandlerService: ErrorHandlerService
  ) {
    this.initDashboard();
  }

  private initDashboard() {
    this.getLabels();
  }

  private getLabels() {
    this.labelService.getLabels().subscribe({
      next: (labels) => {
        this.labels = labels;
        const startIntervalDate = this.currentSelectedMonth;
        const endIntervalDate = endOfMonth(this.currentSelectedMonth);
        this.getExpenses(startIntervalDate, endIntervalDate);
        // Get total expenses, et switch avec la liste des expense par mois
      },
      error: (error: HttpErrorResponse) =>
        this.errorHandlerService.handleError(
          error.message,
          'this.ERROR_MESSAGE_INIT_DASHBOARD'
        )
    });
  }

  public handleLabelCreation(newLabel: Label) {
    this.labels = [...this.labels, newLabel];
  }

  public handleLabelDeletion(labelId: number) {
    this.expenses = this.expenses.filter(
      (expense) => expense.labelId !== labelId
    );
    this.refreshExpensesChart();
  }

  public deleteLabel(labelId: number): void {
    this.labelService.deleteLabel(labelId).subscribe({
      next: () => {
        this.labels = this.labels.filter((label) => label.id !== labelId);
        this.expenses = this.expenses.filter(
          (expense) => expense.labelId !== labelId
        );
        this.refreshExpensesChart();
      },
      error: (error) =>
        this.errorHandlerService.handleError(
          error.message,
          'erreur suppression label'
        )
    });
  }

  public handleSelectExpensesForMonth(month: Date) {
    if (this.currentSelectedMonth.getTime() !== startOfMonth(month).getTime()) {
      this.currentSelectedMonth = startOfMonth(month);
      this.getExpenses(this.currentSelectedMonth, endOfMonth(month));
    }
  }

  private getExpensesByLabel(expenses: Expense[]): Record<string, number[]> {
    return expenses.reduce(
      (expensesByLabel: Record<string, number[]>, currentExpense: Expense) => {
        const labelId = currentExpense.labelId;
        expensesByLabel[labelId] = expensesByLabel[labelId] ?? [];
        expensesByLabel[labelId].push(currentExpense.amount);
        return expensesByLabel;
      },
      {}
    );
  }

  private getExpenses(startIntervalDate: Date, endIntervalDate: Date) {
    this.expenseService
      .getExpensesAtMonth(startIntervalDate, endIntervalDate)
      .subscribe({
        next: (expenses) => {
          this.expenses = expenses;
          this.refreshExpensesChart();
        },
        error: (error: HttpErrorResponse) =>
          this.errorHandlerService.handleError(error.message, 'this.epenses')
      });
  }

  private refreshExpensesChart() {
    const expensesByLabel = this.getExpensesByLabel(this.expenses);
    this.expensesByLabelChart = {
      labels: [this.EXPENSES_CHART_LABEL],
      datasets: Object.keys(expensesByLabel).map((labelId) => {
        return {
          label: this.labels.filter(
            (label) => label.id.toString() === labelId
          )[0].label,
          data: [
            expensesByLabel[labelId].reduce((total, amount) => total + amount)
          ]
        };
      })
    };
  }

  public handleExpenseCreation(newExpense: Expense) {
    this.expenses = [...this.expenses, newExpense];
    this.refreshExpensesChart();
  }

  public openDeleteExpenseModal(expenseId: number) {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      height: DIALOG_SMALL_HEIGHT,
      width: DIALOG_SMALL_WIDTH,
      data: {
        title: "Suppression d'une dépense",
        message: 'Êtes-vous sûr de vouloir supprimer cette dépense ?'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'validate') {
        this.deleteExpense(expenseId);
      }
    });
  }

  private deleteExpense(expenseId: number) {
    this.expenseService.deleteExpense(expenseId).subscribe({
      next: () => {
        this.expenses = this.expenses.filter(
          (expense) => expense.id !== expenseId
        );
        this.refreshExpensesChart();
      }
    });
  }

  public getLabelFromId(labelId: number): Label | undefined {
    return this.labels.find((label) => label.id === labelId);
  }

  public getTotalForMonth = () =>
    this.expenses
      .map((expense) => expense.amount)
      .reduce((total, amount) => total + amount);

  public formatMonthToDisplay = (monthDate: Date) =>
    format(monthDate, 'MMMM yyyy');

  public getMonthButtonColor = (monthDate: Date) =>
    this.currentSelectedMonth.getTime() === startOfMonth(monthDate).getTime()
      ? 'primary'
      : '';

  public handleChartClickedEvent({
    event,
    active
  }: {
    event?: ChartEvent;
    active?: Record<string, unknown>[];
  }): void {
    console.log(event, active);
  }
}
