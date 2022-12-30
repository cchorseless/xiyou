import { CCShare } from "./lib/CCShare";
import { TimeUtils } from "./lib/TimeUtils";
import { AllServiceEntity } from "./service/AllServiceEntity";

[
    CCShare,
    TimeUtils,
]

export class AllShared {
    static Init() {
        AllServiceEntity.init();
        GLogHelper.print("register AllShared");

    }
}