import { ResHelper } from "../../../helper/ResHelper";
import { courier_egg_honor } from "../../../npc/abilities/courier/courier_egg_honor";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET } from "../../../shared/lib/Entity";
import { ChessVector } from "../ChessControl/ChessVector";
import { ERoundBoard } from "../Round/ERoundBoard";

@GReloadable
export class CourierEggComponent extends ET.Component {

    EggUnit: IBaseNpc_Plus;
    /**蛋额外的受击次数上限 */
    eggExtraHitCount: number = 0;
    PathConnerLeft: Vector[];
    PathConnerRight: Vector[];
    onAwake(...args: any[]): void {

    }
    /**
     * 添加蛋的额外受击次数
     * @param change 
     */
    AddEggExtraHitCount(change: number) {
        this.eggExtraHitCount += change;
        if (IsValid(this.EggUnit)) {
            let buff = this.EggUnit.findBuff("modifier_courier_egg_honor");
            if (buff) {
                buff.IncrementStackCount(change)
            }
        }
    }


    OnRound_Start(round?: ERoundBoard): void {
        if (this.EggUnit && IsValid(this.EggUnit)) {
            SafeDestroyUnit(this.EggUnit);
            this.EggUnit = null
        }
        let playerroot = GGameScene.GetPlayer(this.BelongPlayerid);
        let pos = new ChessVector(0, 1, this.BelongPlayerid)
        for (let i = 0; i < 100; i++) {
            let x = RandomInt(0, 7.5);
            let y = RandomInt(1, 3.5);
            pos.x = x;
            pos.y = y;
            if (GChessControlSystem.GetInstance().IsBoardEmptyGird(pos)) {
                break;
            }
        }
        this.EggUnit = BaseNpc_Plus.CreateUnitByName("unit_npc_courier_egg", pos.getVector3(), playerroot.Hero)
        this.EggUnit.StartGesture(GameActivity_t.ACT_DOTA_CAPTURE)
        let [pathleft, pathright] = GMapSystem.GetInstance().ChangeGirdPathToEgg(Vector(pos.x, pos.y, this.BelongPlayerid));
        // 找到拐角
        this.PathConnerLeft = [];
        pathleft.forEach((v) => {
            this.PathConnerLeft.push(v.getVector3())
        })
        this.PathConnerRight = [];
        pathright.forEach((v) => {
            this.PathConnerRight.push(v.getVector3())
        })
    }


    IsInPath(v: Vector) {
        for (let r of this.PathConnerLeft) {
            if (GFuncVector.CalculateDistance(v, r) < 50) {
                return true
            }
        }
        for (let r of this.PathConnerRight) {
            if (GFuncVector.CalculateDistance(v, r) < 50) {
                return true
            }
        }
        return false
    }



    GetFirstCorner(v: Vector) {
        let posleft = 0;
        let distanceleft = 10000;
        for (let i = 0, len = this.PathConnerLeft.length; i < len; i++) {
            let pos = this.PathConnerLeft[i];
            let curdistance = GFuncVector.CalculateDistance(v, pos)
            if (curdistance < distanceleft) {
                distanceleft = curdistance;
                posleft = i;
            }
        }
        let posright = 0;
        let distanceRight = 10000;
        for (let i = 0, len = this.PathConnerRight.length; i < len; i++) {
            let pos = this.PathConnerRight[i];
            let curdistance = GFuncVector.CalculateDistance(v, pos)
            if (curdistance < distanceRight) {
                distanceRight = curdistance;
                posright = i;
            }
        }
        if (distanceleft > distanceRight) {
            return { isleft: false, index: posright, pos: this.PathConnerRight[posright] };
        }
        else {
            return { isleft: true, index: posleft, pos: this.PathConnerLeft[posleft] };
        }
    }

    KillEgg() {
        if (this.EggUnit && IsValid(this.EggUnit)) {
            let egg = this.EggUnit;
            StartSoundEventFromPosition("Hero_Phoenix.SuperNova.Death", egg.GetAbsOrigin());
            let pfxName = "particles/units/heroes/hero_phoenix/phoenix_supernova_death.vpcf";
            let pfx = ResHelper.CreateParticleEx(pfxName, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
            let attach_point = egg.ScriptLookupAttachment("attach_hitloc");
            ParticleManager.SetParticleControl(pfx, 0, egg.GetAttachmentOrigin(attach_point));
            ParticleManager.SetParticleControl(pfx, 1, egg.GetAttachmentOrigin(attach_point));
            ParticleManager.SetParticleControl(pfx, 3, egg.GetAttachmentOrigin(attach_point));
            ParticleManager.ReleaseParticleIndex(pfx);
            this.EggUnit.Kill(undefined, this.EggUnit);
            let playerroot = GGameScene.GetPlayer(this.BelongPlayerid);
            let round = playerroot.RoundManagerComp().getCurrentBoardRound();
            if (round.IsRoundBattle()) {
                round.OnRound_Prize()
            }
        }
    }
    OnRound_Prize(round: ERoundBoard) {
        // 孵化棋子
        if (IsValid(this.EggUnit) && this.EggUnit.IsAlive()) {
            this.EggUnit.findAbliityPlus<courier_egg_honor>("courier_egg_honor").EggChess();
        }
    }
    OnRound_WaitingEnd() {
        if (this.EggUnit && IsValid(this.EggUnit)) {
            SafeDestroyUnit(this.EggUnit);
            this.EggUnit = null
        }
    }
}