const WEB_PATH = import.meta.env.VITE_BACKEND_API;

const MAIN_SUB_WEB_URL = "/ShopNow/api";

const ROUTERS = {
    POST_ROUTE: {
        sendOtp: `${WEB_PATH}${MAIN_SUB_WEB_URL}/post/send-otp`,
        createUser: `${WEB_PATH}${MAIN_SUB_WEB_URL}/post/create-user`,
        setUser: `${WEB_PATH}${MAIN_SUB_WEB_URL}/post/set-user`,
        postComment: `${WEB_PATH}${MAIN_SUB_WEB_URL}/post/post-comment`,
        addToCart: `${WEB_PATH}${MAIN_SUB_WEB_URL}/post/add-to-cart`,
        removeFromCart: `${WEB_PATH}${MAIN_SUB_WEB_URL}/post/remove-from-cart`,
        clearCart: `${WEB_PATH}${MAIN_SUB_WEB_URL}/post/clear-cart`,
        toggleWishlist: `${WEB_PATH}${MAIN_SUB_WEB_URL}/post/toggle-wishlist`,
        addAddress: `${WEB_PATH}${MAIN_SUB_WEB_URL}/post/add-address`,
        placeOrder: `${WEB_PATH}${MAIN_SUB_WEB_URL}/post/place-order`,
        cancelOrder: `${WEB_PATH}${MAIN_SUB_WEB_URL}/post/cancel-order`,
    },
    GET_ROUTE: {
        getUser: `${WEB_PATH}${MAIN_SUB_WEB_URL}/get/get-user`,
        getLatestProduct: `${WEB_PATH}${MAIN_SUB_WEB_URL}/get/get-latest-product`,
        getProduct: `${WEB_PATH}${MAIN_SUB_WEB_URL}/get/get-product`,
        getProductComments: `${WEB_PATH}${MAIN_SUB_WEB_URL}/get/get-product-comments`,
        getCart: `${WEB_PATH}${MAIN_SUB_WEB_URL}/get/get-cart`,
        getWishlist: `${WEB_PATH}${MAIN_SUB_WEB_URL}/get/get-wishlist`,
        getAddress: `${WEB_PATH}${MAIN_SUB_WEB_URL}/get/get-address`,
        getOrders: `${WEB_PATH}${MAIN_SUB_WEB_URL}/get/get-orders`,
        getDevice: `${WEB_PATH}${MAIN_SUB_WEB_URL}/get/get-device`
    },
    PUT_ROUTE: {
        updatePassword: `${WEB_PATH}${MAIN_SUB_WEB_URL}/put/update-password`,
        deleteDevice: `${WEB_PATH}${MAIN_SUB_WEB_URL}/put/delete-device`,
        updateProfile: `${WEB_PATH}${MAIN_SUB_WEB_URL}/put/update-profile`,
        updateAddress: `${WEB_PATH}${MAIN_SUB_WEB_URL}/put/update-address`,
        updateOrder: `${WEB_PATH}${MAIN_SUB_WEB_URL}/put/update-order`,
        deleteAddress: `${WEB_PATH}${MAIN_SUB_WEB_URL}/put/delete-address`,
        updateCartQuantity: `${WEB_PATH}${MAIN_SUB_WEB_URL}/put/update-cart-quantity`
    }
};

export default ROUTERS;