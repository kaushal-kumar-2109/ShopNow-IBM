const WEB_PATH = "http://localhost:3000" || "http://192.168.1.18:3000";
const MAIN_SUB_WEB_URL = "/ShopNow/api";

const ROUTERS = {
    POST_ROUTE: {
        sendOtp: `${WEB_PATH}${MAIN_SUB_WEB_URL}/post/send-otp`,
        createUser: `${WEB_PATH}${MAIN_SUB_WEB_URL}/post/create-user`,
        setUser: `${WEB_PATH}${MAIN_SUB_WEB_URL}/post/set-user`,
        postComment: `${WEB_PATH}${MAIN_SUB_WEB_URL}/post/post-comment`,
        addToCart: `${WEB_PATH}${MAIN_SUB_WEB_URL}/post/add-to-cart`,
        updateCartQuantity: `${WEB_PATH}${MAIN_SUB_WEB_URL}/post/update-cart-quantity`,
        removeFromCart: `${WEB_PATH}${MAIN_SUB_WEB_URL}/post/remove-from-cart`,
        clearCart: `${WEB_PATH}${MAIN_SUB_WEB_URL}/post/clear-cart`,
        toggleWishlist: `${WEB_PATH}${MAIN_SUB_WEB_URL}/post/toggle-wishlist`
    },
    GET_ROUTE: {
        getUser: `${WEB_PATH}${MAIN_SUB_WEB_URL}/get/get-user`,
        getLatestProduct: `${WEB_PATH}${MAIN_SUB_WEB_URL}/get/get-latest-product`,
        getProduct: `${WEB_PATH}${MAIN_SUB_WEB_URL}/get/get-product`,
        getProductComments: `${WEB_PATH}${MAIN_SUB_WEB_URL}/get/get-product-comments`,
        getCart: `${WEB_PATH}${MAIN_SUB_WEB_URL}/get/get-cart`,
        getWishlist: `${WEB_PATH}${MAIN_SUB_WEB_URL}/get/get-wishlist`
    },
    PUT_ROUTE: {
        updatePassword: `${WEB_PATH}${MAIN_SUB_WEB_URL}/put/update-password`
    }
};

export default ROUTERS;