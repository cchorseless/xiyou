import { GameServiceConfig } from "../GameServiceConfig";
import { GEventHelper } from "./GEventHelper";


export const serializeETProps = (params: string | null = null) =>
    (target: ET.Entity, attr: string) => {
        //#region LUA
        if (!_CODE_IN_LUA_) { return }
        // 处理属性
        if (target.SerializeETProps == null) {
            (target.SerializeETProps as any) = [];
        }
        if (params != null) {
            attr = params;
        }
        target.SerializeETProps.push(attr);
        //#endregion LUA
    };
export const serializeDomainProps = (params: string | null = null) =>
    (target: ET.IEntityRoot, attr: string) => {
        //#region LUA
        if (!_CODE_IN_LUA_) { return }
        // 处理属性
        if (target.SerializeDomainProps == null) {
            target.SerializeDomainProps = [];
        }
        if (params != null) {
            attr = params;
        }
        target.SerializeDomainProps.push(attr);
        //#endregion LUA
    };

export module ET {
    interface IEntityFunc {
        /**初始化 */
        onAwake?(...args: any[]): void;
        /**移除 */
        onRemove?(): void;
        /**反序列化后 */
        onSerializeToEntity?(): void;
        /**重载组件 */
        onReload?(): void;
        /**销毁前 */
        onDestroy?(): void;
    }

    export interface IEntityRoot {
        ETRoot?: EntityRoot;
        SerializeDomainProps?: string[];
    }

    export class EntitySystem {
        private static AllEntity: { [instanceId: string]: Entity } = {};
        private static AllTypeEntity: { [typename: string]: Entity[] } = {};
        static RegisterSystem(entity: Entity, b: boolean) {
            const typekey = entity.GetType();
            if (b) {
                if (entity.InstanceId == null || EntitySystem.AllEntity[entity.InstanceId] != null) {
                    GLogHelper.error("RegisterSystem error");
                }
                EntitySystem.AllEntity[entity.InstanceId] = entity;
                EntitySystem.AllTypeEntity[typekey] = EntitySystem.AllTypeEntity[typekey] || [];
                EntitySystem.AllTypeEntity[typekey].push(entity);
                if (entity.IsComponent) {
                    let comp = entity as Component;
                    if (comp.IsSingleton) {
                        (GGetRegClass(comp.constructor.name) as typeof SingletonComponent)._instance_ = comp;
                    }
                }
            } else {
                if (entity.InstanceId == null || EntitySystem.AllEntity[entity.InstanceId] == null) {
                    GLogHelper.error("UnRegisterSystem error");
                }
                delete EntitySystem.AllEntity[entity.InstanceId];
                if (EntitySystem.AllTypeEntity[typekey]) {
                    const typelist = EntitySystem.AllTypeEntity[typekey];
                    if (typelist) {
                        const index = typelist.indexOf(entity);
                        if (index > -1) {
                            typelist.splice(index, 1)
                        }
                    }
                }
                if (entity.IsComponent) {
                    let comp = entity as Component;
                    if (comp.IsSingleton) {
                        (GGetRegClass(comp.constructor.name) as typeof SingletonComponent)._instance_ = null as any;
                    }
                }
            }

        }

        static GetEntity(instanceId: string) {
            return EntitySystem.AllEntity[instanceId];
        }
        /**
        * 获取一个单例
        * @returns
        */
        public static GetInstance<T extends typeof Entity>(typename: string, playerid: PlayerID): InstanceType<T> {
            const typeList: Entity[] = (EntitySystem.AllTypeEntity[typename] || []).filter(instance => { return instance.BelongPlayerid == playerid });;
            if (typeList.length !== 1 || typeList[0].IsDisposed()) {
                return null as InstanceType<T>;
            }
            return typeList[0] as InstanceType<T>;
        }

        /**
        * 获取一组
        * @returns
        */
        public static GetInstances<T extends typeof Entity>(typename: string, playerid: PlayerID): InstanceType<T>[] {
            const typeList: Entity[] = (EntitySystem.AllTypeEntity[typename] || []).filter(instance => { return instance.BelongPlayerid == playerid });;
            if (typeList.length == 0) {
                GLogHelper.error(typename + " is not a Muti instance");
            }
            return typeList as InstanceType<T>[];
        }

