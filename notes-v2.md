# todo
### basic UX improvements
- my current 4 workspaces should be checked into VC. that should be the base point to reset to.
  - to do this, idk... we could do it via a "download" option. then you might want an "upload" as well? meh, maybe not. 

### bugs
- param nodes should not be delete-able
- ...

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
      - for each top-level function:
      - parse the function def:
        - emit `(define (f ...`
        - (start at return node. special: it emits its parent value or nil)
        - recursive descent via parsed(node) =
          - if node is literal: emit literal, stop
          - if node is function call: emit `(<node_fun> " ".join(parent_nodes.map(parse))`
            - read: "to parse the funcall graph (a tree) to scheme, call the root node function `(root_node_fun...` and use as args the recursive result of each child"
    - final step: generate `(main arg1 ... argN)` at end of file

challenge #1 - parsing top-level functions:
- i thought i could just parse from the main fun ret node /instead/ of starting with all the top-level function defs
  - benefit: just trace back from there. unused function defs will be ignored.
  - but this won't work. i thought i could return a single "(define main...)" in a single recursive call, but not if any other top-level function is in play.
    - i suppose i can make all top-level funcs defined in main's scope. feels kinda weird though since it's contrary to what the UI implies.
      - i'd just mark functions that i need and parse them at the end of main. but this feels so strange, no?

scheme deviation sanity check:
- context: ordering in graph land
  - multiple connected components in vislang dont make sense. we don't know the execution order (connections imply order, given no cycles) or which to take the value of.
  - but, inside a function, these issues go away: the connected component containing the return node is the only relevant one.
- therefore, i make the natural choice and enforce a main function as the program entrypoint.
  - unambiguous program return value via: main's retval
  - unambiguous ordering via: all code is either in the main function or called recursively from main --> all code is in a function --> all function code has unambiguous order (and value)
- addendum: corollaries
  - a connected component is an expression -> all functions just return one expression
    - so progn becomes necessary to cause side effects

### optional:
- improve syntax correctness
  - variables can have same name
  - main function can be renamed
  - param names allow any string. this ok?
  - don't allow connections between nodes in function defs and nodes outside


# conceptual
### incremental parsing and vislang IDE
so, seeing the scheme translation update in realtime in response to editing the graph would be so sick. it seems a lot tougher - it's too slow to reparse everything on edit, so you'd have to do "incremental parsing".

this is what treesitter does, this is what IDEs do! so i'd be making a vislang IDE!

might wanna read this [laurie tratt piece](https://tratt.net/laurie/blog/2024/structured_editing_and_incremental_parsing.html) i found at the top of google