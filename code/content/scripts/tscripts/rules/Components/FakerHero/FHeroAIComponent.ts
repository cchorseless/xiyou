
import { ET } from "../../../shared/lib/Entity";
@GReloadable
export class FHeroAIComponent extends ET.Component {


    onAwake(...args: any[]): void {
        GTimerHelper.AddTimer(2, GHandler.create(this, () => {
            this.startRandomMove();
            return RandomInt(1, 10);
        }))

        GTimerHelper.AddTimer(2, GHandler.create(this, () => {
            this.saySomething();
            return RandomInt(1, 10);
        }))
    }

    onDestroy(): void {
        GTimerHelper.ClearAll(this);
    }

    startRandomMove() {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        let hero = GGameScene.GetPlayer(this.BelongPlayerid).Hero;
        let pos = hero.GetAbsOrigin();
        let m = pos + RandomVector(300) as Vector;
        npc.MoveToPosition(m);
    }

    // todo: 说话
    saySomething() {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        npc.AddSpeechBubble(1, "hello", 3, 0, 15)
    }
}
