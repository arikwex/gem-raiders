import { ctx, canvas } from './canvas';

function render() {
  ctx.fillStyle = '#eee';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // logo
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#f47';
  ctx.font = '10em Jaldi';
  ctx.fillText('Tiny', canvas.width * 0.45, canvas.height * 0.3);
  ctx.font = '16em Jaldi';
  ctx.fillText('GEM', canvas.width * 0.45, canvas.height * 0.55);
  ctx.font = '10em Jaldi';
  ctx.fillText('Raiders', canvas.width * 0.45, canvas.height * 0.76);

  ctx.save();
  ctx.translate(canvas.width * 0.05, canvas.height * 0.37);
  ctx.scale(42, 42);
  // Body
  ctx.fillStyle = '#58f';
  ctx.fillRect(3.5, 5, 3, 3);

  // Cool hat
  ctx.fillStyle = '#222';
  ctx.fillRect(2.5, 5.1, 5, -0.5);
  ctx.fillRect(4.0, 5.1, 2, -1.5);
  ctx.fillRect(2.5, 5.1, 0.8, -1.0);
  ctx.fillRect(7.5, 5.1, -0.8, -1.0);

  // Holding gem
  ctx.fillStyle = '#f47';
  ctx.beginPath();
  const dY = -5.5;
  ctx.moveTo(5, 3+dY);
  ctx.lineTo(7, 4+dY);
  ctx.lineTo(5, 7+dY);
  ctx.lineTo(3, 4+dY);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#c35';
  ctx.lineWidth = 0.8;
  ctx.stroke();
  ctx.restore();
};

export default {
  render,
};