import { DBService } from "../service/dbService";

export class ValidatorController {
    
    db: DBService = new DBService();

    public validateToken( token:string | null){
        return (token != null );
    }
}
