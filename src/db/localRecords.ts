export class LocalRecords {
    
    records : Map<string, IRecord> = new Map(); 

    public bet( id:string) : number{
        let data: IRecord | undefined;
        if (this.records.has(id)) {
            data = this.records.get(id);
        }
        return data && data.bet? data.bet : 0;
    }
    public win( id:string) : number{
        let data: IRecord | undefined;
        if (this.records.has(id)) {
            data = this.records.get(id);
        }
        return data && data.win? data.win : 0;
    }

    public debit( id:string, amount: number){
        let data :IRecord | undefined; 
        if ( this.records.has( id) ){
            data = this.records.get( id );
        }
        if (data && data.status == 'bet') {
            return { status : false, message : 'bet already paced' };
        }
        
        this.records.set( id, {
            status: 'bet', bet : amount, win : 0
        });

        return { status : true }

    }

    public credit( id:string, amount: number){
        let data :IRecord | undefined; 
        if ( this.records.has( id) ){
            data = this.records.get( id );
        }
        if (!data){
            return { status : false, message : 'player not found' };
        }
        if ( data.status == 'win') {
            return { status : false, message : 'win already paced' };
        }
        
        this.records.set( id, {
            status: 'Bet', bet : amount, win : 0
        });

        return { status : true }
    }

    public allBets(){
        let data : any[] = [];
        for (let key of this.records.keys()) {
            const record :IRecord | undefined = this.records.get( key);
            if (record) {
                data.push( {
                    id: key, status: record.status, bet: record.bet 
                } )    
            }
        }
        return data;
    }

    public clear(){
        this.records.clear();
    }
}

interface IRecord {
    status?: string
    bet?: number
    win?: number
}
