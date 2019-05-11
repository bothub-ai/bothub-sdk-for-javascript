import { BothubParameter, transformParameter, logEvent } from './core';
import { facebookReady } from 'src/lib/facebook';

/** 添加至购物车事件参数 */
interface AddedToCartParams {
    /** 商品编号 */
    sku: BothubParameter['id'];
    /** 商品名称 */
    name: BothubParameter['type'];
    /** 商品货币单位 */
    currency: BothubParameter['currency'];
    /** 商品价格 */
    price: string;
}

/** 添加至购物车事件 */
export function addedToCart(param?: AddedToCartParams) {
    facebookReady.then(() => logEvent(
        window.FB.AppEvents.EventNames.ADDED_TO_CART,
        ...transformParameter(param, {
            sku: 'id',
            name: 'type',
            price: 'valueToSumKey',
        }),
    ));
}

/** 添加至愿望单事件参数 */
interface AddedToWishlistParams {
    /** 商品编号 */
    sku: BothubParameter['id'];
    /** 商品名称 */
    name: BothubParameter['type'];
    /** 商品货币单位 */
    currency: BothubParameter['currency'];
    /** 商品价格 */
    price: string;
}

/** 添加至愿望单事件 */
export function addedToWishlist(param?: AddedToWishlistParams) {
    facebookReady.then(() => logEvent(
        window.FB.AppEvents.EventNames.ADDED_TO_WISHLIST,
        ...transformParameter(param, {
            sku: 'id',
            name: 'type',
            price: 'valueToSumKey',
        }),
    ));
}

/** 购物车结算事件参数 */
interface InitiatedCheckoutParams extends Pick<BothubParameter, 'id' | 'type' | 'currency' | 'numItems' | 'paymentAvailable'> {
    /** 商品编号 */
    sku: BothubParameter['id'];
    /** 商品名称 */
    name: BothubParameter['type'];
    /** 商品货币单位 */
    currency: BothubParameter['currency'];
    /** 商品数量 */
    quantity: BothubParameter['numItems'];
    /** 商品是否处于可以付款的状态 */
    availablity: BothubParameter['paymentAvailable'];
    /** 购物车结算总价格 */
    totalPrice: string;
}

/** 购物车结算事件 */
export function initiatedCheckout(param?: InitiatedCheckoutParams) {
    facebookReady.then(() => logEvent(
        window.FB.AppEvents.EventNames.INITIATED_CHECKOUT,
        ...transformParameter(param, {
            sku: 'id',
            name: 'type',
            quantity: 'numItems',
            availablity: 'paymentAvailable',
            totalPrice: 'valueToSumKey',
        }),
    ));
}
