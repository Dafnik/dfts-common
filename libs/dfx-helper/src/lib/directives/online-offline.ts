import { Directive, HostBinding, HostListener, NgModule } from '@angular/core';

@Directive({
  selector: '[hideIfOnline]',
  standalone: true,
})
export class DfxHideIfOnline {
  @HostBinding('hidden')
  get hidden(): boolean {
    return !this._isOffline;
  }

  private _isOffline = false;

  @HostListener('window:offline')
  setNetworkOffline(): void {
    this._isOffline = true;
  }

  @HostListener('window:online')
  setNetworkOnline(): void {
    this._isOffline = false;
  }
}

@Directive({
  selector: '[hideIfOffline]',
  standalone: true,
})
export class DfxHideIfOffline extends DfxHideIfOnline {
  @HostBinding('hidden')
  override get hidden(): boolean {
    return !super.hidden;
  }
}

@NgModule({
  imports: [DfxHideIfOnline, DfxHideIfOffline],
  exports: [DfxHideIfOnline, DfxHideIfOffline],
})
export class DfxHideIfOnlineOfflineModule {}
