import { ET, serializeETProps } from "../../lib/Entity";

export class CourierBag extends ET.Component {
    @serializeETProps()
    AllItem: { [itemtype: string]: { [slot: string]: string } } = {};
    /**最大神器数 */
    @serializeETProps()
    iMaxArtifact = 6;
    /**购买道具到背包|信使 */
    bBuyItem2Bag: boolean = false;
    /**神器选项列表 */
    artifactSelection: string[] = []
}