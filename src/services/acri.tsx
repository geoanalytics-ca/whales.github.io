import { Collection, STACLink } from '@stac/StacObjects';

export const fetchItemRefACRI = async (collection: Collection, searchDates: string[]): Promise<any> => {
    const filterStringsBySubstring = (itemHrefs: STACLink[], substrings: string[]): STACLink[] => {
        return itemHrefs.filter((itemLink) => {
            return substrings.some((substring) => itemLink.href.includes(substring));
        });
    };
    const validDates = filterStringsBySubstring(collection.links as STACLink[], searchDates);
    console.log('valid Items', validDates);
    return validDates;
};