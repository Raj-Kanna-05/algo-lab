/**
 * codeSnippets.js — Readable code implementations for every algorithm
 * Languages: Python, Java, C++
 */

export const CODE_SNIPPETS = {

  'bubble-sort': {
    python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

# Example
print(bubble_sort([5, 3, 8, 1, 9, 2]))`,

    java: `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j]   = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`,

    cpp: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}`,
  },

  'merge-sort': {
    python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left  = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]`,

    java: `public static int[] mergeSort(int[] arr) {
    if (arr.length <= 1) return arr;
    int mid = arr.length / 2;
    int[] left  = mergeSort(Arrays.copyOfRange(arr, 0, mid));
    int[] right = mergeSort(Arrays.copyOfRange(arr, mid, arr.length));
    return merge(left, right);
}

static int[] merge(int[] l, int[] r) {
    int[] res = new int[l.length + r.length];
    int i = 0, j = 0, k = 0;
    while (i < l.length && j < r.length)
        res[k++] = (l[i] <= r[j]) ? l[i++] : r[j++];
    while (i < l.length) res[k++] = l[i++];
    while (j < r.length) res[k++] = r[j++];
    return res;
}`,

    cpp: `void mergeSort(vector<int>& arr, int lo, int hi) {
    if (lo >= hi) return;
    int mid = (lo + hi) / 2;
    mergeSort(arr, lo, mid);
    mergeSort(arr, mid + 1, hi);
    merge(arr, lo, mid, hi);
}

void merge(vector<int>& arr, int lo, int mid, int hi) {
    vector<int> tmp(arr.begin()+lo, arr.begin()+hi+1);
    int i = 0, j = mid-lo+1, k = lo;
    while (i <= mid-lo && j <= hi-lo)
        arr[k++] = (tmp[i]<=tmp[j]) ? tmp[i++] : tmp[j++];
    while (i <= mid-lo) arr[k++] = tmp[i++];
    while (j <= hi-lo)  arr[k++] = tmp[j++];
}`,
  },

  'quick-sort': {
    python: `def quick_sort(arr, lo=0, hi=None):
    if hi is None: hi = len(arr) - 1
    if lo < hi:
        p = partition(arr, lo, hi)
        quick_sort(arr, lo, p - 1)
        quick_sort(arr, p + 1, hi)

def partition(arr, lo, hi):
    pivot = arr[hi]
    i = lo - 1
    for j in range(lo, hi):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i+1], arr[hi] = arr[hi], arr[i+1]
    return i + 1`,

    java: `public static void quickSort(int[] arr, int lo, int hi) {
    if (lo < hi) {
        int p = partition(arr, lo, hi);
        quickSort(arr, lo, p - 1);
        quickSort(arr, p + 1, hi);
    }
}

static int partition(int[] arr, int lo, int hi) {
    int pivot = arr[hi], i = lo - 1;
    for (int j = lo; j < hi; j++) {
        if (arr[j] <= pivot) {
            int t = arr[++i]; arr[i] = arr[j]; arr[j] = t;
        }
    }
    int t = arr[i+1]; arr[i+1] = arr[hi]; arr[hi] = t;
    return i + 1;
}`,

    cpp: `void quickSort(vector<int>& arr, int lo, int hi) {
    if (lo < hi) {
        int p = partition(arr, lo, hi);
        quickSort(arr, lo, p - 1);
        quickSort(arr, p + 1, hi);
    }
}

int partition(vector<int>& arr, int lo, int hi) {
    int pivot = arr[hi], i = lo - 1;
    for (int j = lo; j < hi; j++)
        if (arr[j] <= pivot) swap(arr[++i], arr[j]);
    swap(arr[i + 1], arr[hi]);
    return i + 1;
}`,
  },

  'bfs-maze': {
    python: `from collections import deque

def bfs(grid, start, end):
    queue = deque([start])
    visited = {start}
    parent = {}

    while queue:
        cell = queue.popleft()
        if cell == end:
            return reconstruct(parent, start, end)
        for nb in neighbors(grid, cell):
            if nb not in visited:
                visited.add(nb)
                parent[nb] = cell
                queue.append(nb)
    return []  # no path

