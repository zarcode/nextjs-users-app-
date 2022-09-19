import { useUserCreate } from './usersApi';
import React, { useState } from 'react';

const UserEditFrom = () => {
    const createUserMutation = useUserCreate()
	// Form state
	const [form, setForm] = useState({
		name: '',
		email: '',
		gender: '',
	})

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm(old => ({
			...old,
			[e.target.name]: e.target.value
		}))
	}

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log(e)
	}
    return (
  
          <form onSubmit={onSubmit}>
			<input
				type="text"
				name="name"
				value={form.name}
				onChange={onChange}
			/>
			<input
				type="text"
				name="name"
				value={form.email}
				onChange={onChange}
			/>
			<button
				type="submit"
			>
				Submit
			</button>
          </form>
        
    )
}

export default UserEditFrom
