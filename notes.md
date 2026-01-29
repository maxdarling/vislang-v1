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

# todo
Function calls:
- add input/output nodes
  - mvp: one target handle on left, one source handle on right
  - future: inc/dec buttons that dynamically change # of input handles
    - UI: newline under function name label: "params: [-]{paramCount}[+]".
    - assign ids to handles. they can just simply incrementing numbers per node, per input/output (i think? we'll test it)
    - edit: ok, so this is a function *def*, not a call. so the left params should be source nodes that drag rightwards into the box.
      - but does that even make sense? should params be handles or nodes?
      - params dont' have a known value at declaration time, ya know? so I think handles kind make sense.
      - the only issue then is that at call time, are we passing value through those handles?
        - i don't think so. the data passing so far has been in e.g. arithNode 'useNodeConnections'. handles just facilitate the creation of edges between nodes. if it were handles, then the react flow semantics would be meaningless: a param handle connected to an internal node would connect said node to the function node's source - not the semantics we want.

- implement a global "namespace"
  - map of all funcname -> func
  - func nodes are responsible for updating their map entry on name change
  - assign unique names to funcs at init time
    - i guess just use uuid to start
- create call nodes (black boxes with names)
  - dropdown to select a function name from global namespace
  - upon changing name that, it morphs to the proper call signature, i.e. named params as INPUTS and return node as output
    -
- impl simple call scheme

Next:
- type system?

Stretch:
- can i get nodes to run arbitrary code?
- layouting with a library like elkjs. docs: https://reactflow.dev/examples/layout/elkjs
- peruse the examples! https://reactflow.dev/examples. e.g. animating edges.

# react flow docs list
- intersections: https://reactflow.dev/examples/nodes/intersections
- subflows (parent relationship and bounding): https://reactflow.dev/learn/layouting/sub-flows
- low prio impl:
  - (state management options when it gets unwieldy)[https://reactflow.dev/learn/advanced-use/state-management]
  - (selection grouping)[https://reactflow.dev/examples/grouping/selection-grouping]
  - (parent child relation)[https://reactflow.dev/examples/grouping/parent-child-relation]

# bugs list
- (1/26/26) setting reactive values inside a useEffect. in FunctionNode, when computing 'intersectionCount'. but it doesn't need to be a reactive value - the only reason i was using useEffect in the first place I think was for the render trigger on allNodes. solution: you can express that dependency relationships like that (i.e. "derive X from Y, which can change") with useMemo. this is basic newby react stuff, of course, but it's cool to encounter and understand now. note: configuring eslint with the 'react-hooks' plugin is what caught this - huge!
- (12/8/25) deleting a node/edge to a node with inputs causes crash. cause: violates react's "rule of hooks"? specifically calling a different number of hooks? fix is to use getNode (a method) instead of useNodeData (hook) when i map over connections.
- (12/5/25) typo on mvp arithmetic example prevented updates from happening.