import { h, FunctionalComponent } from 'preact';
import { ComponentProps, bhClass, fbClass } from './constant';
import { WarpperClassName, underlineObject } from '../helper';

import Loading from 'src/widget/components/loading';

const Component: FunctionalComponent<ComponentProps> = ({ id, loading, attrs }) => (
    <div id={id} class={WarpperClassName}>
        { loading ? <Loading /> : '' }
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
