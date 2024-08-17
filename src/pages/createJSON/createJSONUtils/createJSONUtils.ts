export function createJson(json: object): string {
  let str = `const Utils = {
  `;

  Object.values(json).forEach((item) => {
    str += `${item.className[0].toLowerCase()}${item.className.slice(1)}`;
    str += `${item.keyFunction.toString().replace("keyFunction", "")},
 `;
  });

  str += `};
export default Utils;`;
  return str;
}
