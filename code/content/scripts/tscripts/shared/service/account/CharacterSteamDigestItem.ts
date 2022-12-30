
import { ET } from "../../lib/Entity";


@GReloadable
export class CharacterSteamDigestItem extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;

    public CharacterId: string;
    public SteamName: string;
    public SteamIconUrl: string;
    onSerializeToEntity() {

    }
}
