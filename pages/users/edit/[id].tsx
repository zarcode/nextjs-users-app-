import React from 'react';
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from "@/layout"
import AddEdit from "@/components/users/AddEdit"
import { useUserData } from "@/components/users/usersApi"
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { getUser } from '../../../components/users/usersApi';

type Props = {id: number}

const EditUser: NextPage<Props> = ({id}) => {
    const {data} = useUserData(id)

	return (
		<Layout>
            {typeof data === "undefined" ? (
                <div>Not found</div>
            ) : (
                <>
                    <h1>
                        {`Edit user ${data.name}`}
                    </h1>
                    <Link href="/">{"< Back"}</Link>
                    <AddEdit user={data}/>
                </>
            )}
		</Layout>
	)
}

export default EditUser

export async function getServerSideProps({ params }: { params: { id: string } }) {
    const userId = parseInt(params.id);

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery(["user", userId], 
      () => getUser(userId)
    );  
  
    return {
      props: {
        id: userId,
        dehydratedState: dehydrate(queryClient)
      }
    };
}
