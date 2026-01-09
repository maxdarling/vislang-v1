# todo
- functions?

# cleanup
- unify initial nodes and sidebar-created nodes (diff id schemes)
- new node creation is a little loose, e.g. pass 0 to data nodes. default constructor (0 val) should be in node file.

# sidebar
- sidebar elements should be icons, not text. while dragging, too. (jointjs example: https://changelog.jointjs.com/rappid/examples/kitchensink/)
- 

# later
- can i get nodes to run arbitrary code?
- cleanup sidebar
- layouting with a library like elkjs. docs: https://reactflow.dev/examples/layout/elkjs
- peruse the examples! https://reactflow.dev/examples. e.g. animating edges.


# bugs list
12/8/25
- deleting a node/edge to a node with inputs causes crash. cause: violates react's "rule of hooks"? specifically calling a different number of hooks? fix is to use getNode (a method) instead of useNodeData (hook) when i map over connections.
12/5/25
- typo on mvp arithmetic example prevented updates from happening.