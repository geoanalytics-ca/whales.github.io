import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { assert } from 'console';

class SBDSClient {
    private axiosInstance: AxiosInstance;

    constructor(baseURL: string) {
        if (process.env.NEXT_PUBLIC_SBDS_KEY) {
            this.axiosInstance = axios.create({
                baseURL,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SBDS_KEY.trim()}`
                },
            });
        } else {
            throw new Error('SBDS_KEY environment variable not set');
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
