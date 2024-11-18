class MinHeap {
  private readonly container: string[];
  private readonly sorter: (a: string, b: string) => number;

  constructor(sorter: (a: string, b: string) => number) {
    this.container = [];
    this.sorter = sorter;
  }

  get_left_child_index(parent_index: number): number {
    return 2 * parent_index + 1;
  }

  get_right_child_index(parent_index: number): number {
    return 2 * parent_index + 2;
  }

  get_parent_index(child_index: number): number {
    return Math.floor((child_index - 1) / 2);
  }

  has_parent(child_index: number): boolean {
    return this.get_parent_index(child_index) >= 0;
  }

  has_left_child(parent_index: number): boolean {
    return this.get_left_child_index(parent_index) < this.container.length;
  }

  has_right_child(parent_index: number): boolean {
    return this.get_right_child_index(parent_index) < this.container.length;
  }

  left_child(parent_index: number): string {
    return this.container[this.get_left_child_index(parent_index)];
  }

  right_child(parent_index: number): string {
    return this.container[this.get_right_child_index(parent_index)];
  }

  parent(child_index: number): string {
    return this.container[this.get_parent_index(child_index)];
  }

  swap(first: number, second: number): void {
    const tmp = this.container[second];
    this.container[second] = this.container[first];
    this.container[first] = tmp;
  }

  pop(): string {
    if (this.container.length === 1) {
      return this.container.pop() as string;
    }

    const head_index = 0;
    const last_element = this.container.pop() as string;
    const first_element = this.container[head_index];

    this.container[head_index] = last_element;
    this.heapify_down(head_index);

    return first_element;
  }

  insert(value: string): void {
    this.container.push(value);
    this.heapify_up(this.container.length - 1);
  }

  heapify_up(start_index?: number): void {
    let current_index = start_index ?? this.container.length - 1;

    while (this.has_parent(current_index) && !this.pair_is_in_correct_order(this.parent(current_index), this.container[current_index])) {
      this.swap(current_index, this.get_parent_index(current_index));
      current_index = this.get_parent_index(current_index);
    }
  }

  heapify_down(start_index = 0): void {
    let current_index = start_index;
    let next_index: number;

    while (this.has_left_child(current_index)) {
      if (
        this.has_right_child(current_index) &&
        this.pair_is_in_correct_order(this.right_child(current_index), this.left_child(current_index))
      ) {
        next_index = this.get_right_child_index(current_index);
      } else {
        next_index = this.get_left_child_index(current_index);
      }

      if (this.pair_is_in_correct_order(this.container[current_index], this.container[next_index])) {
        break;
      }

      this.swap(current_index, next_index);
      current_index = next_index;
    }
  }

  empty(): boolean {
    return this.container.length === 0;
  }

  pair_is_in_correct_order(a: string, b: string): boolean {
    return this.sorter(a, b) < 0;
  }
}

class PriorityQueue {
  private readonly priorities: { [key: string]: number };
  private queue: MinHeap;

  constructor() {
    this.priorities = {};
    this.queue = new MinHeap(this.default_sorter.bind(this));
  }

  private default_sorter = (a: string, b: string): number => {
    return this.priorities[a] - this.priorities[b];
  };

  push(value: string, cost: number): void {
    this.priorities[value] = cost;
    this.queue.insert(value);
  }

  pop(): { value: string; cost: number } {
    const next_node_value = this.queue.pop();
    const next_node_cost = this.priorities[next_node_value];
    delete this.priorities[next_node_value];

    return {
      value: next_node_value,
      cost: next_node_cost,
    };
  }

  empty(): boolean {
    return this.queue.empty();
  }
}

export function dijkstra_singleSourceShortestPaths(
  graph: { [nodeID: string]: { [neighborID: string]: number } },
  s: string,
  d?: string,
): { [nodeID: string]: string } {
  const predecessors: { [nodeID: string]: string } = {};
  const costs: { [nodeID: string]: number } = {};
  costs[s] = 0;

  const open = new PriorityQueue();
  open.push(s, 0);

  let closest: { value: string; cost: number };
  let u: string;
  let v: string;
  let cost_of_s_to_u: number;
  let adjacent_nodes: { [neighborID: string]: number };
  let cost_of_e: number;
  let cost_of_s_to_u_plus_cost_of_e: number;
  let cost_of_s_to_v: number | undefined;
  let first_visit: boolean;

  while (!open.empty()) {
    closest = open.pop();
    u = closest.value;
    cost_of_s_to_u = closest.cost;

    adjacent_nodes = graph[u] || {};

    for (v in adjacent_nodes) {
      // eslint-disable-next-line no-prototype-builtins
      if (adjacent_nodes.hasOwnProperty(v)) {
        cost_of_e = adjacent_nodes[v];
        cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;

        cost_of_s_to_v = costs[v];
        first_visit = typeof cost_of_s_to_v === 'undefined';

        if (first_visit || cost_of_s_to_v! > cost_of_s_to_u_plus_cost_of_e) {
          costs[v] = cost_of_s_to_u_plus_cost_of_e;
          open.push(v, cost_of_s_to_u_plus_cost_of_e);
          predecessors[v] = u;
        }
      }
    }
  }

  if (typeof d !== 'undefined' && typeof costs[d] === 'undefined') {
    const msg = `Could not find a path from ${s} to ${d}.`;
    throw new Error(msg);
  }

  return predecessors;
}

export function dijkstra_extractShortestPathFromPredecessorList(predecessors: { [nodeID: string]: string }, d: string): string[] {
  const nodes: string[] = [];
  let u: string | undefined = d;
  while (u) {
    nodes.push(u);
    u = predecessors[u];
  }
  nodes.reverse();
  return nodes;
}

export function dijkstra_findPath(graph: { [nodeID: string]: { [neighborID: string]: number } }, s: string, d: string): string[] {
  const predecessors = dijkstra_singleSourceShortestPaths(graph, s, d);
  return dijkstra_extractShortestPathFromPredecessorList(predecessors, d);
}
