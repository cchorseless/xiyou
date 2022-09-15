import { LogHelper } from "./helper/LogHelper";
import { AllServiceEntity } from "./service/AllServiceEntity";
import { AllModifierEntity } from "./npc/modifier/AllModifierEntity";
import { AllRulesEntity } from "./rules/AllRulesEntity";


export class AllEntity {
    static init() {
        AllRulesEntity.init();
        AllModifierEntity.init();
        AllServiceEntity.init();
        LogHelper.print("register all entity");
    }
}
