import { Component, computed, model } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    BaseChartDirective,
    MatDividerModule,
  ],
  template: ` <div class="flex justify-center">
    <div class="w-4/5">
      <h1 class="text-3xl font-bold mb-5">Tirage sans remise</h1>
      <p class="mb-5">
        Choisir le nombre de répétition, la probabilité de l'évènement et le
        nombre de succès :
      </p>
      <div class="flex justify-between">
        <mat-form-field>
          <mat-label>Répétition</mat-label>
          <input matInput type="number" [(ngModel)]="n" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Probabilité</mat-label>
          <input matInput type="number" [(ngModel)]="p" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Succès</mat-label>
          <input matInput type="number" [(ngModel)]="k" />
        </mat-form-field>
      </div>
      <p>
        Il y a {{ binomialLawChanges() }}% que l'évènement arrive exactement
        {{ k() }} fois.
      </p>
      <p>
        Et {{ atLestBinomialLawChanges() }}% qu'il arrive au moins
        {{ k() }} fois.
      </p>
      <p class="mb-8">
        Enfin, {{ lessThanBinomialLawChanges() }}% qu'il arrive moins de
        {{ k() }} fois
      </p>
      <mat-divider></mat-divider>
      <p class="mt-8">
        Ce graphique représente la probabilité d'obtenir un nombre de succès
        pour un total de {{ n() }} répétitions
      </p>
      <canvas
        baseChart
        [data]="data()"
        [options]="barChartOptions"
        type="line"
      ></canvas>
      <p>
        Ce graphique représente la probabilité d'avoir {{ k() }} succès en
        fonction du nombre de répétition.
      </p>
      <canvas
        baseChart
        [data]="data2()"
        [options]="barChartOptions"
        type="line"
      ></canvas>
    </div>
  </div>`,
})
export default class HomeComponent {
  barChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
      },
    },
  };
  n = model(36);
  p = model(1 / 8);
  k = model(6);
  binomialLawChanges = computed(() =>
    (this.binomialLaw(this.n(), this.p(), this.k()) * 100).toFixed(2)
  );
  atLestBinomialLawChanges = computed(() =>
    (this.atLestBinomialLaw(this.n(), this.p(), this.k()) * 100).toFixed(2)
  );
  lessThanBinomialLawChanges = computed(() =>
    (this.lessThanBinomialLaw(this.n(), this.p(), this.k()) * 100).toFixed(2)
  );

  data = computed(() => ({
    labels: this.binomialList(this.n(), this.p()).map((v, i) => i),
    datasets: [
      {
        label: `Chance d'obtenir un nombre de succès pour ${this.n()} répétitions`,
        data: this.binomialList(this.n(), this.p()),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  }));

  data2 = computed(() => ({
    labels: this.atLeastBinomialLawBinomialList(
      this.n(),
      this.p(),
      this.k()
    ).map((v, i) => i),
    datasets: [
      {
        label: `Chance d'obtenir au moins ${this.k()} succès en fonction du nombre de répétition`,
        data: this.atLeastBinomialLawBinomialList(this.n(), this.p(), this.k()),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  }));

  binomialCoefficient = (n: number, k: number) => {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;
    if (k === 1 || k === n - 1) return n;
    if (n - k < k) k = n - k;

    let res = n;
    for (let i = 2; i <= k; i++) res *= (n - i + 1) / i;
    return Math.round(res);
  };

  /**
   *
   * @param n répétition
   * @param p probabilité
   * @param k succès
   * @returns loi binomiale
   */
  binomialLaw = (n: number, p: number, k: number) => {
    return (
      this.binomialCoefficient(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k)
    );
  };

  atLestBinomialLaw = (n: number, p: number, k: number) => {
    const i = n - k; //number of success and more
    const iList = Array.from({ length: i }, (_, index) => index);
    const listBinomial = iList.map((v: number) =>
      this.binomialLaw(n, p, v + k)
    );
    return listBinomial.reduce((sum, a) => sum + a, 0);
  };

  lessThanBinomialLaw = (n: number, p: number, k: number) => {
    const iList = Array.from({ length: k }, (_, index) => index);
    const listBinomial = iList.map((v: number) => this.binomialLaw(n, p, v));
    return listBinomial.reduce((sum, a) => sum + a, 0);
  };

  binomialList = (n: number, p: number) => {
    const iList = Array.from({ length: n + 1 }, (_, index) => index);
    return iList.map((v: number) => this.binomialLaw(n, p, v));
  };
  atLeastBinomialLawBinomialList = (n: number, p: number, k: number) => {
    const iList = Array.from({ length: n + 1 }, (_, index) => index);
    return iList.map((v) => this.atLestBinomialLaw(v, p, k));
  };
}
