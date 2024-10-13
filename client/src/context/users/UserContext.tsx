"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { User } from "../../types/User";

interface UserContextType {
	users: User[];
	setUsers: (users: User[]) => void;
	addUser: (user: User) => void;
	updateUser: (user: User) => void;
	deleteUser: (id: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [users, setUsers] = useState<User[]>([]);

	const addUser = useCallback((user: User) => {
		setUsers((prevUsers) => [...prevUsers, user]);
	}, []);

	const updateUser = useCallback((updatedUser: User) => {
		setUsers((prevUsers) =>
			prevUsers.map((user) =>
				user.id === updatedUser.id ? updatedUser : user
			)
		);
	}, []);

	const deleteUser = useCallback((id: string) => {
		setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
	}, []);

	return (
		<UserContext.Provider
			value={{ users, setUsers, addUser, updateUser, deleteUser }}
		>
			{children}
		</UserContext.Provider>
	);
};

export const useUserContext = () => {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error("useUserContext debe usarse dentro de un UserProvider");
	}
	return context;
};
