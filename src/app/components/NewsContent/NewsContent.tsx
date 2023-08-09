'use client'

import { useEffect, useState } from 'react';
import { ApiResponse, articleData, getRecommendations } from '../../api/external-api';
import ArticleCard from './ArticleCard/ArticleCard'
import styles from './NewsContent.module.scss'
import { motion } from "framer-motion";


export default function NewsContent() {


    // Get recommended news
    const [recommendedNews, setRecommendedNews] = useState<ApiResponse>([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getRecommendations();
                if (response && response.ok) {
                    const data: articleData[] = await response.json();

                    // Fetch images and handle 404s
                    const updatedDataPromises = data.map(async (article) => {
                        const articleImage = article.image || '';
                        try {
                            const imageResponse = await fetch(articleImage);
                            if (imageResponse.status !== 404) {
                                article.image = articleImage;
                            } else {
                                article.image = 'https://www.thermaxglobal.com/wp-content/uploads/2020/05/image-not-found.jpg';
                            }
                        } catch (error) {
                            console.log('Error fetching image:', error);
                            article.image = 'https://www.thermaxglobal.com/wp-content/uploads/2020/05/image-not-found.jpg';
                        }
                        return article;
                    });

                    const updatedData = await Promise.all(updatedDataPromises);

                    setRecommendedNews(updatedData);
                    setLoading(false);
                } else {
                    console.log('Error fetching recommendations:', response?.status);
                    setRecommendedNews([]);
                }
            } catch (error) {
                console.log('Error:', error);
            }
        };

        fetchData();
    }, []);
    // const sampleData = [
    //     {
    //         "author": "TMZ Staff",
    //         "title": "Rafael Nadal Pulls Out Of U.S. Open Over COVID-19 Concerns",
    //         "description": "Rafael Nadal is officially OUT of the U.S. Open ... the tennis legend said Tuesday it's just too damn unsafe for him to travel to America during the COVID-19 pandemic. \"The situation is very complicated worldwide,\" Nadal wrote in a statement. \"The…",
    //         "url": "https://www.tmz.com/2020/08/04/rafael-nadal-us-open-tennis-covid-19-concerns/",
    //         "source": "TMZ.com",
    //         "image": "https://imagez.tmz.com/image/fa/4by3/2020/08/04/fad55ee236fc4033ba324e941bb8c8b7_md.jpg",
    //         "category": "general",
    //         "language": "en",
    //         "country": "us",
    //         "published_at": "2020-08-05T05:47:24+00:00"
    //     },
    //     {
    //         "author": "TMZ Staff",
    //         "title": "Rafael Nadal Pulls Out Of U.S. Open Over COVID-19 Concerns",
    //         "description": "Rafael Nadal is officially OUT of the U.S. Open ... the tennis legend said Tuesday it's just too damn unsafe for him to travel to America during the COVID-19 pandemic. \"The situation is very complicated worldwide,\" Nadal wrote in a statement. \"The…",
    //         "url": "https://www.tmz.com/2020/08/04/rafael-nadal-us-open-tennis-covid-19-concerns/",
    //         "source": "TMZ.com",
    //         "image": "https://imagez.tmz.com/image/fa/4by3/2020/08/04/fad55ee236fc4033ba324e941bb8c8b7_md.jpg",
    //         "category": "general",
    //         "language": "en",
    //         "country": "us",
    //         "published_at": "2020-08-05T05:47:24+00:00"
    //     },
    //     {
    //         "author": "TMZ Staff",
    //         "title": "Rafael Nadal Pulls Out Of U.S. Open Over COVID-19 Concerns",
    //         "description": "Rafael Nadal is officially OUT of the U.S. Open ... the tennis legend said Tuesday it's just too damn unsafe for him to travel to America during the COVID-19 pandemic. \"The situation is very complicated worldwide,\" Nadal wrote in a statement. \"The…",
    //         "url": "https://www.tmz.com/2020/08/04/rafael-nadal-us-open-tennis-covid-19-concerns/",
    //         "source": "TMZ.com",
    //         "image": "https://imagez.tmz.com/image/fa/4by3/2020/08/04/fad55ee236fc4033ba324e941bb8c8b7_md.jpg",
    //         "category": "general",
    //         "language": "en",
    //         "country": "us",
    //         "published_at": "2020-08-05T05:47:24+00:00"
    //     },
    //     {
    //         "author": "TMZ Staff",
    //         "title": "Rafael Nadal Pulls Out Of U.S. Open Over COVID-19 Concerns",
    //         "description": "Rafael Nadal is officially OUT of the U.S. Open ... the tennis legend said Tuesday it's just too damn unsafe for him to travel to America during the COVID-19 pandemic. \"The situation is very complicated worldwide,\" Nadal wrote in a statement. \"The…",
    //         "url": "https://www.tmz.com/2020/08/04/rafael-nadal-us-open-tennis-covid-19-concerns/",
    //         "source": "TMZ.com",
    //         "image": "https://imagez.tmz.com/image/fa/4by3/2020/08/04/fad55ee236fc4033ba324e941bb8c8b7_md.jpg",
    //         "category": "general",
    //         "language": "en",
    //         "country": "us",
    //         "published_at": "2020-08-05T05:47:24+00:00"
    //     },
    //     {
    //         "author": "TMZ Staff",
    //         "title": "Rafael Nadal Pulls Out Of U.S. Open Over COVID-19 Concerns",
    //         "description": "Rafael Nadal is officially OUT of the U.S. Open ... the tennis legend said Tuesday it's just too damn unsafe for him to travel to America during the COVID-19 pandemic. \"The situation is very complicated worldwide,\" Nadal wrote in a statement. \"The…",
    //         "url": "https://www.tmz.com/2020/08/04/rafael-nadal-us-open-tennis-covid-19-concerns/",
    //         "source": "TMZ.com",
    //         "image": "https://imagez.tmz.com/image/fa/4by3/2020/08/04/fad55ee236fc4033ba324e941bb8c8b7_md.jpg",
    //         "category": "general",

    //         "language": "en",
    //         "country": "us",
    //         "published_at": "2020-08-05T05:47:24+00:00"
    //     },
    //     {
    //         "author": "TMZ Staff",
    //         "title": "Rafael Nadal Pulls Out Of U.S. Open Over COVID-19 Concerns",
    //         "description": "Rafael Nadal is officially OUT of the U.S. Open ... the tennis legend said Tuesday it's just too damn unsafe for him to travel to America during the COVID-19 pandemic. \"The situation is very complicated worldwide,\" Nadal wrote in a statement. \"The…",
    //         "url": "https://www.tmz.com/2020/08/04/rafael-nadal-us-open-tennis-covid-19-concerns/",
    //         "source": "TMZ.com",
    //         "image": "https://imagez.tmz.com/image/fa/4by3/2020/08/04/fad55ee236fc4033ba324e941bb8c8b7_md.jpg",
    //         "category": "general",
    //         "language": "en",
    //         "country": "us",
    //         "published_at": "2020-08-05T05:47:24+00:00"
    //     },
    // ]

    const container = {
        hidden: { opacity: 1, scale: 0 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                delayChildren: 1,
                staggerChildren: .4,
            },
        },
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5, // Adjust the duration as needed
            },
        },
    };

    return (
        <section className={styles.wrapper}>
            <motion.div
                className={styles.articles}
                variants={container} // Apply the container variants
                initial="hidden"
                animate="visible"
            >
                {recommendedNews.map((article, index) => {
                    // Limit title to 5 words and add ellipsis
                    let title = article.title.split(' ').slice(0, 7).join(' ') + '';
                    // Also if the title is too long, limit it to 50 characters
                    if (title.length > 30) {
                        title = article.title.split(' ').slice(0, 5).join(' ') + '';
                    }
                    // Limit content to 20 words and add ellipsis
                    let content = article.description.split(' ').slice(0, 16).join(' ')
                    if (content.length > 100) {
                        content = article.description.split(' ').slice(0, 10).join(' ') + '...';
                    }

                    return (
                        <motion.a
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            // Adjust the animation transition as needed
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            variants={item}
                            href={article.url}
                            target='_blank'
                        >
                            <ArticleCard
                                title={title}
                                content={content}
                                date={article.published_at}
                                image={article.image || 'https://www.thermaxglobal.com/wp-content/uploads/2020/05/image-not-found.jpg'}
                                source={article.source}
                                url={article.url}
                                topArticle={index === 0}
                            />
                        </motion.a>
                    );
                })}
            </motion.div>
        </section>
    );
}
