
import { ReactNode } from "react"
import classNames from "classnames"
import Image from 'next/image'
import Link from 'next/link'
import styles from './Layout.module.css'
import PageHead from "./page-head"

interface Props {
    children?: ReactNode
}

export default function Layout({children}:Props) {
  return (
    <div className={styles.container}>
        <PageHead/>
        <Link href="/">
            <span className={classNames(styles.logo, "center-horizontally")}>
            <Image src="/users.svg" alt="App Logo" width={80} height={80} />
            </span>
        </Link>

        <main className={styles.main}>
            {children}
        </main>

        <footer className={styles.footer}>
            <p>
                Powered by
                <span className={styles.logo}>
                    <Image src="/users.svg" alt="Users Logo" width={40} height={40} />
                </span>
            </p>
        </footer>
    </div>
  )
}
