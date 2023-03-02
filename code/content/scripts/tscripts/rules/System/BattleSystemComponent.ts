import { modifier_event } from "../../npc/propertystat/modifier_event";
import { ET } from "../../shared/lib/Entity";
@GReloadable
export class BattleSystemComponent extends ET.SingletonComponent {

    /**全局战斗伤害记录 */
    public Npc_RECORD_SYSTEM: CDOTA_BaseNPC;
    /**全局buff事件监听 */
    public Npc_MODIFIER_EVENTS: CDOTA_BaseNPC;
    /**
     * 初始化全局NPC
     */
    private CreateGlobalEventNPC() {
        if (this.Npc_MODIFIER_EVENTS) {
            GFuncEntity.SafeDestroyUnit(this.Npc_MODIFIER_EVENTS);
            this.Npc_MODIFIER_EVENTS = null;
        }
        this.Npc_MODIFIER_EVENTS = modifier_event.applyThinker(Vector(0, 0, 0), GameRules.Addon.Instance as any, null, null, DOTATeam_t.DOTA_TEAM_NOTEAM, false);
    }

    public onAwake(...args: any[]): void {
        this.CreateGlobalEventNPC();
    }

    onDestroy(): void {
        if (this.Npc_MODIFIER_EVENTS) {
            GFuncEntity.SafeDestroyUnit(this.Npc_MODIFIER_EVENTS);
            this.Npc_MODIFIER_EVENTS = null;
        }
    }

}