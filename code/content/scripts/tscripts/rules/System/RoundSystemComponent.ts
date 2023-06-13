import { EventHelper } from "../../helper/EventHelper";
import { BaseNpc_Plus } from "../../npc/entityPlus/BaseNpc_Plus";
import { GameEnum } from "../../shared/GameEnum";
import { GameProtocol } from "../../shared/GameProtocol";
import { ET } from "../../shared/lib/Entity";
import { RoundPrizeUnitEntityRoot } from "../Components/Round/RoundPrizeUnitEntityRoot";

@GReloadable
export class RoundSystemComponent extends ET.SingletonComponent {
    iRound: string;
    private _debug_nextround: string;
    GetCurrentRoundIndex() {
        if (this.iRound) {
            return GJSONConfig.RoundBoardConfig.get(this.iRound).roundIndex;
        }
        return 1;
    }
    GetCurrentRoundType() {
        return GJSONConfig.RoundBoardConfig.get(this.iRound).roundType;
    }
    // - 判断是否是无尽
    IsEndlessRound() {
        return this.GetCurrentRoundType() == "endless";
    }

    GetFirstBoardRoundid() {
        const difficultydes = GGameServiceSystem.GetInstance().getDifficultyChapterDes()
        return difficultydes + "_1";
    }
    /**
     * 结束回合
     * @returns 
     */
    GetFinishBoardRoundid() {
        let roundid = this.GetFirstBoardRoundid();
        while (GJSONConfig.RoundBoardConfig.get(roundid).roundNextid != "") {
            roundid = GJSONConfig.RoundBoardConfig.get(roundid).roundNextid;
        }
        return roundid;
    }

    GetNextBoardRoundid() {
        return GJSONConfig.RoundBoardConfig.get(this.iRound).roundNextid;
    }

    public onAwake() {
        this.addEvent();
    }
    public addEvent() {
        EventHelper.addGameEvent(GameEnum.GameEvent.EntityHurtEvent, GHandler.create(this, this.OnEntityHurtEvent));
        EventHelper.addProtocolEvent(GameProtocol.Protocol.req_DebugPauseRoundStage, GHandler.create(this, (e: JS_TO_LUA_DATA) => {
            const ispause = GToBoolean(e.data);
            GPlayerEntityRoot.GetAllInstance()
                .forEach((player) => {
                    player.RoundManagerComp().debugPauseBoardRound(ispause)
                });
        }));
        EventHelper.addProtocolEvent(GameProtocol.Protocol.req_DebugNextRoundStage, GHandler.create(this, (e: JS_TO_LUA_DATA) => {
            GPlayerEntityRoot.GetAllInstance()
                .forEach((player) => {
                    player.RoundManagerComp().debugNextBoardRound()
                });
        }));
        EventHelper.addProtocolEvent(GameProtocol.Protocol.req_DebugJumpToRound, GHandler.create(this, (e: JS_TO_LUA_DATA) => {
            let data = GToNumber(e.data);
            if (data >= 1 && data <= 40) {
                this._debug_nextround = GGameServiceSystem.GetInstance().getDifficultyChapterDes() + "_" + data;
            }
        }));


    }




    public StartGame() {
        GNotificationSystem.NoticeCombatMessage({
            message: "lang_Welcome_to_our_game",
            string_from: "addon_game_name"
        })
        this.runBoardRound(this.GetFirstBoardRoundid());
        this.CreateFinishBoss()
    }
    RoundFinishEnemys: IBaseNpc_Plus[] = [];
    /**
     * 创建最终的Boss
     */
    public CreateFinishBoss() {
        let endindex = this.GetFinishBoardRoundid();
        const config = GJSONConfig.RoundBoardConfig.get(endindex);
        let enemys = config.enemyinfo.filter(v => v.enemycreatetype == GEEnum.EEnemyCreateType.PublicEnemy);
        const pos = GMapSystem.GetInstance().BaseBaoXiangBossPoint;

        for (let enemyinfo of enemys) {
            let enemy = BaseNpc_Plus.CreateUnitByName(enemyinfo.unitname, pos, null, true, DOTATeam_t.DOTA_TEAM_BADGUYS);
            enemy.SetUnitOnClearGround();
            this.RoundFinishEnemys.push(enemy);
        }
    }

