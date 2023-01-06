import { GameEnum } from "../shared/GameEnum";
import { GameServiceConfig } from "../shared/GameServiceConfig";

export module BotHelper {
    const vspath = 'npc/bot/bot_base.lua';
    const herolist = [
        GameEnum.Dota2.enum_HeroName.antimage,
        GameEnum.Dota2.enum_HeroName.axe,
        GameEnum.Dota2.enum_HeroName.bane,
        GameEnum.Dota2.enum_HeroName.bloodseeker,
        GameEnum.Dota2.enum_HeroName.crystal_maiden,
        GameEnum.Dota2.enum_HeroName.drow_ranger,
        GameEnum.Dota2.enum_HeroName.earthshaker,
        GameEnum.Dota2.enum_HeroName.juggernaut,
        GameEnum.Dota2.enum_HeroName.mirana,
    ];

    /**添加机器人
     *
     */
    export function addBot(count: number = 1) {
        for (let i = 0; i < count; i++) {
            let heroName = herolist.pop() || GameServiceConfig.DEFAULT_PICKED_HERO;
            let playername = DoUniqueString('BOT_');
            GameRules.AddBotPlayerWithEntityScript(heroName, playername, DOTATeam_t.DOTA_TEAM_GOODGUYS, vspath, false);
        }
    }

}