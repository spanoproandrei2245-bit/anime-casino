import { Log } from './logger';

export class GameEngine {
    @Log('INFO')
    static async calculateWin(betAmount: number, result: string[]): Promise<number> {
        let multiplier = 0;
        if (result[0] === result[1] && result[1] === result[2]) {
            if (result[0] === '7️⃣') multiplier = 10;
            else if (result[0] === '💎') multiplier = 5;
            else multiplier = 3;
        }
        return Math.floor(betAmount * multiplier);
    }
}