import { h, FunctionalComponent } from 'preact';
import { underlineObject } from '../helper';
import { WarpperClassName } from '../base/base';
import { ComponentProps, bhClass, fbClass } from './constant';

import Loading from 'src/widget/components/loading';

const Component: FunctionalComponent<ComponentProps> = ({ id, loading, attrs }) => (
    <div id={id} class={WarpperClassName}>
        { loading ? <Loading style='position: relative; left: 60px;' /> : '' }
        <div
            data-ref={window.btoa(id)}
            class={`${bhClass} ${fbClass}`}
            style={!loading ? '' : {
                opacity: '0',
                position: 'absolute',
            }}
            {...underlineObject(attrs)}
        />
    </div>
);

export default Component;
