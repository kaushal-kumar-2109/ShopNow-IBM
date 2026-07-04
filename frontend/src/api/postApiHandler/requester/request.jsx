const PostDataCall = async (url, data) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', "auth": localStorage.getItem("GoEventUserData") },

            body: JSON.stringify(data)
        });
        const json = await response.json();
        if (response.status == 200 || response.status == 201) {
            return {
                flag: true,
                message: "Data fetched successfully",
                data: json
            };
        } else {
            return {
                flag: false,
                message: "Faild to fetch data",
                data: json
            };
        }
    } catch (err) {
        return ({
            flag: false,
            message: "Faild to fetch data",
            error: err
        });
    }
}


export default PostDataCall;