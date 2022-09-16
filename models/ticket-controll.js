const path= require('path');
const fs= require('fs');

class Ticket{
    constructor(numero, escritorio){
        this.numero=numero;
        this.escritorio=escritorio;
    }
}


class TicketControl{

    constructor(){
        this.ultimo  = 0;
        this.hoy     = new Date().getDate();
        this.tickets = [];
        this.ultimos = []; //Ultimos 4 tickets
        
        this.init();
    }
    //Generar data en DB
    get toJson(){
        return{
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets:this.tickets,
            ultimos:this.ultimos
        }
    }
    //Inicializador de DB
    init(){
        const { hoy, ultimo, ultimos, tickets }=require('../data/data.json');
        if(hoy ===this.hoy){
            this.tickets=tickets;
            this.ultimo=ultimo;
            this.ultimos=ultimos
        }else{
            this.guardaDB();
        }
    }

    guardaDB(){
        const dbPath= path.join(__dirname,'../data/data.json');
        fs.writeFileSync(dbPath, JSON.stringify( this.toJson ));
    }   

    //ticketes siguietes
    siguiente(){
        this.ultimo+=1;
        const ticket= new Ticket(this.ultimo, null);
        this.tickets.push( ticket );
        this.guardaDB();

        return 'Ticket: '+ ticket.numero;
    }

    atenderTicket(escritorio){
        if(this.tickets.length===0){
            return null;
        }

        //optener y borrar el primer ticket del arreglo de tickets
        const ticket= this.tickets.shift();
        ticket.escritorio=escritorio;

        this.ultimos.unshift( ticket );

        if(this.ultimos.length>4){
            this.ultimos.splice(-1,1);
        }

        this.guardaDB();
        return ticket;
    }

}


module.exports=TicketControl;