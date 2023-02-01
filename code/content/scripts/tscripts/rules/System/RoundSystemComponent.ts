import { GameFunc } from "../../GameFunc";
import { EventHelper } from "../../helper/EventHelper";
import { KVHelper } from "../../helper/KVHelper";
import { unit_base_equip_bag } from "../../npc/units/common/unit_base_equip_bag";
import { unit_base_gold_bag } from "../../npc/units/common/unit_base_gold_bag";
import { GameEnum } from "../../shared/GameEnum";
import { GameProtocol } from "../../shared/GameProtocol";
import { ET } from "../../shared/lib/Entity";
import { RoundPrizeUnitEntityRoot } from "../Components/Round/RoundPrizeUnitEntityRoot";

@GReloadable
export class RoundSystemComponent extends ET.SingletonComponent {
    iRound: string;

    GetCurrentRoundType() {
        return KVHelper.KvServerConfig.building_round[this.iRound].round_type;
    }
    // - 判断是否是无尽
    IsEndlessRound() {
        return this.GetCurrentRoundType() == "endless";
    }

    GetFirstBoardRoundid() {
        const difficultydes = GGameServiceSystem.GetInstance().getDifficultyChapterDes()
        return difficultydes + "_1";
    }

    GetNextBoardRoundid() {
        return KVHelper.KvServerConfig.building_round_board[this.iRound].round_nextid;
    }

    public onAwake() {
        this.addEvent();
    }
    public addEvent() {
        EventHelper.addGameEvent(GameEnum.GameEvent.EntityHurtEvent, GHandler.create(this, this.OnEntityHurtEvent));
        EventHelper.addProtocolEvent(GameProtocol.Protocol.PauseRoundStage, GHandler.create(this, (e: JS_TO_LUA_DATA) => {
            const ispause = GToBoolean(e.data);
            GPlayerEntityRoot.GetAllInstance()
                .forEach((player) => {
                    player.RoundManagerComp().debugPauseBoardRound(ispause)
                });
        }));
    }




    public StartGame() {
        this.runBoardRound(this.GetFirstBoardRoundid());

    }

    private OnEntityHurtEvent(events: EntityHurtEvent) {
        let hUnit = EntIndexToHScript(events.entindex_attacker) as IBaseNpc_Plus;
        if (!GameFunc.IsValid(hUnit)) {
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
        this.createRoundPrizeUnit(round);
    }

    public endBoardRound() {
        let allWaiting = true;
        GPlayerEntityRoot.GetAllInstance()
            .forEach((player) => {
                if (!player.RoundManagerComp().getCurrentBoardRound().IsWaitingEnd()) {
                    allWaiting = false;
                }
            });
        GLogHelper.print("endBoardRound", allWaiting)
        if (allWaiting) {
            GTimerHelper.AddTimer(3,
                GHandler.create(this, () => {
                    let nextid = this.GetNextBoardRoundid();
                    GLogHelper.print("endBoardRound", nextid)
                    if (nextid != null) {
                        this.runBoardRound(nextid);
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
            let a = unit_base_gold_bag.CreateOne(vv, DOTATeam_t.DOTA_TEAM_BADGUYS, true);
            RoundPrizeUnitEntityRoot.Active(a);
            this.Domain.ETRoot.AddDomainChild(a.ETRoot);
            let vv1 = Vector(RandomFloat(minx, maxx), RandomFloat(miny, maxy), 64);
            let b = unit_base_equip_bag.CreateOne(vv1, DOTATeam_t.DOTA_TEAM_BADGUYS, true);
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
        return GameFunc.ArrayFunc.RandomArray(allunit);
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