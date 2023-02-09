
import { ET } from "../../shared/lib/Entity";

@GReloadable
export class CombinationSystemComponent extends ET.SingletonComponent {

    /**是否工作 */
    public IsWorking: boolean = true;
    /**初始化 */
    public onAwake(...args: any[]): void {

    }
}

declare global {
    /**
     * @ServerOnly
     */
    var GCombinationSystem: typeof CombinationSystemComponent;
}
if (_G.GCombinationSystem == undefined) {
    _G.GCombinationSystem = CombinationSystemComponent;
}