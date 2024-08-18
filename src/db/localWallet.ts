export class LocalWallet{

    wallet : Map<string, IWallet> = new Map(); 

    public allPlayers(){
        let data : any[] = [];
        for (let key of this.wallet.keys()) {
            const record :IWallet | undefined = this.wallet.get( key);
            if (record) {
                data.push( {
                    id: key, name: record.name 
                })    
            }
        }
        return data;
    }

    public add( id: string, name:string){
        let data :IWallet | undefined; 
        if ( this.wallet.has( id) ){
            data = this.wallet.get( id );
        }
        if (data != undefined) {
            return { status : false, message : 'session id already exists' };
        }
        
        this.wallet.set( id, {
            name : name, balance : 5000
        });

        return { status : true } 
    }

    public remove( id: string) {
        this.wallet.delete( id);
    }

    public balance( id: string) {
        const data = this.wallet.get( id);
        return data ? data.balance : 0; 
    }

    public name( id: string) : string {
        const data = this.wallet.get( id);
        return data ? data.name : ""; 
    }

    public updateBalance( id: string, debit: number, credit: number ){
        const data = this.wallet.get( id);
        if (data) {
            data.balance += credit - debit;
            return { status : true }
        } 
        return { status: false, message: "player not found" };
    }

} 

interface IWallet {
    name: string
    balance: number
}
