const getResult = (home: number, away: number) => {
    if (home > away) return '1';
    if (home < away) return '2';
    return 'x';
}

export const calculatePoints = (tip: string, score: string) => {
    const [predHome, predAway] = tip.split('-').map(Number);
    const [realHome, realAway] = score.split('-').map(Number);

    if (predHome === realHome && predAway === realAway) {
        return 5;
    } else {
        const predResult = getResult(predHome, predAway);
        const realResult = getResult(realHome, realAway);

        if (predResult === realResult) {
            const predDiff = predHome - predAway;
            const realDiff = realHome - realAway;
            return predDiff === realDiff ? 3 : 1;
        }
    }

    return 0;
}