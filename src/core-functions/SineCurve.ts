export function SineCurve(startingValue: any, differential: any, speed: any) {
  const currentDate = new Date();
  return startingValue + Math.sin(currentDate.getTime() * speed) * differential;
}
// function SineCurve(
//   startingValue: any,
//   differentialany,
//   speedany,
//   timestamp: any,
// ) {
//   return startingValue + Math.sin(timestamp * speed) * differential;
// }
