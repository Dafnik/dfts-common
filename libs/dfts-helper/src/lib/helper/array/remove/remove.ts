export function a_remove<T>(array: T[], ...items: T[]): T[] {
  if (Array.isArray(items)) {
    for (const item of items) {
      if (item) {
        const itemIndex = array.indexOf(item);
        if (itemIndex !== -1) {
          array.splice(itemIndex, 1);
        }
      }
    }
  } else if (items) {
    const itemIndex = array.indexOf(items);
    if (itemIndex !== -1) {
      array.splice(itemIndex, 1);
    }
  }
  return array;
}
