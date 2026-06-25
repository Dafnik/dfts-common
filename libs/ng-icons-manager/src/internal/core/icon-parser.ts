export class IconParser {
  parse(content: string): Set<string> {
    const icons = new Set<string>();
    this.staticNames(content).forEach((icon) => icons.add(icon));
    this.commentHints(content).forEach((icon) => icons.add(icon));
    return icons;
  }

  private staticNames(content: string): string[] {
    return [...content.matchAll(/<ng-icon[^>]*name=["']([^"']+)["']/g)].map((match) => match[1]);
  }

  private commentHints(content: string): string[] {
    const comments = [...content.matchAll(/<!--\s*([\s\S]*?)\s*-->|\/\*\*?([\s\S]*?)\*\/|\/\/([^\r\n]*)/g)];
    return comments.flatMap((comment) => {
      const block = comment[1] ?? comment[2] ?? comment[3] ?? '';
      return [...block.matchAll(/i\(([^)]+)\)/g)].flatMap((match) =>
        match[1]
          .split(',')
          .map((name) => name.trim())
          .filter(Boolean),
      );
    });
  }
}
