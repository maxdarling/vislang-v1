# todo
### MVP: parse the graph
att 1: scheme
- a rough version of scheme makes sense. it ~basically is already what we have with arithmetic
- boolean type
  - boolean operators: <, >, equal?, and, or, not
  - #t and #f bool nodes
  - impl:
    - make new "literals" section. rename data node to "number".
    - boolean nodes "true" and "false" nodes, with "#t" and "#f" as labels
    - boolean operators under the "logic" section


- parsing strategy:
  - start in the main function. ret node. and walk backwards.
- evaluation: give a source string to a library (e.g. biwascheme or LIPS). very simple!

impl steps:
- for fast iteration, i need a workspace that i'll develop in (e.g. fibonacci)
  - put example 1 in a workspace
  - [TRY TO GET AWAY WITH NO PERSISTENCE YET, AND JUST DO "INITIAL NODES"]
  - [REALIZE IT'S TOO HARD OTHERWISE, AND GO IMPL THAT]
- see the graph representation for myself. i think i just need edges and nodes (id, type, name)



bug:
- weird stuff happening with call nodes. deleting a node in a workspace deletes all other nodes. as one example. it's very odd.

### optional:
- improve syntax correctness
  - variables can have same name
  - main function can be renamed
  - param names allow any string. this ok?
  - don't allow connections between nodes in function defs and nodes outside

### persistence
- desired behavior: the state of all workspaces should be persisted across refreshes.
- simple mvp: on node/edge creation or dragstop (are there others?), save the current state (nodes, edges, node positions, node values). save to local storage. have "save" and "reset" buttons. top of left sidebar.