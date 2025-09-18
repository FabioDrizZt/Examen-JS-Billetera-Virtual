const balance = document.getElementById('balance');
const btnIngresar = document.getElementById('btnIngresar');
const modalIngresar = document.getElementById('modalIngresar');
const btnTransferir = document.getElementById('btnTransferir');
const modalTransferir = document.getElementById('modalTransferir');
const btnHistorial = document.getElementById('btnHistorial');
const transactionList = document.getElementById('transactionList');
const confirmarIngreso = document.getElementById('confirmarIngreso');
const montoIngreso = document.getElementById('montoIngreso');
const confirmarTransferencia = document.getElementById('confirmarTransferencia');
const montoTransferencia = document.getElementById('montoTransferencia');
const destinatario = document.getElementById('destinatario');

/* const botonesCancelar = document.querySelectorAll('.cerrar-modal');
botonesCancelar.forEach(boton => {
    boton.addEventListener('click', () => {
        modalIngresar.style.display = 'none';
        modalTransferir.style.display = 'none';
    });
}); */

const openModal = (modal) => {
    modal.style.display = 'block';
    modal.querySelector('.cerrar-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

btnIngresar.addEventListener('click', () => {
    openModal(modalIngresar);
})

btnTransferir.addEventListener('click', () => {
    openModal(modalTransferir);
})

btnHistorial.addEventListener('click', () => {
    if (transactionList.style.display === 'none') {
        transactionList.style.display = 'block';
    } else {
        transactionList.style.display = 'none';
    }
})

/* Agregar transacciones al historial */
const agregarTransaccion = (transaccion) => {
    const transacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
    transacciones.push(transaccion);
    localStorage.setItem('transacciones', JSON.stringify(transacciones));
    mostrarTransacciones()
}

/* Logica del ingreso de dinero */
const validarMonto = (monto) => !(isNaN(monto) || monto <= 0)

confirmarIngreso.addEventListener('click', () => {
    const monto = parseFloat(montoIngreso.value);
    console.log(monto)
    if (validarMonto(monto)) {
        const saldo = parseFloat(localStorage.getItem('saldo') || 0);
        localStorage.setItem('saldo', saldo + monto);
        balance.innerText = `$ ${(saldo + monto).toFixed(2)}`;
        montoIngreso.value = '';
        modalIngresar.style.display = 'none';
        // Historial
        agregarTransaccion({
            monto,
            tipo: 'ingreso',
            destinatario: 'Billetera Virtual'
        })
    } else {
        alert('Ingrese un monto valido');
        return;
    }
})

/* Logica del transferencia de dinero */
const validarSaldo = (monto) => {
    const saldo = parseFloat(localStorage.getItem('saldo') || 0);
    return monto <= saldo;
}

confirmarTransferencia.addEventListener('click', () => {
    const monto = parseFloat(montoTransferencia.value);
    const destination = destinatario.value;
    if (validarMonto(monto) && validarSaldo(monto) && destination.length > 2) {
        const saldo = parseFloat(localStorage.getItem('saldo') || 0)
        localStorage.setItem('saldo', saldo - monto);
        balance.innerText = `$ ${(saldo - monto).toFixed(2)}`;
        montoTransferencia.value = '';
        destinatario.value = '';
        modalTransferir.style.display = 'none';
        // Historial
        agregarTransaccion({
            monto,
            tipo: 'transferencia',
            destinatario: destination
        })

    } else {
        alert('Ingrese un monto valido');
        return;
    }
})

/* Mostrar historial de transacciones */
const mostrarTransacciones = () => {
    const transacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
    transacciones.forEach(transaccion => {
        transactionList.innerHTML += `
                <div class="transaction-item">
                    <p>${transaccion.tipo === 'ingreso' ? '+' : '-'} ${transaccion.monto.toFixed(2)} destino: ${transaccion.destinatario}</p>
                </div>
            `;
    });
}

window.addEventListener('load', () => {
    const saldo = parseFloat(localStorage.getItem('saldo') || 0);
    balance.innerText = `$ ${saldo.toFixed(2)}`;
    mostrarTransacciones()
});