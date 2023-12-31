'use client'

import React, { useEffect, useState } from 'react';
import { createAccount, login, validateToken } from '../api/external-api';
import { getAccessTokenFromCookie, setAccessTokenInCookie, setRefreshTokenInCookie } from '../utils/auth'; // Import the utility function
import styles from './login.module.scss';
import { showMessage, hideMessage, MessageType, getMessageStyles } from '../utils/messageUtils/messageUtils'; // Import the utility functions
import { motion } from 'framer-motion'; // Import the motion component
import { useRouter } from 'next/navigation';

export default function Login() {




    // Form fields
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Message
    const [statusMessage, setStatusMessage] = useState('');
    const [messageType, setMessageType] = useState<MessageType | null>(null); // Add messageType state



    const handleCreateAccount = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent the default form submission behavior

        const response = await login(username, password);
        const data = response ? await response.json() : null;



        console.log('Response Data:', data);
        console.log('Response Code:', response?.status);
        // console.log('interests:', interests);

        if (response?.status === 200 || response?.status === 201) {
            // Account created successfully
            const loginMessage = 'Login successful! Redirecting...';
            showMessage(loginMessage, MessageType.SUCCESS, setStatusMessage, setMessageType);
            // You may want to redirect or take other actions upon successful account creation
            setAccessTokenInCookie(data.token.access);
            setRefreshTokenInCookie(data.token.refresh);


            setTimeout(() => {
                hideMessage(setStatusMessage, setMessageType);
                // Redirect to the home page
                window.location.href = '/';
                // Reload the page
                // window.location.reload();
            }, 2000);
        } else {
            if (data?.errors) {
                console.log('credentials errors:', data.errors[0]);
                showMessage(data.errors[0], MessageType.ERROR, setStatusMessage, setMessageType);
            } else {
                console.log('Unknown error');
                showMessage('An unknown error occurred. Please try again.', MessageType.ERROR, setStatusMessage, setMessageType);
            }
        }




    }

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
                <div className={styles.formWrapper}>
                    <h2 className={styles.formTitle}>Login to your account</h2>
                    <p className={styles.formSubtitle}>Sign in to your account to continue.</p>
                    <div className={styles.formItems}>
                        {/* Signup form */}
                        {/* Email, Password, Confirm Password */}
                        <motion.form
                            className={styles.form}
                            onSubmit={handleCreateAccount}
                            variants={containerVariants} // Use containerVariants for the container animation
                        >
                            <motion.div className={styles.formItem} variants={inputVariants}>
                                <label htmlFor="username" className={styles.label}>
                                    Username
                                </label>
                                <input
                                    type="text"
                                    required
                                    id="email"
                                    placeholder="Username"
                                    className={styles.input}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </motion.div>
                            <motion.div className={styles.formItem} variants={inputVariants}>
                                <label htmlFor="password" className={styles.label}>
                                    Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    id="password"
                                    placeholder="Password"
                                    className={styles.input}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </motion.div>
                            {/* If there is a status message, show div*/}

                            <motion.button
                                type="submit"
                                className={styles.submitBtn}
                                variants={buttonVariants}
                            >
                                Login
                            </motion.button>

                            <p className={styles.refToLoginText}>

                            </p>

                            <div className={styles.statusMessageWrapper}>
                                {statusMessage && (
                                    <div className={getMessageStyles(messageType)}>
                                        <p>{statusMessage}</p>
                                        <button onClick={() => hideMessage(setStatusMessage, setMessageType)} className={styles.closeBtn}>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.form>
                    </div>
                </div>
            </motion.div>
        </motion.main >
    );
}
