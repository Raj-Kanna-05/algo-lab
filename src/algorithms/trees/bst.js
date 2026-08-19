/**
 * bst.js — Binary Search Tree: Insert, Search, Delete
 *
 * Generates a sequence of step snapshots demonstrating BST operations.
 * Each step records the full tree state and which node is currently
 * being examined.
 *
 * A BST stores numbers so that for every node:
 *   - All values in its LEFT subtree are smaller
 *   - All values in its RIGHT subtree are larger
 *
 * Node visual states:
 *   'normal'    — just sitting there
 *   'active'    — currently being compared / visited (amber)
 *   'found'     — the target was found here (green)
 *   'inserted'  — just inserted (green)
 *   'deleted'   — about to be removed (red)
 */

export function bstDemo(valuesToInsert, searchValue) {
  const steps = []
  let root = null
  let idCounter = 0

  // ----- Node factory -----
  function makeNode(value) {
    return { id: idCounter++, value, left: null, right: null, state: 'normal' }
  }

  // ----- Deep clone the tree (needed for snapshots) -----
  function clone(node) {
    if (!node) return null
    return { ...node, left: clone(node.left), right: clone(node.right) }
  }

  // ----- Set state on a path of nodes -----
  function setState(node, id, state) {
    if (!node) return
    if (node.id === id) { node.state = state; return }
    setState(node.left,  id, state)
    setState(node.right, id, state)
  }

  function resetStates(node) {
    if (!node) return
    node.state = 'normal'
    resetStates(node.left)
    resetStates(node.right)
  }

  function snap(note, activeId = null, specialState = null) {
    const treeCopy = clone(root)
    if (activeId !== null && specialState) {
      setState(treeCopy, activeId, specialState)
    }
    steps.push({ tree: treeCopy, note })
  }

  snap('Empty BST. We will insert values one by one, then search for one.')

  // ----- INSERT -----
  function insert(value) {
    snap(`Inserting ${value} into the BST…`)

    function insertHelper(node, value) {
      if (!node) {
        const newNode = makeNode(value)
        snap(`${value} has no parent to compare — it becomes the root!`, newNode.id, 'inserted')
        return newNode
      }

      snap(`Comparing ${value} with node ${node.value}.`, node.id, 'active')

      if (value < node.value) {
        snap(`${value} < ${node.value} → go LEFT.`, node.id, 'active')
        node.left = insertHelper(node.left, value)
      } else if (value > node.value) {
        snap(`${value} > ${node.value} → go RIGHT.`, node.id, 'active')
        node.right = insertHelper(node.right, value)
      } else {
        snap(`${value} already exists in the tree — no duplicate inserted.`, node.id, 'found')
      }

      return node
    }

    root = insertHelper(root, value)
    resetStates(root)
    snap(`${value} inserted successfully.`)
  }

  for (const v of valuesToInsert) insert(v)

  // ----- SEARCH -----
  snap(`Now searching for ${searchValue}…`)

  function search(node, value) {
    if (!node) {
      snap(`Reached a null node — ${value} is NOT in the tree.`)
      return
    }

    snap(`Visiting node ${node.value} — is it ${value}?`, node.id, 'active')

    if (value === node.value) {
      snap(`Found ${value}! ✓`, node.id, 'found')
    } else if (value < node.value) {
      snap(`${value} < ${node.value} → search the LEFT subtree.`, node.id, 'active')
      search(node.left, value)
    } else {
      snap(`${value} > ${node.value} → search the RIGHT subtree.`, node.id, 'active')
      search(node.right, value)
    }
  }

  search(root, searchValue)
  resetStates(root)
  snap('BST demo complete.')

  return steps
}

export const DEFAULT_VALUES  = [5, 3, 7, 1, 4, 6, 8, 2]
export const DEFAULT_SEARCH  = 4
