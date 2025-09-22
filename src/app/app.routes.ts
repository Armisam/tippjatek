import { Routes } from '@angular/router';
import { JatekosStatisztika } from './pages/jatekos-statisztika/jatekos-statisztika';
import { SorrendContainer } from './pages/sorrend-container/sorrend-container';

export const routes: Routes = [
    { path: '', component: SorrendContainer },
    { path: 'jatekos-statisztika/:id', component: JatekosStatisztika }
];
