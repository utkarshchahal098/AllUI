export const credits = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n)

export const compact = (n: number) =>
  new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n)

export const pct = (n: number) => `${Math.round(n * 100)}%`

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`
