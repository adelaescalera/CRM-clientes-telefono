import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ClientService } from '../../service/client.service';

@Component({
  selector: 'app-edit-client',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, DropdownModule],
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.scss']
})
export class EditClientComponent {
  @Input() cliente: any;
  @Output() clienteActualizado = new EventEmitter<any>();

  form: FormGroup;

  tiposTelefono = [
    { label: 'Mobile', value: 'mobile' },
    { label: 'Landline', value: 'landline' },
    { label: 'Office', value: 'office' }
  ];

  constructor(private fb: FormBuilder, private clienteS: ClientService) {
    this.form = this.fb.group({
      nombre: [''],
      dni: [''],
      direccion: [''],
      telefonos: this.fb.array([])
    });
  }

  ngOnChanges() {
    if (this.cliente) {
      this.form.patchValue({
        nombre: this.cliente.nombre,
        dni: this.cliente.dni,
        direccion: this.cliente.direccion
      });

      const telefonosFA = this.form.get('telefonos') as FormArray;
      telefonosFA.clear();

      if (this.cliente.telefonos) {
        this.cliente.telefonos.forEach((t: any) => {
          telefonosFA.push(this.fb.group({
            id: t.phoneId ?? null, // Mantener id para edición
            numero: t.numero,
            type: t.type
          }));
        });
      }
    }
  }

  get telefonos() {
    return this.form.get('telefonos') as FormArray;
  }

  agregarTelefono() {
    this.telefonos.push(this.fb.group({
      id: null,   // nuevo teléfono
      numero: '',
      type: 'mobile'
    }));
  }

  eliminarTelefono(i: number) {
    this.telefonos.removeAt(i);
  }

  guardarCambios() {
    if (this.form.invalid) return;

    // Preparamos los datos incluyendo los id de cada teléfono
    const clienteActualizado = { ...this.cliente, ...this.form.value };

    this.clienteS.updateClient(clienteActualizado.id, clienteActualizado).subscribe({
      next: (res: any) => {
        // Emitimos los datos que vienen del backend para mantener id correctos
        this.clienteActualizado.emit(res.data ?? clienteActualizado);
      },
      error: err => console.error(err)
    });
  }
}
