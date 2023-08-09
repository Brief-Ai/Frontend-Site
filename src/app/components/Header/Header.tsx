'use client'

import styles from './Header.module.scss'
import Image from 'next/image'
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import resultReloadSvg from '../../../../public/svgs/resultReload.svg'
import { ApiResponse, searchArticles, validateToken } from '../../api/external-api';
import debounce from '../../utils/useDebounce';
import { generateNewAccessToken, getAccessTokenFromCookie, logout } from '../../utils/auth';
import { usePathname, useRouter } from 'next/navigation';



export default function Header() {

    // Manages auth protected routes and redirects
    const router = useRouter();
    const pathName = usePathname()

    const [dynamicPathName, setDynamicPathName] = useState(pathName)

    // Set the dynamic path name to the current path name
    // Update dynamic path name when the path name changes


    useEffect(() => {
        setDynamicPathName(pathName)

        const attemptRefreshAndRedirect = async () => {
            // TODO: If access token is expired, refresh the token
            //Attempt to refresh the token
            const completedTokenRefresh = await generateNewAccessToken()
            if (completedTokenRefresh) {
                console.log('Token refresh completed')
                if (dynamicPathName === '/login' || dynamicPathName === '/signup') {
                    setDynamicPathName('/')
                    router.push('/');
                }
            } else {
                console.log('Token refresh failed')
                if (dynamicPathName !== '/login' && dynamicPathName !== '/signup') {
                    setDynamicPathName('/login')
                    router.push('/login');
                }
            }
        }

        // Function to check if the user is logged in
        const checkUserLoggedIn = async () => {
            try {
                // Retrieve the access token from the cookie
                const accessToken = await getAccessTokenFromCookie();
                if (!accessToken) {
                    console.log(`No access token while on page ${pathName}`);
                    attemptRefreshAndRedirect()
                    return
                }

                // Validate the access token
                console.log('Validating token...');
                // console.log('Access token 2.5 :', accessToken);
                const validTokenResponse = await validateToken();
                if (validTokenResponse?.status === 200) {
                    console.log('Token is valid');
                    // User is logged in
                    // console.log(`User is logged in while on page ${pathName}`);
                    // If current page is login page, redirect to the home page
                    if (dynamicPathName === '/login' || dynamicPathName === '/signup') {
                        setDynamicPathName('/')
                        router.push('/');
                    }
                } else {
                    // User is not logged in
                    console.log('User is not logged in');
                    attemptRefreshAndRedirect()
                }
            } catch (error) {
                console.error('Error verifying token:', error);
                // Handle any error that occurs during token verification (e.g., network error)
                // For now, you can redirect the user to the login page as a fallback
                router.push('/login');
            }
        };
        // Call the function to check if the user is logged in
        checkUserLoggedIn();
    }, []);







    // Reference to the search bar element for detecting clicks outside
    const searchBarRef = useRef<HTMLDivElement>(null);
    const [searchResults, setSearchResults] = useState<ApiResponse>([]);


    // Effect to handle clicks outside the search bar and close search results
    useEffect(() => {
        function handleClickOutside(event: Event) {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
                console.log('Clicked outside search bar');
                setSearchResults([]);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchBarRef]);

    function SearchBar() {
        const [hasStartedTyping, setHasStartedTyping] = useState(false);
        const [searchTerm, setSearchTerm] = useState('');
        const [myResults, setMyResults] = useState<ApiResponse>([]);

        // Debounce search function to avoid excessive API calls while typing
        const debouncedSearch = useCallback(
            debounce(async (value: string) => {
                console.log('Fetching search results for term:', value);
                try {
                    const response = await searchArticles(value + ' ');

                    if (!response?.ok) {
                        // Handle error fetching search results (e.g., network error)
                        console.error('Error fetching search results:', response);
                        return;
                    }

                    const results = await response.json();

                    if (Array.isArray(results) && results.length === 0) {
                        // If no results are returned, set the search results to "No results" object
                        setMyResults([
                            {
                                id: '',
                                title: 'No results',
                                description: '',
                                source: '',
                                url: '',
                                published_at: '',
                                category: '',
                                image: null
                            }
                        ]);
                    } else {
                        setMyResults(results || []);
                    }
                } catch (error) {
                    console.error('Error fetching search results:', error);
                    // Handle error fetching search results (e.g., network error)
                }
            }, 1500),
            []
        );

        // Handler for input change event
        const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            let value = event.target.value;
            setSearchTerm(value);
            setHasStartedTyping(true);
            debouncedSearch(value)
        };

        return (
            <>
                {/* If  searchTerm show searchBarWrapperResults*/}
                {/* If  window.location.pathname is / then add class feedPage*/}

                <motion.div
                    ref={searchBarRef}
                    className={
                        [searchTerm ? styles.searchBarWrapperResults : '', styles.searchBarWrapper, dynamicPathName === '/' ? styles.feedPage : ''].join(" ")
                    }
                    initial="visible"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0, y: -130 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                    }}
                >
                    <Image
                        src="/svgs/search.svg"
                        alt="Search Icon"
                        className={styles.searchIcon}
                        width={23.11}
                        height={23.11}
                    />
                    <input
                        type="text"
                        id="searchBarInput"
                        onChange={handleInputChange}
                        placeholder="Search relevant news..."
                        className={styles.searchBarInput}
                    />
                </motion.div >
                {searchTerm && (
                    <motion.div
                        className={styles.searchResults}
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: hasStartedTyping ? 1 : 0, y: 0 }}
                        transition={{ duration: 0.5 }}
                        ref={searchBarRef}
                    >
                        {hasStartedTyping && searchTerm && <SearchResults results={myResults} />}
                    </motion.div>
                )
                }
            </>
        );
    }

    interface SearchResultsProps {
        results: ApiResponse;
    }

    function SearchResults({ results }: SearchResultsProps) {
        const containerVariants = {
            hidden: { opacity: 1, scale: 0, },
            visible: {
                opacity: 1,
                scale: 1,
                transition: {
                    delayChildren: 0,
                    staggerChildren: 0.1,
                },
            },
        };
        const itemVariants = {
            hidden: { y: 20, x: 20, opacity: 0, },
            visible: {
                y: 0,
                x: 0,
                opacity: 1,
            },
        };
        const separatorVariants = {
            hidden: { opacity: 0, x: 20 },
            visible: {
                opacity: 1,
                x: 0,
                transition: {
                    duration: 0.5,
                },
            },
        };

        const [searchResults, setSearchResults] = useState<ApiResponse>(results);

        // Update search results when the "results" prop changes
        useEffect(() => {
            // If results prop is empty, set search results to aarray with one empty object to show "No results" message
            if (results.length === 0) {
                setSearchResults([{
                    id: '',
                    title: 'No results',
                    description: '',
                    source: '',
                    url: '',
                    published_at: '',
                    category: '',
                    image: null
                }]);
            } else
                setSearchResults(results);
        }, [results]);



        return (
            <motion.ul
                key={searchResults.length} // Use the length of the searchResults array as the key
                className={styles.searchResultsList}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {searchResults.map((result, index) => (
                    <a key={index} href={result.url} target='_blank
                    '>
                        {index === 0 ? (
                            <motion.hr
                                variants={separatorVariants}
                                style={{ marginTop: 0 }}
                                className={styles.resultSeparator}
                            />
                        ) : (
                            <motion.hr
                                variants={separatorVariants}
                                className={styles.resultSeparator}
                            />
                        )}
                        {/* If title is 'No results' dont show svg and number */}
                        {result.title == 'No results' && (
                            <motion.li
                                className={styles.searchResultItem}
                                key={index}
                                variants={itemVariants}
                            >
                                <div className={styles.searchResultItemTitle}>
                                    {result.title + '...'}
                                </div>
                            </motion.li>
                        ) || (
                                <motion.li
                                    className={styles.searchResultItem}
                                    key={index}
                                    variants={itemVariants}
                                >
                                    <Image
                                        src={resultReloadSvg}
                                        alt="Reload Icon"
                                        width={14}
                                        height={14}
                                        className={styles.reloadIcon}
                                    />
                                    <div className={styles.searchResultItemTitle}>{index + 1}. {result.title}</div>
                                </motion.li>
                            )}



                    </a>
                ))}
            </motion.ul>
        );
    }

    const logoVariants = {
        hidden: { opacity: 0, y: -30 },
        visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.8 } },
    };

    const buttonVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.8 } },
    };

    return (
        // Style of justify content is set to space-between to push the action buttons to the right if window is not '/'
        <section className={styles.wrapper} style={{ justifyContent: dynamicPathName === '/' ? 'center' : 'space-between' }}>
            {/* <p>{dynamicPathName}</p> */}
            <motion.a
                className={styles.logoNameWrapper}
                initial="hidden"
                animate="visible"
                variants={logoVariants}
                href="/"
                target='_self'
            >
                <motion.img
                    src="/images/brief.png"
                    alt="Brief Ai Logo"
                    width={52}
                    height={52}
                    className={styles.logo}
                />
                <motion.div
                    className={styles.bizName}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 1, duration: 0.8 } }}
                >
                    Brief.
                    {/* ({dynamicPathName}) */}
                </motion.div>
            </motion.a>
            {/* Hide if not window '/' */}
            {(dynamicPathName === '/') && (
                <SearchBar />
            )}
            <motion.div
                className={styles.actionButtonWrapper}
                initial="hidden"
                animate="visible"
                variants={buttonVariants}
            >
                {(dynamicPathName != '/' && dynamicPathName != '/interests') && (
                    <>
                        <motion.a
                            className={[styles.btn, styles.signUpBtn].join(' ')}
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            href="/signup"
                            target='_self'
                        >
                            Sign Up
                        </motion.a>
                        <motion.a
                            className={[styles.btn, styles.loginBtn].join(' ')}
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            href="/login"
                            target='_self'
                        >
                            Login
                        </motion.a>
                    </>
                )}

                {(dynamicPathName === '/' || dynamicPathName == '/interests') && (
                    <motion.a
                        className={[styles.btn, styles.signUpBtn].join(' ')}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        href="/interests"
                        target='_self'
                    >
                        My Interests
                    </motion.a>
                )}
                {(dynamicPathName === '/' || dynamicPathName == '/interests') && (
                    <motion.a
                        className={[styles.btn, styles.loginBtn].join(' ')}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        onClick={() => {
                            logout();
                        }}
                    >
                        Log Out
                    </motion.a>
                )}
            </motion.div>
        </section >
    )
}
