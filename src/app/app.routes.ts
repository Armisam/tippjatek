import { Routes } from '@angular/router';
import { SorrendContainer } from './pages/sorrend-container/sorrend-container';
import { JatekosStatisztika } from './pages/jatekos-statisztika/jatekos-statisztika';

export const routes: Routes = [
    { path: '', component: SorrendContainer },
    { path: 'jatekos-statisztika/:id', component: JatekosStatisztika }
];
