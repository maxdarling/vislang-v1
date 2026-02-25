# todo
### functions (see functions-notes.md)
- create global namespace (map of string name to func node id)
  - on func node name change, update it's entry in map
- create call nodes (black boxes with names)
  - dropdown to select a function name from global namespace
  - upon changing name that, it morphs to the proper call signature
    - inputs: handles labeled with corresponding function def's param names
    - output: an output handle

### bugs
-

### stretch:
- type system?
- can i get nodes to run arbitrary code?
- layouting with a library like elkjs. docs: https://reactflow.dev/examples/layout/elkjs
- peruse the examples! https://reactflow.dev/examples. e.g. animating edges.

# react flow concepts
### nodes are just dom elements
- nodes are just dom elements.
- react flow reads ("measures") their width/height from the browser (e.g. by `e.getBoundingClientRect())
  - react flow controls position, though, via transforms.
    - todo: understand better

example NodeResizer flow:
  pointer move
    ↓
  math (delta)
    ↓
  update node.style in state
    ↓
  React render
    ↓
  DOM width/height changes
    ↓
  browser layout
    ↓
  React Flow measures
    ↓
  edges + hitboxes update

### node sizing via css styles
- since flow is measuring, setting node height/width in stylesheet totally fine
- noob pointer: inline styles win in CSS. this is how resizer can override a node with an initial width/height set in the stylesheet

# react flow docs list
- intersections: https://reactflow.dev/examples/nodes/intersections
- subflows (parent relationship and bounding): https://reactflow.dev/learn/layouting/sub-flows
- low prio impl:
  - (state management options when it gets unwieldy)[https://reactflow.dev/learn/advanced-use/state-management]
  - (selection grouping)[https://reactflow.dev/examples/grouping/selection-grouping]
  - (parent child relation)[https://reactflow.dev/examples/grouping/parent-child-relation]

# bugs list
- (2/25/26) param/return nodes buggy intersection count. Bug: we were passing allNodes (from useNodes()) as the 3rd argument to getIntersectingNodes. Inside React Flow, when a 3rd nodes argument is provided, it computes each candidate node's rect from the user-facing node object. For param/return nodes that have parentId, their position is stored as parent-relative. But the function node's rect (the source of the intersection check) is in absolute coordinates. These are two different coordinate spaces, so the overlap math produces nonsense. fix: remove allNodes as the 3rd argument. Without it, React Flow falls back to internalNode which has positionAbsolute already computed — the correct absolute position for both parent and child nodes. We keep allNodes in the useMemo deps so the count still re-runs whenever nodes change.
  - sonnet 4.6 solved quick (before, cursor auto trolling?).
  - it's disappointing to hit a sharp edge like this, hmm. i hope it's not a sign of things to come.
- (1/29/26) new DnD'd function nodes are tiny. reason: initial dimensions not being set (unlike the "initial node" which had width/height set). i assumed the node resizer would set the dimensions for you, but apparently not. what's happening is that the node's root div dims are unset by us so the browser sets it automatically to some small size, and *then* then react flow measures that as the node's size, and then the node resizer acts on that size. See "concepts" section for more clarity.
- (1/26/26) setting reactive values inside a useEffect. in FunctionNode, when computing 'intersectionCount'. but it doesn't need to be a reactive value - the only reason i was using useEffect in the first place I think was for the render trigger on allNodes. solution: you can express that dependency relationships like that (i.e. "derive X from Y, which can change") with useMemo. this is basic newby react stuff, of course, but it's cool to encounter and understand now. note: configuring eslint with the 'react-hooks' plugin is what caught this - huge!
- (12/8/25) deleting a node/edge to a node with inputs causes crash. cause: violates react's "rule of hooks"? specifically calling a different number of hooks? fix is to use getNode (a method) instead of useNodeData (hook) when i map over connections.
- (12/5/25) typo on mvp arithmetic example prevented updates from happening.