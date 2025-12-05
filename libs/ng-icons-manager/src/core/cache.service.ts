export class IconCache {
  private iconsCache = new Set<string>();

  get icons(): Set<string> {
    return new Set(this.iconsCache);
  }

  set icons(icons: Set<string>) {
    this.iconsCache = new Set(icons);
  }

  clear(): void {
    this.iconsCache.clear();
  }

  diff(newIcons: Set<string>): { toAdd: Set<string>; toRemove: Set<string> } {
    const toAdd = new Set([...newIcons].filter((i) => !this.iconsCache.has(i)));
    const toRemove = new Set([...this.iconsCache].filter((i) => !newIcons.has(i)));
    return { toAdd, toRemove };
  }
}
