import React, { useState, useEffect } from 'react';
import { Base64 } from 'js-base64';
import {
    Link,
    Button,
    Modal,
    ModalBody,
    useDisclosure
} from "@nextui-org/react";
import { MdEmail } from "react-icons/md";
import { useForm, SubmitHandler } from "react-hook-form"

const ContactBanner = () => {
    const [contact, setContact] = useState<string>('');
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const contactString: string = "c21hcnR3aGFsZV9wcm9qZWN0QGFyY3R1cy5jYQo=";

    interface IFormInput {
        firstName: string
        lastName: string
        email: string
      }

    const { register, handleSubmit } = useForm<IFormInput>()
    const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data);

    const openModal = () => {
        isOpen;
    };

    useEffect(() => {
        setContact(Base64.decode(contactString));
    }, [contactString]);

    return (
        <div>
            <Modal className="z-2 h-screen" size={'5xl'} isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose}>
                <ModalBody>
                    <form onSubmit={handleSubmit(onSubmit)}>
                    <input {...register("firstName", { required: true, maxLength: 20 })} />
                    <input {...register("lastName", { pattern: /^[A-Za-z]+$/i })} />
                        <input type="email" placeholder="Email" />
                        <textarea placeholder="Message" />
                        <Button type="submit">Send</Button>
                    </form>
                </ModalBody>
            </Modal>
            <Button className="h-7 z-2 bg-buttonbg" onClick={openModal}>
                <MdEmail size={20} /> Contact Us
            </Button>
        </div>
    );
};

export default ContactBanner;
