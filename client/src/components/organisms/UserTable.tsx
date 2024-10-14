"use client";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { User } from "@/types/User";
import UserFormDialog from "./UserFormDialog";
import { Toast } from "primereact/toast";
import { Paginator, PaginatorRowsPerPageDropdownOptions } from "primereact/paginator";
import { Dropdown } from "primereact/dropdown";
import useUserTableLogic from "./UserTableLogic";

interface UserTableProps {
	filters: { usuario: string; estado: string };
}

export default function UserTable({ filters }: UserTableProps) {
	const {
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
	} = useUserTableLogic({ filters }) as ReturnType<typeof useUserTableLogic>;

	const actionsBodyTemplate = (rowData: User) => {
		return (
			<div className="flex justify-content-center">
				<Button
					icon="pi pi-trash"
					className="p-button-rounded p-button-warning"
					onClick={() => confirmDelete(rowData)}
				/>
			</div>
		);
	};

	if (loading) {
		return <div className="text-center p-4">Cargando usuarios...</div>;
	}

	const emptyMessage = "No hay usuarios disponibles";

	const paginatorTemplate = {
		layout: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown",
		RowsPerPageDropdown: (options: PaginatorRowsPerPageDropdownOptions) => {
			const dropdownOptions = [
				{ label: 10, value: 10 },
				{ label: 20, value: 20 },
				{ label: 50, value: 50 },
			];

			return (
				<>
					<Dropdown
						className="p-2"
						value={options.value}
						options={dropdownOptions}
						onChange={(e) => options.onChange(e.value)}
					/>
				</>
			);
		},
	};

	return (
		<div>
			<Toast ref={toast} />
			<DataTable
				value={users}
				lazy
				paginator={false}
				first={lazyParams.first}
				rows={lazyParams.rows}
				totalRecords={users.length}
				scrollable
				loading={loading}
				scrollHeight="600px"
				virtualScrollerOptions={{ itemSize: 50 }}
				rowsPerPageOptions={[10, 20, 50]}
				dataKey="id"
				emptyMessage={emptyMessage}
				selectionMode="single"
				onRowSelect={onRowSelect}
			>
				<Column
					field="id"
					header="ID"
					sortable
					headerClassName="text-center"
					style={{ width: "25%" }}
				/>
				<Column
					field="usuario"
					header="Usuario"
					sortable
					style={{ width: "25%", height: "50px" }}
				/>
				<Column
					field="estado"
					header="Estado"
					sortable
					style={{ width: "25%" }}
				/>
				<Column
					field="actions"
					header="Acciones"
					style={{ width: "10%" }}
					body={actionsBodyTemplate}
					exportable={false}
				/>
			</DataTable>
			<Paginator
				first={lazyParams.first}
				rows={lazyParams.rows}
				onPageChange={onPageChange}
				template={paginatorTemplate}
				className=""
				totalRecords={totalCount}
				rowsPerPageOptions={[10, 20, 50]}
			/>
			<ConfirmDialog />
			{selectedUser && (
				<UserFormDialog
					user={selectedUser}
					visible={dialogVisible}
					onHide={() => setDialogVisible(false)}
					onSave={loadLazyData}
				/>
			)}
		</div>
	);
}
