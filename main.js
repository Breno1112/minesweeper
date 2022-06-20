import Game from "./Game.js";

const canvas = document.getElementById('screen');
const game = new Game(canvas);
game.start();
window.game = game;