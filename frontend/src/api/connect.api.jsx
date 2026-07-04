const WEB_PATH = "http://localhost:3000" || "http://192.168.1.18:3000";
const MAIN_SUB_WEB_URL = "/ShopNow/api";

const ROUTERS = {
    POST_ROUTE: {
        sendOtp: `${WEB_PATH}${MAIN_SUB_WEB_URL}/post/send-otp`,
        createUser: `${WEB_PATH}${MAIN_SUB_WEB_URL}/post/create-user`,
        setUser: `${WEB_PATH}${MAIN_SUB_WEB_URL}/post/set-user`
    },
    GET_ROUTE: {
        getUser: `${WEB_PATH}${MAIN_SUB_WEB_URL}/get/get-user`
    },
    PUT_ROUTE: {
        updatePassword: `${WEB_PATH}${MAIN_SUB_WEB_URL}/put/update-password`
    }
};

export default ROUTERS;