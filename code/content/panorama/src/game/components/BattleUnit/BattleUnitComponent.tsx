import { ET, registerET } from "../../../libs/Entity";

@registerET()
export class BattleUnitComponent extends ET.Component {
    public iLevel: number = 1;
    public iStar: number = 1;
}