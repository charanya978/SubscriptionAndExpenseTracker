import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, RouterModule, FormsModule],
})
export class DashboardComponent implements OnInit, OnDestroy {
  isDashboardPage = true;
  expenses: any[] = [];
  subscriptions: any[] = [];
  totalBudget: number = 0;
  isBudgetModalOpen = false;
  user: { name: string; email: string } = { name: '', email: '' };

  financialTips = [
  "Save at least 20% of your monthly income.",
  "Avoid impulse buying—plan your purchases.",
  "Invest in index funds for long-term growth.",
  "Track your expenses to stay within budget.",
  "Build an emergency fund covering 3–6 months of expenses.",
  "Use the 50/30/20 budgeting rule: needs, wants, savings.",
  "Cancel unused subscriptions to cut hidden costs.",
  "Set financial goals and review them monthly.",
  "Automate savings to stay consistent without effort.",
  "Avoid high-interest debt like credit card balances.",
  "Cook at home more often to save on food expenses.",
  "Compare prices before making big purchases.",
  "Pay yourself first—treat savings like a fixed expense.",
  "Review your spending weekly to stay on track.",
  "Use cash or prepaid cards to avoid overspending.",
  "Invest early to benefit from compound interest.",
  "Plan purchases—don’t shop when emotional or bored.",
  "Set a no-spend day or week each month.",
  "Use budgeting apps to visualize your financial health.",
  "Always sleep on big purchases—impulse fades with time.",
];

  selectedTip = 'Save at least 20% of your monthly income';
  tipInterval: any;

  topCategory: string = '';
  mostFrequentSubscription: string = '';
  largestExpense: any = null;
  highestSpendingDay: string = '';

  constructor(
    private router: Router,
    private dataService: DataService,
    private userService: UserService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isDashboardPage = event.url === '/dashboard';
      }
    });
  }

  ngOnInit() {
    const userData = this.userService.getUser();
    if (userData) {
      this.user = userData;
    }

    this.startTipRotation();
    this.loadBudget();

    this.dataService.expenses$.subscribe((data) => {
      this.expenses = data;
      this.calculateSpendingInsights();
    });

    this.dataService.subscriptions$.subscribe((data) => {
      this.subscriptions = data;
      this.calculateSpendingInsights();
    });
  }

  ngOnDestroy() {
    if (this.tipInterval) {
      clearInterval(this.tipInterval);
    }
  }

  startTipRotation() {
    this.setRandomTip();
    this.tipInterval = setInterval(() => {
      this.setRandomTip();
    }, 2000);
  }

  setRandomTip() {
    const randomIndex = Math.floor(Math.random() * this.financialTips.length);
    this.selectedTip = this.financialTips[randomIndex];
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  /** ✅ Load budget specific to user email */
  loadBudget() {
    if (this.isBrowser() && this.user.email) {
      const savedBudget = localStorage.getItem(`budget_${this.user.email}`);
      this.totalBudget = savedBudget ? parseFloat(savedBudget) : 0;
    }
  }

  /** ✅ Save budget specific to user email */
  saveBudget() {
    if (this.isBrowser() && this.user.email) {
      localStorage.setItem(`budget_${this.user.email}`, this.totalBudget.toString());
    }
    this.closeBudgetModal();
  }

  editBudget() {
    this.loadBudget();
    this.openBudgetModal();
  }

  getTotalExpenses(): number {
    return this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  getTotalSubscriptionsCost(): number {
    return this.subscriptions.reduce((sum, sub) => sum + sub.price, 0);
  }

  getRemainingBudget(): number {
    return this.totalBudget - this.getTotalExpenses() - this.getTotalSubscriptionsCost();
  }

  openBudgetModal() {
    this.isBudgetModalOpen = true;
  }

  closeBudgetModal() {
    this.isBudgetModalOpen = false;
  }

  logout() {
    console.log('User logged out');
    this.router.navigate(['/login']);
  }

  private calculateSpendingInsights() {
    this.getTopCategory();
    this.getMostFrequentSubscription();
    this.getLargestExpense();
    this.getHighestSpendingDay();
  }

  private getTopCategory() {
    const categoryCount: { [key: string]: number } = {};
    for (let exp of this.expenses) {
      const category = exp.category || 'Uncategorized';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    }
    this.topCategory = Object.keys(categoryCount).reduce(
      (a, b) => (categoryCount[a] > categoryCount[b] ? a : b),
      ''
    );
  }

  private getMostFrequentSubscription() {
    const nameCount: { [key: string]: number } = {};
    for (let sub of this.subscriptions) {
      nameCount[sub.name] = (nameCount[sub.name] || 0) + 1;
    }
    this.mostFrequentSubscription = Object.keys(nameCount).reduce(
      (a, b) => (nameCount[a] > nameCount[b] ? a : b),
      ''
    );
  }

  private getLargestExpense() {
    this.largestExpense = this.expenses.reduce(
      (max, exp) => (exp.amount > (max?.amount || 0) ? exp : max),
      null
    );
  }

  private getHighestSpendingDay() {
    const dayMap: { [key: string]: number } = {};
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for (let exp of this.expenses) {
      const date = new Date(exp.date);
      const day = days[date.getDay()];
      dayMap[day] = (dayMap[day] || 0) + exp.amount;
    }

    this.highestSpendingDay = Object.keys(dayMap).reduce(
      (a, b) => (dayMap[a] > dayMap[b] ? a : b),
      ''
    );
  }
}
