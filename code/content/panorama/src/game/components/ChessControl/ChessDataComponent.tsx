import { ET } from "../../../../../scripts/tscripts/shared/lib/Entity";

@GReloadable
export class ChessDataComponent extends ET.Component {
    public iLevel: number = 1;
    public iStar: number = 1;
    public IsShowOverhead: boolean = false;
    public PrimaryAttribute: number = 1;

}