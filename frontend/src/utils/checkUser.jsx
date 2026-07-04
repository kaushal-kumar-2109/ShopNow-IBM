const CheckUserData = async () => {
    try {
        const userData = localStorage.getItem("ShopNowUserData");
        const user = JSON.parse(userData);

        if (user) {
            return ({ status: true, message: "User found", data: user });
        } else {
            return ({ status: false, message: "User not found", data: user });
        }
    } catch (err) {
        return { tag: "error", message: "Something went wrong", error: err };
    }
}

export { CheckUserData };