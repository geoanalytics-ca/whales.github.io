import axios from 'axios';
import { Collection, Item } from '../stac/StacObjects'; 
import { 
    fetchItemRefACRI,
    fetchItemRefSuitableHabitat,
 } from '@services/acri';

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

export const fetchItems = async (collection: Collection, startDateTime: Date, endDateTime: Date): Promise<any> => {
    const filteredItems: Item[] = [];
    console.log('Collection ID:', collection.id); 
    const searchDates: string[] = [];
    const startDate: Date = typeof startDateTime === 'string' ? new Date(startDateTime) : startDateTime;
    const endDate: Date = typeof endDateTime === 'string' ? new Date(endDateTime) : new Date(endDateTime)
    console.log('startDate', startDate)
    console.log('endDate', endDate)
    const currentDate: Date = new Date(startDate);
    while (currentDate <= endDate) {
        searchDates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    console.log('searchDates', searchDates);

    switch (collection.id) {
        case 'acri':
            console.log('Fetching ACRI items')
            return fetchItemRefACRI(collection, searchDates);
        case 'Suitablehabitat':
            console.log('Fetching suitablehabitat items')
            return fetchItemRefSuitableHabitat(collection, searchDates);
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
        // console.log('Item:', response.data); // Add this line
        return response.data;
    } catch (error) {
        console.error('Error fetching item:', error);
        throw error;
    }
};