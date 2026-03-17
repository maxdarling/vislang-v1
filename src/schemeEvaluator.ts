import BiwaScheme from "biwascheme";

export function paramToSchemeLiteral(val: string): string {
  const s = val.trim();
  if (s === "") return '""';
  const n = Number(s);
  if (Number.isFinite(n) && !s.includes(" ")) return String(n);
  return '"' + s.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
}

export type RunResult =
  | { ok: true; output: string }
  | { ok: false; error: string };

export function evaluateScheme(
  program: string,
  paramValues: string[],
): Promise<RunResult> {
  const args = paramValues.map(paramToSchemeLiteral).join(" ");
  const callExpr = args ? `(main ${args})` : "(main)";
  const toEval = `${program}\n\n${callExpr}`;

  return new Promise((resolve) => {
    const onError = (e: unknown) => {
      const msg = e instanceof Error ? e.message : String(e);
      resolve({ ok: false, error: msg });
    };

    const intp = new BiwaScheme.Interpreter(onError);
    try {
      intp.evaluate(toEval, (res: unknown) => {
        const str =
          res === undefined || res === null
            ? ""
            : typeof BiwaScheme.to_write === "function"
              ? BiwaScheme.to_write(res)
              : String(res);
        resolve({ ok: true, output: str });
      });
    } catch (e) {
      resolve({
        ok: false,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  });
}
