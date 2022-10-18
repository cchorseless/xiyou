import { GetRegClass, reloadable } from "../../GameCache";
import { GameFunc } from "../../GameFunc";
import { LogHelper } from "../../helper/LogHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { PlayerEntityRoot } from "../Components/Player/PlayerEntityRoot";


export const serializeETProps =
    (params: string = null) =>
        (target: ET.Entity, attr: string) => {
            // 处理属性
            if (target.SerializeETProps == null) {
                (target as any).SerializeETProps = [];
            }
            if (params != null) {
                attr = params;
            }
            target.SerializeETProps.push(attr);
        };
export const serializeDomainProps =
    (params: string = null) =>
        (target: ET.IEntityRoot, attr: string) => {
            // 处理属性
            if (target.SerializeDomainProps == null) {
                target.SerializeDomainProps = [];
            }
            if (params != null) {
                attr = params;
            }
            target.SerializeDomainProps.push(attr);
        };

export module ET {
    export interface IEntityJson {
        _t: string;
        _id: string;
        _p_instanceid?: string;
        _nettable?: string;
        Children?: { [k: string]: IEntityJson };
        C?: { [k: string]: IEntityJson };
        [K: string]: any;
    }
    export interface IETEntityJson {
        _t: string;
        _id: string;
        Children?: IETEntityJson[];
        C?: IETEntityJson[];
        [K: string]: any;
    }

    interface IEntityProperty {
        InstanceId: string;
        Id: string;
        IsRegister: boolean;
        Parent: Entity;
        Domain: IEntityRoot;
        Children: { [K: string]: Entity };
        Components: { [K: string]: Component };
    }

    interface IEntityFunc {
        /**初始化 */
        onAwake?(...args: any[]): void;
        /**重载组件 */
        onReload?(): void;
        /**帧刷新 */
        onUpdate?(): void;
        /**销毁前 */
        onDestroy?(): void;
    }

    export interface IEntityRoot {
        ETRoot?: EntityRoot;
        SerializeDomainProps?: string[];
    }

    export class Handler {
        private static _pool: Handler[] = [];
        private static _gid: number = 0;
        public _id = Handler._gid++;
        public caller: any;
        public method: any;
        public args: any[];
        public once: boolean;
        constructor() {
            this.once = false;
            this._id = 0;
            this.setTo(null, null, null);
        }
        setTo(caller: any, method: any, args: any[], once = true) {
            this._id = Handler._gid++;
            this.caller = caller;
            this.method = method;
            this.args = args;
            this.once = once;
            return this;
        }
        run() {
            if (this.method == null) return null;
            let id = this._id;
            let [status, nextCall] = xpcall(
                this.method,
                (msg: any) => {
                    return "\n" + LogHelper.traceFunc(msg) + "\n";
                },
                this.caller
            );
            if (!status) {
                LogHelper.error(nextCall);
            }
            this._id === id && this.once && this.recover();
            return nextCall;
        }
        runWith(data: any[]) {
            if (this.method == null) return null;
            let id = this._id;
            let arg: any[] = [];
            if (this.args) {
                arg = arg.concat(this.args);
            }
            if (data) {
                arg = arg.concat(data);
            }
            let [status, nextCall] = xpcall(
                this.method,
                (msg: any) => {
                    return "\n" + LogHelper.traceFunc(msg) + "\n";
                },
                this.caller,
                ...arg
            );
            if (!status) {
                LogHelper.error(nextCall);
            }
            this._id === id && this.once && this.recover();
            return nextCall;
        }
        clear() {
            this.caller = null;
            this.method = null;
            this.args = null;
            return this;
        }
        recover() {
            if (this._id > 0) {
                this._id = 0;
                Handler._pool.push(this.clear());
            }
        }
        static create(caller: any, method: any, args: any[] = null, once = true) {
            if (Handler._pool.length > 0) return Handler._pool.pop().setTo(caller, method, args, once);
            return new Handler().setTo(caller, method, args, once);
        }
    }

    export class EntityEventSystem {
        public static AllEntity: { [instanceId: string]: Entity } = {};
        static RegisterSystem(entity: Entity, b: boolean) {
            if (b) {
                if (entity.InstanceId == null || EntityEventSystem.AllEntity[entity.InstanceId] != null) {
                    throw new Error("RegisterSystem error");
                }
                EntityEventSystem.AllEntity[entity.InstanceId] = entity;
            } else {
                if (entity.InstanceId == null || EntityEventSystem.AllEntity[entity.InstanceId] == null) {
                    throw new Error("UnRegisterSystem error");
                }
                delete EntityEventSystem.AllEntity[entity.InstanceId];
            }
        }

