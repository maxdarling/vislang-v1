# todo
MVP: parse the graph
- att 1: scheme
  - a rough version of scheme makes sense. it ~basically is already what we have with arithmetic
  - parsing strategy:
    - start in the main function. ret node. and walk backwards.
  - evaluation: give a source string to a library (e.g. biwascheme or LIPS). very simple!

optional:
- cleanup: rip out the computation guts
- improve syntax correctness
  - variables can have same name
  - main function can be renamed
  - param names allow any string. this ok?
  - ...

### persistence
- desired behavior: the state of all workspaces should be persisted across refreshes.
- simple mvp: on node/edge creation or dragstop (are there others?), save the current state (nodes, edges, node positions, node values). save to local storage. have "save" and "reset" buttons. bottom of left sidebar.