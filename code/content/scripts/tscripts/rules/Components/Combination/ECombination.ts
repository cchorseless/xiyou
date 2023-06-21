
import { KVHelper } from "../../../helper/KVHelper";
import { CombinationConfig } from "../../../shared/CombinationConfig";
import { Dota } from "../../../shared/Gen/Types";
import { ET, serializeETProps } from "../../../shared/lib/Entity";
import { ERoundBoard } from "../Round/ERoundBoard";
import { ECombinationLabelItem } from "./ECombinationLabelItem";


@GReloadable
export class ECombination extends ET.Entity {

    public config: { [k: string]: Dota.CombinationConfigRecord } = {};
    private combination: { [k: string]: ECombinationLabelItem[] } = {};
    @serializeETProps()
    public SectName: string;
    @serializeETProps()
    public SectId: string;
    @serializeETProps()
    public activeNeedCount: number;
    @serializeETProps()
    public uniqueConfigList: string[] = [];



    onAwake(SectId: string): void {
        this.SectId = SectId;
    }


    addConfig(c: Dota.CombinationConfigRecord) {
        this.config[c.index] = c;
        this.activeNeedCount = tonumber(c.activeCount);
        this.SectName = c.SectName;
    }

    isInCombination(c: number | string) {
        for (let k in this.config) {
            // if (this.config[k].heroid == "" + c) {
            //     return true
            // }
            if (this.config[k].Abilityid == "" + c) {
                return true;
            }
        }
        return false;
    }

    IsFriendly() {
        return true;
    }

    readonly isActive: boolean = false;
    checkActive() {
        let curCount = this.getCurUniqueCount();
        let haschange = this.isActive;
        (this.isActive as any) = curCount >= this.activeNeedCount;
        this.SyncClient();
        return haschange != this.isActive;
    }


    getCurUniqueCount() {
        this.uniqueConfigList = [];
        for (let k in this.combination) {
            let c = this.combination[k];
            c.forEach(entity => {
                let unit = entity.GetDomain<IBaseNpc_Plus>().ETRoot.As<IBattleUnitEntityRoot>();
                if (!this.uniqueConfigList.includes(unit.ConfigID)) {
                    this.uniqueConfigList.push(unit.ConfigID);
                }
            })
        }
        return this.uniqueConfigList.length
    }

    getAllBattleUnit() {
        let r: IBattleUnitEntityRoot[] = [];
        for (let k in this.combination) {
            let c = this.combination[k];
            c.forEach(entity => {
                let building = entity.GetDomain<IBaseNpc_Plus>().ETRoot.As<IBattleUnitEntityRoot>();
                if (!r.includes(building)) {
                    r.push(building);
                }
            })
        }
        return r;
    }




