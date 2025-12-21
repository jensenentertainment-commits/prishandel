export function getVisitNumber(key: string) {
  try {
    const raw = localStorage.getItem(key);
    const n = raw ? parseInt(raw, 10) : 0;
    const next = Number.isFinite(n) ? n + 1 : 1;
    localStorage.setItem(key, String(next));
    return next;
  } catch {
    return 1;
  }
}

export function h32(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function pick<T>(arr: readonly T[], seed: number) {
  return arr[seed % arr.length];
}
