'use client'

import styles from './Header.module.scss'
import Image from 'next/image'
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import resultReloadSvg from '../../../../public/svgs/resultReload.svg'
import searchArticles from '../../api/external-api';
import debounce from '../../utils/useDebounce';

type ApiResponse = Array<{
    id: string
    title: string
    description: string
    url: string
    published_at: string
    category: string
    image: string | null
}>

export default function Header() {
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
                const results = await searchArticles(value + ' ');
                console.log('Search results:', results);
                setMyResults(results);
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
                <div
                    ref={searchBarRef}
                    className={searchTerm ? [styles.searchBarWrapperResults, styles.searchBarWrapper].join(" ") : styles.searchBarWrapper}
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
                </div>
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
                )}
            </>
        );
    }

    interface SearchResultsProps {
        results: ApiResponse;
    }

    function SearchResults({ results }: SearchResultsProps) {
        const containerVariants = {
            hidden: { opacity: 1, scale: 0 },
            visible: {
                opacity: 1,
                scale: 1,
                transition: {
                    delayChildren: 0.3,
                    staggerChildren: 0.2,
                },
            },
        };
        const itemVariants = {
            hidden: { y: 20, opacity: 0 },
            visible: {
                y: 0,
                opacity: 1,
            },
        };
        const separatorVariants = {
            hidden: { opacity: 0, y: 20 },
            visible: {
                opacity: 1,
                y: 0,
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
                    <a key={index} href={result.url} target='_blank'>
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
                                    {result.title}
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

    return (
        <section className={styles.wrapper}>
            <div className={styles.logoNameWrapper}>
                <Image
                    src="/images/brief.png"
                    alt="Brief Ai Logo"
                    width={52}
                    height={52}
                    className={styles.logo}
                />
                <div className={styles.bizName}>
                    Brief.
                </div>
            </div>
            <SearchBar />
            <div className={styles.actionButtonWrapper}>
                <div className={[styles.btn, styles.signUpBtn].join(" ")} >
                    Sign Up
                </div>
                <div className={[styles.btn, styles.loginBtn].join(" ")} >
                    Login
                </div>
            </div>
        </section>
    )
}