def reconstruct(parent, start, end):
    path, cur = [], end
    while cur != start:
        path.append(cur); cur = parent[cur]
    return path[::-1]`,

    java: `public List<int[]> bfs(int[][] grid, int[] start, int[] end) {
    Queue<int[]> q = new LinkedList<>();
    Map<String, int[]> parent = new HashMap<>();
    q.add(start);
    parent.put(key(start), null);

    int[][] dirs = {{-1,0},{1,0},{0,-1},{0,1}};
    while (!q.isEmpty()) {
        int[] cur = q.poll();
        if (Arrays.equals(cur, end))
            return reconstruct(parent, start, end);
        for (int[] d : dirs) {
            int[] nb = {cur[0]+d[0], cur[1]+d[1]};
            if (inBounds(grid, nb) && !parent.containsKey(key(nb))) {
                parent.put(key(nb), cur);
                q.add(nb);
            }
        }
    }
    return Collections.emptyList();
}`,

    cpp: `vector<pair<int,int>> bfs(vector<vector<int>>& grid,
                           pair<int,int> start, pair<int,int> end) {
    queue<pair<int,int>> q;
    map<pair<int,int>, pair<int,int>> parent;
    q.push(start);
    parent[start] = {-1,-1};

    int dr[] = {-1,1,0,0}, dc[] = {0,0,-1,1};
    while (!q.empty()) {
        auto [r,c] = q.front(); q.pop();
        if (make_pair(r,c) == end)
            return reconstruct(parent, start, end);
        for (int i = 0; i < 4; i++) {
            auto nb = make_pair(r+dr[i], c+dc[i]);
            if (inBounds(grid,nb) && !parent.count(nb)) {
                parent[nb] = {r,c};
                q.push(nb);
            }
        }
    }
    return {};
}`,
  },

  'a-star-maze': {
    python: `import heapq

