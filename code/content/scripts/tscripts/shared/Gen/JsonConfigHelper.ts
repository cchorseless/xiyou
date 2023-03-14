
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
    export function Init() {
        if (_G.GJsonConfigHelper == null) {
            _G.GJsonConfigHelper = JsonConfigHelper;
        }
        GJSONConfig.CombinationConfig.getDataList().forEach((v) => {
            if (v.Abilityid) {
                AbilitySectInfo[v.Abilityid] = AbilitySectInfo[v.Abilityid] || [];
                AbilitySectInfo[v.Abilityid].push(v.id);
            }
        })
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


    export function GetAbilitySectSpeEffectName(abilityid: string, level: ISectLevel = "b") {
        let list = AbilitySectInfo[abilityid];
        if (list && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                let v = GJSONConfig.CombinationConfig.get(list[i])!;
                if (v.SectLevel == level) {
                    return v.acitveSpecialEffect;
                }
            }
        }
    }

}


declare global {
    var GJsonConfigHelper: typeof JsonConfigHelper;
    type ISectLevel = "a" | "b" | "c" | "d";
}