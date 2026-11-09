// Se utiliza input para recibir datos del componente padre,
// Se utiliza output para enviar eventos al componente padre 
// Se utiliza signal para gestionar datos reactivos.
import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-nuevo-movimiento',
  imports: [],
  templateUrl: './nuevo-movimiento.html',
  styleUrl: './nuevo-movimiento.css'
})
export class NuevoMovimiento {
  readonly saldoActual = input.required<number>();

  readonly movimientoSolicitado = output<{
    tipo: string;
    monto: number;
  }>();

  protected readonly tipoMovimiento = signal('');
  protected readonly monto = signal('');
  protected readonly error = signal('');

  protected actualizarMonto(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;

    this.monto.set(valor);
    this.validarMonto();
  }

  protected validarMonto(): void {
    const valor = this.monto();

    //En esta parte se realizan la comprobaciones del monto igresado por el usuario.
    //Que sea un número, que no sea negativo, que no tenga mas de 2 decimales.
    if (valor.trim() === '') {
      this.error.set('');
    } else if (!/^\d+(\.\d{1,2})?$/.test(valor)) {
      this.error.set('Ingrese únicamente números y hasta dos decimales.');
    } else if (Number(valor) <= 0) {
      this.error.set('El monto debe ser mayor que cero.');
    //Aqui se valida que el monto ingresado en caso de ser gasto, no pueda ser mayor que el saldo 
    // disponible. Caso contrario indica un error
    } else if (
      this.tipoMovimiento() === 'Gasto' &&
      Number(valor) > this.saldoActual()
    ) {
      this.error.set('No cuenta con saldo suficiente.');
    } else {
      this.error.set('');
    }
  }

  protected get formularioInvalido(): boolean {
      return (
        this.tipoMovimiento() === '' ||
        this.monto().trim() === '' ||
        !/^\d+(\.\d{1,2})?$/.test(this.monto()) ||
        Number(this.monto()) <= 0 ||
        this.error() !== ''
      );
    }

    protected registrarMovimiento(): void {
    if (this.formularioInvalido) {
      return;
    }

    this.movimientoSolicitado.emit({
      tipo: this.tipoMovimiento(),
      monto: Number(this.monto())
    });

    this.monto.set('');
    this.error.set('');
  }
}