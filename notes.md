# functions notes

- normal function calls work like:
  - a function is defined as a series of expressions/statements. it has a signature (input/output types)
  - to call a function at runtime, a little song and dance is done on the stack: you create a stack frame with args, where to return back to, etc. then you're in that function, executing away on the args passed. then you return to whence you came.

- to do "normal"-style calls in react flow:
  - functions are defined in one spot, and separate
  - calling would be by name. e.g. black nodes that were named.
  - when a func node is to be run (same logic as arith nodes: watch for changing inputs):
    - "pass args" - pass through func arg inputs to special func param nodes.
    - param changes cause function execution cascade. once done...
    - ... extract output value as "return value". set to to function node value.

- challenges with above:
  - nodes are all updating independently. no ordered control flow like w/ normal funcs. value of func is undefined (or just un-updated?) during execution before we have a return value.
  - what about multiple calls to same func?
    - with a single func instance, it's unclear which output goes to which. we could pass a node id, i suppose, or a callback.
    - but then what about parallelism? two calls could happen concurrently, meaning concurrent edits of the func instance inputs. jumbled!
      - either need separate func instances, or a way to force sequentiality (e.g a queue)

### plan
- poc: simple function definition and single caller. same Flow. function definition as named, bordered area (dashed line).
- later
  - multiple callers (sol: each node is a new func instance)
  - modular UI: create tabs system (separate Flow?) and/or collapsible function defs.

### todo
- [ ] basic function node. resizeable transparent rect with name.
  - make it stay behind child nodes
    - seems like must use parent relationship for this. awk, because there's this other constraint that child nodes must come after parent in array.
  - make it resizeable
  - add a name at top
- [ ] add input/output nodes
- [ ] call nodes (black boxes with names)
- [ ] impl simple call scheme

later:
- [ ] implement pro docs examples:
  - [ ] (selection grouping)[https://reactflow.dev/examples/grouping/selection-grouping]
  - [ ] (parent child relation)[https://reactflow.dev/examples/grouping/parent-child-relation]
- misc docs to consider
  - (state management options when it gets unwieldy)[https://reactflow.dev/learn/advanced-use/state-management]

# react flow docs list
- intersections: https://reactflow.dev/examples/nodes/intersections
- subflows (parent relationship and bounding): https://reactflow.dev/learn/layouting/sub-flows

# stretch
- can i get nodes to run arbitrary code?
- layouting with a library like elkjs. docs: https://reactflow.dev/examples/layout/elkjs
- peruse the examples! https://reactflow.dev/examples. e.g. animating edges.

# bugs list
12/8/25
- deleting a node/edge to a node with inputs causes crash. cause: violates react's "rule of hooks"? specifically calling a different number of hooks? fix is to use getNode (a method) instead of useNodeData (hook) when i map over connections.
12/5/25
- typo on mvp arithmetic example prevented updates from happening.