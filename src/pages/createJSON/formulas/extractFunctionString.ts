export function extractFunctionString(rawSource: string): string {
  return rawSource
    .split('\n')
    .filter(line => !line.trimStart().startsWith('import '))
    .join('\n')
    .replace(/^export\s+/m, '')
    .trim();
}
