const itemCount: number = 100000;
export const itemList: string[] = new Array(itemCount)
  .fill(null)
  .map((_: null, idx: number): string => {
    return `Item ${idx}`;
  });
