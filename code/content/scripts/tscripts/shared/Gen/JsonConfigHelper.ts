import { EEnum } from "./Types";

export module JsonConfigHelper {
    export function GetRecordItemConfig(itemid: string | number) {
        itemid = Number(itemid);
        return GJSONConfig.ItemConfig.get(itemid);
    }

    const AbilitySectInfo: { [key: string]: string[] } = {};
    const HeroSectInfo: { [key: string]: string[] } = {};
    export function Init() {
        if (_G.GJsonConfigHelper == null) {
            _G.GJsonConfigHelper = JsonConfigHelper;
        }
        if (_G.GEEnum == null) {
            _G.GEEnum = EEnum;
        }
        // 防止编译剪裁
        GJsonConfigHelper;
        GEEnum;
        GJSONConfig.CombinationConfig.getDataList().forEach((v) => {
            if (v.Abilityid) {
                AbilitySectInfo[v.Abilityid] = AbilitySectInfo[v.Abilityid] || [];
                AbilitySectInfo[v.Abilityid].push(v.id);
            }
            if (v.heroid) {
                HeroSectInfo[v.SectName] = HeroSectInfo[v.SectName] || [];
                HeroSectInfo[v.SectName].push(v.heroid);
            }
        })
    }
    export function GetAllHeroBySectLabel(sectlabel: string) {
        let list = HeroSectInfo[sectlabel] || [];
        return list;
    }
    export function GetAbilitySectLabel(abilityid: string) {
        let list = AbilitySectInfo[abilityid];
        if (list && list.length > 0) {
            return GJSONConfig.CombinationConfig.get(list[0])!.SectName;
        }
    }
    export function GetAbilitySectUnlockEquipid(abilityid: string) {
        let list = AbilitySectInfo[abilityid];
        if (list && list.length > 0) {
            return GJSONConfig.CombinationConfig.get(list[0])!.Equipid;
        }
    }
    /**
     * 获取英雄经验物品id
     * @param heroname 
     * @returns 
     */
    export function GetHeroExpItemConfigId(heroname: string) {
        let config = GJSONConfig.ItemConfig.getDataList();
        for (let _v of config) {
            if (_v.ItemType == EEnum.EItemType.HeroExp && _v.BindHeroName == heroname) {
                return _v.id;
            }
        }
    }
    /**
     * 根据分数获取天梯配置ID
     * @param score 
     * @returns 
     */
    export function GetRankScoreLevel(score: number) {
        const t = GJSONConfig.RankBattleScoreExpConfig.getDataList();
        for (const _t of t) {
            if (_t.ScoreMin <= score && (_t.ScoreMax > score || _t.ScoreMax == 0)) {
                return _t.id;
            }
        }
        return 1;
    }
    /**
     * 获取排行榜id
     * @param score 
     * @returns 
     */
    export function GetRankScoreExpItemConfigId(score: number) {
        let config = GJSONConfig.RankBattleScoreExpConfig.getDataList();
        for (let _v of config) {
            if (_v.ScoreMin <= score && (_v.ScoreMax > score || _v.ScoreMax == 0)) {
                return _v.id;
            }
        }
        return 1;
    }
    export function GetAbilitySectEffectName(abilityid: string, level: ISectLevel = "b", isCommonEffect = true) {
        let list = AbilitySectInfo[abilityid];
        if (list && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                let v = GJSONConfig.CombinationConfig.get(list[i])!;
                if (v.SectLevel == level) {
                    if (isCommonEffect) {
                        return v.acitveCommonEffect;
                    }
                    else {
                        return v.acitveSpecialEffect;
                    }
                }
            }
        }
    }



}


declare global {
    var GJsonConfigHelper: typeof JsonConfigHelper;
    var GEEnum: typeof EEnum;
    type ISectLevel = "a" | "b" | "c" | "d";
    type ICoinType = EEnum.EMoneyType;
    type IRarityNumber = EEnum.ERarity;
    type IRarity = "A" | "B" | "C" | "D" | "S" | "SS";
}