export module WearableConfig {
    export enum EWearableAttach {
        customorigin = ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
        PATTACH_CUSTOMORIGIN = ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
        point_follow = ParticleAttachment_t.PATTACH_POINT_FOLLOW,
        PATTACH_POINT_FOLLOW = ParticleAttachment_t.PATTACH_POINT_FOLLOW,
        absorigin_follow = ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
        PATTACH_ABSORIGIN_FOLLOW = ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
        rootbone_follow = ParticleAttachment_t.PATTACH_ROOTBONE_FOLLOW,
        PATTACH_ROOTBONE_FOLLOW = ParticleAttachment_t.PATTACH_ROOTBONE_FOLLOW,
        renderorigin_follow = ParticleAttachment_t.PATTACH_RENDERORIGIN_FOLLOW,
        PATTACH_RENDERORIGIN_FOLLOW = ParticleAttachment_t.PATTACH_RENDERORIGIN_FOLLOW,
        absorigin = ParticleAttachment_t.PATTACH_ABSORIGIN,
        PATTACH_ABSORIGIN = ParticleAttachment_t.PATTACH_ABSORIGIN,
        customorigin_follow = ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW,
        PATTACH_CUSTOMORIGIN_FOLLOW = ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW,
        worldorigin = ParticleAttachment_t.PATTACH_WORLDORIGIN,
        PATTACH_WORLDORIGIN = ParticleAttachment_t.PATTACH_WORLDORIGIN,
    }

    export enum EWearableType {
        wearable = "wearable",
        weapon = 'weapon',
        taunt = 'taunt',
        default_item = 'default_item',
        bundle = 'bundle',
        courier = 'courier',
        ward = 'ward',

    }

}
declare global {
    namespace IWearableConfig {
        interface IUnitWearSlotInfo {
            itemDef: string;
            style?: string;
            model?: CBaseModelEntity;
            bRespawnItem: boolean;
            particles: { [k: string]: ParticleID };
            additional_wearable?: CBaseModelEntity[];
            default_projectile?: string;
            replace_particle_names?: { [k: string]: any };
            model_modifiers?: any[];
            bChangeSkin?: boolean;
            bChangeModel?: boolean;
            bChangeSummon?: { [k: string]: any };
            bChangeScale?: boolean;
            bActivity?: boolean;
            bPersona?: boolean;
        }

        interface IItemSlot {
            SlotName?: string;
            SlotText?: string;
            SlotIndex?: number;
            DisplayInLoadout?: number;
            ItemDefs?: number[];
            DefaultItem?: number;
            styles?: any;
        }
        interface IHeroInfo {
            Bundles?: number[]; // 捆绑包
            ModelScale?: number;
            Slots?: { [k: string]: IItemSlot };
            SlotIndex2Name?: { [k: string]: string };
        }
        interface IOneItemInfo {
            name?: string;
            prefab?: string;
            creation_date?: string;
            event_id?: string;
            image_inventory?: string;
            item_name?: string;
            item_rarity?: string;
            item_slot?: string;
            item_type_name?: string;
            model_player?: string;
            used_by_heroes?: { [k: string]: number };
            bundle?: { [k: string]: number };
            visuals?: {
                styles?: { [k: string]: any };
                alternate_icons?: { [k: string]: any };
                [k: string]: any
            };
        }
    }
}