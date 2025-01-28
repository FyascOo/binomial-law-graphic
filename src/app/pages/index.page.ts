import { Component, computed, model } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatFormFieldModule, MatInputModule, FormsModule],
  template: `<h1>Hello</h1>
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
    <p>Pile poil {{ k() }}: {{ result() }}</p>
    <p>Au moins {{ k() }}: {{ result2() }}</p>
    <p>Moins de {{ k() }}: {{ 1 - result2() }}</p> `,
})
export default class HomeComponent {
  n = model(10);
  p = model(0.5);
  k = model(5);
  result = computed(() => this.binomialLaw(this.n(), this.p(), this.k()));
  result2 = computed(() => 1 - this.binomialLaw2(this.n(), this.p(), this.k()));

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
      this.binomialLaw(n, p, +v + k)
    );
    console.log(listBinomial);
    return listBinomial.reduce((sum, a) => sum + a, 0);
  };
}
