
import type { GetStaticProps, GetStaticPaths, NextPage } from 'next'
import Link from 'next/link'
import Layout from '../layout'
import Users from '../components/users/users'
import { getUsers } from '../components/users/usersApi'
import { dehydrate, QueryClient } from "@tanstack/react-query"

const Home:NextPage = () => {
  return (
    <Layout>

        <h1>
        Learn to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <Users/>
        <Link href="/add-user">Add user</Link>
    </Layout>

  )
}

export default Home

export const getStaticProps: GetStaticProps = async (context) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["users"], 
    () => getUsers(1)
  );  

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
};

// export const getStaticPaths: GetStaticPaths = async () => {
//   return {
//     paths: [],
//     fallback: "blocking"
//   };
// };