    private OnEntityHurtEvent(events: EntityHurtEvent) {
        let hUnit = EntIndexToHScript(events.entindex_attacker) as IBaseNpc_Plus;
        if (!IsValid(hUnit)) {
            return;
        }
        if (!hUnit.ETRoot || !hUnit.ETRoot.AsValid<IEnemyUnitEntityRoot>("EnemyUnitEntityRoot")) {
            return;
        }
        hUnit.ETRoot.As<IEnemyUnitEntityRoot>().GetRound().onEntityHurt(events.entindex_attacker, events.damage);
    }

    public runBoardRound(round: string) {
        this.iRound = round;
        GPlayerEntityRoot.GetAllInstance()
            .forEach((player) => {
                player.RoundManagerComp().runBoardRound(round);
            });
        // this.createRoundPrizeUnit(round);
    }

    public endBoardRound() {
        let allWaiting = true;
        GPlayerEntityRoot.GetAllInstance().forEach((player) => {
            if (!player.RoundManagerComp().getCurrentBoardRound().IsRoundWaitingEnd()) {
                allWaiting = false;
            }
        });
        if (allWaiting) {
            GTimerHelper.AddTimer(3,
                GHandler.create(this, () => {
                    let nextid = this._debug_nextround || this.GetNextBoardRoundid();
                    this._debug_nextround = null;
                    if (nextid != null) {
                        this.runBoardRound(nextid);
                    }
                    else {
                        GGameScene.Victory();
                    }
                }));
        }
    }

    private createRoundPrizeUnit(round: string) {
        this.clearRoundPrizeUnit();
        let posinfo = GMapSystem.GetInstance().BaseRoomPrizeUnitRefreshZone;
        let minx = posinfo[0];
        let miny = posinfo[1];
        let maxx = posinfo[2];
        let maxy = posinfo[3];
        for (let i = 0; i < 30; i++) {
            let vv = Vector(RandomFloat(minx, maxx), RandomFloat(miny, maxy), 64);
            let a = BaseNpc_Plus.CreateUnitByName("unit_base_gold_bag", vv, null, true, DOTATeam_t.DOTA_TEAM_BADGUYS);
            RoundPrizeUnitEntityRoot.Active(a);
            this.Domain.ETRoot.AddDomainChild(a.ETRoot);
            let vv1 = Vector(RandomFloat(minx, maxx), RandomFloat(miny, maxy), 64);
            let b = BaseNpc_Plus.CreateUnitByName("unit_base_gold_bag", vv1, null, true, DOTATeam_t.DOTA_TEAM_BADGUYS);
            RoundPrizeUnitEntityRoot.Active(b);
            this.Domain.ETRoot.AddDomainChild(b.ETRoot);
        }
    }
    public clearRoundPrizeUnit() {
        let allunit = this.Domain.ETRoot.GetDomainChilds(RoundPrizeUnitEntityRoot);
        allunit.forEach((unit) => {
            unit.Dispose();
        });
    }

    public randomRoundPrizeUnit() {
        let allunit = this.Domain.ETRoot.GetDomainChilds(RoundPrizeUnitEntityRoot);
        return GFuncRandom.RandomArray(allunit);
    }

    public runBasicRound(round: string) {
        // PlayerSystem.GetAllPlayer().forEach((player) => {
        //     player.RoundManagerComp().runBasicRound(round);
        // });
        // let round_time = KVHelper.KvServerConfig.building_round[round as "10"].round_time;
        // TimerHelper.addTimer(
        //     tonumber(round_time),
        //     () => {
        //         RoundSystem.runBasicRound("" + (tonumber(round) + 1));
        //     },
        //     this,
        //     true
        // );
    }
}
declare global {
    /**
     * @ServerOnly
     */
    var GRoundSystem: typeof RoundSystemComponent;
}
if (_G.GRoundSystem == undefined) {
    _G.GRoundSystem = RoundSystemComponent;
}