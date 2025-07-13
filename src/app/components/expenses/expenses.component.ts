import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';

interface Expense {
  id: string | number;
  title: string;
  amount: number;
  date: string;
  category: string;
  userEmail: string;
}

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css'],
})
export class ExpensesComponent {
  expenses: Expense[] = [];
  title = '';
  amount: number | null = null;
  date = '';
  category = '';
  editingExpense: Expense | null = null;

  readonly categories = ['Food', 'Travel', 'Rent', 'Other', 'Health', 'Shopping', 'Utilities'];

  constructor(private dataService: DataService, private userService: UserService) {
    const currentUser = this.userService.getUser();
    this.dataService.expenses$.subscribe(allExpenses => {
      this.expenses = allExpenses.filter(e => e.userEmail === currentUser?.email);
    });
  }

  addExpense() {
    if (!this.title || this.amount === null || !this.date || !this.category) {
      alert('Please fill in all fields!');
      return;
    }

    const currentUser = this.userService.getUser();
    if (!currentUser) return;

    if (this.editingExpense) {
      this.expenses = this.expenses.map(expense =>
        expense.id === this.editingExpense!.id
          ? { ...expense, title: this.title, amount: this.amount!, date: this.date, category: this.category }
          : expense
      );
      this.editingExpense = null;
    } else {
      const newExpense: Expense = {
        id: this.generateUniqueId(),
        title: this.title,
        amount: this.amount!,
        date: this.date,
        category: this.category,
        userEmail: currentUser.email,
      };
      this.expenses.push(newExpense);
    }

    this.expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    this.saveExpenses();
    this.resetForm();
  }

  editExpense(expense: Expense) {
    this.title = expense.title;
    this.amount = expense.amount;
    this.date = expense.date;
    this.category = expense.category;
    this.editingExpense = expense;
  }

  deleteExpense(expense: Expense) {
    if (confirm(`Delete "${expense.title}"?`)) {
      this.expenses = this.expenses.filter(e => e.id !== expense.id);
      this.saveExpenses();
    }
  }

  saveExpenses() {
    const allExpenses = this.dataService.getRawExpenses();
    const userEmail = this.userService.getUser()?.email;
    const updated = [
      ...allExpenses.filter(e => e.userEmail !== userEmail),
      ...this.expenses,
    ];
    this.dataService.setExpenses(updated);
  }

  resetForm() {
    this.title = '';
    this.amount = null;
    this.date = '';
    this.category = '';
    this.editingExpense = null;
  }

  private generateUniqueId(): string | number {
    return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now();
  }
}
