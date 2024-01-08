import { fetchCatalog, fetchCollection, fetchItems, fetchItem } from '@services/stac';
import React, { useState, useEffect, use } from 'react';
import { Catalog, Collection, Item, STACLink } from '@stac/StacObjects';
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
        mapCenter, setMapCenter, mapZoom,
        catalog, setCatalog, collections, setCollections, itemLinks, setItemLinks,
    } : { 
        mapCenter: number[], setMapCenter: React.Dispatch<React.SetStateAction<number[]>>, mapZoom: number,
        catalog: Catalog | undefined, setCatalog: React.Dispatch<React.SetStateAction<Catalog | undefined>>, collections: Collection[], setCollections: React.Dispatch<React.SetStateAction<Collection[]>>, itemLinks: STACLink[], setItemLinks: React.Dispatch<React.SetStateAction<STACLink[]>>,
    }
    ) => {
    
    // Track the state of the query parameters
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    // Track the state of the collections and items
    const [showItemsResults, setShowItemsResults] = useState<STACLink[]>([]); // Track the query results
    
    // Track which Item's should be rendered
    const [selectedCollections, setSelectedCollections] = useState<Collection[]>([]); // Track selected collections
    const [selectedItems, setSelectedItems] = useState<STACLink[]>([]); // Track selected items

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
            
    const handleItemChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('Item changed:', event.target.name, event.target.checked);
        const selectedItem = selectedItems.some((item) => item.title === event.target.name);
        const itemLink: STACLink | undefined = itemLinks.find((item) => item.title === event.target.name);
        console.log('selectedItem:', selectedItem);
        if (event.target.checked && !selectedItem && itemLink) {
            selectedItems.push(itemLink);
            const item = await fetchItem(itemLink.href);
            console.log('Item:', item);
            console.log('Item Assets:', item.assets);
            const dataAssetKey = Object.keys(item.assets).find((k) => k === 'data');
            if (dataAssetKey) {
                const dataAsset = item.assets.data;
                console.log('Data Asset Key:', dataAssetKey);
                console.log('Data Asset:', dataAsset);
            }
        }
        else {
            (itemLink && selectedItem &&
                selectedItems.splice(selectedItems.indexOf(itemLink), 1) &&
                itemLinks.splice(itemLinks.indexOf(itemLink), 1));
        }
        console.log('Selected Items:', selectedItems);
    };

    const ItemPane = (
        { itemLinks, selectedCollections, handleItemChange } : { itemLinks: STACLink[], selectedCollections: Collection[], handleItemChange: (event: React.ChangeEvent<HTMLInputElement>) => void }
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
                                        <FaMap />
                                        <Divider orientation="vertical" />
                                        <FaImage onClick={() => setIsModalOpen(true)} />
                                        <Divider orientation="vertical" />
                                        {/* <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
                                            <img src={itemLink.png} alt={itemLink.title} />
                                        </Modal> */}
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
                                <Checkbox name={link.title} defaultSelected={false} onChange={handleCollectionChange}>
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
                        < ItemPane itemLinks={itemLinks} selectedCollections={selectedCollections} handleItemChange={handleItemChange} />
                    </Card>
                </div>
            </CardBody>
        </Card>
    );
};

export default DataPane;
                
