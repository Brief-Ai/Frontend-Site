'use client'

import styles from './Header.module.scss'
import Image from 'next/image'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import resultReloadSvg from '../../../../public/svgs/resultReload.svg'

interface SearchResultsProps {
    searchTerm: string;
}

const searchResultsVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Header() {
    const sampleData = [
        {
            "author": "TMZ Staff",
            "title": "Rafael Nadal Pulls Out Of U.S. Open Over COVID-19 Concerns",
            "description": "Rafael Nadal is officially OUT of the U.S. Open ... the tennis legend said Tuesday it's just too damn unsafe for him to travel to America during the COVID-19 pandemic. \"The situation is very complicated worldwide,\" Nadal wrote in a statement. \"The…",
            "url": "https://www.tmz.com/2020/08/04/rafael-nadal-us-open-tennis-covid-19-concerns/",
            "source": "TMZ.com",
            "image": "https://imagez.tmz.com/image/fa/4by3/2020/08/04/fad55ee236fc4033ba324e941bb8c8b7_md.jpg",
            "category": "general",
            "language": "en",
            "country": "us",
            "published_at": "2020-08-05T05:47:24+00:00"
        },
        {
            "author": "TMZ Staff",
            "title": "Rafael Nadal Pulls Out Of U.S. Open Over COVID-19 Concerns",
            "description": "Rafael Nadal is officially OUT of the U.S. Open ... the tennis legend said Tuesday it's just too damn unsafe for him to travel to America during the COVID-19 pandemic. \"The situation is very complicated worldwide,\" Nadal wrote in a statement. \"The…",
            "url": "https://www.tmz.com/2020/08/04/rafael-nadal-us-open-tennis-covid-19-concerns/",
            "source": "TMZ.com",
            "image": "https://imagez.tmz.com/image/fa/4by3/2020/08/04/fad55ee236fc4033ba324e941bb8c8b7_md.jpg",
            "category": "general",
            "language": "en",
            "country": "us",
            "published_at": "2020-08-05T05:47:24+00:00"
        },
        {
            "author": "TMZ Staff",
            "title": "Rafael Nadal Pulls Out Of U.S. Open Over COVID-19 Concerns",
            "description": "Rafael Nadal is officially OUT of the U.S. Open ... the tennis legend said Tuesday it's just too damn unsafe for him to travel to America during the COVID-19 pandemic. \"The situation is very complicated worldwide,\" Nadal wrote in a statement. \"The…",
            "url": "https://www.tmz.com/2020/08/04/rafael-nadal-us-open-tennis-covid-19-concerns/",
            "source": "TMZ.com",
            "image": "https://imagez.tmz.com/image/fa/4by3/2020/08/04/fad55ee236fc4033ba324e941bb8c8b7_md.jpg",
            "category": "general",
            "language": "en",
            "country": "us",
            "published_at": "2020-08-05T05:47:24+00:00"
        },
        {
            "author": "TMZ Staff",
            "title": "Rafael Nadal Pulls Out Of U.S. Open Over COVID-19 Concerns",
            "description": "Rafael Nadal is officially OUT of the U.S. Open ... the tennis legend said Tuesday it's just too damn unsafe for him to travel to America during the COVID-19 pandemic. \"The situation is very complicated worldwide,\" Nadal wrote in a statement. \"The…",
            "url": "https://www.tmz.com/2020/08/04/rafael-nadal-us-open-tennis-covid-19-concerns/",
            "source": "TMZ.com",
            "image": "https://imagez.tmz.com/image/fa/4by3/2020/08/04/fad55ee236fc4033ba324e941bb8c8b7_md.jpg",
            "category": "general",
            "language": "en",
            "country": "us",
            "published_at": "2020-08-05T05:47:24+00:00"
        },
        {
            "author": "TMZ Staff",
            "title": "Rafael Nadal Pulls Out Of U.S. Open Over COVID-19 Concerns",
            "description": "Rafael Nadal is officially OUT of the U.S. Open ... the tennis legend said Tuesday it's just too damn unsafe for him to travel to America during the COVID-19 pandemic. \"The situation is very complicated worldwide,\" Nadal wrote in a statement. \"The…",
            "url": "https://www.tmz.com/2020/08/04/rafael-nadal-us-open-tennis-covid-19-concerns/",
            "source": "TMZ.com",
            "image": "https://imagez.tmz.com/image/fa/4by3/2020/08/04/fad55ee236fc4033ba324e941bb8c8b7_md.jpg",
            "category": "general",
            "language": "en",
            "country": "us",
            "published_at": "2020-08-05T05:47:24+00:00"
        },
        {
            "author": "TMZ Staff",
            "title": "Rafael Nadal Pulls Out Of U.S. Open Over COVID-19 Concerns",
            "description": "Rafael Nadal is officially OUT of the U.S. Open ... the tennis legend said Tuesday it's just too damn unsafe for him to travel to America during the COVID-19 pandemic. \"The situation is very complicated worldwide,\" Nadal wrote in a statement. \"The…",
            "url": "https://www.tmz.com/2020/08/04/rafael-nadal-us-open-tennis-covid-19-concerns/",
            "source": "TMZ.com",
            "image": "https://imagez.tmz.com/image/fa/4by3/2020/08/04/fad55ee236fc4033ba324e941bb8c8b7_md.jpg",
            "category": "general",
            "language": "en",
            "country": "us",
            "published_at": "2020-08-05T05:47:24+00:00"
        },
    ]
    const searchBarRef = useRef<HTMLDivElement>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        function handleClickOutside(event: Event) {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
                setSearchTerm(''); // Clear the search term
                setSearchResults([]); // Clear the search results
            }
        }


        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchBarRef]);



    function SearchBar() {
        const [searchTerm, setSearchTerm] = useState('');
        const [hasStartedTyping, setHasStartedTyping] = useState(false);

        const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(event.target.value);
            setHasStartedTyping(true);
        };




        return (
            <>
                <div ref={searchBarRef}
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
                {searchTerm && <motion.div
                    ref={searchBarRef}
                    className={styles.searchResults}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: hasStartedTyping ? 1 : 0, y: 0 }}
                    transition={{ duration: 0.5 }} >
                    {hasStartedTyping && searchTerm && <SearchResults searchTerm={searchTerm} />}
                </motion.div >}
            </>
        );
    }



    function SearchResults({ searchTerm }: SearchResultsProps) {
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
                    duration: 0.5, // Adjust the duration as needed
                },
            },
        };

        const [searchResults, setSearchResults] = useState([]);

        const search = async (query: string) => {
            // Call your search API here
            // This is just a placeholder, replace it with your actual search logic
            fetch(`/api/search?query=${query}`)
                .then(response => response.json())
                .then(data => setSearchResults(data));
        }

        return (
            <motion.ul
                className={styles.searchResultsList}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {sampleData.map((result, index) => (
                    <>
                        {/* If index is 0 then make hr have not top margin */}
                        {index === 0 ? <motion.hr
                            variants={separatorVariants}
                            style={{ marginTop: 0 }}
                            className={styles.resultSeparator} /> : <motion.hr
                            variants={separatorVariants}
                            className={styles.resultSeparator} />}
                        <motion.li
                            className={styles.searchResultItem}
                            key={index}
                            variants={itemVariants}
                        >
                            {/*   reload icon   */}
                            <Image src={resultReloadSvg} alt="Reload Icon" width={14} height={14} className={styles.reloadIcon} />
                            <div className={styles.searchResultItemTitle}>{index + 1}. {result.title},{result.source}</div>
                        </motion.li>
                    </>

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
            </div >

        </section >
    )
}