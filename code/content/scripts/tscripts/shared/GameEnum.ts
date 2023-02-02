export module GameEnum {
    export namespace EGameRecordKey {
        export class GameTime {
            public static readonly GAMERULES_STATE_INIT = "GAMERULES_STATE_INIT";
            public static readonly GAMERULES_STATE_WAIT_FOR_PLAYERS_TO_LOAD = "GAMERULES_STATE_WAIT_FOR_PLAYERS_TO_LOAD";
            public static readonly GAMERULES_STATE_CUSTOM_GAME_SETUP = "GAMERULES_STATE_CUSTOM_GAME_SETUP";
            public static readonly GAMERULES_STATE_HERO_SELECTION = "GAMERULES_STATE_HERO_SELECTION";
            public static readonly GAMERULES_STATE_STRATEGY_TIME = "GAMERULES_STATE_STRATEGY_TIME";
            public static readonly GAMERULES_STATE_TEAM_SHOWCASE = "GAMERULES_STATE_TEAM_SHOWCASE";
            public static readonly GAMERULES_STATE_WAIT_FOR_MAP_TO_LOAD = "GAMERULES_STATE_WAIT_FOR_MAP_TO_LOAD";
            public static readonly GAMERULES_STATE_PRE_GAME = "GAMERULES_STATE_PRE_GAME";
            public static readonly GAMERULES_STATE_SCENARIO_SETUP = "GAMERULES_STATE_SCENARIO_SETUP";
            public static readonly GAMERULES_STATE_GAME_IN_PROGRESS = "GAMERULES_STATE_GAME_IN_PROGRESS";
            public static readonly GAMERULES_STATE_POST_GAME = "GAMERULES_STATE_POST_GAME";
            public static readonly GAMERULES_STATE_DISCONNECT = "GAMERULES_STATE_DISCONNECT";
        }
    }

    export namespace Unit {
        /**单位类型 */
        export enum UnitClass {
            /**饰品 */
            dota_item_wearable = "dota_item_wearable",
            /**道具 */
            item_lua = "item_lua",
            /**技能 */
            ability_lua = "ability_lua",
            /**生物 */
            npc_dota_creature = "npc_dota_creature",
            /**防御塔 */
            npc_dota_tower = "npc_dota_tower",
            /**出生点 */
            info_player_start_goodguys = "info_player_start_goodguys",
        }

        export enum UnitLabels {
            /**NPC */
            npc = "npc",
            /**采集物 */
            collect = "collect",
            /**怪物 */
            monster = "monster",
            /**红方传送点 */
            redtp = "redtp",
            /**红方传送点 */
            bluetp = "bluetp",
        }
        /**单位名称 */
        export enum UnitNames {
            //#region dota
            dota_hero_antimage = "dota_hero_antimage",
            dota_hero_axe = "dota_hero_axe",
            dota_hero_bane = "dota_hero_bane",
            dota_hero_bloodseeker = "dota_hero_bloodseeker",
            dota_hero_crystal_maiden = "dota_hero_crystal_maiden",
            dota_hero_drow_ranger = "dota_hero_drow_ranger",
            dota_hero_earthshaker = "dota_hero_earthshaker",
            dota_hero_juggernaut = "dota_hero_juggernaut",
            dota_hero_mirana = "dota_hero_mirana",
            dota_hero_nevermore = "dota_hero_nevermore",
            dota_hero_morphling = "dota_hero_morphling",
            dota_hero_phantom_lancer = "dota_hero_phantom_lancer",
            dota_hero_puck = "dota_hero_puck",
            dota_hero_pudge = "dota_hero_pudge",
            dota_hero_razor = "dota_hero_razor",
            dota_hero_sand_king = "dota_hero_sand_king",
            dota_hero_storm_spirit = "dota_hero_storm_spirit",
            dota_hero_sven = "dota_hero_sven",
            dota_hero_tiny = "dota_hero_tiny",
            dota_hero_vengefulspirit = "dota_hero_vengefulspirit",
            dota_hero_windrunner = "dota_hero_windrunner",
            dota_hero_zuus = "dota_hero_zuus",
            dota_hero_kunkka = "dota_hero_kunkka",
            dota_hero_lina = "dota_hero_lina",
            dota_hero_lich = "dota_hero_lich",
            dota_hero_lion = "dota_hero_lion",
            dota_hero_shadow_shaman = "dota_hero_shadow_shaman",
            dota_hero_slardar = "dota_hero_slardar",
            dota_hero_tidehunter = "dota_hero_tidehunter",
            dota_hero_witch_doctor = "dota_hero_witch_doctor",
            dota_hero_riki = "dota_hero_riki",
            dota_hero_enigma = "dota_hero_enigma",
            dota_hero_tinker = "dota_hero_tinker",
            dota_hero_sniper = "dota_hero_sniper",
            dota_hero_necrolyte = "dota_hero_necrolyte",
            dota_hero_warlock = "dota_hero_warlock",
            dota_hero_beastmaster = "dota_hero_beastmaster",
            dota_hero_queenofpain = "dota_hero_queenofpain",
            dota_hero_venomancer = "dota_hero_venomancer",
            dota_hero_faceless_void = "dota_hero_faceless_void",
            dota_hero_skeleton_king = "dota_hero_skeleton_king",
            dota_hero_death_prophet = "dota_hero_death_prophet",
            dota_hero_phantom_assassin = "dota_hero_phantom_assassin",
            dota_hero_pugna = "dota_hero_pugna",
            dota_hero_templar_assassin = "dota_hero_templar_assassin",
            dota_hero_viper = "dota_hero_viper",
            dota_hero_luna = "dota_hero_luna",
            dota_hero_dragon_knight = "dota_hero_dragon_knight",
            dota_hero_dazzle = "dota_hero_dazzle",
            dota_hero_rattletrap = "dota_hero_rattletrap",
            dota_hero_leshrac = "dota_hero_leshrac",
            dota_hero_furion = "dota_hero_furion",
            dota_hero_life_stealer = "dota_hero_life_stealer",
            dota_hero_dark_seer = "dota_hero_dark_seer",
            dota_hero_clinkz = "dota_hero_clinkz",
            dota_hero_omniknight = "dota_hero_omniknight",
            dota_hero_enchantress = "dota_hero_enchantress",
            dota_hero_huskar = "dota_hero_huskar",
            dota_hero_night_stalker = "dota_hero_night_stalker",
            dota_hero_broodmother = "dota_hero_broodmother",
            dota_hero_bounty_hunter = "dota_hero_bounty_hunter",
            dota_hero_weaver = "dota_hero_weaver",
            dota_hero_jakiro = "dota_hero_jakiro",
            dota_hero_batrider = "dota_hero_batrider",
            dota_hero_chen = "dota_hero_chen",
            dota_hero_spectre = "dota_hero_spectre",
            dota_hero_doom_bringer = "dota_hero_doom_bringer",
            dota_hero_ancient_apparition = "dota_hero_ancient_apparition",
            dota_hero_ursa = "dota_hero_ursa",
            dota_hero_spirit_breaker = "dota_hero_spirit_breaker",
            dota_hero_gyrocopter = "dota_hero_gyrocopter",
            dota_hero_alchemist = "dota_hero_alchemist",
            dota_hero_invoker = "dota_hero_invoker",
            dota_hero_silencer = "dota_hero_silencer",
            dota_hero_obsidian_destroyer = "dota_hero_obsidian_destroyer",
            dota_hero_lycan = "dota_hero_lycan",
            dota_hero_brewmaster = "dota_hero_brewmaster",
            dota_hero_shadow_demon = "dota_hero_shadow_demon",
            dota_hero_lone_druid = "dota_hero_lone_druid",
            dota_hero_chaos_knight = "dota_hero_chaos_knight",
            dota_hero_meepo = "dota_hero_meepo",
            dota_hero_treant = "dota_hero_treant",
            dota_hero_ogre_magi = "dota_hero_ogre_magi",
            dota_hero_undying = "dota_hero_undying",
            dota_hero_rubick = "dota_hero_rubick",
            dota_hero_disruptor = "dota_hero_disruptor",
            dota_hero_nyx_assassin = "dota_hero_nyx_assassin",
            dota_hero_naga_siren = "dota_hero_naga_siren",
            dota_hero_keeper_of_the_light = "dota_hero_keeper_of_the_light",
            dota_hero_wisp = "dota_hero_wisp",
            dota_hero_visage = "dota_hero_visage",
            dota_hero_slark = "dota_hero_slark",
            dota_hero_medusa = "dota_hero_medusa",
            dota_hero_troll_warlord = "dota_hero_troll_warlord",
            dota_hero_centaur = "dota_hero_centaur",
            dota_hero_magnataur = "dota_hero_magnataur",
            dota_hero_shredder = "dota_hero_shredder",
            dota_hero_bristleback = "dota_hero_bristleback",
            dota_hero_tusk = "dota_hero_tusk",
            dota_hero_skywrath_mage = "dota_hero_skywrath_mage",
            dota_hero_abaddon = "dota_hero_abaddon",
            dota_hero_elder_titan = "dota_hero_elder_titan",
            dota_hero_legion_commander = "dota_hero_legion_commander",
            dota_hero_ember_spirit = "dota_hero_ember_spirit",
            dota_hero_earth_spirit = "dota_hero_earth_spirit",
            dota_hero_terrorblade = "dota_hero_terrorblade",
            dota_hero_phoenix = "dota_hero_phoenix",
            dota_hero_oracle = "dota_hero_oracle",
            dota_hero_techies = "dota_hero_techies",
            dota_hero_target_dummy = "dota_hero_target_dummy",
            dota_hero_winter_wyvern = "dota_hero_winter_wyvern",
            dota_hero_arc_warden = "dota_hero_arc_warden",
            dota_hero_abyssal_underlord = "dota_hero_abyssal_underlord",
            dota_hero_monkey_king = "dota_hero_monkey_king",
            dota_hero_pangolier = "dota_hero_pangolier",
            dota_hero_dark_willow = "dota_hero_dark_willow",
            dota_hero_grimstroke = "dota_hero_grimstroke",
            dota_hero_mars = "dota_hero_mars",
            dota_hero_void_spirit = "dota_hero_void_spirit",
            dota_hero_snapfire = "dota_hero_snapfire",
            dota_hero_hoodwink = "dota_hero_hoodwink",
            dota_hero_dawnbreaker = "dota_hero_dawnbreaker",
            //#endregion
            //#region 自定义
            /**全局计时器 */
            info_target = "info_target",
            /**添加了BUFF的空实体 */
            npc_dota_thinker = "npc_dota_thinker",
            npc_dota_companion = "npc_dota_companion",
            /**传送点 */
            unit_red_tp = "unit_red_tp",
            unit_blue_tp = "unit_blue_tp",
            /**泉水 */
            dota_fountain = "dota_fountain",
            npc_dota_nemestice_tower_dire = "npc_dota_nemestice_tower_dire",
            npc_dota_nemestice_tower_radiant = "npc_dota_nemestice_tower_radiant",
        }
    }

    export namespace Ability {
        /**技能积蓄点数BUFF名称 */
        export enum EAbilityChargeBuffName {
            modifier_charges = "modifier_charges"
        }

    }


    /**
     * 所有系统保留事件类型
     */
    export enum GameEvent {
        //#region
        /**
         * Send once a server starts.
         */
        ServerSpawnEvent = "server_spawn",
        /**
         * Server is about to be shut down.
         */
        ServerPreShutdownEvent = "server_pre_shutdown",
        /**
         * Server shut down.
         */
        ServerShutdownEvent = "server_shutdown",
        /**
         * A generic server message.
         */
        ServerMessageEvent = "server_message",
        /**
         * A server console var has changed.
         */
        ServerCvarEvent = "server_cvar",
        ServerAddbanEvent = "server_addban",
        ServerRemovebanEvent = "server_removeban",
        PlayerActivateEvent = "player_activate",
        /**
         * Player has sent final message in the connection sequence.
         */
        PlayerConnectFullEvent = "player_connect_full",
        PlayerSayEvent = "player_say",
        PlayerFullUpdateEvent = "player_full_update",
        /**
         * A new client connected.
         */
        PlayerConnectEvent = "player_connect",
        /**
         * A client was disconnected.
         */
        PlayerDisconnectEvent = "player_disconnect",
        /**
         * A player changed his name.
         */
        PlayerInfoEvent = "player_info",
        /**
         * Player spawned in game.
         */
        PlayerSpawnEvent = "player_spawn",
        PlayerTeamEvent = "player_team",
        local_player_team = "local_player_team",
        PlayerChangenameEvent = "player_changename",
        /**
         * A player changed his class.
         */
        PlayerClassEvent = "player_class",
        /**
         * Players scores changed.
         */
        PlayerScoreEvent = "player_score",
        PlayerHurtEvent = "player_hurt",
        /**
         * Player shoot his weapon.
         */
        PlayerShootEvent = "player_shoot",
        /**
         * A public player chat.
         */
        PlayerChatEvent = "player_chat",
        /**
         * Emits a sound to everyone on a team.
         */
        TeamplayBroadcastAudioEvent = "teamplay_broadcast_audio",
        FinaleStartEvent = "finale_start",
        PlayerStatsUpdatedEvent = "player_stats_updated",
        /**
         * Fired when achievements/stats are downloaded from Steam or XBox Live.
         */
        user_data_downloaded = "user_data_downloaded",
        RagdollDissolvedEvent = "ragdoll_dissolved",
        /**
         * Info about team.
         */
        TeamInfoEvent = "team_info",
        /**
         * Team score changed.
         */
        TeamScoreEvent = "team_score",
        /**
         * A spectator/player is a cameraman.
         */
        HltvCameramanEvent = "hltv_cameraman",
        /**
         * Shot of a single entity.
         */
        HltvChaseEvent = "hltv_chase",
        /**
         * A camera ranking.
         */
        HltvRankCameraEvent = "hltv_rank_camera",
        /**
         * An entity ranking.
         */
        HltvRankEntityEvent = "hltv_rank_entity",
        /**
         * Show from fixed view.
         */
        HltvFixedEvent = "hltv_fixed",
        /**
         * A HLTV message send by moderators.
         */
        HltvMessageEvent = "hltv_message",
        /**
         * General HLTV status.
         */
        HltvStatusEvent = "hltv_status",
        HltvTitleEvent = "hltv_title",
        /**
         * A HLTV chat msg sent by spectators.
         */
        HltvChatEvent = "hltv_chat",
        HltvVersioninfoEvent = "hltv_versioninfo",
        DemoStartEvent = "demo_start",
        demo_stop = "demo_stop",
        DemoSkipEvent = "demo_skip",
        map_shutdown = "map_shutdown",
        map_transition = "map_transition",
        HostnameChangedEvent = "hostname_changed",
        DifficultyChangedEvent = "difficulty_changed",
        /**
         * A message send by game logic to everyone.
         */
        GameMessageEvent = "game_message",
        /**
         * Send when new map is completely loaded.
         */
        GameNewmapEvent = "game_newmap",
        RoundStartEvent = "round_start",
        RoundEndEvent = "round_end",
        round_start_pre_entity = "round_start_pre_entity",
        round_start_post_nav = "round_start_post_nav",
        round_freeze_end = "round_freeze_end",
        /**
         * Round restart.
         */
        TeamplayRoundStartEvent = "teamplay_round_start",
        /**
         * A game event, name may be 32 charaters long.
         */
        PlayerDeathEvent = "player_death",
        PlayerFootstepEvent = "player_footstep",
        PlayerHintmessageEvent = "player_hintmessage",
        BreakBreakableEvent = "break_breakable",
        BreakPropEvent = "break_prop",
        EntityKilledEvent = "entity_killed",
        DoorOpenEvent = "door_open",
        DoorCloseEvent = "door_close",
        DoorUnlockedEvent = "door_unlocked",
        VoteStartedEvent = "vote_started",
        VoteFailedEvent = "vote_failed",
        VotePassedEvent = "vote_passed",
        VoteChangedEvent = "vote_changed",
        VoteCastYesEvent = "vote_cast_yes",
        VoteCastNoEvent = "vote_cast_no",
        AchievementEventEvent = "achievement_event",
        AchievementEarnedEvent = "achievement_earned",
        achievement_write_failed = "achievement_write_failed",
        BonusUpdatedEvent = "bonus_updated",
        spec_target_updated = "spec_target_updated",
        EntityVisibleEvent = "entity_visible",
        /**
         * The player pressed use but a use entity wasn't found.
         */
        PlayerUseMissEvent = "player_use_miss",
        gameinstructor_draw = "gameinstructor_draw",
        gameinstructor_nodraw = "gameinstructor_nodraw",
        FlareIgniteNpcEvent = "flare_ignite_npc",
        helicopter_grenade_punt_miss = "helicopter_grenade_punt_miss",
        PhysgunPickupEvent = "physgun_pickup",
        InventoryUpdatedEvent = "inventory_updated",
        cart_updated = "cart_updated",
        store_pricesheet_updated = "store_pricesheet_updated",
        item_schema_initialized = "item_schema_initialized",
        drop_rate_modified = "drop_rate_modified",
        event_ticket_modified = "event_ticket_modified",
        gc_connected = "gc_connected",
        InstructorStartLessonEvent = "instructor_start_lesson",
        InstructorCloseLessonEvent = "instructor_close_lesson",
        InstructorServerHintCreateEvent = "instructor_server_hint_create",
        InstructorServerHintStopEvent = "instructor_server_hint_stop",
        SetInstructorGroupEnabledEvent = "set_instructor_group_enabled",
        ClientsideLessonClosedEvent = "clientside_lesson_closed",
        dynamic_shadow_light_changed = "dynamic_shadow_light_changed",
        /**
         * Shot of a single entity.
         */
        DotaChaseHeroEvent = "dota_chase_hero",
        DotaCombatlogEvent = "dota_combatlog",
        DotaGameStateChangeEvent = "dota_game_state_change",
        HeroSelectedEvent = "hero_selected",
        DotaPlayerPickHeroEvent = "dota_player_pick_hero",
        ModifierEventEvent = "modifier_event",
        DotaPlayerKillEvent = "dota_player_kill",
        DotaPlayerDenyEvent = "dota_player_deny",
        DotaBarracksKillEvent = "dota_barracks_kill",
        DotaTowerKillEvent = "dota_tower_kill",
        DotaEffigyKillEvent = "dota_effigy_kill",
        DotaRoshanKillEvent = "dota_roshan_kill",
        DotaCourierLostEvent = "dota_courier_lost",
        DotaCourierRespawnedEvent = "dota_courier_respawned",
        DotaGlyphUsedEvent = "dota_glyph_used",
        DotaSuperCreepsEvent = "dota_super_creeps",
        DotaItemPurchaseEvent = "dota_item_purchase",
        DotaItemGiftedEvent = "dota_item_gifted",
        DotaItemPlacedInNeutralStashEvent = "dota_item_placed_in_neutral_stash",
        DotaRunePickupEvent = "dota_rune_pickup",
        DotaWardKilledEvent = "dota_ward_killed",
        DotaRuneSpottedEvent = "dota_rune_spotted",
        DotaItemSpottedEvent = "dota_item_spotted",
        DotaNoBattlePointsEvent = "dota_no_battle_points",
        DotaChatInformationalEvent = "dota_chat_informational",
        DotaActionItemEvent = "dota_action_item",
        DotaChatBanNotificationEvent = "dota_chat_ban_notification",
        DotaChatEventEvent = "dota_chat_event",
        DotaChatTimedRewardEvent = "dota_chat_timed_reward",
        DotaPauseEventEvent = "dota_pause_event",
        DotaChatKillStreakEvent = "dota_chat_kill_streak",
        DotaChatFirstBloodEvent = "dota_chat_first_blood",
        DotaChatAssassinAnnounceEvent = "dota_chat_assassin_announce",
        DotaChatAssassinDeniedEvent = "dota_chat_assassin_denied",
        DotaChatAssassinSuccessEvent = "dota_chat_assassin_success",
        DotaPlayerUpdateHeroSelectionEvent = "dota_player_update_hero_selection",
        dota_player_update_selected_unit = "dota_player_update_selected_unit",
        dota_player_update_query_unit = "dota_player_update_query_unit",
        dota_player_update_killcam_unit = "dota_player_update_killcam_unit",
        DotaPlayerTakeTowerDamageEvent = "dota_player_take_tower_damage",
        DotaHudErrorMessageEvent = "dota_hud_error_message",
        dota_action_success = "dota_action_success",
        dota_starting_position_changed = "dota_starting_position_changed",
        DotaTeamNeutralStashItemsChangedEvent = "dota_team_neutral_stash_items_changed",
        DotaTeamNeutralStashItemsAcknowledgedChangedEvent = "dota_team_neutral_stash_items_acknowledged_changed",
        dota_money_changed = "dota_money_changed",
        dota_enemy_money_changed = "dota_enemy_money_changed",
        dota_portrait_unit_stats_changed = "dota_portrait_unit_stats_changed",
        DotaPortraitUnitModifiersChangedEvent = "dota_portrait_unit_modifiers_changed",
        dota_force_portrait_update = "dota_force_portrait_update",
        dota_inventory_changed = "dota_inventory_changed",
        dota_item_suggestions_changed = "dota_item_suggestions_changed",
        dota_estimated_match_duration_changed = "dota_estimated_match_duration_changed",
        dota_hero_ability_points_changed = "dota_hero_ability_points_changed",
        DotaItemPickedUpEvent = "dota_item_picked_up",
        DotaItemPhysicalDestroyedEvent = "dota_item_physical_destroyed",
        DotaNeutralItemSentToStashEvent = "dota_neutral_item_sent_to_stash",
        DotaInventoryItemChangedEvent = "dota_inventory_item_changed",
        DotaAbilityChangedEvent = "dota_ability_changed",
        DotaSpectatorTalentChangedEvent = "dota_spectator_talent_changed",
        dota_portrait_ability_layout_changed = "dota_portrait_ability_layout_changed",
        DotaInventoryItemAddedEvent = "dota_inventory_item_added",
        dota_inventory_changed_query_unit = "dota_inventory_changed_query_unit",
        DotaLinkClickedEvent = "dota_link_clicked",
        DotaSetQuickBuyEvent = "dota_set_quick_buy",
        DotaQuickBuyChangedEvent = "dota_quick_buy_changed",
        DotaPlayerShopChangedEvent = "dota_player_shop_changed",
        DotaHeroEnteredShopEvent = "dota_hero_entered_shop",
        DotaPlayerShowKillcamEvent = "dota_player_show_killcam",
        DotaPlayerShowMinikillcamEvent = "dota_player_show_minikillcam",
        gc_user_session_created = "gc_user_session_created",
        team_data_updated = "team_data_updated",
        guild_data_updated = "guild_data_updated",
        guild_open_parties_updated = "guild_open_parties_updated",
        fantasy_updated = "fantasy_updated",
        fantasy_league_changed = "fantasy_league_changed",
        fantasy_score_info_changed = "fantasy_score_info_changed",
        league_admin_info_updated = "league_admin_info_updated",
        league_series_info_updated = "league_series_info_updated",
        player_info_updated = "player_info_updated",
        PlayerInfoIndividualUpdatedEvent = "player_info_individual_updated",
        game_rules_state_change = "game_rules_state_change",
        MatchHistoryUpdatedEvent = "match_history_updated",
        MatchDetailsUpdatedEvent = "match_details_updated",
        TeamDetailsUpdatedEvent = "team_details_updated",
        live_games_updated = "live_games_updated",
        RecentMatchesUpdatedEvent = "recent_matches_updated",
        news_updated = "news_updated",
        PersonaUpdatedEvent = "persona_updated",
        tournament_state_updated = "tournament_state_updated",
        party_updated = "party_updated",
        lobby_updated = "lobby_updated",
        dashboard_caches_cleared = "dashboard_caches_cleared",
        LastHitEvent = "last_hit",
        PlayerCompletedGameEvent = "player_completed_game",
        PlayerReconnectedEvent = "player_reconnected",
        NommedTreeEvent = "nommed_tree",
        DotaRuneActivatedServerEvent = "dota_rune_activated_server",
        DotaPlayerGainedLevelEvent = "dota_player_gained_level",
        DotaPlayerLearnedAbilityEvent = "dota_player_learned_ability",
        DotaPlayerUsedAbilityEvent = "dota_player_used_ability",
        DotaNonPlayerUsedAbilityEvent = "dota_non_player_used_ability",
        DotaPlayerBeginCastEvent = "dota_player_begin_cast",
        DotaNonPlayerBeginCastEvent = "dota_non_player_begin_cast",
        DotaAbilityChannelFinishedEvent = "dota_ability_channel_finished",
        DotaHoldoutReviveCompleteEvent = "dota_holdout_revive_complete",
        DotaHoldoutReviveEliminatedEvent = "dota_holdout_revive_eliminated",
        DotaPlayerKilledEvent = "dota_player_killed",
        DotaAssistEarnedEvent = "dota_assist_earned",
        bindpanel_open = "bindpanel_open",
        bindpanel_close = "bindpanel_close",
        keybind_changed = "keybind_changed",
        dota_item_drag_begin = "dota_item_drag_begin",
        dota_item_drag_end = "dota_item_drag_end",
        dota_shop_item_drag_begin = "dota_shop_item_drag_begin",
        dota_shop_item_drag_end = "dota_shop_item_drag_end",
        DotaItemPurchasedEvent = "dota_item_purchased",
        DotaItemCombinedEvent = "dota_item_combined",
        DotaItemUsedEvent = "dota_item_used",
        DotaItemAutoPurchaseEvent = "dota_item_auto_purchase",
        DotaUnitEventEvent = "dota_unit_event",
        DotaQuestStartedEvent = "dota_quest_started",
        DotaQuestCompletedEvent = "dota_quest_completed",
        gameui_activated = "gameui_activated",
        gameui_hidden = "gameui_hidden",
        PlayerFullyjoinedEvent = "player_fullyjoined",
        DotaSpectateHeroEvent = "dota_spectate_hero",
        DotaMatchDoneEvent = "dota_match_done",
        dota_match_done_client = "dota_match_done_client",
        JoinedChatChannelEvent = "joined_chat_channel",
        LeftChatChannelEvent = "left_chat_channel",
        gc_chat_channel_list_updated = "gc_chat_channel_list_updated",
        FileDownloadedEvent = "file_downloaded",
        PlayerReportCountsUpdatedEvent = "player_report_counts_updated",
        ScaleformFileDownloadCompleteEvent = "scaleform_file_download_complete",
        ItemPurchasedEvent = "item_purchased",
        gc_mismatched_version = "gc_mismatched_version",
        DotaWorkshopFileselectedEvent = "dota_workshop_fileselected",
        dota_workshop_filecanceled = "dota_workshop_filecanceled",
        rich_presence_updated = "rich_presence_updated",
        live_leagues_updated = "live_leagues_updated",
        DotaHeroRandomEvent = "dota_hero_random",
        DotaRiverPaintedEvent = "dota_river_painted",
        DotaScanUsedEvent = "dota_scan_used",
        DotaScanFoundEnemyEvent = "dota_scan_found_enemy",
        DotaRdChatTurnEvent = "dota_rd_chat_turn",
        DotaAdNominatedBanEvent = "dota_ad_nominated_ban",
        DotaAdBanEvent = "dota_ad_ban",
        DotaAdBanCountEvent = "dota_ad_ban_count",
        DotaAdHeroCollisionEvent = "dota_ad_hero_collision",
        dota_favorite_heroes_updated = "dota_favorite_heroes_updated",
        profile_opened = "profile_opened",
        profile_closed = "profile_closed",
        item_preview_closed = "item_preview_closed",
        DashboardSwitchedSectionEvent = "dashboard_switched_section",
        DotaTournamentItemEventEvent = "dota_tournament_item_event",
        DotaHeroSwapEvent = "dota_hero_swap",
        dota_reset_suggested_items = "dota_reset_suggested_items",
        halloween_high_score_received = "halloween_high_score_received",
        HalloweenPhaseEndEvent = "halloween_phase_end",
        halloween_high_score_request_failed = "halloween_high_score_request_failed",
        DotaHudSkinChangedEvent = "dota_hud_skin_changed",
        DotaInventoryPlayerGotItemEvent = "dota_inventory_player_got_item",
        player_is_experienced = "player_is_experienced",
        player_is_notexperienced = "player_is_notexperienced",
        dota_tutorial_lesson_start = "dota_tutorial_lesson_start",
        dota_tutorial_task_advance = "dota_tutorial_task_advance",
        DotaTutorialShopToggledEvent = "dota_tutorial_shop_toggled",
        map_location_updated = "map_location_updated",
        richpresence_custom_updated = "richpresence_custom_updated",
        game_end_visible = "game_end_visible",
        enable_china_logomark = "enable_china_logomark",
        HighlightHudElementEvent = "highlight_hud_element",
        hide_highlight_hud_element = "hide_highlight_hud_element",
        intro_video_finished = "intro_video_finished",
        matchmaking_status_visibility_changed = "matchmaking_status_visibility_changed",
        practice_lobby_visibility_changed = "practice_lobby_visibility_changed",
        DotaCourierTransferItemEvent = "dota_courier_transfer_item",
        full_ui_unlocked = "full_ui_unlocked",
        ClientDisconnectEvent = "client_disconnect",
        HeroSelectorPreviewSetEvent = "hero_selector_preview_set",
        AntiaddictionToastEvent = "antiaddiction_toast",
        hero_picker_shown = "hero_picker_shown",
        hero_picker_hidden = "hero_picker_hidden",
        dota_local_quickbuy_changed = "dota_local_quickbuy_changed",
        ShowCenterMessageEvent = "show_center_message",
        HudFlipChangedEvent = "hud_flip_changed",
        frosty_points_updated = "frosty_points_updated",
        DefeatedEvent = "defeated",
        reset_defeated = "reset_defeated",
        booster_state_updated = "booster_state_updated",
        CustomGameDifficultyEvent = "custom_game_difficulty",
        TreeCutEvent = "tree_cut",
        UgcDetailsArrivedEvent = "ugc_details_arrived",
        UgcSubscribedEvent = "ugc_subscribed",
        UgcUnsubscribedEvent = "ugc_unsubscribed",
        UgcDownloadRequestedEvent = "ugc_download_requested",
        UgcInstalledEvent = "ugc_installed",
        PrizepoolReceivedEvent = "prizepool_received",
        MicrotransactionSuccessEvent = "microtransaction_success",
        DotaRubickAbilityStealEvent = "dota_rubick_ability_steal",
        community_cached_names_updated = "community_cached_names_updated",
        SpecItemPickupEvent = "spec_item_pickup",
        SpecAegisReclaimTimeEvent = "spec_aegis_reclaim_time",
        AccountTrophiesChangedEvent = "account_trophies_changed",
        AccountAllHeroChallengeChangedEvent = "account_all_hero_challenge_changed",
        TeamShowcaseUiUpdateEvent = "team_showcase_ui_update",
        dota_match_signout = "dota_match_signout",
        DotaIllusionsCreatedEvent = "dota_illusions_created",
        DotaYearBeastKilledEvent = "dota_year_beast_killed",
        DotaPlayerSpawnedEvent = "dota_player_spawned",
        DotaHeroUndoselectionEvent = "dota_hero_undoselection",
        dota_challenge_socache_updated = "dota_challenge_socache_updated",
        dota_player_team_changed = "dota_player_team_changed",
        party_invites_updated = "party_invites_updated",
        lobby_invites_updated = "lobby_invites_updated",
        custom_game_mode_list_updated = "custom_game_mode_list_updated",
        custom_game_lobby_list_updated = "custom_game_lobby_list_updated",
        friend_lobby_list_updated = "friend_lobby_list_updated",
        dota_team_player_list_changed = "dota_team_player_list_changed",
        dota_player_connection_state_changed = "dota_player_connection_state_changed",
        dota_player_details_changed = "dota_player_details_changed",
        PlayerProfileStatsUpdatedEvent = "player_profile_stats_updated",
        CustomGamePlayerCountUpdatedEvent = "custom_game_player_count_updated",
        CustomGameFriendsPlayedUpdatedEvent = "custom_game_friends_played_updated",
        custom_games_friends_play_updated = "custom_games_friends_play_updated",
        DotaPlayerUpdateAssignedHeroEvent = "dota_player_update_assigned_hero",
        dota_player_hero_selection_dirty = "dota_player_hero_selection_dirty",
        DotaNpcGoalReachedEvent = "dota_npc_goal_reached",
        DotaPlayerSelectedCustomTeamEvent = "dota_player_selected_custom_team",
        DotaCoinWagerEvent = "dota_coin_wager",
        DotaWagerTokenEvent = "dota_wager_token",
        DotaRankWagerEvent = "dota_rank_wager",
        DotaBountyEvent = "dota_bounty",
        DotaCandyEvent = "dota_candy",
        DotaAdRandomedEvent = "dota_ad_randomed",
        colorblind_mode_changed = "colorblind_mode_changed",
        DotaReportSubmittedEvent = "dota_report_submitted",
        client_reload_game_keyvalues = "client_reload_game_keyvalues",
        DotaHeroInventoryItemChangeEvent = "dota_hero_inventory_item_change",
        game_rules_shutdown = "game_rules_shutdown",
        AegisEventEvent = "aegis_event",
        DotaBuybackEvent = "dota_buyback",
        BoughtBackEvent = "bought_back",
        DotaShrineKillEvent = "dota_shrine_kill",
        ParticleSystemStartEvent = "particle_system_start",
        ParticleSystemStopEvent = "particle_system_stop",
        DotaCombatEventMessageEvent = "dota_combat_event_message",
        DotaItemSpawnedEvent = "dota_item_spawned",
        DotaPlayerReconnectedEvent = "dota_player_reconnected",
        DotaOnHeroFinishSpawnEvent = "dota_on_hero_finish_spawn",
        DotaCreatureGainedLevelEvent = "dota_creature_gained_level",
        DotaHeroTeleportToUnitEvent = "dota_hero_teleport_to_unit",
        DotaNeutralCreepCampClearedEvent = "dota_neutral_creep_camp_cleared",
        NpcSpawnedEvent = "npc_spawned",
        NpcReplacedEvent = "npc_replaced",
        EntityHurtEvent = "entity_hurt",
        /**
         * The specified channel contains new messages.
         */
        ChatNewMessageEvent = "chat_new_message",
        /**
         * The specified channel has had players leave or join.
         */
        ChatMembersChangedEvent = "chat_members_changed",
        DotaTeamKillCreditEvent = "dota_team_kill_credit",
    }

    /**玩家行为 */
    export namespace Dota2 {
        /**英雄名称 */
        export enum enum_HeroName {
            antimage = "npc_dota_hero_antimage",
            axe = "npc_dota_hero_axe",
            bane = "npc_dota_hero_bane",
            bloodseeker = "npc_dota_hero_bloodseeker",
            crystal_maiden = "npc_dota_hero_crystal_maiden",
            drow_ranger = "npc_dota_hero_drow_ranger",
            earthshaker = "npc_dota_hero_earthshaker",
            juggernaut = "npc_dota_hero_juggernaut",
            mirana = "npc_dota_hero_mirana",
            nevermore = "npc_dota_hero_nevermore",
            morphling = "npc_dota_hero_morphling",
            phantom_lancer = "npc_dota_hero_phantom_lancer",
            puck = "npc_dota_hero_puck",
            pudge = "npc_dota_hero_pudge",
            razor = "npc_dota_hero_razor",
            sand_king = "npc_dota_hero_sand_king",
            storm_spirit = "npc_dota_hero_storm_spirit",
            sven = "npc_dota_hero_sven",
            tiny = "npc_dota_hero_tiny",
            vengefulspirit = "npc_dota_hero_vengefulspirit",
            windrunner = "npc_dota_hero_windrunner",
            zuus = "npc_dota_hero_zuus",
            kunkka = "npc_dota_hero_kunkka",
            lina = "npc_dota_hero_lina",
            lich = "npc_dota_hero_lich",
            lion = "npc_dota_hero_lion",
            shadow_shaman = "npc_dota_hero_shadow_shaman",
            slardar = "npc_dota_hero_slardar",
            tidehunter = "npc_dota_hero_tidehunter",
            witch_doctor = "npc_dota_hero_witch_doctor",
            riki = "npc_dota_hero_riki",
            enigma = "npc_dota_hero_enigma",
            tinker = "npc_dota_hero_tinker",
            sniper = "npc_dota_hero_sniper",
            necrolyte = "npc_dota_hero_necrolyte",
            warlock = "npc_dota_hero_warlock",
            beastmaster = "npc_dota_hero_beastmaster",
            queenofpain = "npc_dota_hero_queenofpain",
            venomancer = "npc_dota_hero_venomancer",
            faceless_void = "npc_dota_hero_faceless_void",
            skeleton_king = "npc_dota_hero_skeleton_king",
            death_prophet = "npc_dota_hero_death_prophet",
            phantom_assassin = "npc_dota_hero_phantom_assassin",
            pugna = "npc_dota_hero_pugna",
            templar_assassin = "npc_dota_hero_templar_assassin",
            viper = "npc_dota_hero_viper",
            luna = "npc_dota_hero_luna",
            dragon_knight = "npc_dota_hero_dragon_knight",
            dazzle = "npc_dota_hero_dazzle",
            rattletrap = "npc_dota_hero_rattletrap",
            leshrac = "npc_dota_hero_leshrac",
            furion = "npc_dota_hero_furion",
            life_stealer = "npc_dota_hero_life_stealer",
            dark_seer = "npc_dota_hero_dark_seer",
            clinkz = "npc_dota_hero_clinkz",
            omniknight = "npc_dota_hero_omniknight",
            enchantress = "npc_dota_hero_enchantress",
            huskar = "npc_dota_hero_huskar",
            night_stalker = "npc_dota_hero_night_stalker",
            broodmother = "npc_dota_hero_broodmother",
            bounty_hunter = "npc_dota_hero_bounty_hunter",
            weaver = "npc_dota_hero_weaver",
            jakiro = "npc_dota_hero_jakiro",
            batrider = "npc_dota_hero_batrider",
            chen = "npc_dota_hero_chen",
            spectre = "npc_dota_hero_spectre",
            doom_bringer = "npc_dota_hero_doom_bringer",
            ancient_apparition = "npc_dota_hero_ancient_apparition",
            ursa = "npc_dota_hero_ursa",
            spirit_breaker = "npc_dota_hero_spirit_breaker",
            gyrocopter = "npc_dota_hero_gyrocopter",
            alchemist = "npc_dota_hero_alchemist",
            invoker = "npc_dota_hero_invoker",
            silencer = "npc_dota_hero_silencer",
            obsidian_destroyer = "npc_dota_hero_obsidian_destroyer",
            lycan = "npc_dota_hero_lycan",
            brewmaster = "npc_dota_hero_brewmaster",
            shadow_demon = "npc_dota_hero_shadow_demon",
            lone_druid = "npc_dota_hero_lone_druid",
            chaos_knight = "npc_dota_hero_chaos_knight",
            meepo = "npc_dota_hero_meepo",
            treant = "npc_dota_hero_treant",
            ogre_magi = "npc_dota_hero_ogre_magi",
            undying = "npc_dota_hero_undying",
            rubick = "npc_dota_hero_rubick",
            disruptor = "npc_dota_hero_disruptor",
            nyx_assassin = "npc_dota_hero_nyx_assassin",
            naga_siren = "npc_dota_hero_naga_siren",
            keeper_of_the_light = "npc_dota_hero_keeper_of_the_light",
            wisp = "npc_dota_hero_wisp",
            visage = "npc_dota_hero_visage",
            slark = "npc_dota_hero_slark",
            medusa = "npc_dota_hero_medusa",
            troll_warlord = "npc_dota_hero_troll_warlord",
            centaur = "npc_dota_hero_centaur",
            magnataur = "npc_dota_hero_magnataur",
            shredder = "npc_dota_hero_shredder",
            bristleback = "npc_dota_hero_bristleback",
            tusk = "npc_dota_hero_tusk",
            skywrath_mage = "npc_dota_hero_skywrath_mage",
            abaddon = "npc_dota_hero_abaddon",
            elder_titan = "npc_dota_hero_elder_titan",
            legion_commander = "npc_dota_hero_legion_commander",
            ember_spirit = "npc_dota_hero_ember_spirit",
            earth_spirit = "npc_dota_hero_earth_spirit",
            terrorblade = "npc_dota_hero_terrorblade",
            phoenix = "npc_dota_hero_phoenix",
            oracle = "npc_dota_hero_oracle",
            techies = "npc_dota_hero_techies",
            target_dummy = "npc_dota_hero_target_dummy",
            winter_wyvern = "npc_dota_hero_winter_wyvern",
            arc_warden = "npc_dota_hero_arc_warden",
            abyssal_underlord = "npc_dota_hero_abyssal_underlord",
            monkey_king = "npc_dota_hero_monkey_king",
            pangolier = "npc_dota_hero_pangolier",
            dark_willow = "npc_dota_hero_dark_willow",
            grimstroke = "npc_dota_hero_grimstroke",
            mars = "npc_dota_hero_mars",
            void_spirit = "npc_dota_hero_void_spirit",
            snapfire = "npc_dota_hero_snapfire",
            hoodwink = "npc_dota_hero_hoodwink",
            dawnbreaker = "npc_dota_hero_dawnbreaker",
        }
        /**英雄ID */
        export enum enum_HeroID {
            antimage = 1,
            axe = 2,
            bane = 3,
            bloodseeker = 4,
            crystal_maiden = 5,
            drow_ranger = 6,
            earthshaker = 7,
            juggernaut = 8,
            mirana = 9,
            nevermore = 11,
            morphling = 10,
            phantom_lancer = 12,
            puck = 13,
            pudge = 14,
            razor = 15,
            sand_king = 16,
            storm_spirit = 17,
            sven = 18,
            tiny = 19,
            vengefulspirit = 20,
            windrunner = 21,
            zuus = 22,
            kunkka = 23,
            lina = 25,
            lich = 31,
            lion = 26,
            shadow_shaman = 27,
            slardar = 28,
            tidehunter = 29,
            witch_doctor = 30,
            riki = 32,
            enigma = 33,
            tinker = 34,
            sniper = 35,
            necrolyte = 36,
            warlock = 37,
            beastmaster = 38,
            queenofpain = 39,
            venomancer = 40,
            faceless_void = 41,
            skeleton_king = 42,
            death_prophet = 43,
            phantom_assassin = 44,
            pugna = 45,
            templar_assassin = 46,
            viper = 47,
            luna = 48,
            dragon_knight = 49,
            dazzle = 50,
            rattletrap = 51,
            leshrac = 52,
            furion = 53,
            life_stealer = 54,
            dark_seer = 55,
            clinkz = 56,
            omniknight = 57,
            enchantress = 58,
            huskar = 59,
            night_stalker = 60,
            broodmother = 61,
            bounty_hunter = 62,
            weaver = 63,
            jakiro = 64,
            batrider = 65,
            chen = 66,
            spectre = 67,
            doom_bringer = 69,
            ancient_apparition = 68,
            ursa = 70,
            spirit_breaker = 71,
            gyrocopter = 72,
            alchemist = 73,
            invoker = 74,
            silencer = 75,
            obsidian_destroyer = 76,
            lycan = 77,
            brewmaster = 78,
            shadow_demon = 79,
            lone_druid = 80,
            chaos_knight = 81,
            meepo = 82,
            treant = 83,
            ogre_magi = 84,
            undying = 85,
            rubick = 86,
            disruptor = 87,
            nyx_assassin = 88,
            naga_siren = 89,
            keeper_of_the_light = 90,
            wisp = 91,
            visage = 92,
            slark = 93,
            medusa = 94,
            troll_warlord = 95,
            centaur = 96,
            magnataur = 97,
            shredder = 98,
            bristleback = 99,
            tusk = 100,
            skywrath_mage = 101,
            abaddon = 102,
            elder_titan = 103,
            legion_commander = 104,
            ember_spirit = 106,
            earth_spirit = 107,
            terrorblade = 109,
            phoenix = 110,
            oracle = 111,
            techies = 105,
            target_dummy = 127,
            winter_wyvern = 112,
            arc_warden = 113,
            abyssal_underlord = 108,
            monkey_king = 114,
            pangolier = 120,
            dark_willow = 119,
            grimstroke = 121,
            mars = 129,
            void_spirit = 126,
            snapfire = 128,
            hoodwink = 123,
            dawnbreaker = 135,
        }
        /**dota 自带buff */
        export enum EReserveModifierName {
            /**无敌BUFF */
            modifier_invulnerable = "modifier_invulnerable",
            /**泉水回血 */
            modifier_fountain_aura = "modifier_fountain_aura",
            /**泉水真实视野 */
            modifier_fountain_truesight_aura = "modifier_fountain_truesight_aura",
            /**泉水被动 */
            modifier_fountain_passive = "modifier_fountain_passive",
            /**塔真实视野 */
            modifier_tower_truesight_aura = "modifier_tower_truesight_aura",
            /**塔增加护甲BUFF */
            modifier_tower_aura = "modifier_tower_aura",
            /**多血条BUFF */
            modifier_many_hp_bar = "modifier_many_hp_bar",
        }


        export enum EDotaItemSlot {
            DOTA_ITEM_SLOT_MIN = 0,
            DOTA_ITEM_SLOT_MAX = 5,
            DOTA_ITEM_BACKPACK_MIN = 6,
            DOTA_ITEM_BACKPACK_MAX = 8,
            DOTA_ITEM_STASH_MIN = 9,
            DOTA_ITEM_STASH_MAX = 14,
        }
    }


}
