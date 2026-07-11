import { CheckUserData } from "./checkUser"

const SaveTheamSettings = async (theam) => {
    await CheckUserData().catch(console.error);
    const getUserSettings = localStorage.getItem("ShopNowUserSettings");
    let settings = {};
    if (getUserSettings) {
        try {
            settings = JSON.parse(getUserSettings) || {};
        } catch (e) {
            console.error("Error parsing settings", e);
        }
    }
    
    const newTheme = theam || settings.theam || "light";
    if (settings.theam !== newTheme) {
        settings.theam = newTheme;
        localStorage.setItem("ShopNowUserSettings", JSON.stringify(settings));
    }
};
// Safe default call on import
SaveTheamSettings().catch(console.error);

const GetUserSettings = async () => {
    await CheckUserData().catch(console.error);
    const getUserSettings = localStorage.getItem("ShopNowUserSettings");
    if (!getUserSettings) {
        return {
            status: false,
            message: "No settings found",
        };
    }
    try {
        const data = JSON.parse(getUserSettings);
        return {
            status: true,
            data: data,
        };
    } catch (err) {
        return {
            status: false,
            message: "Error parsing settings",
            error: err
        };
    }
}

export { SaveTheamSettings, GetUserSettings };