def a_star(grid, start, end):
    def h(cell): # Manhattan heuristic
        return abs(cell[0]-end[0]) + abs(cell[1]-end[1])

    open_set = [(h(start), 0, start)]
    g = {start: 0}
    came_from = {}

    while open_set:
        _, cost, cur = heapq.heappop(open_set)
        if cur == end:
            return reconstruct(came_from, start, end)
        for nb in neighbors(grid, cur):
            new_g = g[cur] + 1
            if new_g < g.get(nb, float('inf')):
                came_from[nb] = cur
                g[nb] = new_g
                heapq.heappush(open_set, (new_g + h(nb), new_g, nb))
    return []`,

    java: `public List<int[]> aStar(int[][] grid, int[] s, int[] e) {
    PriorityQueue<int[]> open = new PriorityQueue<>(
        Comparator.comparingInt(a -> a[0]));
    Map<String, int[]> from = new HashMap<>();
    Map<String, Integer> g = new HashMap<>();

    g.put(key(s), 0);
    open.add(new int[]{h(s,e), s[0], s[1]});

    int[][] dirs = {{-1,0},{1,0},{0,-1},{0,1}};
    while (!open.isEmpty()) {
        int[] cur = open.poll();
        int[] cell = {cur[1], cur[2]};
        if (Arrays.equals(cell, e))
            return reconstruct(from, s, e);
        for (int[] d : dirs) {
            int[] nb = {cell[0]+d[0], cell[1]+d[1]};
            int ng = g.get(key(cell)) + 1;
            if (ng < g.getOrDefault(key(nb), Integer.MAX_VALUE)) {
                g.put(key(nb), ng);
                from.put(key(nb), cell);
                open.add(new int[]{ng + h(nb,e), nb[0], nb[1]});
            }
        }
    }
    return Collections.emptyList();
}`,

    cpp: `vector<pair<int,int>> aStar(vector<vector<int>>& grid,
                              pair<int,int> s, pair<int,int> e) {
    auto h = [&](pair<int,int> c) {
        return abs(c.first-e.first) + abs(c.second-e.second);
    };
    using T = tuple<int,int,pair<int,int>>;
    priority_queue<T, vector<T>, greater<T>> pq;
    map<pair<int,int>,pair<int,int>> from;
    map<pair<int,int>,int> g;
    g[s] = 0;
    pq.push({h(s), 0, s});

    int dr[]={-1,1,0,0}, dc[]={0,0,-1,1};
    while (!pq.empty()) {
        auto [f, cost, cur] = pq.top(); pq.pop();
        if (cur == e) return reconstruct(from, s, e);
        for (int i = 0; i < 4; i++) {
            auto nb = make_pair(cur.first+dr[i], cur.second+dc[i]);
            int ng = g[cur] + 1;
            if (!g.count(nb) || ng < g[nb]) {
                g[nb] = ng; from[nb] = cur;
                pq.push({ng + h(nb), ng, nb});
            }
        }
    }
    return {};
}`,
  },

  'minimax': {
    python: `def minimax(board, is_maximizing):
    winner = check_winner(board)
    if winner == 'X': return 10
    if winner == 'O': return -10
    if winner == 'draw': return 0

    if is_maximizing:
        best = float('-inf')
        for i, cell in enumerate(board):
            if cell is None:
                board[i] = 'X'
                best = max(best, minimax(board, False))
                board[i] = None
        return best
    else:
        best = float('inf')
        for i, cell in enumerate(board):
            if cell is None:
                board[i] = 'O'
                best = min(best, minimax(board, True))
                board[i] = None
        return best`,

    java: `public int minimax(char[] board, boolean isMax) {
    String w = checkWinner(board);
    if (w.equals("X")) return 10;
    if (w.equals("O")) return -10;
    if (w.equals("draw")) return 0;

    if (isMax) {
        int best = Integer.MIN_VALUE;
        for (int i = 0; i < 9; i++) {
            if (board[i] == 0) {
                board[i] = 'X';
                best = Math.max(best, minimax(board, false));
                board[i] = 0;
            }
        }
        return best;
    } else {
        int best = Integer.MAX_VALUE;
        for (int i = 0; i < 9; i++) {
            if (board[i] == 0) {
                board[i] = 'O';
                best = Math.min(best, minimax(board, true));
                board[i] = 0;
            }
        }
        return best;
    }
}`,

    cpp: `int minimax(vector<char>& board, bool isMax) {
    string w = checkWinner(board);
    if (w == "X") return 10;
    if (w == "O") return -10;
    if (w == "draw") return 0;

    if (isMax) {
        int best = INT_MIN;
        for (int i = 0; i < 9; i++) {
            if (!board[i]) {
                board[i] = 'X';
                best = max(best, minimax(board, false));
                board[i] = 0;
            }
        }
        return best;
    } else {
        int best = INT_MAX;
        for (int i = 0; i < 9; i++) {
            if (!board[i]) {
                board[i] = 'O';
                best = min(best, minimax(board, true));
                board[i] = 0;
            }
        }
        return best;
    }
}`,
  },

  'alpha-beta': {
    python: `def alpha_beta(board, is_max, alpha, beta):
    winner = check_winner(board)
    if winner == 'X': return 10
    if winner == 'O': return -10
    if winner == 'draw': return 0

    if is_max:
        value = float('-inf')
        for i in range(9):
            if board[i] is None:
                board[i] = 'X'
                value = max(value, alpha_beta(board, False, alpha, beta))
                board[i] = None
                alpha = max(alpha, value)
                if alpha >= beta: break  # prune!
        return value
    else:
        value = float('inf')
        for i in range(9):
            if board[i] is None:
                board[i] = 'O'
                value = min(value, alpha_beta(board, True, alpha, beta))
                board[i] = None
                beta = min(beta, value)
                if alpha >= beta: break  # prune!
        return value`,

    java: `public int alphaBeta(char[] b, boolean isMax, int alpha, int beta) {
    String w = checkWinner(b);
    if (w.equals("X")) return 10;
    if (w.equals("O")) return -10;
    if (w.equals("draw")) return 0;

    if (isMax) {
        int val = Integer.MIN_VALUE;
        for (int i = 0; i < 9; i++) {
            if (b[i] == 0) {
                b[i] = 'X';
                val = Math.max(val, alphaBeta(b, false, alpha, beta));
                b[i] = 0;
                alpha = Math.max(alpha, val);
                if (alpha >= beta) break; // prune
            }
        }
        return val;
    } else {
        int val = Integer.MAX_VALUE;
        for (int i = 0; i < 9; i++) {
            if (b[i] == 0) {
                b[i] = 'O';
                val = Math.min(val, alphaBeta(b, true, alpha, beta));
                b[i] = 0;
                beta = Math.min(beta, val);
                if (alpha >= beta) break; // prune
            }
        }
        return val;
    }
}`,

    cpp: `int alphaBeta(vector<char>& b, bool isMax, int alpha, int beta) {
    string w = checkWinner(b);
    if (w == "X") return 10;
    if (w == "O") return -10;
    if (w == "draw") return 0;

    if (isMax) {
        int val = INT_MIN;
        for (int i = 0; i < 9; i++) {
            if (!b[i]) {
                b[i] = 'X';
                val = max(val, alphaBeta(b, false, alpha, beta));
                b[i] = 0;
                alpha = max(alpha, val);
                if (alpha >= beta) break; // prune
            }
        }
        return val;
    } else {
        int val = INT_MAX;
        for (int i = 0; i < 9; i++) {
            if (!b[i]) {
                b[i] = 'O';
                val = min(val, alphaBeta(b, true, alpha, beta));
                b[i] = 0;
                beta = min(beta, val);
                if (alpha >= beta) break; // prune
            }
        }
        return val;
    }
}`,
  },

  'bst': {
    python: `class Node:
    def __init__(self, val):
        self.val = val
        self.left = self.right = None

def insert(root, val):
    if root is None:
        return Node(val)
    if val < root.val:
        root.left = insert(root.left, val)
    elif val > root.val:
        root.right = insert(root.right, val)
    return root

