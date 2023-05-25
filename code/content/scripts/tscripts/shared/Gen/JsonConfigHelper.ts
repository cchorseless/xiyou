import { EEnum } from "./Types";

export module JsonConfigHelper {
    export function GetRecordItemConfig(itemid: string | number) {
        itemid = Number(itemid);
        return GJSONConfig.ItemConfig.get(itemid);
    }

    const HeroIdNameMap = new Map<number, string>();

    export function GetHeroName(heroConfigId: number): string {
        if (HeroIdNameMap.size == 0) {
            GJSONConfig.BuildingLevelUpConfig.getDataList().forEach(record => { HeroIdNameMap.set(record.BindHeroId, record.Id); });
        }

        return HeroIdNameMap.get(heroConfigId)!;
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