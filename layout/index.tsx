
import { ReactNode } from "react"
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
            <span className={styles.logo}>
            <Image src="/vercel.svg" alt="App Logo" width={72} height={16} />
            </span>
        </Link>

        <main className={styles.main}>

            {children}
        </main>

        <footer className={styles.footer}>
            <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            >
            Powered by{' '}
            <span className={styles.logo}>
                <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
            </span>
            </a>
        </footer>
    </div>
  )
}
