'use strict'

import styles from './ArticleCard.module.scss'
import Image from 'next/image'

interface ArticleCardProps {
    title: string;
    content: string;
    //Date format in 2023-07-26T17:19:52+00:00
    date: string;
}

export default function ArticleCard({ title, content, date }: ArticleCardProps) {

    // Render date string in format: "July 27th, 2023" format from 2023-07-26T17:19:52+00:00
    const dateString = new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

    return (
        <div className={styles.card}>
            <div className={styles.newsHeader}>
                {title}
            </div>
            <div className={styles.date}>
                {dateString}
            </div>
            <div className={styles.content}>
                <p>{content}</p>
            </div>
            <Image />
        </div >
    )
}