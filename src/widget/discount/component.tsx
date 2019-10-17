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
    /** 远程请求状态 */
    getCodeLoading: boolean;
    /** 优惠码已经请求过 */
    codeSubscribed: boolean;
}

export default class DiscountComponent extends Component<ComponentProps, State> {
    state: State = {
        showCode: false,
        shakeBox: false,
        isCopied: false,
        getCodeLoading: false,
        codeSubscribed: false,
    };

    /** 复制文本 */
    copyCode() {
        const { data, emit } = this.props;

        this.setState({ isCopied: true });

        log(`Copy the code to Clipboard, ${data.discountCode}`);
        copy(data.discountCode);
        emit('copyCodeBtn');
    }

    /** 震动选框 */
    shakeBox() {
        this.setState({ shakeBox: true });
        setTimeout(() => this.setState({ shakeBox: false }), 1000);
    }

    /** 获取优惠码文本 */
    async getCode() {
        const { data } = this.props;

        let result: GetPromiseType<ReturnType<NonNullable<typeof data.getCode>>> = {
            code: data.discountCode,
            isSubscribed: false,
            message: '',
        };

        this.setState({ getCodeLoading: true });

        // 如果是用函数拿到的
        if (data.getCode && isFunc(data.getCode)) {
            result = await data.getCode();
        }
        
        this.setState({
            showCode: true,
            getCodeLoading: false,
            codeSubscribed: result.isSubscribed,
        });

        data.discountCode = result.isSubscribed ? result.message : result.code;
    }

    /** 按钮回调函数 */
    btnClickHandler = (ev: MouseEvent) => {
        ev.stopPropagation();
        ev.stopImmediatePropagation();

        if (this.state.showCode) {
            this.copyCode();
        }
        else {
            // 触发“获取优惠码按钮”点击事件
            this.props.emit('showCodeBtn', this.props.isChecked);

            if (this.props.isChecked) {
                this.getCode();
            }
            else {
                this.shakeBox();
            }
        }
    }

    /** 按钮文本 */
    get btnText() {
        const { data } = this.props;
        const { getCodeLoading, showCode, isCopied } = this.state;

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
    }

    render() {
        const { props, state } = this;
        const { id, checkboxId, data, loading } = props;
        const { showCode, shakeBox, getCodeLoading, codeSubscribed } = state;

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
                            ? codeSubscribed
                                ? <div className={`${bhClass}__tip`} style='color: #464C5B'>
                                    <div className={`${bhClass}__msg`}>THANKS</div>
                                </div>
                                : <div className={`${bhClass}__tip`} style='color: #33D499'>
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

                            <div className={`${bhClass}__content-text`}>{ (showCode && !codeSubscribed) ? data.discountText : '' }</div>
                            <div
                                className={`${bhClass}__content-code`}
                                style={codeSubscribed ? 'color: #464C5B' : ''}>{
                                showCode ? data.discountCode : ''
                            }</div>
                        </div>
                    </article>
                    { codeSubscribed ? '' :<button
                        className={`${bhClass}__btn`}
                        onClick={this.btnClickHandler}>
                            
                        {/* disabled={getCodeLoading || loading} */}
                        { this.btnText }
                    </button>}
                </section>
            </div>
        );
    }
}
