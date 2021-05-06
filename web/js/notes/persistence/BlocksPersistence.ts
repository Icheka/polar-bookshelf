import React from 'react';
import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import {BlockStoreMutations} from "../store/BlockStoreMutations";
import IBlocksStoreMutation = BlockStoreMutations.IBlocksStoreMutation;
import {BlockIDStr} from "../store/BlocksStore";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import firebase from 'firebase';
import {IBlock} from "../store/IBlock";
import {IQuerySnapshot} from "polar-snapshot-cache/src/store/IQuerySnapshot";
import {IDocumentChange} from "polar-snapshot-cache/src/store/IDocumentChange";

export interface IBlocksPersistence {

    /**
     * Write to the persistence layer by taking the raw mutations and mapping
     * them to Firestore primitives
     *
     * @param mutations
     */
    write(mutations: ReadonlyArray<IBlocksStoreMutation>): Promise<void>;

}

export type BlocksPersistenceWriter = (mutations: ReadonlyArray<IBlocksStoreMutation>) => Promise<void>;

export function useFirestoreBlocksPersistenceWriter(): BlocksPersistenceWriter {

    const {firestore} = useFirestore();

    return React.useCallback(async (mutations: ReadonlyArray<IBlocksStoreMutation>) => {

        const firestoreMutations = BlocksPersistence.convertToFirestoreMutations(mutations);

        const collection = firestore.collection('block');
        const batch = firestore.batch();

        // convert the firestore mutations to a batch...
        for(const firestoreMutation of firestoreMutations) {

            const doc = collection.doc(firestoreMutation.id);

            switch (firestoreMutation.type) {

                case "set-doc":
                    batch.set(doc, firestoreMutation.value);
                    break;

                    case "delete-doc":
                    batch.delete(doc)
                    break;

                case "update-path":
                    batch.update(doc, firestoreMutation.path, firestoreMutation.value);
                    break;

                case "update-delete-field-value":
                    batch.update(doc, firestoreMutation.path, firebase.firestore.FieldValue.delete())
                    break;

            }

        }

        await batch.commit();

    }, [firestore]);

}

export namespace BlocksPersistence {

    import MutationTarget = BlockStoreMutations.MutationTarget;
    import IItemsPositionPatch = BlockStoreMutations.IItemsPositionPatch;

    export interface IFirestoreMutationSetDoc {
        readonly id: BlockIDStr;
        readonly type: 'set-doc';
        readonly value: any;
    }

    export interface IFirestoreMutationDeleteDoc {
        readonly id: BlockIDStr;
        readonly type: 'delete-doc';
    }
    export interface IFirestoreMutationUpdatePath {
        readonly id: BlockIDStr;
        readonly type: 'update-path';
        readonly path: string;
        readonly value: any;
    }

// https://stackoverflow.com/questions/48145962/firestore-delete-a-field-inside-an-object
    export interface IFirestoreMutationUpdateFieldValueDelete {
        readonly id: BlockIDStr;
        readonly type: 'update-delete-field-value';
        readonly path: string;
    }

    export type IFirestoreMutation =
        IFirestoreMutationSetDoc |
        IFirestoreMutationDeleteDoc |
        IFirestoreMutationUpdatePath |
        IFirestoreMutationUpdateFieldValueDelete;


