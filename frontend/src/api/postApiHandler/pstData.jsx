import ROUTERS from "../connect.api";
import PostDataCall from "./requester/request";

const sendOtp = async (data) => {
    return await PostDataCall(ROUTERS.POST_ROUTE.sendOtp, data);
};

const createUser = async (data) => {
    return await PostDataCall(ROUTERS.POST_ROUTE.createUser, data);
}

const setUser = async (data) => {
    return await PostDataCall(ROUTERS.POST_ROUTE.setUser, data);
}

const updateUserPassword = async (data) => {
    return await PostDataCall(ROUTERS.PUT_ROUTE.updatePassword, data);
}

const postComment = async (data) => {
    return await PostDataCall(ROUTERS.POST_ROUTE.postComment, data);
}

const apiAddToCart = async (data) => {
    return await PostDataCall(ROUTERS.POST_ROUTE.addToCart, data);
}

const apiUpdateCartQuantity = async (data) => {
    return await PostDataCall(ROUTERS.POST_ROUTE.updateCartQuantity, data);
}

const apiRemoveFromCart = async (data) => {
    return await PostDataCall(ROUTERS.POST_ROUTE.removeFromCart, data);
}

const apiClearCart = async () => {
    return await PostDataCall(ROUTERS.POST_ROUTE.clearCart, {});
}

const apiToggleWishlist = async (data) => {
    return await PostDataCall(ROUTERS.POST_ROUTE.toggleWishlist, data);
}

const apiUpdateProfile = async (data) => {
    return await PostDataCall(ROUTERS.POST_ROUTE.updateProfile, data);
}

const apiAddAddress = async (data) => {
    return await PostDataCall(ROUTERS.POST_ROUTE.addAddress, data);
}

const apiUpdateAddress = async (id, data) => {
    return await PostDataCall(`${ROUTERS.POST_ROUTE.updateAddress}/${id}`, data);
}

const apiDeleteAddress = async (id) => {
    return await PostDataCall(`${ROUTERS.POST_ROUTE.deleteAddress}/${id}`, {});
}

const apiPlaceOrder = async (data) => {
    return await PostDataCall(ROUTERS.POST_ROUTE.placeOrder, data);
}

const apiCancelOrder = async (id) => {
    return await PostDataCall(`${ROUTERS.POST_ROUTE.cancelOrder}/${id}`, {});
}

const apiUpdateOrder = async (id, data) => {
    return await PostDataCall(`${ROUTERS.POST_ROUTE.updateOrder}/${id}`, data);
}

export { sendOtp, createUser, setUser, updateUserPassword, postComment, apiAddToCart, apiUpdateCartQuantity, apiRemoveFromCart, apiClearCart, apiToggleWishlist, apiUpdateProfile, apiAddAddress, apiUpdateAddress, apiDeleteAddress, apiPlaceOrder, apiCancelOrder, apiUpdateOrder };