import { CrashGameController } from "../controllers/crashgame";
import { GameService } from "../service/gameService";

const service : GameService = new GameService();
const game : CrashGameController = new CrashGameController(); 

export async function add( id: string, name: string ) {
    return await service.addPlayer(id, name);
}

export async function remove( id: string ) {
    return service.removePlayer( id );
}

export async function bet( id: string, body: string ) {
    if (!game.betPaused()) {
        const data = JSON.parse( body);
        return service.debit( id, data.bet);
    }
    return { status : false, message : "bet not allowed" }
}

export async function cashout( id: string, body: string ) {
    const data = JSON.parse( body);
    return service.cashout( id, game.value() );
}

export async function allRecords() {
    return { 
        records : await service.allRecords(), 
        betPaused : await game.betPaused(),
        multiplier : await game.value(),
        timer : await game.timeline()
    };
}

export async function callback() {
    game.update();
    if ( game.isEnd()) {
        await service.closeSession();
        game.reset();
    }
}