        static GetEntity(instanceId: string) {
            return EntityEventSystem.AllEntity[instanceId];
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

    export class Entity implements IEntityFunc {
        public readonly InstanceId: string;
        public readonly Id: string;
        public readonly IsRegister: boolean = false;
        public readonly IsComponent: boolean = false;
        public readonly Parent: Entity;
        public readonly Domain: IEntityRoot;
        public readonly Children: { [uuid: string]: Entity };
        public readonly Components: { [name: string]: Component };
        public readonly SerializeETProps: string[];
        public readonly IsSerializeEntity: boolean = false;

        /**初始化 */
        onAwake?(...args: any[]): void;
        /**重载组件 */
        onReload?(): void;
        /**每一帧刷新 */
        onUpdate?(): void;
        onDestroy?(): void;
        onSerializeToEntity?(): void;

        public toJsonPartObject(props: string[]) {
            let obj: IEntityJson = {} as any;
            obj._t = this.GetType();
            obj._id = this.Id;
            if (this.SerializeETProps != null) {
                for (let k of this.SerializeETProps) {
                    if (props.includes(k)) {
                        obj[k] = (this as any)[k];
                    }
                }
            }
            if (this.Domain.SerializeDomainProps != null) {
                for (let k of this.Domain.SerializeDomainProps) {
                    if (props.includes(k)) {
                        obj[k] = (this.Domain as any)[k];
                    }
                }
            }
            return obj;
        }
        public toJsonObject(ignoreChild: boolean = false) {
            let obj: IEntityJson = {} as any;
            obj._t = this.GetType();
            obj._id = this.Id;
            if (this.SerializeETProps != null) {
                for (let k of this.SerializeETProps) {
                    obj[k] = (this as any)[k];
                }
            }
            if (this.Domain.SerializeDomainProps != null) {
                for (let k of this.Domain.SerializeDomainProps) {
                    obj[k] = (this.Domain as any)[k];
                }
            }
            if (!ignoreChild) {
                if (this.Children != null) {
                    obj.Children = {} as any;
                    for (let k in this.Children) {
                        if (this.Children[k].IsSerializeEntity) {
                            obj.Children[k] = this.Children[k].toJsonObject();
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
        public updateFromJson(json: IETEntityJson) {
            let ignoreKey = ["_t", "_id", "Children", "C"];
            for (let k in json) {
                if (ignoreKey.indexOf(k) == -1) {
                    (this as any)[k] = json[k];
                }
            }
            if (json.Children) {
                if (this.Children != null) {
                    let keys = Object.keys(this.Children);
                    for (let k of keys) {
                        let isdrop = true;
                        for (let _child of json.Children) {
                            if (k == _child._id) {
                                this.GetChild(k)!.updateFromJson(_child);
                                isdrop = false;
                                break;
                            }
                        }
                        if (isdrop) {
                            this.Children[k].Dispose();
                        }
                    }
                }
                for (let info of json.Children) {
                    if (this.GetChild(info._id) == null) {
                        let entity = Entity.FromJson(info);
                        if (this.IsRegister) {
                            this.AddOneChild(entity);
                        } else {
                            (entity as IEntityProperty).Parent = this;
                            this.AddToChildren(entity);
                        }
                    }
                }
            }
            if (json.C) {
                if (this.Components != null) {
                    let keys = Object.keys(this.Components);
                    for (let k of keys) {
                        let isdrop = true;
                        for (let _child of json.C) {
                            if (k == _child._t) {
                                this.Components[k].updateFromJson(_child);
                                isdrop = false;
                                break;
                            }
                        }
                        if (isdrop) {
                            this.Components[k].Dispose();
                        }
                    }
                }
                for (let info of json.C) {
                    if (this.Components == null || this.Components[info._t] == null) {
                        let entity = Entity.FromJson(info);
                        if (this.IsRegister) {
                            this.AddOneComponent(entity);
                        } else {
                            (entity as IEntityProperty).Parent = this;
                            this.AddToComponents(entity);
                        }
                    }
                }
            }
        }
        static FromJson(json: IETEntityJson) {
            let entity = EntityEventSystem.GetEntity(json._id + json._t);
            if (entity != null) {
                entity.updateFromJson(json);
                if (entity.onReload) {
                    entity.onReload();
                }
                return entity;
            }
            let type: typeof Entity = GetRegClass(json._t);
            if (type == null) {
                LogHelper.error("cant find class" + json._t);
                return;
            }
            entity = EntityEventSystem.GetEntity(json._id + json._t);
            if (entity == null) {
                entity = Entity.Create(type);
                (entity as IEntityProperty).Id = json._id;
                entity.setDomain(GameRules.Addon);
            }
            entity.updateFromJson(json);
            EntityEventSystem.SerializeToEntity(entity);
            return entity;
        }

        static UpdateFromJson(json: IETEntityJson) {
            let entity = EntityEventSystem.GetEntity(json._id + json._t);
            if (entity == null) {
                throw new Error("cant find entity to update");
            }
            entity.updateFromJson(json);
            return entity;
        }

        /**
         *开启服务器每帧刷新
         *@param frame 刷新帧数
         */
        public startServerUpdate(frame = 1) {
            if (this.IsRegister && IsServer()) {
                TimerHelper.addTimer(
                    0,
                    () => {
                        this.onUpdate();
                        if (this.IsRegister) {
                            return FrameTime() * frame;
                        }
                    },
                    this
                );
            }
        }
        /**
         *开启客户端每帧刷新
         *@param frame 刷新帧数
         */
        public startClientUpdate(frame = 1) {
            if (this.IsRegister && IsClient()) {
                TimerHelper.addTimer(
                    0,
                    () => {
                        this.onUpdate && this.onUpdate();
                        if (this.IsRegister) {
                            return GameRules.GetGameFrameTime() * frame;
                        }
                    },
                    this
                );
            }
        }

        public GetType() {
            return this.constructor.name;
        }
        public IsDisposed() {
            return this.InstanceId == "0";
        }
        protected setRegister(value: boolean) {
            if (this.IsRegister == value) {
                return;
            }
            (this as IEntityProperty).IsRegister = value;
            EntityEventSystem.RegisterSystem(this, value);
        }

        protected setParent(value: Entity) {
            if (value == null) {
                throw new Error("cant set parent null:" + this.constructor.name);
            }

            if (value == this) {
                throw new Error("cant set parent self:" + this.constructor.name);
            }

            // 严格限制parent必须要有domain,也就是说parent必须在数据树上面
            if (value.Domain == null) {
                throw new Error("cant set parent because parent domain is null: {this.GetType().Name} {value.GetType().Name}");
            }

            if (this.Parent != null) {
                // 之前有parent
                // parent相同，不设置
                if (this.Parent == value) {
                    LogHelper.error("重复设置了Parent: {this.GetType().Name} parent: {this.parent.GetType().Name}");
                    return;
                }
                if (this.IsComponent) {
                    this.Parent.RemoveFromComponents(this as Component);
                } else {
                    this.Parent.RemoveFromChildren(this);
                }
            }

            (this as IEntityProperty).Parent = value;
            if (this.IsComponent) {
                this.Parent.AddToComponents(this as Component);
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
                throw new Error("domain cant set null: {this.GetType().Name}");
            }

            if (this.Domain == value) {
                return;
            }

            let preDomain = this.Domain;
            (this as IEntityProperty).Domain = value;
            if (preDomain == null) {
                (this as IEntityProperty).InstanceId = this.Id + this.GetType();
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
        protected AddToChildren(entity: Entity) {
            if (this.Children == null) {
                (this as IEntityProperty).Children = {};
            }
            this.Children[entity.Id] = entity;
        }

        private RemoveFromChildren(entity: Entity) {
            if (this.Children == null) {
                return;
            }
            delete this.Children[entity.Id];
            if (Object.keys(this.Children).length == 0) {
                (this as IEntityProperty).Children = null;
            }
        }

        public Dispose() {
            if (this.IsDisposed()) {
                return;
            }
            this.setRegister(false);
            (this as IEntityProperty).InstanceId = "0";
            // 清理Component
            if (this.Components != null) {
                for (let kv in this.Components) {
                    this.Components[kv].Dispose();
                }
                (this as IEntityProperty).Components = null;
            }

            // 清理Children
            if (this.Children != null) {
                for (let kv in this.Children) {
                    this.Children[kv].Dispose();
                }
                (this as IEntityProperty).Children = null;
            }

            // 触发Destroy事件
            EntityEventSystem.Destroy(this);

            (this as IEntityProperty).Domain = null;

            if (this.Parent != null && !this.Parent.IsDisposed()) {
                if (this.IsComponent) {
                    this.Parent.RemoveComponent(this as any);
                } else {
                    this.Parent.RemoveFromChildren(this);
                }
            }

            (this as IEntityProperty).Parent = null;
        }

        protected AddToComponents(component: Component) {
            if (this.Components == null) {
                (this as IEntityProperty).Components = {};
            }
            if (this.Components[component.GetType()]) {
                LogHelper.error("the same Component ");
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
                (this as IEntityProperty).Components = null;
            }
        }

        public GetChild<K extends Entity>(id: string): K {
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

        public GetComponentByName<K extends Component>(name: string) {
            if (this.Components == null) {
                return null;
            }
            return this.Components[name] as K;
        }
        public GetComponent<K extends typeof Component>(type: K) {
            if (this.Components == null) {
                return null;
            }
            return this.Components[type.name] as InstanceType<K>;
        }

        public static Create<K extends typeof Entity>(type: K) {
            let component = new type();
            (component as IEntityProperty).Id = GameFunc.GenerateUUID();
            return component as InstanceType<K>;
        }
        public static CreateOne<K extends typeof Entity>(this: K) {
            let component = new this();
            (component as IEntityProperty).Id = GameFunc.GenerateUUID();
            return component as InstanceType<K>;
        }

        public AddOneComponent(component: Component) {
            let type = component.GetType();
            if (this.Components != null && this.Components[type] != null) {
                throw new Error("entity already has component: " + type);
            }
            component.setParent(this);
            return component;
        }

        public AddComponent<K extends typeof Component>(type: K, ...args: any[]) {
            if (this.Components != null && this.Components[type.name] != null) {
                throw new Error("entity already has component: " + type.name);
            }
            let component = Entity.Create(type) as InstanceType<K>;
            if (!component.IsComponent) {
                throw new Error("is not component: " + type.name);
            }
            (component as IEntityProperty).Id = this.Id;
            component.setParent(this);
            args = args || [];
            EntityEventSystem.Awake(component, ...args);
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
            EntityEventSystem.Awake(component, ...args);
            return component;
        }

        public AddChildWithId<T extends typeof Entity>(type: T, id: string, ...args: any[]) {
            let component = Entity.Create(type);
            (component as IEntityProperty).Id = id;
            component.setParent(this);
            args = args || [];
            EntityEventSystem.Awake(component, ...args);
            return component;
        }
    }
    export class Component extends Entity {
        public readonly IsComponent: boolean = true;
    }

    export class EntityRoot extends Entity {
        public readonly DomainParent: EntityRoot;
        public readonly DomainChildren: { [uuid: string]: EntityRoot };
        public readonly PreAwakeArgs: { [uuid: string]: any[] };
        constructor(etroot: IEntityRoot = null) {
            super();
            (this as IEntityProperty).Id = GameFunc.GenerateUUID();
            (this as IEntityProperty).Parent = this;
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

        public AsPlayer() {
            return this as any as PlayerEntityRoot;
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
                        let unawake = EntityEventSystem.GetEntity(k);
                        if (unawake != null) {
                            EntityEventSystem.Awake(unawake, ...this.PreAwakeArgs[k]);
                        }
                    }
                }
                (this.PreAwakeArgs as any) = null;
                this.onAwake();
            } else {
                LogHelper.error("cant active");
            }
        }

        public AddPreAwakeComponent<K extends typeof Component>(type: K, ...args: any[]) {
            if (this.Components != null && this.Components[type.name] != null) {
                throw new Error("entity already has component: {type.FullName}");
            }
            let component = Entity.Create(type) as InstanceType<K>;
            if (!component.IsComponent) {
                throw new Error("is not component: " + type.name);
            }
            (component as IEntityProperty).Id = this.Id;
            (component as IEntityProperty).Parent = this;
            this.AddToComponents(component as Component);
            if (this.PreAwakeArgs == null) {
                (this.PreAwakeArgs as any) = {};
            }
            this.PreAwakeArgs[component.Id + component.GetType()] = args;
            return component;
        }
        public AddPreAwakeChild<T extends typeof Entity>(type: T, ...args: any[]) {
            let component = Entity.Create(type);
            (component as IEntityProperty).Parent = this;
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
                throw new Error("setDomainParent error");
            }
            (this as any).DomainParent = _domainParent;
            this.DomainParent.addDomainChildren(this);
        }
        private addDomainChildren(child: EntityRoot) {
            if (this.DomainChildren == null) {
                (this as any).DomainChildren = {};
            }
            this.DomainChildren[child.Id] = child;
        }
        private removeDomainChildren(child: EntityRoot) {
            if (this.DomainChildren == null) {
                return;
            }
            delete this.DomainChildren[child.Id];
            (child as any).DomainParent = null;
            if (Object.keys(this.DomainChildren).length == 0) {
                (this as any).DomainChildren = null;
            }
        }
        public Dispose(): void {
            if (this.DomainChildren != null) {
                for (let key in this.DomainChildren) {
                    this.DomainChildren[key].Dispose();
                }
                (this as any).DomainChildren = null;
            }
            super.Dispose();
            if (this.DomainParent != null && !this.DomainParent.IsDisposed()) {
                this.DomainParent.removeDomainChildren(this);
                (this as any).DomainParent = null;
            }
        }
    }
}
