import ROUTERS from "../connect.api";
import GetDataCall from "./requester/request";

const getLandData = async () => {
    return await GetDataCall(ROUTERS.GET_ROUTE.getLandEvent);
};

const getEventById = async (id) => {
    return await GetDataCall(`${ROUTERS.GET_ROUTE.getEvent}/${id}`);
};

const getEvents = async (params = {}) => {
    const cleanedParams = {};
    Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== "") {
            cleanedParams[key] = params[key];
        }
    });
    const queryString = new URLSearchParams(cleanedParams).toString();
    return await GetDataCall(`${ROUTERS.GET_ROUTE.getEvents}?${queryString}`);
};

export { getLandData, getEventById, getEvents };