'use client'

import React, { useEffect, useState } from 'react';
import styles from './interests.module.scss';
import { motion } from 'framer-motion'; // Import the motion component
import { MessageType, getMessageStyles, hideMessage, showMessage } from '../utils/messageUtils/messageUtils';
import { getInterests, updateInterests } from '../api/external-api';

export default function Interests() {

    // Message
    const [statusMessage, setStatusMessage] = useState('');
    const [messageType, setMessageType] = useState<MessageType | null>(null); // Add messageType state

    const [interests, setInterests] = useState<string[]>([]);
    const [newInterest, setNewInterest] = useState('');

    // On mount, get the interests from the external API
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getInterests();
                let data = response ? await response.json() : null;

                let interests = data?.interests;

                // Convert string array to array of strings
                // {"interests":"['sports', 'games', 'art']"} to ['sports', 'games', 'art']
                if (data.interests == '') {
                    interests = [];
                } else if (interests) {
                    interests = interests.replace(/'/g, '"');
                    interests = JSON.parse(interests);
                }

                console.log('Response Data:', data);
                console.log('Response Code:', response?.status);
                console.log('interests:', interests);



                if (response?.status === 200) {
                    console.log('interests:', interests);
                    setInterests(interests);
                } else {
                    if (data?.errors) {
                        console.log('credentials errors:', data.errors[0]);
                        showMessage(data.errors[0], MessageType.ERROR, setStatusMessage, setMessageType);
                    } else {
                        console.log('Unknown error');
                        showMessage('Unable to find interests for the user, try adding some.', MessageType.ERROR, setStatusMessage, setMessageType);
                        // Wait 2 secounds then close the message
                        setTimeout(() => {
                            hideMessage(setStatusMessage, setMessageType);
                        }, 2000);
                    }
                }
            } catch (error) {
                console.error(error);
                showMessage('An error occurred while fetching interests. Please try again.', MessageType.ERROR, setStatusMessage, setMessageType);
            }
        }

        fetchData();
    }, []);


    const handleKeyDown = (event: { key: string; }) => {
        if (event.key === 'Enter' && newInterest.trim() !== '') {
            setInterests([...interests, newInterest]);
            setNewInterest('');
        }
    };

    const handleUpdateInterests = async () => {
        try {
            const response = await updateInterests(interests);
            const data = response ? await response.json() : null;
            // Use showMessage to display the message
            if (response?.status === 200) {
                showMessage('Interests updated successfully!', MessageType.SUCCESS, setStatusMessage, setMessageType);
                setTimeout(() => {
                    hideMessage(setStatusMessage, setMessageType);
                }, 1000);
            } else {
                if (data?.errors) {
                    console.log('credentials errors:', data.errors[0]);
                    showMessage(data.errors[0], MessageType.ERROR, setStatusMessage, setMessageType);
                } else {
                    console.log('Unknown error');
                    showMessage('An unknown error occurred. Please try again.', MessageType.ERROR, setStatusMessage, setMessageType);
                }
            }
        } catch (error) {
            console.error(error);
            showMessage('An error occurred while updating interests. Please try again.', MessageType.ERROR, setStatusMessage, setMessageType);
        }
    };

    const handleDeleteInterest = (indexToRemove: number) => {
        setInterests(interests.filter((_, index) => index !== indexToRemove));
    };

    // Animation properties for the container and each input
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0,
                staggerChildren: 0.1,
            },
        },
    };

    const inputVariants = {
        hidden: { opacity: 0, y: -30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    };

    const cardVariants = {
        // The background card animation
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
    };

    const buttonVariants = {
        // Submit button, slide in from left
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },

    }

    return (
        <motion.main
            className={styles.wrapper}
            initial="hidden"
            animate="visible"
            variants={containerVariants} // Use containerVariants for the container animation
        >
            <style jsx global>
                {`body {background-image: url("/images/backgroundStars.png");}`}
            </style>
            <motion.div
                className={styles.mainCard}
                variants={cardVariants} // Use cardVariants for the card animation
            >
                <div className={styles.contentWrapper}>

                    <motion.div className={styles.formItem} variants={inputVariants}>
                        <input
                            type="text"
                            placeholder="Type here to add a new interest..."
                            className={styles.input}
                            value={newInterest}
                            onChange={(event) => setNewInterest(event.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </motion.div>
                    <div className={styles.interestContainer}>
                        <ul className={styles.interestsWrapper}>
                            {interests.map((interest, index) => (
                                <li className={styles.interest} key={index}>
                                    <p className={styles.interestText}>{interest}</p>
                                    {/* Delete SVG */}
                                    <img
                                        className={styles.interestClose}
                                        src='/svgs/escape.svg'
                                        alt="Delete"
                                        onClick={() => handleDeleteInterest(index)}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <motion.button
                        type="submit"
                        className={styles.submitBtn}
                        variants={buttonVariants}
                        onClick={async () => {
                            handleUpdateInterests()
                        }}
                    >
                        Save
                    </motion.button>


                    <div className={styles.statusMessageWrapper}>
                        {statusMessage && (
                            <div className={getMessageStyles(messageType)}>
                                <p>{statusMessage}</p>
                                <button onClick={() => hideMessage(setStatusMessage, setMessageType)} className={styles.closeBtn}>
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </motion.div>
        </motion.main >
    );
}
