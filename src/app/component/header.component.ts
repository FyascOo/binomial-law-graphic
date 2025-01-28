import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <div class="h-16 shadow-xl mb-16 flex justify-center items-center">
      Visu de certaine proba
    </div>
  `,
})
export class HeaderComponent {}
