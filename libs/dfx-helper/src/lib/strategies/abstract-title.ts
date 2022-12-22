import {RouterStateSnapshot, TitleStrategy} from '@angular/router';
import {Title} from '@angular/platform-browser';

export abstract class AbstractTitleStrategy extends TitleStrategy {
  abstract titlePrefix: string;
  protected titleSplit = ' - ';

  protected constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot): void {
    const title = this.buildTitle(routerState);
    this.title.setTitle(title ? `${this.titlePrefix}${this.titleSplit}${this.parseTitle(title)}` : this.titlePrefix);
  }

  protected parseTitle(title: string): string {
    return title;
  }
}
