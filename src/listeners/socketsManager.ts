import { WebSocketServer, WebSocket  } from "ws";
import { add, allRecords, bet, cashout, remove } from "../routes/routes";

let wss: WebSocketServer;

function startServer( port: number) {
    wss = new WebSocketServer ({ port });
    wss.on('connection', onConnect);
    wss.on('close', () => console.log('Connection closed'));
        
    console.log( `listening to ${port}`);
}

async function onConnect(ws: ExtWebSocket, req: Request) {

    let headers : any = req.headers; 
    let token :string | null = headers['token'];
    const result = await add( token ? token : "", "" ); // ideally this is step for init 
    ws.id = result.id ? result.id : '';

    if ( result.status ) {
        ws.on('message', async (message: string) => {

            let status = false;
            console.log( "message", message.toString() )
            const data = JSON.parse( message.toString() );
            if( data.bet) {
                const result = await bet( ws.id, message);
                ws.send( JSON.stringify( result));
                status = result.status;
            }
            if( data.cashout) {
                const result = await cashout( ws.id, message );
                ws.send( JSON.stringify( result));
                status = result.status;
            }
            
        })
    
        ws.on('close', async (code: number, reason: string) => {
            console.log( 'close', ws.id, code, reason.toString());
            await remove( ws.id);
        })
    
        ws.on('error', async (error: string) => {
            console.log( 'error', error.toString());
        })  
        
        console.log( 'added', ws.id);

    } else {
        ws.send(`Error : ${result.message}`);
        ws.close();
    }
    
}

export function callback(){
    toClient();
}

async function toClient() {
    if (wss) {
        const records = await allRecords();
        const data = JSON.stringify( { valid : true, ...records } );
        wss.clients.forEach( client => {
            if(client.readyState === WebSocket.OPEN) {
                client.send( data );
            }
        });    
    }
}


export default startServer;

interface ExtWebSocket extends WebSocket {
    id : string;
}
