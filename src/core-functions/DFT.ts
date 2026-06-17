export function dft(pts: any) {
  const N = pts.length;
  const X = [];
  for (let k = 0; k < N; k++) {
    let re = 0, im = 0;
    for (let n = 0; n < N; n++) {
      const phi = (2*Math.PI*k*n)/N;
      re += pts[n].x*Math.cos(phi) + pts[n].y*Math.sin(phi);
      im += -pts[n].x*Math.sin(phi) + pts[n].y*Math.cos(phi);
    }
    re /= N; im /= N;
    X.push({freq: k, amp: Math.sqrt(re*re+im*im), phase: Math.atan2(im,re)});
  }
  return X.sort((a: any, b: any) => b.amp-a.amp);
}
