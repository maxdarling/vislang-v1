type SExpr = string | SExpr[];

function tokenize(code: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  while (i < code.length) {
    const ch = code[i];
    if (" \n\t\r".includes(ch)) {
      i++;
    } else if (ch === "(" || ch === ")") {
      tokens.push(ch);
      i++;
    } else {
      const start = i;
      while (i < code.length && !" \n\t\r()".includes(code[i])) i++;
      tokens.push(code.slice(start, i));
    }
  }
  return tokens;
}

function readSExpr(tokens: string[], pos: { i: number }): SExpr {
  const tok = tokens[pos.i++];
  if (tok === "(") {
    const list: SExpr[] = [];
    while (tokens[pos.i] !== ")") list.push(readSExpr(tokens, pos));
    pos.i++; // consume ")"
    return list;
  }
  if (tok === "'") {
    return ["quote", readSExpr(tokens, pos)];
  }
  return tok;
}

function formatInline(expr: SExpr): string {
  if (typeof expr === "string") return expr;
  if (expr[0] === "quote" && expr.length === 2)
    return "'" + formatInline(expr[1]);
  return "(" + expr.map(formatInline).join(" ") + ")";
}

// Number of elements to keep on the first line before wrapping the rest.
const FORM_HEAD_COUNT: Record<string, number> = {
  define: 2,
};

// Forms that always break onto multiple lines, regardless of line width.
const ALWAYS_BREAK = new Set(["if"]);

function formatSExpr(expr: SExpr, indent: number, maxWidth: number): string {
  if (typeof expr === "string") return expr;
  if (Array.isArray(expr) && expr[0] === "quote" && expr.length === 2)
    return "'" + formatSExpr(expr[1], indent + 1, maxWidth);
  const inline = formatInline(expr);
  const headName = typeof expr[0] === "string" ? expr[0] : null;
  if (indent + inline.length <= maxWidth && !ALWAYS_BREAK.has(headName ?? ""))
    return inline;
  if (expr.length === 0) return "()";
  const childIndent = indent + 2;
  const headCount = headName ? (FORM_HEAD_COUNT[headName] ?? 1) : 1;
  const firstLine = expr.slice(0, headCount).map(formatInline).join(" ");
  const rest = expr
    .slice(headCount)
    .map(
      (e) => " ".repeat(childIndent) + formatSExpr(e, childIndent, maxWidth),
    );
  return (
    "(" + firstLine + (rest.length > 0 ? "\n" + rest.join("\n") : "") + ")"
  );
}

export function prettifyScheme(code: string, maxWidth = 80): string {
  const tokens = tokenize(code);
  const pos = { i: 0 };
  const exprs: SExpr[] = [];
  while (pos.i < tokens.length) exprs.push(readSExpr(tokens, pos));
  return exprs.map((e) => formatSExpr(e, 0, maxWidth)).join("\n\n");
}
