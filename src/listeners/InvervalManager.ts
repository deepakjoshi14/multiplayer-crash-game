let timerid : ReturnType<typeof setTimeout>;

export function startInterval( duration : number, callbacks : Function[] ){
    timerid = setInterval(() => {
        callbacks.forEach(callback => callback());
    }, duration);
}

export function cleatInterval(){
    if (timerid) {
        clearTimeout( timerid);
    }
}
