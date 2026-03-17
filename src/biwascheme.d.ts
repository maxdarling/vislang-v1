declare module "biwascheme" {
  interface BiwaSchemeStatic {
    Interpreter: new (onError?: (e: unknown) => void) => BiwaSchemeInterpreter;
    to_write(obj: unknown): string;
  }

  interface BiwaSchemeInterpreter {
    evaluate(str: string, afterEvaluate?: (result: unknown) => void): unknown;
  }

  const BiwaScheme: BiwaSchemeStatic;
  export default BiwaScheme;
}