    /**
     * Convert the mutation for Firestore mutations which can then me mapped
     * directly to a Firestore Batch.
     */
    export function convertToFirestoreMutations(mutations: ReadonlyArray<IBlocksStoreMutation>): ReadonlyArray<IFirestoreMutation> {

        const toFirestoreMutation = (mutation: IBlocksStoreMutation): ReadonlyArray<IFirestoreMutation> => {

            switch (mutation.type) {

                case "added":

                    return [
                        {
                            id: mutation.id,
                            type: 'set-doc',
                            value: mutation.before
                        }
                    ];

                case "removed":

                    return [
                        {
                            id: mutation.id,
                            type: 'delete-doc',
                        }
                    ];

                case "updated":

                    const createBaseMutations = (): ReadonlyArray<IFirestoreMutation> => {
                        return [
                            {
                                id: mutation.id,
                                type: 'update-path',
                                path: 'update',
                                value: mutation.after.updated
                            },
                            {
                                id: mutation.id,
                                type: 'update-path',
                                path: 'mutation',
                                value: mutation.after.mutation
                            }

                        ]
                    }

                    const convertToFirebaseMutation = (mutationTarget: MutationTarget): ReadonlyArray<IFirestoreMutation> => {

                        switch (mutationTarget) {

                            case "items":

                                const patchToFirestoreMutation = (patch: IItemsPositionPatch): IFirestoreMutation => {

                                    switch (patch.type) {

                                        case "remove":
                                            return {
                                                id: mutation.id,
                                                type: 'update-delete-field-value',
                                                path: `items.${patch.key}`
                                            }
                                        case "insert":
                                            return {
                                                id: mutation.id,
                                                type: 'update-path',
                                                path: `items.${patch.key}`,
                                                value: patch.id
                                            }

                                    }

                                }

                                const patches = BlockStoreMutations.computeItemPositionPatches(mutation.before.items,
                                                                                               mutation.after.items);

                                return patches.map(current => patchToFirestoreMutation(current));

                            case "content":
                                return [
                                    {
                                        id: mutation.id,
                                        type: 'update-path',
                                        path: 'content',
                                        value: mutation.after.content
                                    }
                                ];
                            case "parent":
                                return [
                                    {
                                        id: mutation.id,
                                        type: 'update-path',
                                        path: 'parent',
                                        value: mutation.after.parent
                                    }
                                ];

                        }

                    }

                    const mutationTargets = BlockStoreMutations.computeMutationTargets(mutation.before, mutation.after);

                    const firestoreMutations = arrayStream(mutationTargets.map(current => convertToFirebaseMutation(current)))
                            .flatMap(current => current)
                            .collect();

                    const baseMutations = createBaseMutations();

                    return [...baseMutations, ...firestoreMutations];

            }

        }

        return arrayStream(mutations.map(current => toFirestoreMutation(current)))
            .flatMap(current => current)
            .collect();

    }

}

export type  DocumentChangeType = 'added' |  'modified' | 'removed';

export interface DocumentChange<T> {
    readonly id: string;
    readonly type: DocumentChangeType;
    readonly data: T;
}

export interface ISnapshotMetadata {
    readonly hasPendingWrites: boolean;
    readonly fromCache: boolean;
}

export interface IBlocksPersistenceSnapshot {
    readonly empty: boolean;
    readonly metadata: ISnapshotMetadata;
    readonly docChanges: ReadonlyArray<DocumentChange<IBlock>>;
}

/**
 * This is just a hook that will be re-called from within the UI...
 */
export type BlocksPersistenceSnapshotHook = () => IBlocksPersistenceSnapshot;

function createEmptySnapshot(): IBlocksPersistenceSnapshot {

    return {
        empty: true,
        metadata: {
            hasPendingWrites: false,
            fromCache: true
        },
        docChanges: []
    }

}

export function useFirestoreBlocksPersistenceSnapshot(): IBlocksPersistenceSnapshot {

    const {user, firestore} = useFirestore();
    const [snapshot, setSnapshot] = React.useState<IBlocksPersistenceSnapshot>(createEmptySnapshot());

    // FIXME: we need to get access to the users namespaces (nspace) to which they are subscribed
    // to get all the values.  They might have other places to which they can write.

    React.useEffect(() => {

        if (! user) {
            return;
        }

        const convertSnapshot = (current: IQuerySnapshot): IBlocksPersistenceSnapshot => {

            const convertDocChange = (current: IDocumentChange): DocumentChange<IBlock> => {

                const data: IBlock = current.doc.data() as IBlock;

                return {
                    id: current.id,
                    type: current.type,
                    data
                }
            }

            return {
                empty: current.empty,
                metadata: {
                    hasPendingWrites: current.metadata.hasPendingWrites,
                    fromCache: current.metadata.fromCache
                },
                docChanges: current.docChanges().map(current => convertDocChange(current))
            }

        }

        const convertSnapshotMutateState = (current: IQuerySnapshot): void => {
            setSnapshot(convertSnapshot(current));
        }

        const collection = firestore.collection('blocks');
        const snapshotUnsubscriber = collection.where('uid', '==', user.uid)
                                               .onSnapshot(current => convertSnapshotMutateState(current))

        return () => {
            snapshotUnsubscriber();
        }

    }, [firestore, user])

    return snapshot;

}