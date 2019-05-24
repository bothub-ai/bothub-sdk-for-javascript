import { h, Component } from 'preact';
import { WarpperClassName } from '../base/base';
import { ComponentProps, bhClass } from './constant';

import { log } from 'src/lib/print';
import { copy } from 'src/lib/utils';
import { isFunc } from 'src/lib/assert';
import { parseClass } from 'src/lib/dom';

import Loading from 'src/widget/components/loading';

interface State {
    /** 是否显示优惠码 */
    showCode: boolean;
    /** 是否震动盒子 */
    shakeBox: boolean;
    /** 文本是否已复制 */
    isCopied: boolean;
    /** 远程请求 */
    getCodeLoading: boolean;
}

export default class DiscountComponent extends Component<ComponentProps, State> {
    state: State = {
        showCode: false,
        shakeBox: false,
        isCopied: false,
        getCodeLoading: false,
    };

    render() {
        const { props, state } = this;
        const { showCode, shakeBox, isCopied, getCodeLoading } = state;
        const { id, checkboxId, data, emit, loading, isChecked } = props;

        const clickButton = (ev: MouseEvent) => {
            ev.stopPropagation();
            ev.stopImmediatePropagation();

            if (showCode) {
                this.setState({ isCopied: true });
                log(`Copy the code to Clipboard, ${data.discountCode}`);
                copy(data.discountCode);
                emit('copyCodeBtn');
            }
            else if (isChecked) {
                let result: GetPromise<ReturnType<NonNullable<typeof data.getCode>>>;

                this.setState({ getCodeLoading: true });

                // 如果是用函数拿到的
                if (data.getCode && isFunc(data.getCode)) {
                    result = Promise.resolve(data.getCode());
                }
                else {
                    result = Promise.resolve(data);
                }

                result.then((transform) => {
                    Object.assign(data, transform);

                    this.setState({
                        showCode: true,
                        getCodeLoading: false,
                    });

                    emit('showCodeBtn');
                });
            }
            else {
                this.setState({ shakeBox: true });
                setTimeout(() => this.setState({ shakeBox: false }), 1000);
            }
        };

        return (
            <div id={id} className={WarpperClassName}>
                <section className={`${bhClass} ${bhClass}__${props.align}`}>
                    <header className={`${bhClass}__header`}>
                        <div className={`${bhClass}__title`}>{ data.title }</div>
                        <div className={`${bhClass}__subtitle`}>{ data.subtitle }</div>
                    </header>
                    <article className={parseClass([`${bhClass}__box`, {
                        [`${bhClass}__code`]: showCode,
                        'shake-box': shakeBox,
                    }])}>
                        {showCode
                            ? <div className={`${bhClass}__tip`} style='color: #33D499'>
                                <div className={`${bhClass}__msg`}>SUCCESS</div>
                            </div>
                            : <div className={`${bhClass}__tip`} style='color: #FF6969'>
                                <div className={`${bhClass}__notice`}>{ data.discount }</div>
                                <div className={`${bhClass}__msg`}>DISCOUNT</div>
                            </div>
                        }
                        <div className={`${bhClass}__content`}>
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
                            { showCode ? <div className={`${bhClass}__content-text`}>{ data.discountText }</div> : '' }
                            { showCode ? <div className={`${bhClass}__content-code`}>{ data.discountCode }</div> : '' }
                        </div>
                    </article>
                    <button
                        className={`${bhClass}__btn`}
                        onClick={clickButton}
                        disabled={getCodeLoading || loading}>
                        {(() => {
                            if (getCodeLoading) {
                                return <Loading />;
                            }
                            else if (!showCode) {
                                return data.showCodeBtnText;
                            }
                            else if (isCopied) {
                                return 'Copied!';
                            }
                            else {
                                return data.copyCodeBtnText;
                            }
                        })()}
                    </button>
                </section>
            </div>
        );
    }
}
