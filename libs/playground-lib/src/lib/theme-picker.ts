import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BiComponent, BiName, circleHalf, moonStarsFill, provideIcons, sunFill } from 'dfx-bootstrap-icons';

interface Theme {
  id: 'auto' | 'dark' | 'light';
  name: string;
  icon: BiName;
}

@Component({
  template: `
    <div class="d-flex gap-2">
      <label for="theme">
        <bi width="16" height="16" [name]="currentTheme().icon" class="text-white" />
      </label>
      <select class="rounded-3 px-2" name="theme" id="theme" (change)="setTheme($any($event.target).value)">
        @for (theme of themes; track theme.id) {
        <option [class.active]="theme.id === currentTheme().id" [value]="theme.id">
          <bi [name]="theme.icon" />
          {{ theme.name }}
        </option>
        }
      </select>
    </div>
  `,
  styles: `
  a {
    text-decoration: none;
  }
  `,
  selector: 'theme-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, BiComponent],
  providers: [provideIcons({ circleHalf, sunFill, moonStarsFill })],
})
export class ThemePicker {
  themes: Theme[] = [
    { id: 'auto', name: 'Auto', icon: 'circle-half' },
    { id: 'light', name: 'Light', icon: 'sun-fill' },
    { id: 'dark', name: 'Dark', icon: 'moon-stars-fill' },
  ];

  currentTheme = signal<Theme>(this.themes[0]);

  constructor() {
    const theme = this.themes.find((t) => t.id === localStorage.getItem('theme'));
    if (theme) {
      this.currentTheme.set(theme);
    }
    this.setTheme(this.getPreferredTheme().id);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.currentTheme().id !== 'light' || this.currentTheme().id !== 'dark') {
        this.setTheme(this.getPreferredTheme().id);
      }
    });
  }

  getPreferredTheme(): Theme {
    if (this.currentTheme) {
      return this.currentTheme();
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return this.themes.find((t) => t.id === 'dark')!;
    } else {
      return this.themes.find((t) => t.id === 'light')!;
    }
  }

  setTheme(id: Theme['id']): void {
    const theme = this.themes.find((t) => t.id === id)!;
    this.currentTheme.set(theme);
    localStorage.setItem('theme', theme.id);
    if (theme.id === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme.id);
    }
  }
}
