/**
 * quickSort.js
 *
 * Records every comparison, pivot selection, and swap during Quick Sort.
 * Color legend:
 *   blue  = untouched
 *   amber = pivot element
 *   red   = being compared / swapped
 *   green = confirmed in its final sorted position
 */

const BLUE  = 'blue'
const AMBER = 'amber'
const RED   = 'red'
const GREEN = 'green'

export function quickSort(inputArr) {
  const steps = []
  const arr = inputArr.slice()
  const done = new Set() // indices that are fully placed

  function snap(arr, highlights = {}, note = '') {
    steps.push({
      bars: arr.map((val, i) => ({
        value: val,
        color: done.has(i) ? GREEN : (highlights[i] ?? BLUE),
      })),
      note,
    })
  }

  snap(arr, {}, 'Starting quick sort — we pick a pivot, put smaller items left, larger items right.')

  function partition(arr, low, high) {
    const pivot = arr[high]
    snap(arr, { [high]: AMBER }, `Pivot chosen: ${pivot} (at index ${high}).`)

    let i = low - 1 // pointer for the "small items" zone

    for (let j = low; j < high; j++) {
      snap(arr, { [high]: AMBER, [j]: RED },
        `Comparing ${arr[j]} with pivot ${pivot}.`)

      if (arr[j] <= pivot) {
        i++
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
        if (i !== j) {
          snap(arr, { [high]: AMBER, [i]: RED, [j]: RED },
            `${arr[i]} ≤ pivot — swapping it into the left partition.`)
        }
      }
    }

    // Place pivot into its final spot
    ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
    const pivotFinal = i + 1
    done.add(pivotFinal)
    snap(arr, { [pivotFinal]: GREEN },
      `Pivot ${arr[pivotFinal]} is now in its correct position (index ${pivotFinal}).`)

    return pivotFinal
  }

  function quickSortHelper(arr, low, high) {
    if (low >= high) {
      if (low === high) done.add(low) // single-element sub-array is already sorted
      return
    }

    const pivotIdx = partition(arr, low, high)
    quickSortHelper(arr, low, pivotIdx - 1)
    quickSortHelper(arr, pivotIdx + 1, high)
  }

  quickSortHelper(arr, 0, arr.length - 1)

  // Final state — everything green
  snap(
    arr,
    Object.fromEntries(arr.map((_, i) => [i, GREEN])),
    'Quick sort complete! Array is fully sorted.',
  )

  return steps
}
