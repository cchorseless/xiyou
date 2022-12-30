import { LogHelper } from "./helper/LogHelper";
import { AllModifierEntity } from "./npc/modifier/AllModifierEntity";
import { AllRulesEntity } from "./rules/AllRulesEntity";
import { AllShared } from "./shared/AllShared";
import { AllServiceEntity } from "./shared/service/AllServiceEntity";


export class AllEntity {
    static Init() {
        AllShared.Init();
        AllRulesEntity.init();
        AllModifierEntity.init();
        AllServiceEntity.init();
        LogHelper.print("register all entity");
    }
}
