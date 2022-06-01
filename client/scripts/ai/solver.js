import TILE_TYPE from '../constants/tile-types.js';

function Node(moves, serializedState) {
  this.moves = JSON.parse(JSON.stringify(moves));
  this.state = JSON.parse(serializedState);
  this.parent = null;
}

function getNodeKey(move, gameEngine) {
  return `${move[0]},${move[1]},${gameEngine.state.characterIndex}`;
}

function toPath(node) {
  const moves = [];
  const visited = new Set();
  visited.add(null);
  while (!visited.has(node)) {
    visited.add(node);
    moves.push(node.move);
    node = node.parent;
  }
  //moves.pop();
  moves.reverse();
  return moves;
}

function solver(gameEngine) {
  gameEngine.setSilent(true);

  const visited = new Set();
  const open = [];
  const initialState = gameEngine.getSerializedState();

  // Initialize open list and nodes
  const n = new Node([], initialState);
  open.push(n);
  visited.add(initialState);

  // Begin DFS
  let attempts = 0;
  let currentNode = null;
  while (open.length > 0 && attempts < 1000000) {
    // Examine the current pathing option
    const node = open.pop();
    currentNode = node;
    gameEngine.restoreState(node.state);
    const currentSerializedState = gameEngine.getSerializedState();
    visited.add(currentSerializedState);

    if (gameEngine.state.levelPassed) {
      break;
    }

    // Unbeatable state checker here to cull dead ends
    if (unbeatableState(gameEngine.state)) {
      continue;
    }

    // Add all adjacent valid moves as possible paths
    const newMoves = gameEngine.getValidMoves();
    newMoves.map((m) => {
      gameEngine.move(m);
      const nextSerializedState = gameEngine.getSerializedState();
      if (!visited.has(nextSerializedState)) {
        const n = new Node(node.moves.concat([m]), nextSerializedState);
        n.parent = node;
        open.push(n);
      }
      gameEngine.undo();
    });

    attempts += 1;
    if (attempts % 10000 == 0) {
      console.log(`Thinking... ${attempts} moves tried!`);
    }
  }

  gameEngine.restoreState(JSON.parse(initialState));
  gameEngine.setSilent(false);
  return currentNode.moves;
}

function unbeatableState(state) {
  // Check if players are beneath an uncrossable horizontal chasm
  const lowestPlayerRow = Math.max(
    state.characters[0][1], state.characters[1][1], state.characters[2][1],
  );
  for (let r = 1; r < lowestPlayerRow; r++) {
    let allHoles = true;
    for (let c = 0; c < state.tiles[0].length; c++) {
      if (state.tiles[r][c] != TILE_TYPE.HOLE) {
        allHoles = false;
        break;
      }
    }
    if (allHoles) {
      return true;
    }
  }

  return false;
}

export default solver;