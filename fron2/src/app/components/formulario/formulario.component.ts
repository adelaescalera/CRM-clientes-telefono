import { Component, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AddClient, IRespGeneric, Usuario } from '../../interface/response';
import { ClientService } from '../../service/client.service';
import { UsuarioService } from '../../service/usuario.service';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, CommonModule, FormsModule],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss']
})
export class FormularioComponent {

  @Output() clienteAgregado = new EventEmitter<AddClient>();
  @Output() usuarioAgregado = new EventEmitter<Usuario>();

  tipoEntidad: 'cliente' | 'usuario' = 'cliente';

  addclienteForm: FormGroup;
  addusuarioForm: FormGroup;

  constructor(private fb: FormBuilder, private clienteS: ClientService, private usuarioS: UsuarioService) {
    this.addclienteForm = this.fb.group({
      nombre: ['', Validators.required],
      dni: ['', Validators.required],
      direccion: [''],
      telefonos: this.fb.array([])
    });

    this.addusuarioForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      dni: [''],
      rol: [2, Validators.required] // Asignar rol de cliente por defecto
    });
  }

  cambiarTipo() {
    // Limpia ambos formularios al cambiar tipo
    this.addclienteForm.reset();
    this.addusuarioForm.reset();
    this.telefonos.clear();
  }

  get telefonos(): FormArray {
    return this.addclienteForm.get('telefonos') as FormArray;
  }

  addTelefono() {
    const telefonoGroup = this.fb.group({
      numero: ['', Validators.required],
      type: ['mobile']
    });
    this.telefonos.push(telefonoGroup);
  }

  removeTelefono(index: number) {
    this.telefonos.removeAt(index);
  }

  onSubmitCliente() {
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

  // onSubmitUsuario() {
  //   if (this.addusuarioForm.invalid) return;
  //   const nuevoUsuario: Usuario = this.addusuarioForm.value;

  //   this.usuarioS.addUser(nuevoUsuario).subscribe({
  //     next: (res: IRespGeneric) => {
  //       this.usuarioAgregado.emit(nuevoUsuario);
  //       this.addusuarioForm.reset();
  //       alert('Usuario agregado correctamente');
  //     },
  //     error: (err) => console.error(err)
  //   });
  // }

  onSubmitUsuario() {
  if (this.addusuarioForm.invalid) return;

  const formValue = this.addusuarioForm.value;

  const nuevoUsuario = {
    username: formValue.username,
    password: formValue.password,
    rol: formValue.rol,
    cliente: formValue.dni ? { dni: formValue.dni } : null // 👈 objeto cliente si hay DNI
  };

  this.usuarioS.addUser(nuevoUsuario).subscribe({
    next: () => {
      alert('Usuario creado correctamente');
      this.addusuarioForm.reset();
    },
    error: err => console.error(err)
  });
}

}
