import { EngineCrashGame } from "../engine/crashgame";

export class CrashGameController{

    engine : EngineCrashGame = new EngineCrashGame( config.rtp );
    multiplier : number = 1;
    finalMultiplier : number = 1;

    timeStart : number = 0;
    timeDifference : number = 0;

    incrementTimeStamp = 0;

    status : number = -1;

    constructor(){
        this.reset();
    }

    public betPaused() : boolean {
        return this.status == 2;
    }

    public isEnd() : boolean {
        return this.status == 3;
    }

    public value(): number {
        return this.multiplier;
    }

    public timeline()  {
        let remaining =  this.betPaused() ? 0 : config.betwindow - this.timeDifference; 
        remaining = remaining < 0 ? 0 : remaining;
        return { total : config.betwindow, remaining };
    }

    public reset() {
        this.multiplier = 0;
        this.finalMultiplier = 0;
        this.timeStart = Date.now();
        this.status = 0;
    }

    public update() {
        if (this.status == 0){ // no bet allowed 
            this.timeDifference = Date.now() - this.timeStart;
            if ( this.timeDifference >= config.betwindow ) {
                this.status = 1; 
            }
        } else if (this.status == 1){ // complete 
            this.calculateMultiplier()
            this.status = 2;
            this.multiplier = 1;
            this.incrementTimeStamp = Date.now();
        } else if (this.status == 2){ // multiplier 
            if ( this.multiplier <= this.finalMultiplier){
                let increment = Date.now() - this.incrementTimeStamp;
                increment /= 100;
                increment *= config.incremantRate
                this.multiplier +=  increment;
                this.multiplier = parseFloat( this.multiplier.toFixed(2) ); 
                if ( this.multiplier >= this.finalMultiplier ){
                    this.multiplier = this.finalMultiplier;
                    this.status = 3; // cashout 
                }
            } 
        }
    }

    private calculateMultiplier(){
        const result = this.engine.play(0, "", "");
        this.finalMultiplier = result.multiplier;
        console.log( "finalMultiplier", this.finalMultiplier);
    }
}

const config = {
    rtp : 0.90,
    betwindow : 10000,
    incremantRate : 0.01,
}
