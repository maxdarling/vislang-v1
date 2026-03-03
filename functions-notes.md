# conceptual
## traditional function call architecture:
- a function is defined as a named series of expressions/statements with a "signature" (input/output types).
- low-level execution model for a stack machine, e.g. assembly:
  - overview: a program is a sequence of instructions. you move data around registers, stack, and heap. control flow happens via jump and conditional expressions. the program ends when you hit the end of the list of instructions.
  - function call:
    - a section of instructions delineated by a label that can be jumped to (function name) and a special "return" keyword.
    - function calls are represented by the "call stack". at call time, the caller prepares a new "stack frame" for the callee with the necessary data to 1. restore the caller's state when the call ends (e.g. return address, regisers) and 2. setup the callee for execution (e.g. parameters, local variables).

## call semantics: attempt 1
- UI: calling happens via "call nodes" that correspond to a function node. left: parameters are labeled and accept values. right: 0 or 1 outputs.
  - parameters: nodes. node label is param name.
  - return value: a node labeled "RET", accepting one input. at call time, the value of this node will be the return value of the function.
  - call nodes have a "run" button (simple, debuggable)
  - function nodes have a "refresh" button (simple, debuggable)
- Implementation:
  - a call is invoked via the "run" button on a call node
  - the invocation will take place in a "runtime" environment, which is a separate react flow instance dedicated to all function invocations.
    - UI note: i assume only 1 react flow instance on the screen at one time, and a browser tab style switch mechanism at top, or equivalent.
  - the runtime environment consists of "call instances", clones of function defs with a caller's arguments substituted for the parameters.
  - each function def has at most 1 call instance. all call nodes for a given function share the same call instance - races are not handled explicitly, but designed around via the run button idiom.
  - an invocation takes places according to these steps:
    - if an invocation does not already exist for its corresponding function def, create it in the runtime
      - an invocation is created by cloning the corresponding func def, e.g. all nodes and edges, and assigning the callers arg values to the corresponding param nodes.
      - impl detail: param nodes will become data nodes, as currently we only support 1 type (number). when we add types in the future, param nodes will be typed.
      - impl detail: the "refresh" button on the func node recreates the invocation. this is how we'll handle syncing updates between def and invocation during the MVP phase.
      - impl Q: can cloning/propagation work via the call node having a 'setNodes()' for the runtime flow, or is that insufficient?
    - *function runs via standard react flow value propagation*
    - retrieve the result of the call instance to the call node, which becomes its value as any normal node would have.
      - impl detail: the invocation's RET node may change values multiple times in quick succession due to multiple propagations for each sequentially updated param node. to deal with this, just propagate the invocation's return value to the call node each time it updates.
      - impl Q: like above. afaict the call node could pass a setter callback to the RET node.

- challenges:
  - timing: nodes are all updating independently. no ordered control flow like w/ normal funcs. value of func is undefined/stale during execution before we have a return value.
  - overhead: for each function call, we pay overhead (cloning the function def and living with those nodes for ever after).
    - one way to avoid this node overhead is to "multiplex" call on the same invocation. E.g. each instance has a queue of calls/input to work through sequentially.

# implementation questions
- params: nodes vs handles debate
  - verdict: start with nodes, as they're the simplest (simple mapping of nodes/edges from funcdef time to runtime)

- template vs value for functions and their nodes
  - currently every node is an expression, i.e. it has a value. but nodes in functions are different, they're templates. they don't have values.
  - easy sol: detect when a node is in a function def. if so, don't display its value.
    - to not break the computation:
      - are the param nodes emitting a default value?
      - or do they emit a special value "_?" which tells later nodes not to display value?
        - but this misses nodes not connected to a param
          - wait, but that's good. nodes not connected to a param are perhaps not dynamic. e.g. a static data node. func calls would not be known at runtime, for example, though.
  - later: how to prevent the computation in the first place?
  - attempt #1:
    - inc/dec button on param nodes. they're named and internally have special value "?_"
        - todo: make spacing work. leaving off for now.
      - new logic: any node that sees special value "?_" displays a "?".
      - return node: max one input. needed for call-time cloning.