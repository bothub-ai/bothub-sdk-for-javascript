import { BothubParameter, toFbParameter, logEvent } from './core';

/** 添加至购物车事件参数 */
interface AddedToCartParams extends Pick<BothubParameter, 'id' | 'type' | 'currency'> {
    /** 商品价格 */
    price: string;
}

/** 添加至购物车事件 */
export function addedToCartEvent(param: AddedToCartParams) {
    logEvent(
        window.FB.AppEvents.EventNames.ADDED_TO_CART,
        ...toFbParameter(param, 'price'),
    );
}

/** 添加至愿望单事件参数 */
interface AddedToWishlistParams extends Pick<BothubParameter, 'id' | 'type' | 'currency'> {
    /** 商品价格 */
    price: string;
}

/** 添加至愿望单事件 */
export function addedToWishlistEvent(param: AddedToWishlistParams) {
    logEvent(
        window.FB.AppEvents.EventNames.ADDED_TO_WISHLIST,
        ...toFbParameter(param, 'price'),
    );
}

/** 购物车结算事件参数 */
interface InitiatedCheckoutParams extends Pick<BothubParameter, 'id' | 'type' | 'currency' | 'numItems' | 'paymentAvailable'> {
    /** 购物车结算总价格 */
    totalPrice: string;
}

/** 购物车结算事件 */
export function initiatedCheckoutEvent(param: InitiatedCheckoutParams) {
    logEvent(
        window.FB.AppEvents.EventNames.INITIATED_CHECKOUT,
        ...toFbParameter(param, 'totalPrice'),
    );
}
