"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewLetter = void 0;
const getNewLetter = (tileBag, swap) => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const allTiles = [];
    for (let i = 0; i < letters.length; i++) {
        for (let j = 0; j < tileBag[letters[i]].amount; j++) {
            allTiles.push(letters[i]);
        }
    }
    if (!allTiles.length) {
        return undefined;
    }
    const letter = allTiles[Math.floor(Math.random() * allTiles.length)];
    if (!swap) {
        tileBag[letter].amount--;
    }
    return letter;
};
exports.getNewLetter = getNewLetter;
//# sourceMappingURL=getNewLetter.js.map