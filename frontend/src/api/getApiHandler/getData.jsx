import ROUTERS from "../connect.api";
import GetDataCall from "./requester/request";

const getUserData = async () => {
    return await GetDataCall(ROUTERS.GET_ROUTE.getUser);
};

export { getUserData };