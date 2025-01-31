import { Component, computed, model } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FormsModule } from '@angular/forms';
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
  ],
  template: `<h1></h1>
    <mat-form-field>
      <mat-label>Répétition</mat-label>
      <input matInput type="number" [(ngModel)]="n" />
    </mat-form-field>

    <mat-form-field class="example-full-width">
      <mat-label>Probabilité</mat-label>
      <input matInput type="number" [(ngModel)]="p" />
    </mat-form-field>
    <mat-form-field class="example-full-width">
      <mat-label>Succès</mat-label>
      <input matInput type="number" [(ngModel)]="k" />
    </mat-form-field>
    <p>Pile poil {{ k() }}: {{ result() }}%</p>
    <p>Au moins {{ k() }}: {{ result2() }}%</p>
    <p>Moins de {{ k() }}: {{ result3() }}%</p>
    <canvas
      baseChart
      [data]="data()"
      [options]="barChartOptions"
      type="line"
    ></canvas>
    <canvas
      baseChart
      [data]="data2()"
      [options]="barChartOptions"
      type="line"
    ></canvas> `,
})
export default class HomeComponent {
  barChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  n = model(36);
  p = model(1 / 8);
  k = model(6);
  result = computed(() =>
    (this.binomialLaw(this.n(), this.p(), this.k()) * 100).toFixed(2)
  );
  result2 = computed(() =>
    (this.binomialLaw2(this.n(), this.p(), this.k()) * 100).toFixed(2)
  );
  result3 = computed(() =>
    (this.binomialLaw3(this.n(), this.p(), this.k()) * 100).toFixed(2)
  );

  data = computed(() => ({
    labels: this.binomialList(this.n(), this.p()).map((v, i) => i),
    datasets: [
      {
        label: "Nombre d'unique ",
        data: this.binomialList(this.n(), this.p()),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  }));

  data2 = computed(() => ({
    labels: this.binomialList2(this.n(), this.p(), this.k()).map((v, i) => i),
    datasets: [
      {
        label: "Chance d'obtenir 6 unique  ",
        data: this.binomialList2(this.n(), this.p(), this.k()),
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

  binomialLaw2 = (n: number, p: number, k: number) => {
    const i = n - k;
    const iList = Array.from({ length: i }, (_, index) => index);
    const listBinomial = iList.map((v: number) =>
      this.binomialLaw(n, p, v + k)
    );
    return listBinomial.reduce((sum, a) => sum + a, 0);
  };

  binomialLaw3 = (n: number, p: number, k: number) => {
    const iList = Array.from({ length: k }, (_, index) => index);
    const listBinomial = iList.map((v: number) => this.binomialLaw(n, p, v));
    return listBinomial.reduce((sum, a) => sum + a, 0);
  };

  binomialList = (n: number, p: number) => {
    const iList = Array.from({ length: n + 1 }, (_, index) => index);
    return iList.map((v: number) => this.binomialLaw(n, p, v));
  };
  binomialList2 = (n: number, p: number, k: number) => {
    const iList = Array.from({ length: n + 1 }, (_, index) => index);
    return iList.map((v) => this.binomialLaw2(v, p, k));
  };
}
