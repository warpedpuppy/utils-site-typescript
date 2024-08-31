export const getFunctionName = (functionString: string) => {
  return functionString
    .substring(
      functionString.indexOf("function") + 8,
      functionString.indexOf("(")
    )
    .trim();
};