        public static GetAllInstances<T extends typeof Entity>(typename: string): InstanceType<T>[] {
            const typeList: Entity[] = (EntitySystem.AllTypeEntity[typename] || []);
            let rlist: InstanceType<T>[] = [];
            rlist = rlist.concat(typeList as any[]);
            return rlist;
        }

        static Awake(entity: Entity, ...args: any[]) {
            entity.onAwake && entity.onAwake(...args);
        }

        static SerializeToEntity(entity: Entity) {
            entity.onSerializeToEntity && entity.onSerializeToEntity();
        }
        static Destroy(entity: Entity) {
            entity.onDestroy && entity.onDestroy();
        }
    }

    export class EntityRef<T>{
        get Ref(): T {
            return this._Ref;
        }
        private _Ref: T
        constructor(ref: T) {
            this._Ref = ref;
        }
    }
    export class Entity implements IEntityFunc {
        public readonly InstanceId: string;
        public readonly Id: string;
        public readonly P_InstanceId: string;
        /**绑定实体同步的属性 */
        public readonly D_Props: { [K: string]: any };
        public readonly BelongPlayerid: PlayerID = -1;
        public readonly IsRegister: boolean = false;
        public readonly IsComponent: boolean = false;
        public readonly Parent: Entity;
        public readonly Domain: IEntityRoot;
        public readonly Children: { [uuid: string]: Entity };
        public readonly Components: { [name: string]: Component };
        public readonly SerializeETProps: string[];
        public readonly IsSerializeEntity: boolean = false;
        public get updateEventName() {
            return "updateEntity_" + this.InstanceId;
        }
        onSerializeToEntity?(): void;
        /**初始化 */
        onAwake?(...args: any[]): void;
        /**重载组件 */
        onReload?(): void;
        onRemove?(): void;
        onDestroy?(): void;

        /** 函数组件使用 */
        public HookRef() {
            // const { useState, useEffect } = require("react")
            // const [v, setValue] = useState({ Ref: this });
            // const hander = GHandler.create(this, () => {
            //     setValue({ Ref: this });
            // });
            // useEffect(() => {
            //     GEventHelper.AddEvent(this.updateEventName, hander, null, true);
            //     return () => { hander._id > 0 && GEventHelper.RemoveCaller(this, hander) };
            // }, [v])
            // return v.Ref;
        }
        private _Ref: EntityRef<this>;
        public Ref(v: boolean = false) {
            if (!this._Ref || v) {
                this._Ref = new EntityRef(this);
            }
            return { [this.InstanceId]: this._Ref };
        }

        public RegRef(content: any & { UpdateState: (o: any) => void }) {
            const entity = this;
            content.UpdateState(entity.Ref());
            GEventHelper.AddEvent(this.updateEventName,
                GHandler.create(content, () => {
                    content && content.setState(entity.Ref(true));
                })
            )
        }

        public IsBelongLocalPlayer() {
            if (_CODE_IN_LUA_) { return true }
            if (this.BelongPlayerid != null) {
                return this.BelongPlayerid < 0 || this.BelongPlayerid == Players.GetLocalPlayer();
            }
            GLogHelper.error(this.GetType() + " cant find BelongPlayerid")
        }

        public get FixBelongPlayerid() {
            if (_CODE_IN_LUA_) { return 0 }
            if (this.BelongPlayerid == null) {
                GLogHelper.error(this.GetType() + " cant find BelongPlayerid")
            }
            if (this.BelongPlayerid < 0) {
                return Players.GetLocalPlayer();
            }
            return this.BelongPlayerid;
        }

        public SyncClient(ignoreChild: boolean = false, isShare: boolean = false) {
            //#region LUA
            if (!_CODE_IN_LUA_) { return };
            if (this.BelongPlayerid == -1) {
                (GGameScene as any).SyncClientEntity(this, ignoreChild);
            }
            else {
                const playerroot = GGameScene.GetPlayer(this.BelongPlayerid) as any;
                playerroot.SyncClientEntity(this, ignoreChild, isShare);
            }
            //#endregion LUA
        }


