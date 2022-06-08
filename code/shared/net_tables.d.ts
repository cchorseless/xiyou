declare interface IEntityInfo {
    configid: string;
    entityid: number;
    showhealthbar: 0|1;
}

declare interface IBuildingInfo extends IEntityInfo {
    iStar: number;
}

declare interface CustomNetTableInfo extends CustomNetTableDeclarations {
    common: {
        encrypt_key: {
            _: string;
        };
    };
    building: { [k: string]: IBuildingInfo };

    etentity: { [k: string]: any };
    game_timer: {
        game_timer: {
            current_time: number;
            current_state: 1 | 2 | 3 | 4 | 5;
            current_round: number;
        };
    };
    hero_list: {
        hero_list: Record<string, string> | string[];
    };
}
