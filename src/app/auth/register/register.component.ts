import { Component, Input } from '@angular/core';
import { PersonaModalComponent } from '../../features/persona/persona-modal.component';
import { SexoResponseDTO } from '../../models/sexo.model';
import { SexoService } from '../../services/sexo.service';
import { PersonaService } from '../../services/persona.service';
import { Persona } from '../../models/persona.model';
import { RolResponseDTO } from '../../models/rol.model';
import { RolService } from '../../services/rol.service';
import { UsuarioModalComponent } from "../../features/usuario/usuario-modal.component";
import { NgIf } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-register',
   standalone: true,
  imports: [PersonaModalComponent, UsuarioModalComponent,NgIf,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  persona: Persona = {} as Persona;
  sexo: SexoResponseDTO[] = [];
  roles: RolResponseDTO[] = [];

  usuarioVisible = false;
  usuario: any = {};

  constructor(
    private personaService: PersonaService,
    private sexoService: SexoService,
    private rolService: RolService,
    private usuarioService: UsuarioService // 👈 nuevo

  ) {}

  ngOnInit(): void {
    this.sexoService.getAll().subscribe({ next: (data) => this.sexo = data });
    this.rolService.getAll().subscribe({ next: (data) => this.roles = data });
  }

 registrarPersona() {
  this.personaService.create(this.persona).subscribe({
    next: (resp) => {
      console.log('Persona registrada:', resp);
      this.usuarioVisible = true;

      // ✅ Buscar el rol con nombre "usuario"
      const rolUsuario = this.roles.find(r => r.nombre.toLowerCase() === 'usuario');

      // ✅ Inicializar el objeto usuario
      this.usuario = {
        nombreUsuario: '',
        password: '',
        idPersona: resp.idPersona,   // asigna la persona recién creada
        idRol: rolUsuario?.idRol || null,  // asignar el rol "usuario" automáticamente
        estado: true
      };
    },
    error: (err) => console.error('Error registrando persona:', err)
  });
}

registrarUsuario() {
  this.usuarioService.create(this.usuario).subscribe({
    next: (resp) => {
      console.log('Usuario registrado:', resp);
      alert('Usuario registrado exitosamente.');
      // Aquí podrías redirigir, limpiar formulario, etc.
    },
    error: (err) => {
      console.error('Error registrando usuario:', err);
      alert('Hubo un error al registrar el usuario.');
    }
  });
}



}