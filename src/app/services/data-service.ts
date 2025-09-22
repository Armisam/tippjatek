import { Injectable, computed } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Player } from '../interfaces/player';

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly playersResource = httpResource<{ players: Player[] }>(() => ({
    url: '/players.json',
  }));

  sortedPlayers = computed(() => {
    const data = this.playersResource.value();
    if (!data) return [];
    return [...data.players].sort((a, b) => b.points - a.points);
  });
}
