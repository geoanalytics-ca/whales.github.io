
export type STACLink = {
    rel: string;
    href: string;
    title: string;
    id: string;
    type?: string;
};

// Define the type for the catalog
export type Catalog = {
    id: string;
    title: string;
    description: string;
    stac_version: string;
    links: STACLink[];
    // Add any additional properties specific to your STAC Catalog
};

// Define the type for the collection
export type Collection = {
    id: string;
    title: string;
    description: string;
    stac_version: string;
    links: STACLink[];
    // Add any additional properties specific to your STAC Collection
};

export type Asset = {
    href: string;
    type: string;
    title: string;
    description: string;
    roles: string[];
    // Add any additional properties specific to your STAC Asset
};

// Define the type for the item
export type Item = {
    id: string;
    title: string;
    type: string;
    geometry: {
        type: string;
        coordinates: number[];
    };
    bbox: number[];
    properties: {
        datetime: string;
        'eo:cloud_cover': number;
        'eo:gsd': number;
        'eo:platform': string;
        'eo:instrument': string;
        'eo:off_nadir': number;
        'eo:azimuth': number;
        'eo:sun_azimuth': number;
        'eo:sun_elevation': number;
        'eo:epsg': number;
        'eo:constellation': string;
        'eo:bands': {
            name: string;
            common_name: string;
            description: string;
            gsd: number;
            center_wavelength: number;
            full_width_half_max: number;
            data_type: string;
            physical_range: number[];
            min: number;
            max: number;
            nodata: number;
        }[];
    };
    assets: Asset[];
    links: STACLink[];
    // Add any additional properties specific to your STAC Item
};