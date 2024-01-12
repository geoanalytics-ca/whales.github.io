import { fetchCatalog, fetchCollection, fetchItems, fetchItem } from '@services/stac';
import React, { useState, useEffect, use } from 'react';
import { Catalog, Collection, Asset, STACLink } from '@stac/StacObjects';
import { FaImage, FaMap } from "react-icons/fa";
import { 
    Card,
    CardBody,
    Spinner,
    Checkbox,
    Divider,
    Modal,
} from "@nextui-org/react";

const DataPane = (
    { 
        mapCenter, setMapCenter, mapZoom, setMapData,
        catalog, setCatalog, collections, setCollections, itemLinks, setItemLinks,
    } : { 
        mapCenter: number[], setMapCenter: React.Dispatch<React.SetStateAction<number[]>>, mapZoom: number, setMapData: React.Dispatch<React.SetStateAction<string>>,
        catalog: Catalog | undefined, setCatalog: React.Dispatch<React.SetStateAction<Catalog | undefined>>, collections: Collection[], setCollections: React.Dispatch<React.SetStateAction<Collection[]>>, itemLinks: STACLink[], setItemLinks: React.Dispatch<React.SetStateAction<STACLink[]>>,
    }
    ) => {
    
    // Track the state of the query parameters
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    // Track the state of the collections and items
    const [showItemsResults, setShowItemsResults] = useState<STACLink[]>([]); // Track the query results
    const [clickedItem, setClickedItem] = useState<string>(''); // Track the clicked item
    
    // Track which Item's should be rendered
    const [selectedCollections, setSelectedCollections] = useState<Collection[]>([]); // Track selected collections

    // PNG Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
        
    const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value > endDate) {
            setEndDate(event.target.value);
        }
        setStartDate(event.target.value);
    };
    
    const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value < startDate) {
            setStartDate(event.target.value);
        }
        setEndDate(event.target.value);
    };

    const handleCollectionChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedCollection = selectedCollections.find((collection) => collection.id === event.target.name);
        const collection: Collection | undefined = collections.find((collection) => collection.id === event.target.name);
        let newCollection: boolean = false;
        let collectionItems: STACLink[] = [];
        (event.target.checked &&
            !selectedCollection && collection) && (
                selectedCollections.push(collection),
                newCollection = true,
                console.log('Checked:', event.target.name)
        );

        (!event.target.checked &&
            selectedCollection && collection) && (
                selectedCollections.splice(selectedCollections.indexOf(collection), 1),
                console.log('Unchecked:', event.target.name),
                (itemLinks.length > 0) && (
                    itemLinks.forEach((itemLink) => {
                        (itemLink.parent === collection.id) && (
                            itemLinks.splice(itemLinks.indexOf(itemLink), 1)
                        );
                    }
                ))
            );

        (newCollection && collection && startDate < endDate) && (
            collectionItems = await fetchItems(collection, startDate, endDate),
            collectionItems.forEach((itemLink) => {
                itemLink.parent = collection.id;
                itemLinks.push(itemLink);
            }),
            setShowItemsResults(collectionItems)
        );
            
        console.log('Selected Collections:', selectedCollections);

    };

    const handleItemSelection = () => {
        (clickedItem && (
            console.log('Clicked Item:', clickedItem)
        ));
        const itemLink = itemLinks.find((itemLink) => itemLink.title === clickedItem);
        itemLink && fetchItem(itemLink.href).then((item) => {
            console.log('Item:', item);
            item.assets && Object.keys(item.assets).map((key) => {
                const asset = item.assets[key];
                if (
                    key !== 'reference' &&
                    key !== 'data' &&
                    key !== 'netcdf' &&
                    key !== 'image' &&
                    !asset.title.includes('flags')
                ) {
                    console.log('Asset:', asset);
                    setMapData(asset.href);
                }
            });
        });
    };

    // https://acri.blob.core.windows.net/acri/ACRI/ATLNW/merged/day/2022/04/17/L3m_20220417__ATLNW_1_AV-MOD_NRRS469_DAY_00.NRRS469_mean.tif

    useEffect(() => {
        handleItemSelection();
    }, [clickedItem]);

    const ItemPane = (
        { itemLinks, selectedCollections, handleItemSelection } : { itemLinks: STACLink[], selectedCollections: Collection[], handleItemSelection: (event: React.ChangeEvent<HTMLInputElement>) => void }
    ) => {

        useEffect(() => {
            console.log('Item Links:', itemLinks);
        }, [itemLinks]);

        return (
                <CardBody>
                        <div className="flex h-10 items-center space-x-4 text-small">
                            Map
                            <Divider orientation="vertical" />
                            PNG
                            <Divider orientation="vertical" />
                            Item
                        </div>
                        <Divider />
                        <>
                        {(itemLinks.length > 0 && selectedCollections.length > 0) && (
                            showItemsResults.map((itemLink) =>
                                    <div key={itemLink.title} className="flex items-center space-x-4 text-small">
                                        <FaMap key={itemLink.title} onClick={() => setClickedItem(itemLink.title)} />
                                        <Divider orientation="vertical" />
                                        <FaImage onClick={() => setIsModalOpen(true)} />
                                        <Divider orientation="vertical" />
                                        {itemLink.title}
                                    </div>
                            ))}
                        </>
                </CardBody>
        );
    };

    useEffect(() => {
        const fetchCatalogData = async () => {
            await fetchCatalog().then((catalog) => {
                setCatalog(catalog);
            });
        };
        fetchCatalogData();
        console.log('Catalog:', catalog);
    }, []);

    const CollectionPane = (
        { catalog, collections, setCollections } : { catalog: Catalog | undefined, collections: Collection[], setCollections: React.Dispatch<React.SetStateAction<Collection[]>> }
    ) => {
        
        if (catalog && catalog.links && collections.length === 0) {
            catalog.links.filter((link) => link.rel === 'child').forEach(async (link) => {
                const collection = await fetchCollection(link.href).then((collection) => {
                    setCollections(collections => [...collections, collection]);
                    return collection;
                }
                );
                console.log('Collection:', collection);
            });
        }

        return (
                <CardBody>
                    <>{
                        (catalog && catalog.links) ? (
                            catalog.links.filter((link) => link.rel === 'child').map((link) =>
                                <Checkbox key={link.title} name={link.title} defaultSelected={false} onChange={handleCollectionChange}>
                                    {link.title}
                                </Checkbox>
                            )
                        ) : (
                            <Spinner />
                        )
                    }</>
                </CardBody>
        );
    };

    const renderImage = (itemLink: STACLink) => {
        fetchItem(itemLink.href).then((item) => {
            console.log('Item:', item);
            setMapData(item.links.filter((link: any) => link.rel === 'data')[0].href);
        });
    }

    return (
        <Card className='datapane'>
            <CardBody>
                <div>
                    <Card className="date-box">
                        <CardBody>
                            <label htmlFor="startDateTime">Start Date: </label>
                            <input type="date" id="startDateTime" value={startDate} onChange={handleStartDateChange} />
                            <br />
                            <label htmlFor="endDateTime">End Date: </label>
                            <input type="date" id="endDateTime" value={endDate} onChange={handleEndDateChange} />
                    </CardBody>
                </Card>
                </div>
                <div>
                    <Card className='collection-pane'>
                        Collections:
                        < CollectionPane catalog={catalog} collections={collections} setCollections={setCollections} />
                    </Card>
                </div>
                <div>
                    <Card className='item-pane'>
                        Items:
                        < ItemPane itemLinks={itemLinks} selectedCollections={selectedCollections} handleItemSelection={handleItemSelection} />
                    </Card>
                </div>
            </CardBody>
        </Card>
    );
};

export default DataPane;
                
