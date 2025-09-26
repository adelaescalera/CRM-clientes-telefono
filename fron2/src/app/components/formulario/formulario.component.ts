import { Component, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AddClient, IRespGeneric } from '../../interface/response';
import { ClientService } from '../../service/client.service';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, CommonModule],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss']
})
export class FormularioComponent {
  
  @Output() clienteAgregado = new EventEmitter<AddClient>();

  addclienteForm: FormGroup;

  constructor(private fb: FormBuilder, private clienteS: ClientService) {
    this.addclienteForm = this.fb.group({
      nombre: ['', Validators.required],
      dni: ['', Validators.required],
      direccion: [''],
      telefonos: this.fb.array([]) // FormArray para teléfonos
    });
  }

  // Getter para usar en HTML
  get telefonos(): FormArray {
    return this.addclienteForm.get('telefonos') as FormArray;
  }


addTelefono() {
  const telefonoGroup = this.fb.group({
    numero: ['', Validators.required],
    type: ['mobile'] // Valor por defecto
  });
  this.telefonos.push(telefonoGroup);
}

  // Eliminar teléfono
  removeTelefono(index: number) {
    this.telefonos.removeAt(index);
  }

  // Enviar formulario
  onSubmit() {
    if (this.addclienteForm.invalid) return;

    const nuevoCliente: AddClient = this.addclienteForm.value;

    this.clienteS.addClient(nuevoCliente).subscribe({
      next: (res: IRespGeneric) => {
        this.clienteAgregado.emit(nuevoCliente); 
        this.addclienteForm.reset();
        this.telefonos.clear();
        alert('Cliente agregado correctamente'); 
      },
      error: (err) => console.error(err)
    });
  }
}
