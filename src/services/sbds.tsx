import axios from 'axios';

import { Detection } from '../types/db';

const apiURL = "/api/whalemap"

export const getDetections = async (startDate: string, endDate: string, detectionType: string): Promise<any> => {
    const params = {
        'startdate': startDate,
        'enddate': endDate,
        'detectiontype': detectionType
    };
    console.log('params', params);
    const response = await axios.get(`${apiURL}/detections`, {
        params: params,
        headers: {'Content-Type': 'application/json'},
    });

    if (response.status == 204) {
        return [];
    }
        
    return response.data.detections;
}

export const getBlobSAS = async (
    {blobName, setDetectionImage} : { blobName: string, setDetectionImage: React.Dispatch<React.SetStateAction<string>>}
    ) => {
    const params = {
        'blob_name': blobName
    };
    const response = await axios.get(
        `${apiURL}/blobsas`, {
        params: params,
        headers: {'Content-Type': 'application/json'},
    });
    console.log('response', JSON.parse(response.data.blobsas));
    setDetectionImage(JSON.parse(response.data.blobsas));
}
