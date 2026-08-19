/**
 * mergeSort.js
 *
 * Runs Merge Sort on a copy of `arr` and records every meaningful moment
 * as a "step" snapshot so the UI can replay them one at a time.
 *
 * Each step has:
 *   bars    — full array at this moment, with color info for each bar
 *   note    — plain-English sentence describing what's happening
 *   dividers — index positions of the current sub-array boundaries (for highlighting)
 */

const BLUE  = 'blue'   // untouched
const AMBER = 'amber'  // currently being compared / examined
const RED   = 'red'    // being moved / overwritten
const GREEN = 'green'  // confirmed in final position

export function mergeSort(inputArr) {
  const steps = []
  const arr = inputArr.slice() // work on a copy

  // Snapshot helper — captures current array state
  function snap(arr, highlights = {}, note = '') {
    steps.push({
      bars: arr.map((val, i) => ({
        value: val,
        color: highlights[i] ?? BLUE,
      })),
      note,
    })
  }

  snap(arr, {}, 'Starting merge sort — we split the array in half repeatedly, then merge.')

  function mergeSortHelper(arr, left, right) {
    if (right - left <= 1) return

    const mid = Math.floor((left + right) / 2)

    // Highlight the current sub-array being processed
    const subHighlight = {}
    for (let i = left; i < right; i++) subHighlight[i] = AMBER
    snap(arr, subHighlight, `Splitting indices ${left}–${right - 1} at midpoint ${mid}.`)

    mergeSortHelper(arr, left, mid)
    mergeSortHelper(arr, mid, right)

    // Now merge the two sorted halves
    const leftArr  = arr.slice(left, mid)
    const rightArr = arr.slice(mid, right)
    let i = 0, j = 0, k = left

    while (i < leftArr.length && j < rightArr.length) {
      const liIdx = left + i
      const riIdx = mid + j
      const comparing = {}
      for (let x = left; x < right; x++) comparing[x] = BLUE
      comparing[liIdx] = AMBER
      comparing[riIdx] = AMBER
      snap(arr, comparing, `Comparing ${leftArr[i]} (left) vs ${rightArr[j]} (right).`)

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i++]
        const placed = {}
        for (let x = left; x < right; x++) placed[x] = BLUE
        placed[k] = RED
        snap(arr, placed, `${arr[k]} is smaller — placed at position ${k}.`)
      } else {
        arr[k] = rightArr[j++]
        const placed = {}
        for (let x = left; x < right; x++) placed[x] = BLUE
        placed[k] = RED
        snap(arr, placed, `${arr[k]} is smaller — placed at position ${k}.`)
      }
      k++
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i++]
      const placed = {}
      for (let x = left; x < right; x++) placed[x] = BLUE
      placed[k] = RED
      snap(arr, placed, `Copying remaining left element ${arr[k]} to position ${k}.`)
      k++
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j++]
      const placed = {}
      for (let x = left; x < right; x++) placed[x] = BLUE
      placed[k] = RED
      snap(arr, placed, `Copying remaining right element ${arr[k]} to position ${k}.`)
      k++
    }

    // Mark this merged segment as green (done)
    const doneHighlight = {}
    for (let x = 0; x < arr.length; x++) doneHighlight[x] = BLUE
    for (let x = left; x < right; x++) doneHighlight[x] = GREEN
    snap(arr, doneHighlight, `Merged and sorted indices ${left}–${right - 1}.`)
  }

  mergeSortHelper(arr, 0, arr.length)

  // Final: everything green
  snap(arr, Object.fromEntries(arr.map((_, i) => [i, GREEN])), 'Merge sort complete! Array is fully sorted.')

  return steps
}
