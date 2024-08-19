export class EngineCrashGame{

    rtp : number = 0;

    constructor( rtp: number){
        this.rtp = rtp;
    }

    play( bet: number, prevstate: string, config: string) {
        const random = Math.random();
        let multiplier = ((1.1-(1-this.rtp)) * random) / (1-random);
        multiplier = multiplier < 1 ? 1 : parseFloat( multiplier.toFixed(2));
        return { multiplier }
    }
}

