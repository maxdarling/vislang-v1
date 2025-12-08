# todo
- abstract function nodes. they can have color, shape, func, and label.

# later
- can i get a tray/sidebar with nodes? (wanna use Panel component. also, more here: https://reactflow.dev/api-reference/components)
- how to design functions?
- can i get nodes to run arbitrary code?

# bugs list
12/8/25
- deleting a node/edge to a node with inputs causes crash. cause: violates react's "rule of hooks"? specifically calling a different number of hooks? fix is to use getNode (a method) instead of useNodeData (hook) when i map over connections.
12/5/25
- typo on mvp arithmetic example prevented updates from happening.