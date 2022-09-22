import { useUserCreate, SubmitUser } from './usersApi';
import React, { useState } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from 'react-hook-form';

const UserEditFrom = () => {
	const queryClient = useQueryClient();
	const createUserMutation = useUserCreate();

	const {
		register,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm<SubmitUser>();

	const onSubmit = (form: SubmitUser) => {
		createUserMutation.mutate(form, {
			onSuccess: () => {
				reset();
				queryClient.invalidateQueries(['users']);
			},
		})
	}

	const createUserMutationError = createUserMutation.error as Error;

	return (
		<>
			{createUserMutation.isSuccess && (<div>User has been created successfully</div>)}
			{createUserMutation.isError && (<div>Error: {createUserMutationError.message}</div>)}
			<form onSubmit={handleSubmit(onSubmit)}>
				<div>
					<label htmlFor="name">Name</label>
					<input
						type="text"
						aria-label="user name"
						aria-errormessage="name-validation-error"
						aria-invalid={errors.name ? "true" : "false"}
						{...register("name", { required: "Name is Required" })}
					/>
					{errors.name && errors.name.type === "required" && (
						<span id="name-validation-error">{errors.name.message}</span>
					)}
				</div>

				<div>
					<label htmlFor="email">Email</label>
					<input
						type="text"
						aria-label="user email"
						aria-errormessage="email-validation-error"
						aria-invalid={errors.email ? "true" : "false"}
						{...register("email", { 
							required: "Email is Required",
							pattern: {
								value: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
								message: "Invalid email address"
							}
						})}
					/>
					{errors.email && (
						<span id="email-validation-error">{errors.email.message}</span>
					)}
				</div>

				<div>
					<label htmlFor="gender">Gender</label>
					<select
						aria-label="user gender"
						aria-errormessage="gender-validation-error"
						aria-invalid={errors.gender ? "true" : "false"}
						{...register("gender", { required: "You need to select gender" })}
					>
						<option value="">---</option>
						<option value="male">Male</option>
						<option value="female">Female</option>
					</select>
					{errors.gender && errors.gender.type === "required" && (
						<span id="gender-validation-error">{errors.gender.message}</span>
					)}
				</div>

				<button
					type="submit"
					disabled={createUserMutation.isLoading ? true : false}
				>
					{createUserMutation.isLoading ? "Submiting" : "Submit"}
				</button>
			</form>
		</>

	)
}

export default UserEditFrom
