import {IBlock, IBlockLink, NamespaceIDStr, TMutation, UIDStr} from "./IBlock";
import {INewChildPosition, BlockIDStr, BlockContent, IBlockContent} from "./BlocksStore";
import {action, computed, makeObservable, observable} from "mobx"
import { ISODateTimeString, ISODateTimeStrings } from "polar-shared/src/metadata/ISODateTimeStrings";
import { Contents } from "../content/Contents";
import {PositionalArrays} from "./PositionalArrays";
import PositionalArray = PositionalArrays.PositionalArray;
import { arrayStream } from "polar-shared/src/util/ArrayStreams";
import PositionalArrayPositionStr = PositionalArrays.PositionalArrayPositionStr;
import deepEqual from "deep-equal";
import {BlocksStoreUndoQueues} from "./BlocksStoreUndoQueues";
import IItemsPositionPatch = BlocksStoreUndoQueues.IItemsPositionPatch;

export class Block<C extends BlockContent = BlockContent> implements IBlock<C> {

    @observable private _id: BlockIDStr;

    /**
     * The graph to which this page belongs.
     */
    @observable private _nspace: NamespaceIDStr;

    /**
     * The owner of this block.
     */
    @observable readonly _uid: UIDStr;

    @observable private _parent: BlockIDStr | undefined;

    @observable private _created: ISODateTimeString;

    @observable private _updated: ISODateTimeString;

    /**
     * The sub-items of this node as node IDs.
     */
    @observable private _items: PositionalArray<BlockIDStr>;

    @observable private _content: C;

    /**
     * The linked wiki references to other blocks.
     */
    @observable private _links: PositionalArray<IBlockLink>;

    @observable private _mutation: TMutation;

    constructor(opts: IBlock<C | IBlockContent>) {

        this._id = opts.id;
        this._nspace = opts.nspace;
        this._uid = opts.uid;
        this._parent = opts.parent;
        this._created = opts.created;
        this._updated = opts.updated;
        this._items = {...opts.items};
        this._content = Contents.create(opts.content);
        this._links = {...opts.links};
        this._mutation = opts.mutation;

        makeObservable(this)

    }

    @computed get id() {
        return this._id;
    }

    @computed get nspace() {
        return this._nspace;
    }

    @computed get uid() {
        return this._uid;
    }

    @computed get parent() {
        return this._parent;
    }

    @computed get created() {
        return this._created;
    }

    @computed get updated() {
        return this._updated;
    }

    @computed get items(): PositionalArray<BlockIDStr> {
        return this._items;
    }

    @computed get itemsAsArray(): ReadonlyArray<BlockIDStr> {
        return PositionalArrays.toArray(this._items);
    }

    @computed get content() {
        return this._content;
    }

    @computed get links(): PositionalArray<IBlockLink> {
        return this._links;
    }

    @computed get linksAsArray(): ReadonlyArray<IBlockLink> {
        return PositionalArrays.toArray(this._links);
    }

    @computed get mutation() {
        return this._mutation;
    }

    /**
     * Return true if the given content has been mutated vs the current content.
     */
    public hasContentMutated(content: C | IBlockContent): boolean {
        return ! deepEqual(this._content, content);
    }

    @action setContent(content: C | IBlockContent) {

        if (this.hasContentMutated(content)) {
            this._content.update(content);
            return true;
        }

        return false;

    }

    @action setParent(id: BlockIDStr): boolean {

        if (this._parent !== id) {
            this._parent = id;
            this._updated = ISODateTimeStrings.create();
            return true;
        }

        return false;

    }

    public hasItemsMutated(items: ReadonlyArray<BlockIDStr>): boolean {
        return ! deepEqual(PositionalArrays.toArray(this._items), items);

    }

    @action setItems(items: ReadonlyArray<BlockIDStr>): boolean {

        if (this.hasItemsMutated(items)) {
            PositionalArrays.set(this._items, items);
            this._updated = ISODateTimeStrings.create();
            return true;
        }

        return false;

    }

