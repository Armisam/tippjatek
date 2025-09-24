import { Component, inject, computed, effect, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService } from '../../services/data-service';
import { Prediction } from '../../types/prediction';
import { calculatePoints } from '../../utility/calculate-points';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-jatekos-statisztika',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './jatekos-statisztika.html',
  styleUrls: ['./jatekos-statisztika.scss']
})
export class JatekosStatisztika {
  private readonly route = inject(ActivatedRoute);
  private readonly dataService = inject(DataService);

  private readonly playerId = computed(() => this.route.snapshot.paramMap.get('id'));

  readonly playerName = signal<string>('');
  readonly playerPredictions = signal<
    { roundNumber: number; tips: Prediction[] }[]
  >([]);
  readonly scores = this.dataService.scoresData;

  readonly editingTip = signal<{ roundNumber: number; matchNumber: number } | null>(null);
  readonly editingValueHome = signal<number>(0);
  readonly editingValueAway = signal<number>(0);

  constructor() {
    effect(() => {
      if (this.playerId() && this.dataService.predictionsData() && this.dataService.scoresData()) {
        const predictions = this.dataService.predictionsData()?.filter(
          p => p.playerId === Number(this.playerId())
        ) || [];

        const grouped = predictions.reduce((acc, pred) => {
          let round = acc.find(r => r.roundNumber === pred.roundNumber);
          if (!round) {
            round = { roundNumber: pred.roundNumber, tips: [] };
            acc.push(round);
          }
          round.tips.push(pred);
          return acc;
        }, [] as { roundNumber: number; tips: Prediction[] }[]);

        grouped.sort((a, b) => a.roundNumber - b.roundNumber);

        let allScores = this.dataService.scoresData() ?? [];
        const today = new Date();
        const futureScores = allScores.filter(
          score => score.startDate && score.startDate.toDate() > today
        );
        const nextScore = futureScores.reduce((earliest, current) => {
          const currentDate = current.startDate!.toDate();
          const earliestDate = earliest.startDate!.toDate();
          return currentDate < earliestDate ? current : earliest;
        }, futureScores[0]);

        if (nextScore) {
          const nextDate = nextScore.startDate!.toDate();
          const oneWeekLater = new Date(nextDate.getTime() + 7 * 24 * 60 * 60 * 1000);

          const scoresWithinWeek = futureScores.filter(score => {
            const scoreDate = score.startDate!.toDate();
            return scoreDate >= nextDate && scoreDate <= oneWeekLater;
          });

          allScores = scoresWithinWeek;
        }

        const allRounds = Array.from(new Set(allScores.map(s => s.roundNumber)));
        const lastRound = Math.max(...allRounds);

        const lastRoundScores = allScores.filter(s => s.roundNumber === lastRound);

        let lastRoundGroup = grouped.find(g => g.roundNumber === lastRound);
        if (!lastRoundGroup) {
          lastRoundGroup = { roundNumber: lastRound, tips: [] };
          grouped.push(lastRoundGroup);
        }

        lastRoundGroup.tips = lastRoundScores
          .sort((a, b) => a.matchNumber - b.matchNumber)
          .map(score => {
            const existing = lastRoundGroup!.tips.find(t => t.matchNumber === score.matchNumber);
            return (
              existing ?? {
                roundNumber: lastRound,
                matchNumber: score.matchNumber,
                playerId: Number(this.playerId()),
                tip: '',
                startDate: score.startDate ? new Date(score.startDate.seconds * 1000 + (score.startDate.nanoseconds || 0) / 1e6) : undefined
              }
            );
          });

        this.playerPredictions.set(grouped);

        this.playerName.set(
          this.dataService.playersData()?.find(
            p => p.id === Number(this.playerId())
          )?.name || ''
        );
      }
    });

  }

  getPoints(tip: Prediction): number {
    const scores = this.dataService.scoresData();
    const actualScore = scores?.find(
      s => s.roundNumber === tip.roundNumber && s.matchNumber === tip.matchNumber
    )?.score;

    return calculatePoints(tip.tip, actualScore || '');
  }

  getPair(roundNumber: number, matchNumber: number): string {
    const score = this.scores()?.find(s => s.roundNumber === roundNumber && s.matchNumber === matchNumber);
    return score ? `${score.home}-${score.away}` : '';
  }

  getScore(roundNumber: number, matchNumber: number): string {
    const score = this.scores()?.find(s => s.roundNumber === roundNumber && s.matchNumber === matchNumber);
    return score && score.score ? score.score : '-';
  }

  isLastRound(roundNumber: number): boolean {
    const allRounds = Array.from(new Set(this.scores()?.map(s => s.roundNumber) ?? []));
    return !allRounds.some(r => r > roundNumber);
  }

  onClickSaveEditTip(roundNumber: number, matchNumber: number, tip?: string) {
    if (this.editingTip()?.roundNumber !== roundNumber || this.editingTip()?.matchNumber !==
      matchNumber) {
      this.editingTip.set({ roundNumber, matchNumber });
      this.editingValueHome.set(tip ? tip.split('-').map(Number)[0] : 0);
      this.editingValueAway.set(tip ? tip.split('-').map(Number)[1] : 0);
    } else {
      this.dataService.addOrUpdatePrediction(Number(this.playerId()) || 0, roundNumber, matchNumber, `${this.editingValueHome()}-${this.editingValueAway()}`);
      const updatedPredictions = this.playerPredictions().map(group =>
        group.roundNumber === roundNumber
          ? {
            ...group,
            tips: group.tips.map(pred =>
              pred.matchNumber === matchNumber
                ? { ...pred, tip: `${this.editingValueHome()}-${this.editingValueAway()}` }
                : pred
            ),
          }
          : group
      );
      this.playerPredictions.set(updatedPredictions);
      this.editingTip.set(null);
    }
  }

  sanitizeNumber(event: Event, editingValue: WritableSignal<number>) {
    const inputEl = (event.target as HTMLInputElement)
    const cleaned = inputEl.value.replace(/\D/g, '');
    editingValue.set(Number(cleaned));
    inputEl.value = cleaned;
  }

  canEdit(roundNumber: number, matchNumber: number): boolean {
    const score = this.scores()?.find(
      s => s.roundNumber === roundNumber && s.matchNumber === matchNumber
    );
    if (!score?.startDate) return false;

    let matchStart: Date;
    if ((score.startDate as any).toDate) {
      matchStart = (score.startDate as any).toDate();
    } else if ('seconds' in score.startDate) {
      matchStart = new Date(score.startDate.seconds * 1000 + (score.startDate.nanoseconds || 0) / 1e6);
    } else {
      matchStart = new Date(score.startDate);
    }

    const now = new Date();
    const day = matchStart.getDay();
    const diffToMonday = (day + 6) % 7;

    const startOfWeek = new Date(matchStart);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(matchStart.getDate() - diffToMonday);

    const twoHoursBefore = new Date(matchStart.getTime() - 2 * 60 * 60 * 1000);

    return now >= startOfWeek && now <= twoHoursBefore;
  }


}
