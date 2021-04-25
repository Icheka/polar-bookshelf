import React from "react";
import {useDocViewerCallbacks, useDocViewerStore} from "../../DocViewerStore";
import {useFakePinchToZoom} from "../../PinchHooks";
import {ScaleLevelTuple} from "../../ScaleLevels";

interface UseIPDFPinchToZoomArgs {
    viewerRef: React.RefObject<HTMLElement>; 
    wrapperRef: React.RefObject<HTMLElement>; 
}

export const usePDFPinchToZoom: React.FC<UseIPDFPinchToZoomArgs> = ({ viewerRef, wrapperRef }) => {
    const {docScale} = useDocViewerStore(['docScale']);
    const {setScale} = useDocViewerCallbacks();
    
    const shouldUpdate = React.useCallback((zoom: number): boolean => {
        const wrapper = wrapperRef.current!, viewer = viewerRef.current!;
        const max = 4;
        const scale = docScale!.scaleValue * zoom;
        return (wrapper.scrollWidth > viewer.getBoundingClientRect().width || zoom > 1) && (scale <= max || zoom < 1);
    }, [docScale]);

    const onZoom = React.useCallback((zoom: number): void => {
        const newScale = zoom * docScale!.scaleValue;
        const newScaleLevel: ScaleLevelTuple = {
            label: `${Math.round(newScale * 100)}%`,
            value: `${newScale}`,
        };
        setScale(newScaleLevel);
    }, [docScale, setScale]);

    useFakePinchToZoom({
        viewerRef,
        wrapperRef,
        shouldUpdate,
        onZoom,
    });
    return null;
};
