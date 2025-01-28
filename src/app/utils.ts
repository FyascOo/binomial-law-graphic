export const binomialCoefficient = (n: number, k: number) => {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  if (k === 1 || k === n - 1) return n;
  if (n - k < k) k = n - k;

  let res = n;
  for (let i = 2; i <= k; i++) res *= (n - i + 1) / i;
  return Math.round(res);
};

/**
 *
 * @param n répétition
 * @param p probabilité
 * @param k succès
 * @returns loi binomiale
 */
export const binomialLaw = (n: number, p: number, k: number) => {
  return binomialCoefficient(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
};
