const GetDataCall = async (url) => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            credentials: "include",
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        if (response.status == 200) {
            return {
                flag: true,
                message: data.message,
                data: data.data,
                total: data.total,
                totalPages: data.totalPages
            };
        } else {
            return {
                flag: false,
                message: data.message,
                error: data.data
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