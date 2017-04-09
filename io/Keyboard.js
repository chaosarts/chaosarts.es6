let initialized = false;
let downKeys = new Array;

export class Keyboard {

    static isDown (keyCode) {
        return downKeys.indexOf(keyCode) > -1;
    }


    static init () {
        if (initialized) return;
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
    }
}


function onKeyDown (event) {
    if (this.isDown(event.keyCode)) return;
    downKeys.push(event.keyCode);
}



function onKeyUp (event) {
    const index = downKeys.indexOf(event.keyCode);
    if (index < 0) return;
    downKeys = downKeys.slice(0, index).concat(downKeys.slice(index + 1));
}


Keyboard.Apple.Code = {
    'BACKSPACE':    8,
    'TAB':          9,
    'SHIFT':        16,
    'CTRL':         17,
    'ALT':          18,
    'ESC':          27,
    'SPACE':        32,
    'LEFT':         37,
    'UP':           38,
    'RIGHT':        39,
    'DOWN':         40,
    'CMD_LEFT':     91,
    'CMD_RIGHT':    93,
    'F1':           112,
    'F2':           113,
    'F3':           114,
    'F4':           115,
    'F5':           116,
    'F6':           117,
    'F7':           118,
    'F8':           119,
    'F9':           120,
    'F10':          121,
    'F11':          122,
    'F12':          123
}