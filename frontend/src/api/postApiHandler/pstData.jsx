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

export { sendOtp, createUser, setUser, updateUserPassword };