    addCombination(entity: ECombinationLabelItem) {
        let c = entity.SourceEntityConfigId;
        if (this.isInCombination(c)) {
            this.combination[c] = this.combination[c] || [];
            if (!this.combination[c].includes(entity)) {
                this.combination[c].push(entity);
            }
            if (this.checkActive() && this.isActive) {
                if (this.SectName == CombinationConfig.ESectName.sect_black_art) {
                    let playerroot = GGameScene.GetPlayer(this.BelongPlayerid);
                    let sectroot = playerroot.CombinationManager();
                    for (let k in sectroot.allCombination) {
                        if (k == CombinationConfig.ESectName.sect_black_art) continue;
                        sectroot.ChangeCombinationActiveNeedCount(k, -1)
                    }
                }
                // this.ApplyBuffEffect(true);
            }
        }
    }
    removeAllCombination() {
        this.combination = {};
        this.checkActive();
    }
    removeCombination(entity: ECombinationLabelItem) {
        let c = entity.SourceEntityConfigId;
        if (this.combination[c] && this.combination[c].includes(entity)) {
            let index = this.combination[c].indexOf(entity);
            this.combination[c].splice(index, 1);
        }
        if (this.combination[c] && this.combination[c].length == 0) {
            delete this.combination[c];
        }
        if (this.checkActive() && !this.isActive) {
            // this.CancelEffect();
            if (this.SectName == CombinationConfig.ESectName.sect_black_art) {
                let playerroot = GGameScene.GetPlayer(this.BelongPlayerid);
                let sectroot = playerroot.CombinationManager();
                for (let k in sectroot.allCombination) {
                    if (k == CombinationConfig.ESectName.sect_black_art) continue;
                    sectroot.ChangeCombinationActiveNeedCount(k, 1)
                }
            }
        }
    }
    ApplyBuffEffect(isActive: boolean = false) {
        let configMap = this.config;
        if (configMap) {
            let bufflist = new Map<string, string>();
            for (let key in configMap) {
                let config = configMap[key];
                let combuff = config.acitveCommonEffect;
                let spebuff = config.acitveSpecialEffect;
                if (combuff && combuff.length > 0) {
                    bufflist.set(combuff, config.Abilityid);
                }
                if (spebuff && spebuff.length > 0) {
                    bufflist.set(spebuff, config.Abilityid);
                }
            }
            bufflist.forEach((abilityname, buff) => {
                if (buff && buff.length > 0) {
                    let buffconfig = GJSONConfig.BuffEffectConfig.get(buff);
                    if (buffconfig) {
                        let battleunits: IBattleUnitEntityRoot[];
                        switch (buffconfig.target) {
                            case CombinationConfig.EEffectTargetType.self:
                                battleunits = this.getAllBattleUnit().filter(unit => {
                                    let root = unit.GetDomain<IBaseNpc_Plus>();
                                    if (root) {
                                        if (root.FindAbilityByName(abilityname)) {
                                            return true;
                                        }
                                        if (root.FindItemInInventory(abilityname)) {
                                            return true;
                                        }
                                    }
                                    return false;
                                });
                                break;
                            case CombinationConfig.EEffectTargetType.hero:
                                battleunits = this.getAllBattleUnit();
                                break;
                            case CombinationConfig.EEffectTargetType.team:
                            case CombinationConfig.EEffectTargetType.enemyteam:
                                let team = DOTATeam_t.DOTA_TEAM_GOODGUYS;
                                if (this.IsFriendly()) {
                                    team = buffconfig.target == CombinationConfig.EEffectTargetType.team ? DOTATeam_t.DOTA_TEAM_GOODGUYS : DOTATeam_t.DOTA_TEAM_BADGUYS;
                                }
                                else {
                                    team = buffconfig.target == CombinationConfig.EEffectTargetType.enemyteam ? DOTATeam_t.DOTA_TEAM_GOODGUYS : DOTATeam_t.DOTA_TEAM_BADGUYS;
                                }
                                battleunits = GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid).BattleUnitManagerComp().GetAllBattleUnitAlive(team, true);
                                break;
                        };
                        if (battleunits) {
                            battleunits.forEach(unit => {
                                let entity: IBaseNpc_Plus;
                                if (unit.IsBuilding()) {
                                    let RuntimeBuilding = unit.As<IBuildingEntityRoot>().RuntimeBuilding;
                                    if (RuntimeBuilding) {
                                        entity = RuntimeBuilding.GetDomain<IBaseNpc_Plus>();
                                    }
                                }
                                else {
                                    entity = unit.GetDomain<IBaseNpc_Plus>();
                                }
                                if (entity) {
                                    entity.HandleCiTiao(buff, isActive, abilityname);
                                }
                            })
                        }
                    }
                }
            })
        }
    }

    OnRound_Battle(round: ERoundBoard) {
        this.ApplyBuffEffect(true);

    }

    OnRound_Prize(round: ERoundBoard) {
        if (!this.isActive) { return }
        let SectName = this.SectName;
        let playerroot = GGameScene.GetPlayer(this.BelongPlayerid);
        if (SectName === CombinationConfig.ESectName.sect_invent) {
            let runtimeunits = playerroot.BattleUnitManagerComp().GetAllBuildingRuntimeEntityRoot();
            runtimeunits = runtimeunits.filter(unit => { return unit.isAlive });
            let isInventActive_a = -1;
            let isInventActive_b = -1;
            let isInventActive_c = -1;
            for (let k of runtimeunits) {
                let entity = k.GetDomain<IBaseNpc_Plus>();
                if (entity) {
                    let buff_a = entity.FindModifierByName("modifier_sect_invent_base_a") as IBaseModifier_Plus & { prize_pool: number };
                    let buff_b = entity.FindModifierByName("modifier_sect_invent_base_b") as IBaseModifier_Plus & { prize_pool: number };
                    let buff_c = entity.FindModifierByName("modifier_sect_invent_base_c") as IBaseModifier_Plus & { prize_pool: number };
                    if (this.SectId == "sect_invent_a" && buff_a) {
                        isInventActive_a = buff_a.prize_pool;
                    }
                    if (this.SectId == "sect_invent_b" && buff_b) {
                        isInventActive_b = buff_b.prize_pool;
                    }
                    if (this.SectId == "sect_invent_c" && buff_c) {
                        isInventActive_c = buff_c.prize_pool;
                    }
                }
            }
            if (isInventActive_a > 0) {
                playerroot.Hero.AddItemOrInGround(KVHelper.RandomPoolConfig(isInventActive_a + ""));
            }
            if (isInventActive_b > 0) {
                playerroot.Hero.AddItemOrInGround(KVHelper.RandomPoolConfig(isInventActive_b + ""));
            }
            if (isInventActive_c > 0) {
                playerroot.Hero.AddItemOrInGround(KVHelper.RandomPoolConfig(isInventActive_c + ""));
            }
        }
        else if (SectName === CombinationConfig.ESectName.sect_fish_chess) {
            let prop_pect = 0;
            if (this.SectId == "sect_fish_chess_a") {
                prop_pect = GJSONConfig.BuffEffectConfig.get("modifier_sect_fish_chess_base_a").propinfo.get("prop_pect");
                let heros = GJsonConfigHelper.GetAllHeroBySectLabel(this.SectName)
                for (let i = 0; i < this.uniqueConfigList.length; i++) {
                    if (RollPercentage(prop_pect)) {
                        playerroot.BuildingManager().addBuilding(GFuncRandom.RandomOne(heros), true, 0);
                    }
                }
            }
            else if (this.SectId == "sect_fish_chess_b") {
                prop_pect = GJSONConfig.BuffEffectConfig.get("modifier_sect_fish_chess_base_b").propinfo.get("prop_pect");
                let allCombination = playerroot.CombinationManager().getAllAtLeastOneCombination();
                let heros: string[] = [];
                for (let sectname of allCombination) {
                    heros = heros.concat(GJsonConfigHelper.GetAllHeroBySectLabel(sectname))
                }
                for (let i = 0; i < this.uniqueConfigList.length; i++) {
                    if (RollPercentage(prop_pect)) {
                        playerroot.BuildingManager().addBuilding(GFuncRandom.RandomOne(heros), true, 0);
                    }
                }

            }
            else if (this.SectId == "sect_fish_chess_c") {
                prop_pect = GJSONConfig.BuffEffectConfig.get("modifier_sect_fish_chess_base_c").propinfo.get("prop_pect");
                let buildings = playerroot.BuildingManager().getAllBattleBuilding(false);
                for (let building of buildings) {
                    if (building.checkCanStarUp()) {
                        if (RollPercentage(prop_pect)) {
                            building.AddStar(1);
                        }
                    }
                }
            }

        }

    }

    GetSectScore() {
        return 100
    }
}
