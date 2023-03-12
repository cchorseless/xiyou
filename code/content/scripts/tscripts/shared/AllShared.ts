import { RefreshConfig } from "./Gen/JsonConfig";
import { JsonConfigHelper } from "./Gen/JsonConfigHelper";
import { CCShare } from "./lib/CCShare";
import { TimeUtils } from "./lib/TimeUtils";
import { PropertyConfig } from "./PropertyConfig";
import { AllServiceEntity } from "./service/AllServiceEntity";

[
    CCShare,
    TimeUtils,
    PropertyConfig,
]

export class AllShared {
    static Init() {
        RefreshConfig();
        JsonConfigHelper.Init();
        AllServiceEntity.init();
        GLogHelper.print(`-------------------------------CODE ON LUA ${_CODE_IN_LUA_}---------------------------------`);

    }
}