
import type { NextPage } from 'next'
import Link from 'next/link'
import Layout from '../layout'

const Home:NextPage = () => {
  return (
    <Layout>

        <h1>
        Learn to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <Link href="/add-user">Add user</Link>
    </Layout>

  )
}

export default Home
