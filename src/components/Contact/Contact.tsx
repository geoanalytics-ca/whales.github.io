import React, { useState, useEffect } from 'react';
import { Base64 } from 'js-base64';
import {
    Link,
    Button
} from "@nextui-org/react";
import { MdEmail } from "react-icons/md";


const ContactBanner = () => {
    const [contact, setContact] = useState<string>('');
    const contactString: string = "c21hcnR3aGFsZV9wcm9qZWN0QGFyY3R1cy5jYQo=";

    useEffect(() => {
        setContact(Base64.decode(contactString));
    }, [contactString]);

    return (
        <div>
            <Button className="h-7 z-2 bg-buttonbg">
                <Link className='text-black text-small' href={`mailto:${contact}`}>
                <MdEmail size={20} /> Contact Us
                </Link>
            </Button>
        </div>
    );
};

export default ContactBanner;
