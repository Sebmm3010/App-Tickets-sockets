const TicketControl = require('../models/ticket-controll');

const ticketControl= new TicketControl;







const socketController = (socket) => {

    socket.emit('ultimo-ticket',ticketControl.ultimo);
    socket.emit('ultimos-4',ticketControl.ultimos);
    socket.emit('tickets-pendientes', ticketControl.tickets.length);


    socket.on('siguiente-ticket', ( payload, callback ) => {
        const siguiente= ticketControl.siguiente();
        callback(siguiente);

        socket.emit('tickets-pendientes', ticketControl.tickets.length);
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
        //Notificar que hay un nuevo ticket pendiente
    });

    socket.on('atender-ticket', ( { escritorio },callback)=>{
        if(!escritorio){
            return callback({
                ok: false,
                msg: 'EL escritorio es obligatorio'
            });
        }

        const ticket= ticketControl.atenderTicket( escritorio );

        socket.broadcast.emit('ultimos-4', ticketControl.ultimos);
        socket.emit('tickets-pendientes', ticketControl.tickets.length);
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);

        if(!ticket){
            callback({
                ok:false,
                msg: 'Ya no hay mas tickets pendientes'
            });
        }else{
            callback({
                ok:true,
                ticket
            })
        }

    });

}





module.exports = {
    socketController
}