        /**
         * 获取一个单例
         * @returns
         */
        public static GetOneInstance<T extends typeof Entity>(this: T, playerid: PlayerID): InstanceType<T> {
            return EntitySystem.GetInstance(this.name, playerid)
        }

        /**
         * 获取一组
         * @returns
         */
        public static GetGroupInstance<T extends typeof Entity>(this: T, playerid: PlayerID): InstanceType<T>[] {
            return EntitySystem.GetInstances(this.name, playerid)
        }

        public static GetAllInstance<T extends typeof Entity>(this: T): InstanceType<T>[] {
            return EntitySystem.GetAllInstances(this.name)
        }

        public toJsonPartObject(props: string[]) {
            let obj: IEntityJson = {
                _t: this.GetType(),
                _id: this.Id,
                BelongPlayerid: this.BelongPlayerid,
            };
            if (this.SerializeETProps != null) {
                for (let k of this.SerializeETProps) {
                    if (props.includes(k)) {
                        obj[k] = GameServiceConfig.TryEncodeData((this as any)[k]);
                    }
                }
            }
            if (this.Domain.SerializeDomainProps != null) {
                obj._d_props = {};
                for (let k of this.Domain.SerializeDomainProps) {
                    if (props.includes(k)) {
                        obj._d_props[k] = GameServiceConfig.TryEncodeData((this.Domain as any)[k]);
                    }
                }
            }
            return obj;
        }
        public toJsonObject(ignoreChild: boolean = false) {
            let obj: IEntityJson = {
                _t: this.GetType(),
                _id: this.Id,
                BelongPlayerid: this.BelongPlayerid,
            };
            if (this.SerializeETProps != null) {
                for (let k of this.SerializeETProps) {
                    obj[k] = GameServiceConfig.TryEncodeData((this as any)[k]);
                }
            }
            if (this.Domain.SerializeDomainProps != null) {
                obj._d_props = {};
                for (let k of this.Domain.SerializeDomainProps) {
                    obj._d_props[k] = GameServiceConfig.TryEncodeData((this.Domain as any)[k]);
                }
            }
            if (!ignoreChild) {
                if (this.Children != null) {
                    obj.Children = {};
                    for (let k in this.Children) {
                        if (this.Children[k].IsSerializeEntity) {
                            obj.Children[k] = this.Children[k].toJsonObject()!;
                        }
                    }
                }
                if (this.Components != null) {
                    obj.C = {};
                    for (let k in this.Components) {
                        if (this.Components[k].IsSerializeEntity) {
                            obj.C[k] = this.Components[k].toJsonObject();
                        }
                    }
                }
            }
            return obj;
        }
        public updateFromJson(json: IEntityJson) {
            let ignoreKey = ["_t", "_id", "Children", "C", "_p_instanceid", "_d_props"];
            for (let k in json) {
                if (ignoreKey.indexOf(k) == -1) {
                    (this as any)[k] = GameServiceConfig.TryDecodeData(json[k]);
                }
            }
            if (json._p_instanceid != null) {
                (this.P_InstanceId as any) = json._p_instanceid;
            }
            if (json._d_props != null) {
                (this.D_Props as any) = json._d_props;
            }
            if (json.Children) {
                let _childs = Object.values(json.Children);
                if (this.Children != null) {
                    let keys = Object.keys(this.Children);
                    for (let k of keys) {
                        let isdrop = true;
                        for (let _child of _childs) {
                            if (k == _child._id) {
                                this.GetChild(k)?.updateFromJson(_child);
                                isdrop = false;
                                break;
                            }
                        }
                        if (isdrop) {
                            // this.Children[k]?.RemoveSelf();
                        }
                    }
                }
                for (let info of _childs) {
                    if (this.GetChild(info._id) == null) {
                        let entity = Entity.FromJson(info);
                        if (this.IsRegister) {
                            this.AddOneChild(entity);
                        }
                        else {
                            (entity.Parent as any) = this;
                            this.AddToChildren(entity);
                        }
                        if (this.BelongPlayerid != null) {
                            (entity.BelongPlayerid as any) = this.BelongPlayerid;
                        }
                    }
                }
            }
            if (json.C) {
                if (this.Components != null) {
                    let keys = Object.keys(this.Components);
                    for (let k of keys) {
                        let isdrop = true;
                        for (let compname in json.C) {
                            let _child = json.C[compname];
                            if (k == _child._t) {
                                this.Components[k]?.updateFromJson(_child);
                                isdrop = false;
                                break;
                            }
                        }
                        if (isdrop) {
                            // this.Components[k]?.RemoveSelf();
                        }
                    }
                }
                for (let k in json.C) {
                    let info = json.C[k];
                    if (this.Components == null || this.Components[info._t] == null) {
                        let entity = Entity.FromJson(info);
                        if (this.IsRegister) {
                            this.AddOneComponent(entity as any);
                        } else {
                            (entity.Parent as any) = this;
                            this.AddToComponents(entity as any);
                        }
                        if (this.BelongPlayerid != null) {
                            (entity.BelongPlayerid as any) = this.BelongPlayerid;
                        }
                    }
                }
            }
        }
        static FromJson(json: IEntityJson) {
            let entity = EntitySystem.GetEntity(json._id + json._t);
            if (entity != null) {
                entity.updateFromJson(json);
                if (entity.onReload) {
                    entity.onReload();
                }
                GEventHelper.FireEvent(entity.updateEventName, null, null, this);
                return entity;
            }
            let type: typeof Entity = GGetRegClass(json._t);
            if (type == null) {
                GLogHelper.error("cant find class" + json._t);
            }
            entity = EntitySystem.GetEntity(json._id + json._t);
            if (entity == null) {
                entity = Entity.Create(type);
                (entity.Id as any) = json._id;
                entity.setDomain(GameSceneRoot.GetInstance());
            }
            // 这里先创建注册然后SerializeToEntity，所以getinstance 比 getcomponent 更早拿到实体
            entity.updateFromJson(json);
            EntitySystem.SerializeToEntity(entity);
            return entity;
        }

