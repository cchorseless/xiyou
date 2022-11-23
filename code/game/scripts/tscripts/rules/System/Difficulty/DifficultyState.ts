import { DifficultyConfig } from "../../../shared/DifficultyConfig";

export class DifficultyState {
    /**章节难度*/
    static DifficultyChapter: DifficultyConfig.EDifficultyChapter = DifficultyConfig.EDifficultyChapter.n1;
    /**难度关卡 */
    static DifficultyLevel: number = 0;

    static getDifficultyDes() {
        if (this.DifficultyLevel > 0) {
            return this.DifficultyChapter + "[" + this.DifficultyLevel + "]";
        }
        return this.DifficultyChapter;
    }
    private static getDifficultyConfig(arr: { [k: string]: number }) {
        if (this.DifficultyLevel == 0) {
            return 0;
        }
        let kArr: number[] = [];
        Object.keys(arr).forEach((k) => {
            kArr.push(tonumber(k));
        });
        kArr.sort();
        while (kArr.length > 0) {
            let k = kArr.shift();
            if (this.DifficultyLevel >= k) {
                return arr[("" + k) as "1"];
            }
        }
        return 0;
    }

    static getEnemyHPMult() {
        return this.getDifficultyConfig(DifficultyConfig.ENDLESS_ENEMEY_fHPMult);
    }
    static getEnemyArmorPhyMult() {
        return this.getDifficultyConfig(DifficultyConfig.ENDLESS_ENEMEY_fArmorPhyMult);
    }
    static getEnemyArmorMagMult() {
        return this.getDifficultyConfig(DifficultyConfig.ENDLESS_ENEMEY_fArmorMagMult);
    }
    static getEnemyHPAdd() {
        return this.getDifficultyConfig(DifficultyConfig.ENDLESS_ENEMEY_fHPAdd);
    }
    static getEnemyArmorPhyAdd() {
        return this.getDifficultyConfig(DifficultyConfig.ENDLESS_ENEMEY_fArmorPhyAdd);
    }
    static getEnemyArmorMagAdd() {
        return this.getDifficultyConfig(DifficultyConfig.ENDLESS_ENEMEY_fArmorMagAdd);
    }
}
