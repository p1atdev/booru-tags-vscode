// 4200 -> 4.2k, 5000000 -> 5M
export function autoScalePrefix(num: number): string {
  if (num < 1000) {
    return num.toString();
  }

  if (num < 1_000_000) {
    return (num / 1000).toFixed(1) + "k";
  }

  return (num / 1_000_000).toFixed(1) + "M";
}
