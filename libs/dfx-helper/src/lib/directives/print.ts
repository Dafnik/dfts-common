/*
Copyright belongs to https://github.com/selemxmn/ngx-print
Licensed under MIT license
 */

import {booleanAttribute, Directive, HostListener, Input, numberAttribute} from '@angular/core';
import {loggerOf} from 'dfts-helper';

@Directive({
  selector: 'button[print]',
  standalone: true,
})
export class DfxPrint {
  private logger = loggerOf('PrintDirective');

  private _styleSheetFiles = '';

  @Input() printSectionId!: string;
  @Input() printTitle?: string;

  @Input({transform: booleanAttribute}) useExistingCss = false;

  /**
   * A delay in milliseconds to force the print dialog to wait before opened. Default: 0
   */
  @Input({transform: numberAttribute}) printDelay = 0;

  private _printStyle: string[] = [];
  @Input()
  set printStyle(values: {[key: string]: {[key: string]: string}} | string[]) {
    if (Array.isArray(values)) {
      this._printStyle = values;
      return;
    }
    values = values as {[key: string]: {[key: string]: string}};
    for (const key in values) {
      // eslint-disable-next-line no-prototype-builtins
      if (values.hasOwnProperty(key)) {
        this._printStyle.push((key + JSON.stringify(values[key])).replace(/['"]+/g, ''));
      }
    }
  }

  private static getElementTag(tag: keyof HTMLElementTagNameMap): string {
    const html: string[] = [];
    const elements = document.getElementsByTagName(tag);
    for (let index = 0; index < elements.length; index++) {
      html.push(elements[index].outerHTML);
    }
    return html.join('\r\n');
  }

  /**
   * @returns the string that create the stylesheet which will be injected
   * later within <style></style> tag.
   *
   * -join/replace to transform an array objects to css-styled string
   */
  getStyleValues(): string {
    return `<style> ${this._printStyle.join(' ').replace(/,/g, ';')} </style>`;
  }

  /**
   * Set paths to css files which should be used for styling
   * @param cssFileList List containing paths to css files
   * @return String containing all links
   */
  @Input()
  set styleSheetFiles(cssFileList: string[]) {
    this._styleSheetFiles = '';
    for (const cssFile of cssFileList) {
      this._styleSheetFiles += `<link rel="stylesheet" type="text/css" href="${cssFile}">`;
    }
  }

  /**
   * @returns string which contains all link tags containing the css which will
   * be injected later within <head></head> tag.
   */
  private getStyleSheetLinkTags() {
    return this._styleSheetFiles;
  }

  /**
   * @returns html section to be printed along with some associated inputs
   */
  private getHtmlContent(): string {
    const printContents = document.getElementById(this.printSectionId);
    if (!printContents) {
      throw Error('Print section not found');
    }

    return printContents.innerHTML;
  }

  @HostListener('click')
  print(): void {
    let styles = '',
      links = '';

    // Base tag https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base
    const baseTag = DfxPrint.getElementTag('base');

    if (this.useExistingCss) {
      styles = DfxPrint.getElementTag('style');
      links = DfxPrint.getElementTag('link');
    }

    const printContents = this.getHtmlContent();
    const popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
    if (!popupWin) {
      this.logger.error('print', 'Could not create popup window');
      return;
    }
    popupWin.document.open();
    popupWin.document.write(`
      <html lang="en">
        <head>
          <title>${this.printTitle ?? ''}</title>
          ${baseTag}
          ${this.getStyleValues()}
          ${this.getStyleSheetLinkTags()}
          ${styles}
          ${links}
        </head>
        <body>
          ${printContents}
          <script defer>
            function triggerPrint() {
              window.removeEventListener('load', triggerPrint, false);
              setTimeout(function() {
                window.print()
                closeWindow();
              }, ${this.printDelay});
            }
            function closeWindow(){
                window.close();
            }
            window.addEventListener('load', triggerPrint, false);
          </script>
        </body>
      </html>`);
    popupWin.document.close();
  }
}