        static UpdateFromJson(json: IEntityJson) {
            let entity = EntitySystem.GetEntity(json._id + json._t);
            if (entity == null) {
                GLogHelper.error("cant find entity to update");
            }
            entity.updateFromJson(json);
            return entity;
        }



        public GetType() {
            return this.constructor.name;
        }

        public GetD_Props<P>() {
            return (this.D_Props || {}) as P;
        }
        public IsDisposed() {
            return this.InstanceId == "0";
        }
        protected setRegister(value: boolean) {
            if (this.IsRegister == value) {
                return;
            }
            (this.IsRegister as any) = value;
            EntitySystem.RegisterSystem(this, value);
        }

        protected setParent(value: Entity) {
            if (value == null) {
                GLogHelper.error("cant set parent null:" + this.constructor.name);
            }

            if (value == this) {
                GLogHelper.error("cant set parent self:" + this.constructor.name);
            }

            // 严格限制parent必须要有domain,也就是说parent必须在数据树上面
            if (value.Domain == null) {
                GLogHelper.error("cant set parent because parent domain is null: {this.GetType().Name} {value.GetType().Name}");
            }

            if (this.Parent != null) {
                // 之前有parent
                // parent相同，不设置
                if (this.Parent == value) {
                    GLogHelper.error("重复设置了Parent: {this.GetType().Name} parent: {this.parent.GetType().Name}");
                    return;
                }
                if (this.IsComponent) {
                    this.Parent.RemoveFromComponents(this as any as Component);
                } else {
                    this.Parent.RemoveFromChildren(this);
                }
            }

            (this.Parent as any) = value;
            (this.BelongPlayerid as any) = this.Parent.BelongPlayerid;
            if (this.IsComponent) {
                this.Parent.AddToComponents(this as any as Component);
            } else {
                this.Parent.AddToChildren(this);
            }
            this.setDomain(this.Parent.Domain);
        }

        public GetParent<T extends Entity>(): T {
            return this.Parent as T;
        }

        public GetDomain<T extends IEntityRoot>(): T {
            return this.Domain as T;
        }

