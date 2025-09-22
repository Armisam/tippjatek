import { Component, inject } from '@angular/core';
import { DataService } from '../../services/data-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sorrend-container',
  imports: [RouterLink],
  templateUrl: './sorrend-container.html',
  styleUrl: './sorrend-container.scss'
})
export class SorrendContainer {
  private readonly dataService = inject(DataService);
  readonly players = this.dataService.sortedPlayers;
}
