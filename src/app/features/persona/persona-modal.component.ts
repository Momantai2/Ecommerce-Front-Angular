import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SexoResponseDTO } from '../../models/sexo.model';

@Component({
  selector: 'app-modal-persona',
  templateUrl: './persona-modal.component.html',
  standalone: true,
  imports: [FormsModule,CommonModule],
})
export class PersonaModalComponent {
  @Input() persona: any = {};
  @Input() readonly: boolean = false;


 @Input() sexos: SexoResponseDTO[] = [];

}

