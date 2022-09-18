import { useUserCreate } from '@/components/users/usersApi';
import type { NextPage } from 'next'
import Layout from "../layout";

const AddUser:NextPage = () => {
  const createUserMutation = useUserCreate()
  return (
    <Layout>
      <h1>
      Add a new user
      </h1>
    </Layout>
  )
}

export default AddUser
