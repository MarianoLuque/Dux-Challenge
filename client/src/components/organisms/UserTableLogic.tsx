"use client";

import { useEffect, useRef, useState } from "react";
import { confirmDialog } from "primereact/confirmdialog";
import { User } from "@/types/User";
import { useUserContext } from "@/context/users/UserContext";
import { getUsers, deleteUser } from "@/actions/users/actions";
import { Toast } from "primereact/toast";
import { PaginatorPageChangeEvent } from "primereact/paginator";

interface UserTableProps {
	filters: { usuario: string; estado: string };
}

export interface UserTableLogicReturn {	
	totalCount: number;
	selectedUser: User | null;
	users: User[];
	dialogVisible: boolean;
	loading: boolean;
	lazyParams: {
		first: number;
		rows: number;
		page: number;
	};
	toast: React.RefObject<Toast>;
	loadLazyData: () => Promise<void>;
	confirmDelete: (user: User) => void;
	onPageChange: (event: PaginatorPageChangeEvent) => void;
	onRowSelect: (event: { data: User }) => void;
	setDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function useUserTableLogic({ filters }: UserTableProps): UserTableLogicReturn {
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const {
		users,
		setUsers,
		deleteUser: deleteUserFromContext,
	} = useUserContext();
	const [dialogVisible, setDialogVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [lazyParams, setLazyParams] = useState({
		first: 0,
		rows: 10,
		page: 1,
	});
	const [totalCount, setTotalCount] = useState(0);
	const toast = useRef<Toast>(null);

	const loadLazyData = async () => {
		setLoading(true);
		const { page, rows } = lazyParams;
		const { totalCount, users } = await getUsers(
			filters.estado,
			filters.usuario,
			rows.toString(),
			page.toString()
		);
		setUsers(users);
		setTotalCount(Number(totalCount));
		setLoading(false);
	};

	useEffect(() => {
		loadLazyData();
	}, [lazyParams, filters]);

	const confirmDelete = (user: User) => {
		confirmDialog({
			message: (
				<div className="flex flex-column align-items-center m-3 gap-3">
					<span className="font-bold">
						¿Está seguro de que desea eliminar este usuario?
					</span>
					<span>
						Esta acción eliminará permanentemente a{" "}
						<strong>{user.usuario}</strong>.
					</span>
				</div>
			),
			header: "Confirmar Eliminación",
			icon: "pi pi-info-circle",
			acceptClassName: "p-button-danger p-2 m-2",
			rejectClassName: "p-2 m-2",
			rejectLabel: "Cancelar",
			acceptLabel: "Eliminar",
			accept: async () => {
				try {
					await deleteUser(user.id);
					deleteUserFromContext(user.id);
					await loadLazyData();
					toast.current?.show({
						severity: "success",
						summary: "Usuario Eliminado",
						detail: `${user.usuario} ha sido eliminado con éxito.`,
						life: 3000,
					});
				} catch (error) {
					console.error("Error al eliminar usuario:", error);
					toast.current?.show({
						severity: "error",
						summary: "Error",
						detail: "No se pudo eliminar el usuario. Por favor, inténtelo de nuevo.",
						life: 5000,
					});
				}
			},
		});
	};

	const onPageChange = (event: PaginatorPageChangeEvent) => {
		setLazyParams({
			first: event.first,
			rows: event.rows,
			page: event.page + 1,
		});
	};

	const onRowSelect = (event: { data: User }) => {
		setSelectedUser(event.data);
		setDialogVisible(true);
	};

	return {
		totalCount,
		selectedUser,
		users,
		dialogVisible,
		loading,
		lazyParams,
		toast,
		loadLazyData,
		confirmDelete,
		onPageChange,
		onRowSelect,
		setDialogVisible,
	};
}
