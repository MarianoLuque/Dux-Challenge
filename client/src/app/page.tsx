"use client";
import Searchbar from "@/components/molecules/Searchbar";
import UserFormDialog from "@/components/organisms/UserFormDialog";
import UserTable from "@/components/organisms/UserTable";
import { Button } from "primereact/button";
import { useState } from "react";

export default function Home() {
	const [dialogVisible, setDialogVisible] = useState(false);
	const [filters, setFilters] = useState({ usuario: "", estado: "" });

	const handleSearch = (newFilters: { usuario: string; estado: string }) => {
		setFilters(newFilters);
	};

	return (
		<div className="p-4 h-screen">
			<div className="flex justify-content-between">
				<h1>Usuarios</h1>
				<Button
					label="Nuevo Usuario"
					icon="pi pi-plus"
					className="py-3 px-4 font-bold text-lg border-round-lg"
					onClick={() => setDialogVisible(true)}
				/>
			</div>
			<div className="my-4">
				<Searchbar handleSearch={handleSearch} />
			</div>
			<UserTable filters={filters} />
			<UserFormDialog
				visible={dialogVisible}
				onHide={() => setDialogVisible(false)}
			/>
		</div>
	);
}

