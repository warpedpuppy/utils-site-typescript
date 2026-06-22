import { randomIntegerBetween } from "./RandomIntegerBetween";

export function getRandomColors(str: string = "all") {
  let range = [0, 360];
  if (str.includes("blue")) {
    range = [200, 250];
  } else if (str.includes("green")) {
    range = [80, 150];
  } else if (str.includes("orange")) {
    range = [40, 80];
  } else if (str.includes("red")) {
    range = [0, 40];
  } else if (str.includes("yellow")) {
    range = [51, 60];
  } else {
    range = [0, 360];
  }
  let H = randomIntegerBetween(range[0], range[1]);
  let S = randomIntegerBetween(50, 100);
  let L = randomIntegerBetween(25, 75);
  return { H, S, L };
}
