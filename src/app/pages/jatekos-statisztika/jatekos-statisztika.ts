import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService } from '../../services/data-service';
import { MatchTip } from '../../interfaces/player';

@Component({
  selector: 'app-jatekos-statisztika',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './jatekos-statisztika.html',
  styleUrls: ['./jatekos-statisztika.scss']
})
export class JatekosStatisztika {
  private readonly route = inject(ActivatedRoute);
  private readonly dataService = inject(DataService);

  readonly playerId = computed(() => this.route.snapshot.paramMap.get('id'));

  readonly player = computed(() => {
    const id = Number(this.playerId());
    if (!id) return null;
    return this.dataService.sortedPlayers().find(p => p.id === id) || null;
  });

  calculatePoints(tip: MatchTip): number {
    if (!tip.tip || !tip.actualScore) return 0;

    const [homeGoal, awayGoal] = tip.tip.split('-').map(Number);
    const [actualHome, actualAway] = tip.actualScore.split('-').map(Number);

    const tipResult = homeGoal > awayGoal ? '1' : homeGoal < awayGoal ? '2' : 'x';
    const actualResult = actualHome > actualAway ? '1' : actualHome < actualAway ? '2' : 'x';

    if (tipResult !== actualResult) return 0;
    if (homeGoal === actualHome && awayGoal === actualAway) return 5;
    if ((homeGoal - awayGoal) === (actualHome - actualAway)) return 3;
    return 1;
  }

}