def search(root, target):
    if root is None: return False
    if target == root.val: return True
    if target < root.val:
        return search(root.left, target)
    return search(root.right, target)`,

    java: `class Node { int val; Node left, right;
    Node(int v) { val = v; } }

Node insert(Node root, int val) {
    if (root == null) return new Node(val);
    if (val < root.val)
        root.left  = insert(root.left,  val);
    else if (val > root.val)
        root.right = insert(root.right, val);
    return root;
}

boolean search(Node root, int target) {
    if (root == null) return false;
    if (target == root.val) return true;
    if (target < root.val)
        return search(root.left,  target);
    return search(root.right, target);
}`,

    cpp: `struct Node { int val; Node *left, *right;
    Node(int v): val(v), left(nullptr), right(nullptr) {} };

Node* insert(Node* root, int val) {
    if (!root) return new Node(val);
    if (val < root->val)
        root->left  = insert(root->left,  val);
    else if (val > root->val)
        root->right = insert(root->right, val);
    return root;
}

bool search(Node* root, int target) {
    if (!root) return false;
    if (target == root->val) return true;
    if (target < root->val)
        return search(root->left,  target);
    return search(root->right, target);
}`,
  },

  'n-queens': {
    python: `def solve_n_queens(n):
    board = [['.' ] * n for _ in range(n)]
    solutions = []

    def is_safe(row, col):
        for r in range(row):
            if board[r][col] == 'Q': return False
        r, c = row - 1, col - 1
        while r >= 0 and c >= 0:
            if board[r][c] == 'Q': return False
            r -= 1; c -= 1
        r, c = row - 1, col + 1
        while r >= 0 and c < n:
            if board[r][c] == 'Q': return False
            r -= 1; c += 1
        return True

    def backtrack(col):
        if col == n:
            solutions.append([''.join(r) for r in board])
            return
        for row in range(n):
            if is_safe(row, col):
                board[row][col] = 'Q'
                backtrack(col + 1)
                board[row][col] = '.'  # backtrack

    backtrack(0)
    return solutions`,

    java: `public List<List<String>> solveNQueens(int n) {
    char[][] board = new char[n][n];
    for (char[] row : board) Arrays.fill(row, '.');
    List<List<String>> result = new ArrayList<>();
    backtrack(board, 0, result);
    return result;
}

void backtrack(char[][] board, int col, List<List<String>> res) {
    if (col == board.length) {
        res.add(toStringList(board)); return;
    }
    for (int row = 0; row < board.length; row++) {
        if (isSafe(board, row, col)) {
            board[row][col] = 'Q';
            backtrack(board, col + 1, res);
            board[row][col] = '.'; // backtrack
        }
    }
}`,

    cpp: `void solve(vector<string>& board, int col, int n,
           vector<vector<string>>& result) {
    if (col == n) {
        result.push_back(board); return;
    }
    for (int row = 0; row < n; row++) {
        if (isSafe(board, row, col, n)) {
            board[row][col] = 'Q';
            solve(board, col + 1, n, result);
            board[row][col] = '.'; // backtrack
        }
    }
}

vector<vector<string>> nQueens(int n) {
    vector<string> board(n, string(n, '.'));
    vector<vector<string>> result;
    solve(board, 0, n, result);
    return result;
}`,
  },

  'knapsack': {
    python: `def knapsack(weights, values, capacity):
    n = len(weights)
    # dp[i][w] = max value using first i items with capacity w
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(capacity + 1):
            # Don't take item i
            dp[i][w] = dp[i-1][w]
            # Take item i if it fits
            if weights[i-1] <= w:
                take = values[i-1] + dp[i-1][w - weights[i-1]]
                dp[i][w] = max(dp[i][w], take)

    return dp[n][capacity]`,

    java: `public int knapsack(int[] weights, int[] values, int capacity) {
    int n = weights.length;
    int[][] dp = new int[n + 1][capacity + 1];

    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= capacity; w++) {
            dp[i][w] = dp[i-1][w]; // skip item i
            if (weights[i-1] <= w) {
                int take = values[i-1] + dp[i-1][w - weights[i-1]];
                dp[i][w] = Math.max(dp[i][w], take);
            }
        }
    }
    return dp[n][capacity];
}`,

    cpp: `int knapsack(vector<int>& weights, vector<int>& values, int capacity) {
    int n = weights.size();
    vector<vector<int>> dp(n + 1, vector<int>(capacity + 1, 0));

    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= capacity; w++) {
            dp[i][w] = dp[i-1][w]; // skip item i
            if (weights[i-1] <= w) {
                int take = values[i-1] + dp[i-1][w - weights[i-1]];
                dp[i][w] = max(dp[i][w], take);
            }
        }
    }
    return dp[n][capacity];
}`,
  },
}
