import { BothubParameter, transformParameter, logEvent } from './core';

/** 添加至购物车事件参数 */
interface AddedToCartParams extends Pick<BothubParameter, 'id' | 'type' | 'currency'> {
    /** 商品价格 */
    price: string;
}

/** 添加至购物车事件 */
export function addedToCart(param: AddedToCartParams) {
    logEvent(
        window.FB.AppEvents.EventNames.ADDED_TO_CART,
        ...transformParameter(param, 'price'),
    );
}

/** 添加至愿望单事件参数 */
interface AddedToWishlistParams extends Pick<BothubParameter, 'id' | 'type' | 'currency'> {
    /** 商品价格 */
    price: string;
}

/** 添加至愿望单事件 */
export function addedToWishlist(param: AddedToWishlistParams) {
    logEvent(
        window.FB.AppEvents.EventNames.ADDED_TO_WISHLIST,
        ...transformParameter(param, 'price'),
    );
}

/** 购物车结算事件参数 */
interface InitiatedCheckoutParams extends Pick<BothubParameter, 'id' | 'type' | 'currency' | 'numItems' | 'paymentAvailable'> {
    /** 购物车结算总价格 */
    totalPrice: string;
}

/** 购物车结算事件 */
export function initiatedCheckout(param: InitiatedCheckoutParams) {
    logEvent(
        window.FB.AppEvents.EventNames.INITIATED_CHECKOUT,
        ...transformParameter(param, 'totalPrice'),
    );
}
