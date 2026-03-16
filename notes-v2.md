# todo
### MVP: parsing (scheme)
- goal: parse the graph as scheme
- why: the languages is already a subset of scheme!
  - this makes eval trivial via a library (e.g. biwascheme or LIPS)
- parsing strategy:
  - start in the main function. ret node. and walk backwards.
  - anything not connected is not used. discard.
  - this is an AST! from which we translate to scheme code 1:1
- impl stages:
  - 0. [DONE] cleanups: persistence, bugfixes, style tweaks
  - 1. see the graph representation for myself. i think i just need edges and nodes (id, type, name)
  - 2. write a graph traversal alg (which is the parser)
    - for each workspace, for all function defs:
      - parse the function def:
        - (start at return node. special: it emits its parent value or nil)
        - recursive descent via parsed(node) =
          - if node is literal: emit literal, stop
          - if node is function call: emit `(<node_fun> " ".join(parent_nodes.map(parse))`
            - read: "to parse the funcall graph (a tree) to scheme, call the root node function `(root_node_fun...` and use as args the recursive result of each child"
    - final step: generate `(main arg1 ... argN)` at end of file


### optional:
- improve syntax correctness
  - variables can have same name
  - main function can be renamed
  - param names allow any string. this ok?
  - don't allow connections between nodes in function defs and nodes outside