        protected setDomain(value: IEntityRoot) {
            if (value == null) {
                GLogHelper.error("domain cant set null: {this.GetType().Name}");
            }

            if (this.Domain == value) {
                return;
            }

            let preDomain = this.Domain;
            (this.Domain as any) = value;
            if (preDomain == null) {
                (this.InstanceId as any) = this.Id + this.GetType();
                this.setRegister(true);
            }

            // 递归设置孩子的Domain
            if (this.Children != null) {
                for (let k in this.Children) {
                    this.Children[k].setDomain(this.Domain);
                }
            }

            if (this.Components != null) {
                for (let k in this.Components) {
                    this.Components[k].setDomain(this.Domain);
                }
            }
        }
        AddToChildren(entity: Entity) {
            if (this.Children == null) {
                (this.Children as any) = {};
            }
            this.Children[entity.Id] = entity;
        }

        private RemoveFromChildren(entity: Entity) {
            if (this.Children == null) {
                return;
            }
            delete this.Children[entity.Id];
            if (Object.keys(this.Children).length == 0) {
                (this.Children as any) = null;
            }
        }
        public RemoveSelf() {
            this.onRemove && this.onRemove();
            if (this.Parent != null && !this.Parent.IsDisposed()) {
                if (this.IsComponent) {
                    this.Parent.RemoveFromComponents(this as any);
                } else {
                    this.Parent.RemoveFromChildren(this);
                }
            }
            (this.Parent as any) = null;
            // TimerHelper.AddTimer(
            //     30,
            //     GHandler.create(this, () => {
            //         this.Dispose();
            //     })
            // );
        }
        public Dispose() {
            if (this.IsDisposed()) {
                return;
            }
            this.setRegister(false);
            GEventHelper.RemoveCaller(this);
            GTimerHelper.ClearAll(this);
            (this.InstanceId as any) = "0";
            // 清理Component
            if (this.Components != null) {
                for (let kv in this.Components) {
                    this.Components[kv].Dispose();
                }
                (this.Components as any) = null;
            }

            // 清理Children
            if (this.Children != null) {
                for (let kv in this.Children) {
                    this.Children[kv].Dispose();
                }
                (this.Children as any) = null;
            }

            // 触发Destroy事件
            EntitySystem.Destroy(this);

            (this.Domain as any) = null;

            if (this.Parent != null && !this.Parent.IsDisposed()) {
                if (this.IsComponent) {
                    this.Parent.RemoveComponent(this as any);
                } else {
                    this.Parent.RemoveFromChildren(this);
                }
            }

            (this.Parent as any) = null;
        }

        AddToComponents(component: Component) {
            if (this.Components == null) {
                (this.Components as any) = {};
            }
            if (this.Components[component.GetType()]) {
                GLogHelper.error("the same Component ");
                this.Components[component.GetType()].Dispose();
            }
            this.Components[component.GetType()] = component;
        }

        private RemoveFromComponents(component: Component) {
            if (this.Components == null) {
                return;
            }
            delete this.Components[component.GetType()];
            if (Object.keys(this.Components).length == 0) {
                (this.Components as any) = null;
            }
        }

        public GetChild<K extends Entity>(id: string): K | null {
            if (this.Children == null) {
                return null;
            }
            return this.Children[id] as K;
        }

        public GetChilds<K extends typeof Entity>(type: K): InstanceType<K>[] {
            let r: InstanceType<K>[] = [];
            if (this.Children == null) {
                return r;
            }
            for (let k in this.Children) {
                if (this.Children[k].GetType() == type.name) {
                    r.push(this.Children[k] as InstanceType<K>);
                }
            }
            return r;
        }

        public RemoveComponent(type: typeof Component) {
            if (this.IsDisposed()) {
                return;
            }
            if (this.Components == null) {
                return;
            }
            let c = this.GetComponent(type);
            if (c == null) {
                return;
            }
            this.RemoveFromComponents(c);
            c.Dispose();
        }

        public RemoveOneComponent(component: Component) {
            if (this.IsDisposed()) {
                return;
            }

            if (this.Components == null) {
                return;
            }
            let c = this.Components[component.GetType()];
            if (c == null) {
                return;
            }

            if (c.InstanceId != component.InstanceId) {
                return;
            }

            this.RemoveFromComponents(c);
            c.Dispose();
        }

