export function createJson(json: object): string {
  let str = `const Utils = {
  `;

  Object.entries(json).forEach((item) => {
    str += `${item[0]}: ${item[1]}`;
    // str += item.animationObject.functionString;
    // item.animationObject.dependencies.forEach((functionString: string) => {
    //   str += functionString;
    // });
    // str += `${item.className[0].toLowerCase()}${item.className.slice(1)}`;
    // str += `${item.keyFunction.toString().replace("keyFunction", "")},
    //  `;
  });

  str += `};
export default Utils;`;
  return str;
}
