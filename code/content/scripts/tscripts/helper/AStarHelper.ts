declare global {
    interface IAStarNode {
        x: number;
        y: number;
        [k: string]: any;
    }
}

export module AStarHelper {

    export class AStar {
        cachedPaths: Map<IAStarNode, Map<IAStarNode, IAStarNode[]>>;
        _is_valid_node?(a: IAStarNode, b: IAStarNode): boolean;

        is_valid_node(a: IAStarNode, b: IAStarNode): boolean {
            if (this._is_valid_node) {
                return this._is_valid_node(a, b);
            }
            return true;
        }

        neighbor_nodes(theNode: IAStarNode, nodes: { [k: string]: IAStarNode }) {
            let neighbors: IAStarNode[] = [];
            let keys: string[] = Object.keys(nodes);
            keys.sort();
            for (const _ of keys) {
                const node = nodes[_];
                if (theNode != node && this.is_valid_node(theNode, node)) {
                    neighbors.push(node)
                }
            }
            return neighbors;
        }
        clear_cached_paths() {
            this.cachedPaths = null;
        }
        path(start: IAStarNode, goal: IAStarNode, nodes: { [k: string]: IAStarNode }, ignore_cache: boolean,
            valid_node_func: (a: IAStarNode, b: IAStarNode) => boolean) {
            if (!this.cachedPaths) {
                this.cachedPaths = new Map();
            }
            if (!this.cachedPaths.has(start)) {
                this.cachedPaths.set(start, new Map());
            }
            else if (this.cachedPaths.get(start).has(goal) && !ignore_cache) {
                return this.cachedPaths.get(start).get(goal);
            }
            return this.a_star(start, goal, nodes, valid_node_func);
        }

        a_star(start: IAStarNode, goal: IAStarNode, nodes: { [k: string]: IAStarNode },
            valid_node_func: (a: IAStarNode, b: IAStarNode) => boolean) {
            let closedset: IAStarNode[] = []
            let openset: IAStarNode[] = [start];
            let came_from = new Map<IAStarNode, IAStarNode>()
            if (valid_node_func) {
                this._is_valid_node = valid_node_func;
            }
            let g_score = new Map<IAStarNode, number>();
            let f_score = new Map<IAStarNode, number>();
            g_score.set(start, 0);
            f_score.set(start, g_score.get(start) + heuristic_cost_estimate(start, goal));
            while (openset.length > 0) {
                let current = lowest_f_score(openset, f_score);
                if (current == goal) {
                    let path = unwind_path([], came_from, goal);
                    path.push(goal)
                    return path;
                }
                remove_node(openset, current);
                closedset.push(current);
                let neighbors = this.neighbor_nodes(current, nodes);
                for (const neighbor of (neighbors)) {
                    if (!closedset.includes(neighbor)) {
                        let tentative_g_score = g_score.get(current) + dist_between(current, neighbor);
                        if (!openset.includes(neighbor) || tentative_g_score < g_score.get(neighbor)) {
                            came_from.set(neighbor, current);
                            g_score.set(neighbor, tentative_g_score);
                            f_score.set(neighbor, g_score.get(neighbor) + heuristic_cost_estimate(neighbor, goal));
                            if (!openset.includes(neighbor)) {
                                openset.push(neighbor);
                            }
                        }
                    }
                }
            }
            return;
        }
    }


    function dist(x1: number, y1: number, x2: number, y2: number) {
        return math.sqrt(math.pow(x2 - x1, 2) + math.pow(y2 - y1, 2));
    }
    function dist_between(nodeA: IAStarNode, nodeB: IAStarNode) {
        return dist(nodeA.x, nodeA.y, nodeB.x, nodeB.y);
    }
    function heuristic_cost_estimate(nodeA: IAStarNode, nodeB: IAStarNode) {
        return dist(nodeA.x, nodeA.y, nodeB.x, nodeB.y);
    }

    function lowest_f_score(set: IAStarNode[], f_score: Map<IAStarNode, number>) {
        let lowest = 0;
        let bestNode: IAStarNode;
        for (const node of (set)) {
            let score = f_score.get(node);
            if (score < lowest) {
                [lowest, bestNode] = [score, node];
            }
        }
        return bestNode;
    }


    function remove_node(set: IAStarNode[], theNode: IAStarNode) {
        for (let i = 0; i < set.length; i++) {
            if (set[i] == theNode) {
                set.splice(i, 1)
                return;
            }
        }
    }
    function unwind_path(flat_path: IAStarNode[], map: Map<IAStarNode, IAStarNode>, current_node: IAStarNode): IAStarNode[] {
        if (map.has(current_node)) {
            flat_path.unshift(map.get(current_node));
            return unwind_path(flat_path, map, map.get(current_node));
        } else {
            return flat_path;
        }
    }

    export function distance(x1: number, y1: number, x2: number, y2: number) {
        return dist(x1, y1, x2, y2);
    }

}