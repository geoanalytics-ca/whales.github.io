import axios from 'axios';
import { Collection, Item } from '@stac/StacObjects'; 
import { fetchItemRefACRI } from '@services/acri';
import { start } from 'repl';

const API_BASE_URL = 'https://acri.blob.core.windows.net/acri/stac'; // Replace with your STAC API base URL

export const fetchCatalog = async (): Promise<any> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/catalog.json`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // console.log('Catalog:', response.data); // Add this line
        return response.data;
    } catch (error) {
        console.error('Error fetching catalog:', error);
        throw error;
    }
};

export const fetchCollection = async (collectionLink: string): Promise<any> => {
    try {
        const response = await axios.get(collectionLink, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching collection:', error);
        throw error;
    }
}

export const fetchItems = async (collection: Collection, startDateTime: string, endDateTime: string): Promise<any> => {
    const filteredItems: Item[] = [];
    console.log('Collection ID:', collection.id); 
    const searchDates: string[] = [];
    const startDate: Date = new Date(startDateTime)
    const endDate: Date = new Date(endDateTime)
    console.log('startDate', startDate)
    console.log('endDate', endDate)
    const currentDate: Date = new Date(startDate);
    while (currentDate <= endDate) {
        searchDates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    switch (collection.id) {
        case 'acri':
            console.log('Fetching ACRI items')
            return await fetchItemRefACRI(collection, searchDates);
        case 'arctus':
            console.log('Fetching Arctus items')
            return filteredItems;
        case 'fronts':
            console.log('Fetching Fronts items')
            return filteredItems;
        default:
            return filteredItems;
    }
}
    
export const fetchItem = async (itemLink: string): Promise<any> => {
    try {
        const response = await axios.get(itemLink, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('Item:', response.data); // Add this line
        return response.data;
    } catch (error) {
        console.error('Error fetching item:', error);
        throw error;
    }
};