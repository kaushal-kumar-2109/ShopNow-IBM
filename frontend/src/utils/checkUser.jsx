import { data } from "react-router-dom";

const STORAGE_KEY = "ShopNowUserData";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const clearSession = () => {
    localStorage.removeItem(STORAGE_KEY);
    document.cookie = "jwtoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "jwtoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname + ";";
};

const CheckUserData = async () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { status: false, message: "User not found", data: null };

        const user = JSON.parse(raw);
        if (!user) return { status: false, message: "User not found", data: null };

        // 7-day expiry check
        if (user.expiresDate) {
            if (Date.now() > user.expiresDate) {
                alert("Your session has expired. Logging you out...");
                clearSession();
                return { status: false, message: "Session expired", data: null };
            }
        }

        return { status: true, message: "User found", data: user };
    } catch (err) {
        return { status: false, message: "Something went wrong", error: err };
    }
};

export { CheckUserData, clearSession, STORAGE_KEY };