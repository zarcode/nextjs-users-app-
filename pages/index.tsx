
import type { GetStaticProps, GetStaticPaths, NextPage } from 'next'
import Layout from '../layout'
import Users, { FIRST_PAGE } from '../components/users/usersList'
import { getUsers } from '../components/users/usersApi'
import { dehydrate, QueryClient } from "@tanstack/react-query"

const Home: NextPage = () => {
	return (
		<Layout>
			<Users />
		</Layout>

	)
}

export default Home

export const getServerSideProps: GetStaticProps = async (context) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery(["users", FIRST_PAGE],
		() => getUsers({ params: { page: FIRST_PAGE } })
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