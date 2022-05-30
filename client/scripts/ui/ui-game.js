import { ctx, canvas } from './canvas';
import TILE_TYPE from '../constants/tile-types.js';
import levelManager from '../managers/level-manager.js';

function render(gameEngine) {
  ctx.fillStyle = '#eee';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Level counter
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#f47';
  ctx.font = '2em Jaldi';
  ctx.fillText(`LEVEL ${levelManager.getLevel()}`, canvas.width / 2, canvas.height * 0.07);
  ctx.font = '4em Jaldi';

  // Start game view
  const COL = gameEngine.state.tiles[0].length;
  const ROW = gameEngine.state.tiles.length;
  const tileSize = 10;
  const sceneScale = Math.min(
    window.innerHeight * 0.65 / (tileSize * ROW),
    window.innerWidth * 0.8 / (tileSize * COL),
  );
  ctx.save();
  ctx.translate(window.innerWidth / 2, window.innerHeight * 0.53);
  ctx.scale(sceneScale, sceneScale);

  // Render tile state
  for (let r = 0; r < ROW; r++) {
    for (let c = 0; c < COL; c++) {
      const tileType = gameEngine.state.tiles[r][c];
      ctx.save();
      ctx.translate((c - COL / 2) * tileSize, (r - ROW / 2) * tileSize);
      renderTile(tileType, c, r, COL, ROW, tileSize);
      ctx.restore();
    }
  }

  // Render players
  for (let i = 0; i < gameEngine.state.characters.length; i++) {
    const character = gameEngine.state.characters[i];
    ctx.save();
    ctx.translate((character[0] - COL / 2) * tileSize, (character[1] - ROW / 2) * tileSize);
    renderCharacter(character, i);
    ctx.restore();
  }

  // End game view
  ctx.restore();
};

function renderTile(tileType, c, r, COL, ROW, tileSize) {
  if (tileType == TILE_TYPE.ENTRY || tileType == TILE_TYPE.EXIT) {
    ctx.fillStyle = '#ddd';
    ctx.fillRect(1, 1, tileSize - 2, tileSize - 2);
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 0.2;
    ctx.setLineDash([1.0, 0.8]);
    ctx.strokeRect(1, 1, tileSize - 2, tileSize - 2);
    ctx.setLineDash([]);
  }
  if (tileType == TILE_TYPE.BASIC || tileType == TILE_TYPE.DOUBLE || tileType == TILE_TYPE.TRIPLE || tileType == TILE_TYPE.GEM) {
    ctx.fillStyle = '#ccd';
    ctx.fillRect(0, 0, tileSize, tileSize);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 10);
    ctx.moveTo(10, 0);
    ctx.lineTo(10, 10);
    ctx.strokeStyle = '#dde';
    ctx.lineWidth = 0.4;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(10, 10);
    ctx.strokeStyle = '#aab';
    ctx.lineWidth = 0.7;
    ctx.stroke();
  }
  if (tileType == TILE_TYPE.DOUBLE) {
    ctx.beginPath();
    ctx.moveTo(2, 7);
    ctx.lineTo(8, 3);
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 0.7;
    ctx.stroke();
  }
  if (tileType == TILE_TYPE.TRIPLE) {
    ctx.beginPath();
    ctx.moveTo(2, 8);
    ctx.lineTo(8, 4);
    ctx.moveTo(2, 6);
    ctx.lineTo(8, 2);
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 0.7;
    ctx.stroke();
  }
  if (tileType == TILE_TYPE.GEM) {
    ctx.fillStyle = '#f47';
    ctx.beginPath();
    ctx.moveTo(5, 2);
    ctx.lineTo(8, 4);
    ctx.lineTo(5, 8);
    ctx.lineTo(2, 4);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#c35';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }
  if (tileType == TILE_TYPE.HOLE) {
    ctx.fillStyle = '#222';
    ctx.fillRect(-0.1, -0.1, tileSize+0.2, tileSize+0.2);
  }
};

function renderCharacter(character, model) {
  // Body
  ctx.fillStyle = '#58f';
  if (model == 1) {
    ctx.fillRect(4, 4, 2, 4);
  } else if (model == 0) {
    ctx.fillRect(3.5, 5, 3, 3);
  } else {
    ctx.fillRect(2.5, 3.5, 5, 4.5);
  }

  // Cool hat
  ctx.fillStyle = '#222';
  if (model == 1) {
    ctx.fillRect(3.5, 4.1, 3, -0.7);
    ctx.fillRect(4.5, 4.1, 1, -2.0);
  } else if (model == 0) {
    ctx.fillRect(2.5, 5.1, 5, -0.5);
    ctx.fillRect(4.0, 5.1, 2, -1.5);
    ctx.fillRect(2.5, 5.1, 0.8, -1.0);
    ctx.fillRect(7.5, 5.1, -0.8, -1.0);
  } else {
    ctx.fillRect(3.5, 3.54, 3, -0.5);
    ctx.fillRect(4.5, 3.54, 1, -1.2);
    ctx.fillRect(3.5, 3.54, 0.6, -1.5);
    ctx.fillRect(6.5, 3.54, -0.6, -1.5);
  }

  // Holding gem
  if (character[2]) {
    ctx.fillStyle = '#f47';
    ctx.beginPath();
    const dY = -5.5 - Math.abs(Math.sin(Date.now() * 0.01));
    ctx.moveTo(5, 3+dY);
    ctx.lineTo(7, 4+dY);
    ctx.lineTo(5, 7+dY);
    ctx.lineTo(3, 4+dY);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#c35';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }
}

export default {
  render,
};