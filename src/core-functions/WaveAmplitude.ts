export function waveAmplitude(x: any, y: any, sources: any, time: any, k: any, omega: any) {
  let amp = 0;
  for (let s of sources) {
    let dx = x - s.x, dy = y - s.y;
    amp += Math.cos(k * Math.sqrt(dx*dx + dy*dy) - omega * time);
  }
  return amp / sources.length;
}
