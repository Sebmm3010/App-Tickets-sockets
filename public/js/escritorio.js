
//Referencias a los html

const lblEscritorio = document.querySelector('h1');
const lblTicket = document.querySelector('small');
const btnAtender = document.querySelector('button');
const divAlert = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');


const searchParams = new URLSearchParams(window.location.search);


if (!searchParams.has('escritorio')) {

    window.location = 'index.html';

    throw new Error('Escritorio obligatorio');
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;

divAlert.style.display = 'none';

const socket = io();



socket.on('connect', () => {

    btnAtender.disabled = false;

});

socket.on('disconnect', () => {

    btnAtender.disabled = true;
});

socket.on('tickets-pendientes', (payload) => {
    const num = payload;
    if (num !== 0){
        divAlert.style.display = 'none';
        lblPendientes.style.display = '';


        lblPendientes.innerText = num;
    } else{
        lblPendientes.style.display='none';
        divAlert.style.display = '';
    }
});


btnAtender.addEventListener('click', () => {

    socket.emit('atender-ticket', { escritorio }, ({ ticket, ok, msg }) => {
        if (!ok) {
            lblTicket.innerText = 'Nadie.';
            divAlert.style.display = '';
        }

        lblTicket.innerText = `Ticket: ${ticket.numero}`;
    });
});