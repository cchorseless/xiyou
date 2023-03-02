
import { AoiHelper } from "../../helper/AoiHelper";
import { ResHelper } from "../../helper/ResHelper";
import { BaseModifier_Plus } from "../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../propertystat/modifier_event";

@registerModifier()
export class modifier_portal extends BaseModifier_Plus {
    IsHidden() {
        return true;
    }
    IsDebuff() {
        return false;
    }
    IsPurgable() {
        return false;
    }
    IsPurgeException() {
        return false;
    }
    IsStunDebuff() {
        return false;
    }
    AllowIllusionDuplicate() {
        return false;
    }

    SetWorking(b: boolean) {
        this.iWorking = b;
    }
    iWorking: boolean = true;
    iHasArrow: boolean;
    vPosition: Vector;
    tParticleID: EntityIndex[];
    targetname: string;
    Init(params: IModifierTable) {
        let iParticleID = ResHelper.CreateParticle(
            new ResHelper.ParticleInfo()
                .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                .set_resPath("particles/units/heroes/heroes_underlord/abbysal_underlord_portal_ambient.vpcf")
                .set_owner(this.GetParent())
        );
        if (this.GetParentPlus().GetTeamNumber() == DOTATeam_t.DOTA_TEAM_BADGUYS) {
            ParticleManager.SetParticleControl(iParticleID, 62, Vector(10, 0, 0));
        }
        this.AddParticle(iParticleID, false, false, -1, false, false);
        if (IsServer()) {
            this.vPosition = GFuncVector.StringToVector(params.vPosition);
            this.iHasArrow = params.iHasArrow;
            if (this.iHasArrow) {
                // this.tParticleID = {}
                // let hParent = this.GetParentPlus()
                // Game.EachPlayerHero( (hHero) => {
                //     let iParticleID = ParticleManager.CreateParticle("particles/generic_gameplay/arrow_prompt.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, null)
                //     ParticleManager.SetParticleControlEnt(iParticleID, 0, hHero, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "", hHero.GetAbsOrigin(), false)
                //     ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "", hParent.GetAbsOrigin(), false)
                //     ParticleManager.SetParticleControl(iParticleID, 2, Vector(100, 100, 0))
                //     this.AddParticle(iParticleID, false, false, -1, false, false)
                //     this.tParticleID[hHero.entindex()] = iParticleID
                // })
            }
            GTimerHelper.AddTimer(0.1, GHandler.create(this, () => {
                this.checkTelepoart();
                return 1;
            }));
        }
    }
    checkTelepoart() {
        if (!this.iWorking) {
            return;
        }
        let tTargets = AoiHelper.FindEntityInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), 100, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY);
        for (let hUnit of tTargets) {
            let modifier = modifier_wait_portal.findIn(hUnit);
            if (modifier != null && modifier.CanPortal()) {
                // hUnit.Hold();
                modifier.TeleportToPoint(this.vPosition);
            }
            // modifier_tp.TeleportToPoint(hUnit, null, this.vPosition);
            // if (this.iHasArrow  && this.tParticleID[hUnit.entindex()]) {
            //     ParticleManager.DestroyParticle(this.tParticleID[hUnit.entindex()], false);
            // }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    OnOrder(params: IModifierTable) {
        if (params.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_TARGET) {
            GTimerHelper.AddFrameTimer(1, GHandler.create(this, () => {
                if (GFuncEntity.IsValid(this) && GFuncEntity.IsValid(this.GetParentPlus())) {
                    GFuncEntity.ExecuteOrder(params.unit, dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION, null, null, this.GetParentPlus().GetAbsOrigin());
                }
            }));
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_IGNORING_MOVE_AND_ATTACK_ORDERS]: true,
            [modifierstate.MODIFIER_STATE_UNTARGETABLE]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
        };
    }
}
@registerModifier()
export class modifier_wait_portal extends BaseModifier_Plus {
    IsHidden() {
        return true;
    }
    IsDebuff() {
        return false;
    }
    IsPurgable() {
        return false;
    }
    IsPurgeException() {
        return false;
    }
    IsStunDebuff() {
        return false;
    }
    AllowIllusionDuplicate() {
        return false;
    }
    public Init(params?: object): void {
        this.SetWorking(true);
    }
    iWorking: boolean = true;
    SetWorking(b: boolean) {
        this.iWorking = b;
    }
    CanPortal() {
        return this.iWorking;
    }

    TeleportToPoint(v: Vector) {
        if (!this.CanPortal()) {
            return;
        }
        this.SetWorking(false);
        let x_xishu = RandomFloat(0, 1) > 0.5 ? 1 : -1;
        let y_xishu = RandomFloat(0, 1) > 0.5 ? 1 : -1;
        v.x = v.x + RandomFloat(64, 128) * x_xishu;
        v.y = v.y + RandomFloat(64, 128) * y_xishu;
        let a = GetGroundPosition(v, this.GetParentPlus());
        this.GetParentPlus().SetAbsOrigin(a);
        GTimerHelper.AddTimer(5, GHandler.create(this, () => {
            this.SetWorking(true);
        }));
    }
}
