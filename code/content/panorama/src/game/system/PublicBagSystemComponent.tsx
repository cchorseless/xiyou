import { PublicBagSystem } from "../../../../scripts/tscripts/shared/rules/System/PublicBagSystem";

@GReloadable
export class PublicBagSystemComponent extends PublicBagSystem {
    onSerializeToEntity(): void {
        GGameScene.Scene.AddOneComponent(this);
    }

}