export type MatchTip = {
    matchId: number;
    home: string;
    away: string;
    tip: string;
    actualScore?: string;
}


export type Round = {
    number: number;
    tips: MatchTip[];
};

export type Player = {
    id: number;
    name: string;
    points: number;
    predictions: Round[];
}
