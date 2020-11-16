import * as React from 'react';
import {HeightFitImg} from "../../../web/js/annotation_sidebar/HeightFitImg";

export const HeightFitImgStory = () => {
    return (
        <div style={{
                  width: '400px',
                  border: 'solid 1px black',
                  display: 'flex',
                  flexDirection: 'column'
             }}>

            {[100, 200, 400, 600].map(height => (
                <HeightFitImg id="1234"
                              height={height}
                              src="https://i.imgur.com/tq3l0MA.jpg"/>
            ))}



        </div>
    )
}