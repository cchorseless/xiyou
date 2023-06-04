
import { ET, serializeETProps } from "../../lib/Entity";
import { TCharacter } from "../account/TCharacter";
import { TMail } from "./TMail";



@GReloadable
export class CharacterMailComponent extends ET.Component {
    @serializeETProps()
    public MaxSize: number;
    @serializeETProps()
    public LastMailId: string;
    @serializeETProps()
    public Mails: string[] = [];

    public get Character(): TCharacter { return this.GetParent<TCharacter>(); }
    onGetBelongPlayerid() {
        let character = GTCharacter.GetOneInstanceById(this.Id);
        if (character != null) {
            return character.BelongPlayerid;
        }
        return -1;
    }
    onSerializeToEntity() {
        GTCharacter.GetOneInstance(this.BelongPlayerid).AddOneComponent(this);
        this.onReload();
    }
    onReload() {
        this.SyncClient();
    }


    GetAllMail() {
        let r: TMail[] = [];
        for (let entityid of this.Mails) {
            let entity = TMail.GetOneInstanceById(entityid);
            if (entity && entity.IsDelete == false) {
                r.push(entity)
            }
        }
        return r;
    }



}
