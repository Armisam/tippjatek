import { Component, effect, inject, signal, computed } from '@angular/core';
import { DataService } from '../../services/data-service';
import { RouterLink } from '@angular/router';
import { Player } from '../../types/player';
import { calculatePoints } from '../../utility/calculate-points';


@Component({
  selector: 'app-sorrend-container',
  imports: [RouterLink],
  templateUrl: './sorrend-container.html',
  styleUrls: ['./sorrend-container.scss']
})
export class SorrendContainer {
  private readonly dataService = inject(DataService);

  private readonly playersData = this.dataService.playersData;
  private readonly predictionsData = this.dataService.predictionsData;
  private readonly scoresData = this.dataService.scoresData;

  readonly players = signal<Player[]>([]);

  constructor() {
    effect(() => {
      const players = this.playersData();
      const predictions = this.predictionsData();
      const scores = this.scoresData();

      if (players && predictions && scores) {
        const updatedPlayers: Player[] = players.map(player => {
          let totalPoints = 0;
          const playerPredictions = predictions.filter(p => p.playerId === player.id);

          for (const pred of playerPredictions) {
            const actualScore = scores.find(
              s => s.matchNumber === pred.matchNumber && s.roundNumber === pred.roundNumber
            );
            if (!actualScore || !actualScore.score) continue;

            totalPoints += calculatePoints(pred.tip, actualScore.score);
          }
          return { ...player, points: totalPoints };
        });

        updatedPlayers.sort((a, b) => (b.points || 0) - (a.points || 0));
        this.players.set(updatedPlayers);
      }
    });
  }
}
