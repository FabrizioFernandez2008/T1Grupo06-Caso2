import { Component, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { NuevoMovimiento } from '../nuevo-movimiento/nuevo-movimiento';

@Component({
  selector: 'app-billetera',
  imports: [DecimalPipe, NuevoMovimiento],
  templateUrl: './billetera.html',
  styleUrl: './billetera.css'
})
export class Billetera {
  protected readonly saldo = signal(250);
  protected readonly movimientos = signal<{ tipo: string; monto: number }[]>([]);

  protected registrarMovimiento(movimiento: {
    tipo: string;
    monto: number;
  }): void {
    if (
      movimiento.tipo === 'Gasto' &&
      movimiento.monto > this.saldo()
    ) {
      return;
    }

    if (movimiento.tipo === 'Recarga') {
      this.saldo.update(saldo => saldo + movimiento.monto);
    } else {
      this.saldo.update(saldo => saldo - movimiento.monto);
    }

    this.movimientos.update(movimientos => [
      movimiento,
      ...movimientos
    ]);
  }
}


