import { qrcodegen } from './lib/qrcodegen.js';
import { BitmapOutliner } from './lib/bitmap-outliner.js';
import express from 'express';

const port = process.env.PORT || 5432;
const app = express();

app.get('/:text?', (req, res, next) => {
  const text = req.query.text || req.params.text;
  res.set('Content-Type', 'image/svg+xml');
  res.end(qrCode(text));
});

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});

function qrCode(text = '') {
  const qr = qrcodegen.QrCode.encodeSegments(qrcodegen.QrSegment.makeSegments(text), qrcodegen.QrCode.Ecc.HIGH, 1, 40, -1, true);
  const size = qr.size;
  const bits = new Uint8Array(size * size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      bits[y * size + x] = qr.getModule(x, y);
    }
  }

  const outliner = new BitmapOutliner(size, size, bits);
  const path = outliner.svgPath();
  const svg = `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  	<path d="${path}" fill="#000" fill-rule="evenodd"/>
  </svg>`;

  return svg;
}
