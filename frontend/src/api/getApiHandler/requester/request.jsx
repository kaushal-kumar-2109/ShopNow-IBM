const GetDataCall = async (url) => {
    try {
        const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        const data = await response.json();
        if (response.status == 200) {
            return {
                flag: true,
                message: "Data fetched successfully",
                data: data
            };
        } else {
            return {
                flag: false,
                message: "Faild to fetch data",
                error: data
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


export default GetDataCall;