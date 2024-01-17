import { Collection, STACLink } from '../stac/StacObjects';

export const fetchItemRefACRI = (collection: Collection, searchDates: string[]): STACLink[] => {
    const filterStringsBySubstring = (itemHrefs: STACLink[], substrings: string[]): STACLink[] => {
        return itemHrefs.filter((itemLink) => {
            return substrings.some((substring) => itemLink.href.includes(substring));
        });
    };
    const validDates = filterStringsBySubstring(collection.links as STACLink[], searchDates);
    console.log('valid Items', validDates);
    return validDates;
};

export const fetchItemRefSuitableHabitat = (collection: Collection, searchDates: string[]): STACLink[] => {
    const validDates: STACLink[] = [];
    collection.links.filter((link: STACLink) => (link.rel === 'item')).forEach((itemLink) => {
        searchDates.forEach((searchDate) => {
            if (itemLink.href.includes(searchDate)) {
                validDates.push(itemLink);
            }
        });
    });
    console.log('valid Items', validDates);
    return validDates;
}