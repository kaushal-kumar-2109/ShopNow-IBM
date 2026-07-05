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

// Fetch a single product by its MongoDB _id
const getProductById = async (id) => {
    return await GetDataCall(`${ROUTERS.GET_ROUTE.getProduct}/${id}`);
}

// Fetch comments for a product (paginated)
const getProductComments = async (productId, page = 1, limit = 10) => {
    const url = `${ROUTERS.GET_ROUTE.getProductComments}/${productId}?page=${page}&limit=${limit}`;
    return await GetDataCall(url);
}

// Fetch user's cart from backend
const getCart = async () => {
    return await GetDataCall(ROUTERS.GET_ROUTE.getCart);
}

// Fetch user's wishlist from backend
const getWishlist = async () => {
    return await GetDataCall(ROUTERS.GET_ROUTE.getWishlist);
}

// Fetch all shop products from backend with pagination support
const getAllShopProducts = async (page = 1, limit = 9, category = "") => {
    let url = `${ROUTERS.GET_ROUTE.getLatestProduct}?page=${page}&limit=${limit}`;
    if (category && category !== "All") {
        url += `&category=${encodeURIComponent(category)}`;
    }
    return await GetDataCall(url);
}

// Fetch user's addresses from backend
const getAddresses = async () => {
    return await GetDataCall(ROUTERS.GET_ROUTE.getAddress);
}

// Fetch user's orders from backend
const getOrdersList = async () => {
    return await GetDataCall(ROUTERS.GET_ROUTE.getOrders);
}

export { getUserData, getLatestProduct, getProductsByCategory, getLatestProducts, getBannerProducts, getProductById, getProductComments, getCart, getWishlist, getAllShopProducts, getAddresses, getOrdersList };
