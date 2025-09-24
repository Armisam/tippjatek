import { Injectable, computed, inject, signal } from '@angular/core';
import { Player } from '../types/player';
import { collection, collectionData, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Prediction } from '../types/prediction';
import { Score } from '../types/score';

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly firestore = inject(Firestore);

  private readonly playersCollection = collection(this.firestore, 'players');
  readonly playersData = toSignal<Player[]>(
    collectionData(this.playersCollection, { idField: 'id' }).pipe(
      map((docs) =>
        docs.map((doc) => ({
          id: Number(doc.id),
          name: (doc as any).name,
        }))
      )
    )
  );

  private readonly predictionsCollection = collection(this.firestore, 'predictions');
  readonly predictionsData = toSignal<Prediction[]>(
    collectionData(this.predictionsCollection).pipe(
      map((docs) =>
        docs.map((doc) => ({
          matchNumber: (doc as any).matchNumber,
          playerId: (doc as any).playerId,
          roundNumber: (doc as any).roundNumber,
          tip: (doc as any).tip,
        }))
      )
    )
  );

  private readonly scoresCollection = collection(this.firestore, 'scores');
  readonly scoresData = toSignal<Score[]>(
    collectionData(this.scoresCollection).pipe(
      map((docs) =>
        docs.map((doc) => ({
          matchNumber: (doc as any).matchNumber,
          roundNumber: (doc as any).roundNumber,
          home: (doc as any).home,
          away: (doc as any).away,
          score: (doc as any).score,
          startDate: (doc as any).startDate
        }))
      )
    )
  );

  async addOrUpdatePrediction(playerId: number, roundNumber: number, matchNumber: number, tip: string): Promise<void> {
    try {
      const docId = `${playerId}-${roundNumber}-${matchNumber}`;
      const predDoc = doc(this.firestore, `predictions/${docId}`);
      await setDoc(predDoc, {
        playerId: playerId,
        roundNumber: roundNumber,
        matchNumber: matchNumber,
        tip: tip,
      });
      console.log('Prediction saved:', {
        playerId: playerId,
        roundNumber: roundNumber,
        matchNumber: matchNumber,
        tip: tip,
      });
    } catch (err) {
      console.error('Error saving prediction:', err);
    }
  }
}