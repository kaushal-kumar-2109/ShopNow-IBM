import ROUTERS from "../connect.api";
import GetDataCall from "./requester/request";

const getUserData = async () => {
    return await GetDataCall(ROUTERS.GET_ROUTE.getUser);
};

const getLatestProduct = async () => {
    return await GetDataCall(ROUTERS.GET_ROUTE.getLatestProduct);
}

const getProductsByCategory = async (category, limit = 8) => {
    const url = `${ROUTERS.GET_ROUTE.getLatestProduct}?category=${encodeURIComponent(category)}&limit=${limit}`;
    return await GetDataCall(url);
}

// Fetch `limit` newest products across all categories (no category filter)
const getLatestProducts = async (limit = 3) => {
    const url = `${ROUTERS.GET_ROUTE.getLatestProduct}?limit=${limit}`;
    return await GetDataCall(url);
}

// Fetch 1 product from each of the provided categories in parallel
const getBannerProducts = async (categories) => {
    const results = await Promise.all(
        categories.map((cat) => getProductsByCategory(cat, 1))
    );
    return results
        .filter((r) => r.flag && Array.isArray(r.data) && r.data.length > 0)
        .map((r) => r.data[0]);
}

export { getUserData, getLatestProduct, getProductsByCategory, getLatestProducts, getBannerProducts };