        public GetComponent<K extends typeof Component>(type: K) {
            if (this.Components == null) {
                return null;
            }
            return this.Components[type.name] as InstanceType<K>;
        }
        public GetComponentByName<K extends Component>(str: string) {
            if (this.Components == null) {
                return null;
            }
            return this.Components[str] as K;
        }
        public static Create<K extends typeof Entity>(type: K) {
            let component = new type();
            (component.Id as any) = GGenerateUUID();
            return component as InstanceType<K>;
        }
        public static CreateOne<K extends typeof Entity>(this: K) {
            let component = new this();
            (component.Id as any) = GGenerateUUID();
            return component as InstanceType<K>;
        }

        public AddOneComponent(component: Component) {
            let type = component.GetType();
            if (this.Components != null && this.Components[type] != null) {
                GLogHelper.error("entity already has component: {type.FullName}");
            }
            component.setParent(this);
            return component;
        }

        public AddComponent<K extends typeof Component>(type: K, ...args: any[]) {
            if (this.Components != null && this.Components[type.name] != null) {
                GLogHelper.error("entity already has component: {type.FullName}");
            }
            let component = Entity.Create(type) as InstanceType<K>;
            (component.Id as any) = this.Id;
            component.setParent(this);
            args = args || [];
            EntitySystem.Awake(component, ...args);

            return component;
        }

        public AddOneChild(entity: Entity) {
            entity.setParent(this);
            return entity;
        }

        public AddChild<T extends typeof Entity>(type: T, ...args: any[]) {
            let component = Entity.Create(type);
            component.setParent(this);
            args = args || [];
            EntitySystem.Awake(component, ...args);
            return component;
        }

        public AddChildWithId<T extends typeof Entity>(type: T, id: string, ...args: any[]) {
            let component = Entity.Create(type);
            (component.Id as any) = id;
            component.setParent(this);
            args = args || [];
            EntitySystem.Awake(component, ...args);
            return component;
        }
    }
    export class Component extends Entity {
        public readonly IsComponent: boolean = true;
        public readonly IsSingleton: boolean = false;

    }
    export class SingletonComponent extends Component {
        public static _instance_: SingletonComponent | null;
        public readonly IsSingleton: boolean = true;
        /**
         * 获取一个单例
         * @returns
         */
        public static GetInstance<T extends typeof SingletonComponent>(this: T): InstanceType<T> {
            if (!this._instance_ || this._instance_.IsDisposed()) {
                GLogHelper.warn(this.constructor.name + " is not a SingletonComponent");
            }
            return this._instance_ as InstanceType<T>;
        }
    }


    export class EntityRoot extends Entity {

        public readonly BelongPlayerid: PlayerID = -1;
        public readonly DomainParent: EntityRoot;
        public readonly DomainChildren: { [uuid: string]: EntityRoot };
        public readonly PreAwakeArgs: { [uuid: string]: any[] };
        constructor(etroot: IEntityRoot = null as any) {
            super();
            (this.Id as any) = GGenerateUUID();
            (this.Parent as any) = this;
            if (etroot) {
                this.setDomain(etroot);
            }
        }

        static Active<T extends typeof EntityRoot>(this: T, etroot: IEntityRoot, ...args: any[]) {
            if (etroot.ETRoot == null) {
                etroot.ETRoot = new this(etroot);
                etroot.ETRoot.onAwake(...args);
            }
        }

        public As<T extends EntityRoot>() {
            return this as any as T;
        }

        public AsValid<T extends EntityRoot>(str: string) {
            return this.GetType() === str;
        }

        public onAwake(...args: any[]) { }
        public Active(etroot: IEntityRoot) {
            if (this.Domain != null) {
                return;
            }
            if (etroot.ETRoot == null) {
                this.setDomain(etroot);
                etroot.ETRoot = this;
                if (this.PreAwakeArgs) {
                    for (let k in this.PreAwakeArgs) {
                        let unawake = EntitySystem.GetEntity(k);
                        if (unawake != null) {
                            EntitySystem.Awake(unawake, ...this.PreAwakeArgs[k]);
                        }
                    }
                }
                (this.PreAwakeArgs as any) = null;
                this.onAwake();
            } else {
                GLogHelper.error("cant active");
            }
        }