    @action public setItemsUsingPatches(itemPositionPatches: ReadonlyArray<IItemsPositionPatch>): boolean {

        let mutated: boolean = false;

        for(const itemPositionPatch of itemPositionPatches) {

            switch (itemPositionPatch.type) {

                case "insert":

                    if (! this.hasItem(itemPositionPatch.id)) {

                        if (this.doPutItem(itemPositionPatch.key, itemPositionPatch.id)) {
                            mutated = true;
                        }

                    }

                    break;

                case "remove":

                    if (this.hasItem(itemPositionPatch.id)) {
                        if (this.doRemoveItem(itemPositionPatch.id)) {
                            mutated = true;
                        }
                    }

                    break;

            }

        }

        return mutated;

    }

    @action addItem(id: BlockIDStr, pos?: INewChildPosition | 'unshift'): boolean {

        if (! this.hasItem(id)) {

            if (pos === 'unshift') {
                PositionalArrays.unshift(this._items, id);
            } else if (pos) {
                PositionalArrays.insert(this._items, pos.ref, id, pos.pos);
            } else {
                PositionalArrays.append(this._items, id);
            }

            this._updated = ISODateTimeStrings.create();

            return true;

        }

        return false;

    }

    @action private doRemoveItem(id: BlockIDStr): boolean {

        if (this.hasItem(id)) {

            PositionalArrays.remove(this._items, id);
            return true;

        }

        return false;

    }

    @action removeItem(id: BlockIDStr): boolean {

        if (this.doRemoveItem(id)) {

            this._updated = ISODateTimeStrings.create();
            return true;

        }

        return false;

    }

    @action private doPutItem(key: PositionalArrayPositionStr, id: BlockIDStr): boolean {

        if (! this.hasItem(id)) {

            PositionalArrays.put(this._items, key, id);

            return true;

        }

        return false;

    }

    @action putItem(key: PositionalArrayPositionStr, id: BlockIDStr): boolean {

        if (this.doPutItem(key, id)) {

            this._updated = ISODateTimeStrings.create();

            return true;

        }

        return false;

    }

    public hasItem(id: BlockIDStr): boolean {
        return PositionalArrays.toArray(this._items).includes(id);
    }

    @action setLinks(links: ReadonlyArray<IBlockLink>) {

        PositionalArrays.set(this._links, links);
        this._updated = ISODateTimeStrings.create();

    }

    @action addLink(link: IBlockLink) {

        if (! this.hasLink(link.id)) {
            PositionalArrays.append(this._links, link);
            this._updated = ISODateTimeStrings.create();
            return true;
        }

        return false;

    }

    public hasLink(id: BlockIDStr): boolean {

        return arrayStream(PositionalArrays.toArray(this._links)).
                filter(current => current.id === id)
                .first() !== undefined;

    }

    @action removeLink(id: BlockIDStr): boolean {

        const link =
            arrayStream(Object.values(this._links))
                .filter(current => current.id === id)
                .first();

        if (link) {
            PositionalArrays.remove(this._links, link);
            this._updated = ISODateTimeStrings.create();
            return true;
        }

        return false;

    }

    @action set(block: IBlock) {

        this._parent = block.parent;
        this._created = block.created;
        this._updated = block.updated;
        PositionalArrays.set(this._items, block.items);
        this._content.update(block.content)
        PositionalArrays.set(this._links, block.links);

    }

    /**
     * Perform a bulk/single mutation of the Block.
     */
    public withMutation(delegate: () => void) {

        const before = this.toJSON();

        delegate();

        const after = this.toJSON();

        if (! deepEqual(before, after)) {

            this._updated = ISODateTimeStrings.create();
            this._mutation = this._mutation + 1;
            return true;
        }

        return false;

    }

    public toJSON(): IBlock<C> {

        return {
            id: this._id,
            nspace: this._nspace,
            uid: this._uid,
            parent: this._parent,
            created: this._created,
            updated: this._updated,
            items: {...this._items},
            content: this._content.toJSON() as any,
            links: {...this._links},
            mutation: this._mutation
        };

    }

}
