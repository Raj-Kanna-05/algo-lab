/**
 * bubbleSort.js  (updated to use the unified `bars` step format)
 *
 * Step shape:
 * {
 *   bars: Array<{ value: number, color: 'blue'|'amber'|'red'|'green' }>
 *   note: string
 * }
 */

const BLUE  = 'blue'
const AMBER = 'amber'
const RED   = 'red'
const GREEN = 'green'

export function bubbleSort(input) {
  const array = [...input]
  const steps = []
  const n = array.length

  function snap(highlights = {}, note = '') {
    steps.push({
      bars: array.map((val, i) => ({ value: val, color: highlights[i] ?? BLUE })),
      note,
    })
  }

  snap({}, 'Starting array — bubble sort will compare neighboring pairs and swap them if out of order.')

  for (let i = 0; i < n - 1; i++) {
    let swappedInPass = false

    for (let j = 0; j < n - 1 - i; j++) {
      snap({ [j]: AMBER, [j + 1]: AMBER }, `Comparing positions ${j} and ${j + 1}.`)

      if (array[j] > array[j + 1]) {
        ;[array[j], array[j + 1]] = [array[j + 1], array[j]]
        swappedInPass = true

        const h = {}
        for (let k = n - i; k < n; k++) h[k] = GREEN
        h[j] = RED
        h[j + 1] = RED
        snap(h, `${array[j + 1]} > ${array[j]}, so they swap.`)
      }
    }

    // Mark the newly sorted tail element
    const tail = {}
    for (let k = n - 1 - i; k < n; k++) tail[k] = GREEN
    snap(tail, `Pass ${i + 1} complete — largest remaining value has bubbled to position ${n - 1 - i}.`)

    if (!swappedInPass) break
  }

  // Final: everything green
  snap(Object.fromEntries(array.map((_, i) => [i, GREEN])), 'Array fully sorted!')

  return steps
}
