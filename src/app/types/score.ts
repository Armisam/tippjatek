import { Timestamp } from "@angular/fire/firestore";

export type Score = {
    matchNumber: number;
    roundNumber: number;
    home: string;
    away: string;
    score?: string;
    startDate?: Timestamp;
};