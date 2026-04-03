export function bumpVisitNumber(key: string) {
  try {
    const raw = localStorage.getItem(key);
    const current = raw ? parseInt(raw, 10) : 0;
    const next = Number.isFinite(current) ? current + 1 : 1;
    localStorage.setItem(key, String(next));
    return next;
  } catch {
    return 1;
  }
}

export function readVisitNumber(key: string) {
  try {
    const raw = localStorage.getItem(key);
    const current = raw ? parseInt(raw, 10) : 0;
    return Number.isFinite(current) && current > 0 ? current : 0;
  } catch {
    return 0;
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
  if (!arr.length) {
    throw new Error("pick called with empty array");
  }

  const index = ((seed % arr.length) + arr.length) % arr.length;
  return arr[index];
}