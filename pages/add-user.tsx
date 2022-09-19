import React from 'react';
import type { NextPage } from 'next'
import Layout from "../layout"
import UserEditForm from "../components/users/userEditForm"

const AddUser: NextPage = () => {
    return (
        <Layout>
          <h1>
            Add a new user
          </h1>
          <UserEditForm/>
        </Layout>
    )
}

export default AddUser
