/**
 * knapsack.js — 0/1 Knapsack Problem (Dynamic Programming)
 *
 * Given a list of items (each with a weight and a value) and a max capacity,
 * find the combination of items that maximises total value without exceeding capacity.
 *
 * DP approach: build a 2D table where:
 *   dp[i][w] = best value using first i items with capacity w
 *
 * Each step:
 *   table     — full DP table (items × capacities), filled cell by cell
 *   row       — current item index being processed
 *   col       — current capacity being processed
 *   decision  — 'skip' | 'take' | 'compare' | null
 *   note      — plain-English explanation
 *   items     — original item list (for sidebar display)
 *   capacity  — max capacity
 *   selected  — Set of item indices chosen (final step only)
 */

export function knapsack(items, capacity) {
  const n = items.length
  const steps = []

  // dp[i][w] — 2D table, (n+1) × (capacity+1), all zeros initially
  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0))

  function snap(row, col, decision, note) {
    steps.push({
      table: dp.map(r => r.slice()),
      row,
      col,
      decision,
      note,
      items,
      capacity,
    })
  }

  snap(0, 0, null, 'Starting Knapsack DP. Each cell dp[i][w] = best value using first i items with capacity w.')

  for (let i = 1; i <= n; i++) {
    const item = items[i - 1]
    snap(i, 0, null, `Processing item ${i}: "${item.name}" (weight=${item.weight}, value=${item.value}).`)

    for (let w = 0; w <= capacity; w++) {
      snap(i, w, 'compare', `Capacity ${w}: can we fit item ${i} (weight ${item.weight})?`)

      if (item.weight > w) {
        // Can't fit this item — copy value from row above
        dp[i][w] = dp[i - 1][w]
        snap(i, w, 'skip', `Item ${i} is too heavy (${item.weight} > ${w}). Skip it → carry forward ${dp[i][w]}.`)
      } else {
        // Choose: skip the item, or take it
        const skipValue = dp[i - 1][w]
        const takeValue = dp[i - 1][w - item.weight] + item.value

        if (takeValue > skipValue) {
          dp[i][w] = takeValue
          snap(i, w, 'take', `Taking item ${i}: value if taken=${takeValue} > if skipped=${skipValue}. ✓ dp[${i}][${w}] = ${takeValue}.`)
        } else {
          dp[i][w] = skipValue
          snap(i, w, 'skip', `Skipping item ${i}: value if taken=${takeValue} ≤ if skipped=${skipValue}. dp[${i}][${w}] = ${skipValue}.`)
        }
      }
    }
  }

  // Trace back which items were selected
  const selected = new Set()
  let w = capacity
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.add(i - 1) // item index in original list
      w -= items[i - 1].weight
    }
  }

  const selectedNames = [...selected].map(i => items[i].name).join(', ')
  steps.push({
    table: dp.map(r => r.slice()),
    row: n,
    col: capacity,
    decision: 'solution',
    note: `Optimal value: ${dp[n][capacity]}. Items selected: ${selectedNames || 'none'}.`,
    items,
    capacity,
    selected,
  })

  return steps
}

export const DEFAULT_ITEMS = [
  { name: 'Laptop',   weight: 3, value: 4 },
  { name: 'Camera',   weight: 2, value: 3 },
  { name: 'Book',     weight: 1, value: 1 },
  { name: 'Jacket',   weight: 4, value: 5 },
  { name: 'Phone',    weight: 2, value: 4 },
]
export const DEFAULT_CAPACITY = 6
