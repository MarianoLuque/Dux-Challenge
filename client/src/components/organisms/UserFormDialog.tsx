"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { User } from "@/types/User";
import { useUserContext } from "@/context/users/UserContext";
import { addUser, updateUser, getUser } from "@/actions/users/actions";
import FormButton from "../atoms/FormButton";
import { Toast } from "primereact/toast";

interface UserFormDialogProps {
	user?: User;
	visible?: boolean;
	onHide: () => void;
	onSave?: () => void;
}

export default function UserFormDialog({
	user,
	visible = false,
	onHide,
}: UserFormDialogProps) {
	const [usuario, setUsuario] = useState("");
	const [estado, setEstado] = useState("");
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const { addUser: addUserToContext, updateUser: updateUserInContext } =
		useUserContext();
	const toast = useRef<Toast>(null);

	useEffect(() => {
		if (user) {
			setUsuario(user.usuario);
			setEstado(user.estado);
		} else {
			setUsuario("");
			setEstado("");
		}
	}, [user]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const newErrors: { [key: string]: string } = {};

		if (!usuario.trim()) {
			newErrors.usuario = "Campo requerido";
		}
		if (!estado) {
			newErrors.estado = "Campo requerido";
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		const formData = new FormData();
		formData.append("usuario", usuario);
		formData.append("estado", estado);

		const existingUsers = await getUser(usuario);
		if (user) {
			// Estamos editando un usuario existente
			if (
				existingUsers.some(
					(existingUser: User) =>
						existingUser.usuario === usuario &&
						existingUser.id !== user.id
				)
			) {
				toast.current?.show({
					severity: "error",
					summary: "Error",
					detail: "El nombre de usuario ya existe para otro usuario",
					life: 3000,
				});
				return;
			}
			const updatedUser = await updateUser(user.id, formData);
			updateUserInContext(updatedUser);
		} else {
			// Estamos creando un nuevo usuario
			if (
				existingUsers.some(
					(existingUser: User) => existingUser.usuario === usuario
				)
			) {
				toast.current?.show({
					severity: "error",
					summary: "Error",
					detail: "El nombre de usuario ya existe",
					life: 3000,
				});
				return;
			}
			const newUser = await addUser(formData);
			addUserToContext(newUser);
		}
		setUsuario("");
		setEstado("");
		onHide();
	};

	const handleCancel = async (e: React.FormEvent) => {
		e.preventDefault();
		onHide();
	};

	return (
		<div>
			<Toast ref={toast} />
			<Dialog
				modal
				header={user ? "Editar Usuario" : "Crear Usuario"}
				className="text-center w-4"
				headerClassName="dialog-header text-white"
				visible={visible}
				onHide={onHide}
			>
				<form onSubmit={handleSubmit} className="p-fluid">
					<div className="flex flex-column px-8 py-5 gap-4 text-xl">
						<div className="inline-flex flex-column gap-2 text-left">
							<label htmlFor="usuario">Usuario</label>
							<InputText
								id="usuario"
								value={usuario}
								onChange={(e) => {
									setUsuario(e.target.value);
									setErrors({ ...errors, usuario: "" });
								}}
								required
								className={`text-lg ${
									errors.usuario ? "p-invalid" : ""
								}`}
							/>
							{errors.usuario && (
								<small className="text-red-500">
									{errors.usuario}
								</small>
							)}
						</div>
						<div className="inline-flex flex-column gap-2 text-left">
							<label htmlFor="estado">Estado</label>
							<Dropdown
								id="estado"
								value={estado}
								options={[
									{ label: "ACTIVO", value: "ACTIVO" },
									{ label: "INACTIVO", value: "INACTIVO" },
								]}
								onChange={(e) => {
									setEstado(e.value);
									setErrors({ ...errors, estado: "" });
								}}
								required
								className={`text-lg ${
									errors.estado ? "p-invalid" : ""
								}`}
							/>
							{errors.estado && (
								<small className="text-red-500">
									{errors.estado}
								</small>
							)}
						</div>
						<div className="flex justify-content-center gap-4 mt-3">
							<FormButton
								onClick={handleSubmit}
								type={"confirm"}
							/>
							<FormButton
								onClick={handleCancel}
								type={"cancel"}
							/>
						</div>
					</div>
				</form>
			</Dialog>
		</div>
	);
}
