import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";

@Component({
  standalone: true,
  selector: "app-root",
  imports: [
    RouterOutlet
  ],
  template: `
    <router-outlet/>
  `
})
export class AppComponent {}
