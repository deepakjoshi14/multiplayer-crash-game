import { LocalRecords } from "../db/localRecords";
import { LocalWallet } from "../db/localWallet";

export class DBService {

    wallet : LocalWallet = new LocalWallet();
    record : LocalRecords = new LocalRecords(); 

    public async add( id: string, name: string) {
        return await this.wallet.add( id, name);
    }

    public async remove( id: string) {
        await this.wallet.remove( id);
    }

    public async bet( id:string) {
        return await this.record.bet( id);
    }
    public async win( id:string) {
        return await this.record.win( id);
    }

    public async debit( id: string, amount: number) {
        if (amount <= 0) {
            return { status : false, message : 'invalid bet' };
        }
        const balance: number = await this.wallet.balance( id);
        if (balance < amount) {
            return { status : false, message : 'insufficient funds' };
        }

        const result = await this.record.debit( id, amount);
        if ( result.status) {
            await this.wallet.updateBalance( id, amount, 0);
        }
        return result;
    }

    public async credit( id: string, amount: number) {
        const result = await this.record.credit( id, amount);
        if ( result.status) {
            await this.wallet.updateBalance( id, 0, amount);
        }
        return result;
    }
   
    public async records(){
        const records = await this.wallet.allPlayers();
        await records.forEach( async (record) => {
            record.bet = await this.record.bet( record.id );
            delete record.id;
        });
        return records;
    }

    public async clearAllBets(){
        await this.record.clear();
    }
}