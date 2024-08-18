import { ValidatorController } from "../controllers/validator";
import { DBService } from "./dbService";
import {v4 as uuidv4} from 'uuid';

let count = 1234;

export class GameService {

    validator : ValidatorController = new ValidatorController(); 
    db : DBService = new DBService();

    public async addPlayer( token: string | null, name :string){
        const status : Boolean = this.validator.validateToken(token );
        if (status) { // ideally this will be during launch or init 
            const id = uuidv4();
            await this.db.add( id, `guest${count++}` );
            return { status, id };
        }
        return { status, message : "Invalid Token" };
    }
    public async removePlayer( id: string){
        await this.db.remove(id);
    }

    public async debit( id:string, amount: number){
        if (amount <= 0) {
            return { status : false, message : 'invalid bet' };
        }
        return await this.db.debit( id, amount);
    }

    public async cashout( id:string, multiplier: number) {
        const bet :number = await this.db.bet( id);
        const win = (bet * multiplier).toFixed(2);
        await this.credit( id, parseFloat(win) );
        return { status : true };
    }

    public async credit( id:string, amount: number){
        return await this.db.credit( id, amount);
    }

    public async allRecords(){
        return await this.db.records();
    }

    public async closeSession() {
        await this.db.clearAllBets();
    }

}
