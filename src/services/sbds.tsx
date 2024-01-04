import axios, { AxiosInstance, AxiosResponse } from 'axios';

class SBDSClient {
    private axiosInstance: AxiosInstance;

    constructor(baseURL: string) {
        const sbdsKey = process.env.NEXT_PUBLIC_SBDS_KEY?.trim();

        if (sbdsKey) {
            this.axiosInstance = axios.create({
                baseURL,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sbdsKey}`
                },
            });
        } else {
            console.log('SBDS key not found');
        }
    }

    public async getChipMetadata<T>(chipId: number): Promise<T> {
        const payload = {
            chip_id: chipId
        };
        const response: AxiosResponse<T> = await this.axiosInstance.get('/chip-metadata', {params: payload});
        return response.data;
    }

    public async getDetections<T>(startDate: string, endDate: string, detectionType: string): Promise<T> {
        const payload = {
            start_date: startDate,
            end_date: endDate,
            detection_type: detectionType
        };
        const response: AxiosResponse<T> = await this.axiosInstance.get('/detections', {params: payload});
        return response.data;
    }

    public async getBlobSAS<T>(blobName: string): Promise<T> {
        const payload = {
            blob_name: blobName
        };
        const response: AxiosResponse<T> = await this.axiosInstance.get('/blob-sas', {params: payload});
        return response.data;
    }

}

export default SBDSClient;
