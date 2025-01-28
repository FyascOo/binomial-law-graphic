import { appConfig } from './app.config';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './component/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header />
    <div class="p-8">
      <router-outlet />
    </div>
  `,
  styles: ``,
})
export class AppComponent {}
