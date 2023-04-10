import { PublicBagSystem } from "../../../../scripts/tscripts/shared/rules/System/PublicBagSystem";

@GReloadable
export class PublicBagSystemComponent extends PublicBagSystem {
    getItemByIndex(key: string) {
        let entityid = this.AllItem[key];
        if (entityid == null) return;
        return GItemEntityRoot.GetEntityById(entityid);
    }

}