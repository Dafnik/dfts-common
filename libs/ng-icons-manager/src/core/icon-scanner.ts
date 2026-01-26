import { FileSystemAdapter, ScanResult } from '../types';

export class IconScanner {
  private readonly htmlComponentRegex = /<ng-icon[^>]*name=["']([^"']+)["']/g;
  private readonly htmlCommentRegex = /<!--\s*([\s\S]*?)\s*-->/g;
  private readonly tsCommentRegex = /\/\*\*?([\s\S]*?)\*\//g;

  constructor(private fs: FileSystemAdapter) {}

  scanFiles(srcGlob: string): ScanResult {
    const files = this.fs.glob(srcGlob);
    const usedIcons = new Set<string>();
    const errors: string[] = [];

    for (const file of files) {
      try {
        const content = this.fs.readFile(file);

        this.extractIconsFromContent(content).forEach((icon) => usedIcons.add(icon));

        this.extractIconsFromComments(content).forEach((icon) => usedIcons.add(icon));
      } catch (err) {
        errors.push(`Failed to read file ${file}: ${err}`);
      }
    }

    return { usedIcons, errors };
  }

  private extractIconsFromContent(content: string): Set<string> {
    const icons = new Set<string>();
    let match: RegExpExecArray | null;
    const localRegex = new RegExp(this.htmlComponentRegex);

    while ((match = localRegex.exec(content)) !== null) {
      icons.add(match[1]);
    }

    return icons;
  }

  private extractIconsFromComments(content: string): Set<string> {
    const icons = new Set<string>();

    let match: RegExpExecArray | null;

    while ((match = this.htmlCommentRegex.exec(content)) !== null) {
      this.extractIconsFromCommentBlock(match[1], icons);
    }

    while ((match = this.tsCommentRegex.exec(content)) !== null) {
      this.extractIconsFromCommentBlock(match[1], icons);
    }

    return icons;
  }

  private extractIconsFromCommentBlock(block: string, icons: Set<string>): void {
    const iconInvocation = /i\(([^)]+)\)/g;
    let match: RegExpExecArray | null;

    while ((match = iconInvocation.exec(block)) !== null) {
      const names = match[1]
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
      names.forEach((n) => icons.add(n));
    }
  }
}
