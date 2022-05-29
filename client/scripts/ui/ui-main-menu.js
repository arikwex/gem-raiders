import { ctx, canvas } from './canvas';

function render() {
  ctx.fillStyle = '#eee';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // logo
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#f47';
  ctx.font = '2em Jaldi';
  ctx.fillText('Tiny', canvas.width / 2, canvas.height * 0.1);
  ctx.font = '4em Jaldi';
  ctx.fillText('GEM', canvas.width / 2, canvas.height * 0.2);
  ctx.font = '2em Jaldi';
  ctx.fillText('Raiders', canvas.width / 2, canvas.height * 0.3);
};

export default {
  render,
};