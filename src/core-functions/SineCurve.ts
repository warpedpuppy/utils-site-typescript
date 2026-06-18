export function SineCurve(startingValue: number, differential: number, speed: number) {
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
