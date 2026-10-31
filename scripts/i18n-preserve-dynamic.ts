import ts from "typescript";
import { resolve, relative, isAbsolute } from "node:path";

const ROOT = resolve("src");
const CONFIG = resolve("tsconfig.app.json");
const MAX_COMBINATIONS = 256;

const config = ts.readConfigFile(CONFIG, ts.sys.readFile);

if (config.error) {
  throw new Error(
    ts.flattenDiagnosticMessageText(config.error.messageText, "\n"),
  );
}

const parsed = ts.parseJsonConfigFileContent(
  config.config,
  ts.sys,
  resolve("."),
);

const program = ts.createProgram({
  options: parsed.options,
  rootNames: parsed.fileNames,
});

const checker = program.getTypeChecker();

function stringValues(type: ts.Type): string[] | undefined {
  if (type.isUnion()) {
    const result: string[] = [];

    for (const member of type.types) {
      const values = stringValues(member);
      if (!values) return undefined;
      result.push(...values);
    }

    return [...new Set(result)];
  }

  if (type.flags & ts.TypeFlags.StringLiteral) {
    return [(type as ts.StringLiteralType).value];
  }

  if (type.flags & ts.TypeFlags.TemplateLiteral) {
    const template = type as ts.TemplateLiteralType;
    let result = [template.texts[0]];

    for (let i = 0; i < template.types.length; i++) {
      const values = stringValues(template.types[i]);

      if (!values || result.length * values.length > MAX_COMBINATIONS) {
        return undefined;
      }

      result = result.flatMap((prefix) =>
        values.map((value) => prefix + value + template.texts[i + 1]),
      );
    }

    return result;
  }

  return undefined;
}

function isTranslationCall(node: ts.CallExpression): boolean {
  const expression = node.expression;

  if (ts.isIdentifier(expression)) {
    return expression.text === "t";
  }

  return (
    ts.isPropertyAccessExpression(expression) && expression.name.text === "t"
  );
}

function dynamicPatterns(node: ts.TemplateExpression): string[] {
  let result = [node.head.text];

  for (const span of node.templateSpans) {
    const values = stringValues(checker.getTypeAtLocation(span.expression));

    if (!values || result.length * values.length > MAX_COMBINATIONS) {
      // Fallback for genuinely unresolved runtime values.
      const pattern =
        node.head.text +
        node.templateSpans.map((item) => `*${item.literal.text}`).join("");

      return [pattern];
    }

    result = result.flatMap((prefix) =>
      values.map((value) => prefix + value + span.literal.text),
    );
  }

  return result;
}

const patterns = new Set<string>();
let scannedFiles = 0;

for (const file of program.getSourceFiles()) {
  if (file.isDeclarationFile) continue;

  // Works on Windows and Unix paths.
  const relativePath = relative(ROOT, file.fileName);

  if (relativePath.startsWith("..") || isAbsolute(relativePath)) continue;

  scannedFiles++;

  function visit(node: ts.Node): void {
    if (
      ts.isCallExpression(node) &&
      isTranslationCall(node) &&
      node.arguments.length > 0
    ) {
      const argument = node.arguments[0];

      if (ts.isTemplateExpression(argument)) {
        for (const key of dynamicPatterns(argument)) {
          patterns.add(key);
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(file);
}

if (scannedFiles === 0) {
  throw new Error(
    `No source files under ${ROOT}. Check tsconfig.json and the src directory.`,
  );
}

console.log(`[i18n] Scanned ${scannedFiles} source files.`);
console.log(`[i18n] Found ${patterns.size} dynamic key patterns.`);

export function getDynamicKeyPatterns(): string[] {
  return [...patterns];
}
