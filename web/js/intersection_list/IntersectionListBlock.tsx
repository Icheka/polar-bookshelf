import * as React from 'react';
import {BlockComponent, HiddenComponent, ListValue, VisibleComponent} from "./IntersectionList";
import { useInView } from 'react-intersection-observer';
import {IntersectionListBlockItem} from "./IntersectionListBlockItem";

interface IProps<V extends ListValue> {

    readonly root: HTMLElement;

    readonly values: ReadonlyArray<V>;

    readonly blockComponent: BlockComponent<V>;

    readonly visibleComponent: VisibleComponent<V>;

    readonly hiddenComponent: HiddenComponent<V>;

}

export const IntersectionListBlock = function<V extends ListValue>(props: IProps<V>) {

    const BlockComponent = props.blockComponent;

    const {ref, inView, entry} = useInView({
        threshold: 0,
        trackVisibility: true,
        delay: 100,
        root: props.root
    });

    return (
        <BlockComponent innerRef={ref} values={props.values}>
            <>
                {props.values.map(current => (
                    <IntersectionListBlockItem key={current.id}
                                               root={props.root}
                                               value={current}
                                               visibleComponent={props.visibleComponent}
                                               hiddenComponent={props.hiddenComponent}
                                               inView={inView}/>
                ))}
            </>
        </BlockComponent>
    )
}