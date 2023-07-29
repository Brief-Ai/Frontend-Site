'use client'

import styles from './Header.module.scss'
import Image from 'next/image'

export default function Header() {

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
            <div className={styles.searchBarWrapper}>
                <Image
                    src="/svgs/search.svg"
                    alt="Search Icon"
                    className={styles.searchIcon}
                    width={23.11}
                    height={23.11}
                />
                <input type="text" className={styles.searchBarInput} placeholder="Search relevant news..." />
            </div>
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