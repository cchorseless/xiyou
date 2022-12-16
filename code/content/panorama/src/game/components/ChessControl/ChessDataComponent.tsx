import { ET, registerET } from "../../../libs/Entity";

@registerET()
export class ChessDataComponent extends ET.Component {
    public iLevel: number = 1;
    public iStar: number = 1;
    public IsShowOverhead: boolean = false;

}