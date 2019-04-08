import Widget from 'src/widget';
import Marketing from 'src/plugin/marketing';
import Ecommerce from 'src/plugin/ecommerce';

import { setGlobalParams } from 'src/store';

export default {
    /** 初始化函数 */
    init: setGlobalParams,
    /** 订单数据类 */
    Ecommerce,
    /** 营销功能类 */
    Marketing,
    /** 插件功能类 */
    Widget,
};
