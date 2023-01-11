
import { ET } from "../../lib/Entity";


@GReloadable
export class CharacterSteamDigestItem extends ET.Entity {

    public CharacterId: string;
    public SteamName: string;
    public SteamIconUrl: string;
    onSerializeToEntity() {

    }
}
