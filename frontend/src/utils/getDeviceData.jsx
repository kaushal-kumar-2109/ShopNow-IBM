import FingerprintJs from "@fingerprintjs/fingerprintjs";




const getDeviceInfo = async () => {
    try {
        const fp = await FingerprintJs.load();
        const result = await fp.get();
        return ({
            status: true,
            message: "Device data fetched successfully!",
            data: {
                architecture: result.components.architecture.value,
                hardwareConcurrency: result.components.hardwareConcurrency.value,
                platform: result.components.platform.value,
                timezone: result.components.timezone.value,
                screenResolution: result.components.screenResolution.value,
                deviceMemory: result.components.deviceMemory.value
            },
            error: null
        });
    }
    catch (err) {
        return ({
            status: false,
            message: "Error in getting device data!",
            data: null,
            error: err
        });
    }
}
export { getDeviceInfo }
