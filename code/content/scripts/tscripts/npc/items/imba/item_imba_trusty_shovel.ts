
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";

// 可靠铁铲
@registerAbility()
export class item_imba_trusty_shovel extends BaseItem_Plus {
    public bounty_chance_threshold: number;
    public flask_chance_threshold: number;
    public tp_chance_threshold: number;
    public kobold_chance_threshold: number;
    public last_reward: any;
    public pfx: any;
    GetIntrinsicModifierName(): string {
        return "modifier_imba_trusty_shovel_passives";
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        this.bounty_chance_threshold = this.GetSpecialValueFor("bounty_rune_chance");
        this.flask_chance_threshold = this.GetSpecialValueFor("flask_chance") + this.bounty_chance_threshold;
        this.tp_chance_threshold = this.GetSpecialValueFor("tp_chance") + this.flask_chance_threshold;
        this.kobold_chance_threshold = this.GetSpecialValueFor("kobold_chance") + this.tp_chance_threshold;
        if (this.last_reward == undefined) {
            this.last_reward = "kobold";
        }
        this.pfx = ResHelper.CreateParticleEx("particles/econ/events/ti9/shovel_dig.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus());
        ParticleManager.SetParticleControl(this.pfx, 0, this.GetCursorPosition());
        EmitSoundOn("SeasonalConsumable.TI9.Shovel.Dig", this.GetCasterPlus());
    }
    OnChannelThink(fInterval: number): void {
        if (!IsServer()) {
            return;
        }
    }
    OnChannelFinish(bInterrupted: boolean): void {
        if (!IsServer()) {
            return;
        }
        if (!bInterrupted) {
            let random_int = RandomInt(1, 100);
            if (random_int > 0 && random_int <= this.bounty_chance_threshold) {
                if (this.last_reward == "bounty") {
                    this.OnChannelFinish(bInterrupted);
                    return;
                }
                this.last_reward = "bounty";
                CreateRune(this.GetCursorPosition(), DOTA_RUNES.DOTA_RUNE_BOUNTY);
            } else if (random_int > this.bounty_chance_threshold && random_int <= this.flask_chance_threshold) {
                if (this.last_reward == "flask") {
                    this.OnChannelFinish(bInterrupted);
                    return;
                }
                this.last_reward = "flask";
                this.SpawnItem("item_imba_flask", this.GetCursorPosition());
            } else if (random_int > this.flask_chance_threshold && random_int <= this.tp_chance_threshold) {
                if (this.last_reward == "tp") {
                    this.OnChannelFinish(bInterrupted);
                    return;
                }
                this.last_reward = "tp";
                this.SpawnItem("item_tpscroll", this.GetCursorPosition());
            } else if (random_int > this.tp_chance_threshold && random_int <= this.kobold_chance_threshold) {
                if (this.last_reward == "kobold") {
                    this.OnChannelFinish(bInterrupted);
                    return;
                }
                this.last_reward = "kobold";
                BaseNpc_Plus.CreateUnitByName("npc_imba_neutral_kobold", this.GetCursorPosition(), null, true, DOTATeam_t.DOTA_TEAM_NEUTRALS);
            }
            let pfx2 = ResHelper.CreateParticleEx("particles/econ/events/ti9/shovel_revealed_generic.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus());
            ParticleManager.SetParticleControl(pfx2, 0, this.GetCursorPosition());
            ParticleManager.ReleaseParticleIndex(pfx2);
        }
        if (this.pfx) {
            ParticleManager.DestroyParticle(this.pfx, false);
            ParticleManager.ReleaseParticleIndex(this.pfx);
        }
        StopSoundOn("SeasonalConsumable.TI9.Shovel.Dig", this.GetCasterPlus());
    }
    SpawnItem(sItemName: string, vPos: Vector) {
        let item = BaseItem_Plus.CreateItem(sItemName, undefined, undefined);
        item.SetSellable(false);
        item.SetShareability(EShareAbility.ITEM_FULLY_SHAREABLE);
        CreateItemOnPositionSync(vPos, item);
    }

}
@registerModifier()
export class modifier_imba_trusty_shovel_passives extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.HP_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    CC_GetModifierHealthBonus(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_health");
    }
}