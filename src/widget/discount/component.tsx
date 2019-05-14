import { h, Component } from 'preact';
import { WarpperClassName } from '../base/base';
import { ComponentProps, bhClass } from './constant';

import { log } from 'src/lib/print';
import { copy } from 'src/lib/utils';
import { parseClass } from 'src/lib/dom';

import Loading from 'src/widget/components/loading';

interface State {
    /** 是否显示优惠码 */
    showCode: boolean;
    /** 是否震动盒子 */
    shakeBox: boolean;
    /** 文本是否已复制 */
    isCopied: boolean;
}

export default class DiscountComponent extends Component<ComponentProps, State> {
    state: State = {
        showCode: false,
        shakeBox: false,
        isCopied: false,
    };

    render() {
        const { props, state } = this;
        const { showCode, shakeBox, isCopied } = state;
        const { id, checkboxId, data, emit, loading, isChecked } = props;

        const clickButton = (ev: MouseEvent) => {
            ev.stopPropagation();
            ev.stopImmediatePropagation();

            if (showCode) {
                this.setState({ isCopied: true });
                log(`Copy the code to Clipboard, ${data.discountCode}`);
                copy(data.discountCode);
                emit('clickCopyCodeBtn');
            }
            else if (isChecked) {
                // TODO: 这里的 code 也可能是从后端取过来的
                this.setState({ showCode: true });
                emit('clickShowCodeBtn');
            }
            else {
                this.setState({ shakeBox: true });
                setTimeout(() => this.setState({ shakeBox: false }), 1000);
            }
        };

        return (
            <div id={id} class={WarpperClassName}>
                <section class={`${bhClass} ${bhClass}__${props.align}`}>
                    <header class={`${bhClass}__header`}>
                        <div class={`${bhClass}__title`}>{ data.title }</div>
                        <div class={`${bhClass}__subtitle`}>{ data.subtitle }</div>
                    </header>
                    <article class={parseClass([`${bhClass}__box`, {
                        [`${bhClass}__code`]: showCode,
                        ['shake-box']: shakeBox,
                    }])}>
                        {showCode
                            ? <div class={`${bhClass}__tip`} style='color: #33D499'>
                                <div class={`${bhClass}__msg`}>SUCCESS</div>
                            </div>
                            : <div class={`${bhClass}__tip`} style='color: #FF6969'>
                                <div class={`${bhClass}__notice`}>{ data.discount }</div>
                                <div class={`${bhClass}__msg`}>DISCOUNT</div>
                            </div>
                        }
                        <div class={`${bhClass}__content`}>
                            { loading ? <Loading /> : '' }
                            {/* checkbox 插件元素 */}
                            <div
                                id={checkboxId}
                                style={(!loading && !showCode) ? '' : {
                                    opacity: 0,
                                    zIndex: -1,
                                    position: 'absolute',
                                }}
                            />
                            { showCode ? <div class={`${bhClass}__content-text`}>{ data.discountText }</div> : '' }
                            { showCode ? <div class={`${bhClass}__content-code`}>{ data.discountCode }</div> : '' }
                        </div>
                    </article>
                    <div
                        class={`${bhClass}__btn`}
                        onClick={clickButton}
                        disabled={loading}
                    >{
                        showCode
                            ? isCopied
                                ? 'Copied!'
                                : data.copyCodeBtnText
                            : data.showCodeBtnText
                    }</div>
                </section>
            </div>
        );
    }
}
