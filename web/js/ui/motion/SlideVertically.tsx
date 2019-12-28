import * as React from "react";
import {motion} from "framer-motion";

export const SlideVertically = (props: IProps) => {

    const style: React.CSSProperties = {
        position: 'absolute',
        width: '100%',
        ...props.style || {},
    };

    return (
        <motion.div initial={{ transform: `translateY(${props.initialY}%)` }}
                    animate={{ transform: `translateY(${props.targetY}%)` }}
                    exit={{ transform: `translateY(${props.initialY}%)` }}
                    style={style}>

            {props.children}
        </motion.div>
    );

};

interface IProps {
    readonly initialY: number;
    readonly targetY: number;
    readonly style?: React.CSSProperties;
    readonly children: React.ReactElement | React.ReactNode;
}