        public AddPreAwakeComponent<K extends typeof Component>(type: K, ...args: any[]) {
            if (this.Components != null && this.Components[type.name] != null) {
                GLogHelper.error("entity already has component: {type.FullName}");
            }
            let component = Entity.Create(type) as InstanceType<K>;
            if (!component.IsComponent) {
                GLogHelper.error("is not component: " + type.name);
            }
            (component.Id as any) = this.Id;
            (component.Parent as any) = this;
            this.AddToComponents(component as Component);
            if (this.PreAwakeArgs == null) {
                (this.PreAwakeArgs as any) = {};
            }
            this.PreAwakeArgs[component.Id + component.GetType()] = args;
            return component;
        }
        public AddPreAwakeChild<T extends typeof Entity>(type: T, ...args: any[]) {
            let component = Entity.Create(type);
            (component.Parent as any) = this;
            this.AddToChildren(component as Component);
            if (this.PreAwakeArgs == null) {
                (this.PreAwakeArgs as any) = {};
            }
            this.PreAwakeArgs[component.Id + component.GetType()] = args;
            return component;
        }

        public GetDomainChild<T extends EntityRoot>(id: string) {
            return this.DomainChildren[id] as T;
        }
        public GetDomainChilds<K extends typeof EntityRoot>(type: K): InstanceType<K>[] {
            let r: InstanceType<K>[] = [];
            if (this.DomainChildren == null) {
                return r;
            }
            for (let k in this.DomainChildren) {
                if (this.DomainChildren[k].GetType() == type.name) {
                    r.push(this.DomainChildren[k] as InstanceType<K>);
                }
            }
            return r;
        }
        public GetDomainChildComponents<K extends typeof Component>(type: K): InstanceType<K>[] {
            let r: InstanceType<K>[] = [];
            if (this.DomainChildren == null) {
                return r;
            }
            for (let k in this.DomainChildren) {
                let comp = this.DomainChildren[k].GetComponent(type);
                if (comp != null) {
                    r.push(comp);
                }
            }
            return r;
        }

        public AddDomainChild(_entityRoot: EntityRoot) {
            if (_entityRoot.DomainParent != null) {
                _entityRoot.DomainParent.removeDomainChildren(_entityRoot);
            }
            _entityRoot.setDomainParent(this);
        }
        public RemoveDomainChild(_entityRoot: EntityRoot) {
            if (_entityRoot.DomainParent != this) {
                return;
            }
            this.removeDomainChildren(_entityRoot);
        }


        private setDomainParent(_domainParent: EntityRoot) {
            if (this.DomainParent != null) {
                GLogHelper.error("setDomainParent error");
            }
            (this.DomainParent as any) = _domainParent;
            (this.BelongPlayerid as any) = (this.DomainParent as any).BelongPlayerid;
            _domainParent.addDomainChildren(this);
        }
        private addDomainChildren(child: EntityRoot) {
            if (this.DomainChildren == null) {
                (this.DomainChildren as any) = {};
            }
            this.DomainChildren[child.Id] = child;
        }
        private removeDomainChildren(child: EntityRoot) {
            if (this.DomainChildren == null) {
                return;
            }
            delete this.DomainChildren[child.Id];
            (child.DomainParent as any) = null;
            if (Object.keys(this.DomainChildren).length == 0) {
                (this.DomainChildren as any) = null;
            }
        }
        public Dispose(): void {
            if (this.DomainChildren != null) {
                for (let key in this.DomainChildren) {
                    this.DomainChildren[key].Dispose();
                }
                (this.DomainChildren as any) = null;
            }
            super.Dispose();
            if (this.DomainParent != null && !this.DomainParent.IsDisposed()) {
                this.DomainParent.removeDomainChildren(this);
                (this.DomainParent as any) = null;
            }
        }
    }

    export class GameSceneRoot extends EntityRoot {
        private static Instance: GameSceneRoot;
        ETRoot?: EntityRoot | undefined;
        constructor() {
            super();
            (this.Id as any) = GGenerateUUID();
            (this.Parent as any) = this;
            this.ETRoot = this;
            this.setDomain(this);
        }
        static GetInstance() {
            if (GameSceneRoot.Instance == null) {
                GameSceneRoot.Instance = new GameSceneRoot();
            }
            return GameSceneRoot.Instance;
        }
    }
}
