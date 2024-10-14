"use server";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

const API_URL =
	process.env.API_URL || "https://staging.duxsoftware.com.ar/api/personal";
const SECTOR = process.env.SECTOR || "8000";

//funcion de retardo
async function delay(ms: number) {
	await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getUsers(
	estado?: string,
	usuario_like?: string,
	limit: string = "10",
	page: string = "1"
) {
	let url = `${API_URL}?sector=${SECTOR}&_limit=${limit}&_page=${page}`;
	if (estado === "ACTIVO" || estado === "INACTIVO")
		url += `&estado=${estado}`;
	if (usuario_like !== "") url += `&usuario_like=${usuario_like}`;

	const response = await fetch(url);
	if (!response.ok) throw new Error("Error en la solicitud al API");

	await delay(2000);

	const totalCount = response.headers.get('X-Total-Count');
	const users = await response.json();

	return { totalCount, users };
}

export async function getUser(usuario: string) {
	const response = await fetch(`${API_URL}?sector=${SECTOR}&usuario_like=${usuario}`);
	if (!response.ok) throw new Error("Error en la solicitud al API");
	return await response.json();
}

export async function addUser(formData: FormData) {
	const usuario = formData.get("usuario") as string;
	const estado = formData.get("estado") as string;
	const id = uuidv4();
	if (!usuario || !estado) {
		throw new Error("Nombre de usuario y estado son requeridos");
	}

	const response = await fetch(API_URL, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ id, usuario, estado, sector: SECTOR }),
	});

	if (!response.ok) throw new Error("Error en la solicitud al API");

	await delay(2000);

	revalidatePath("/");
	return await response.json();
}

export async function updateUser(id: string, formData: FormData) {
	const usuario = formData.get("usuario") as string;
	const estado = formData.get("estado") as string;

	if (!usuario || !estado) {
		throw new Error("Usuario y estado son requeridos");
	}

	const response = await fetch(`${API_URL}/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ usuario, estado, sector: SECTOR }),
	});

	if (!response.ok) throw new Error("Error en la solicitud al API");

	await delay(2000);

	revalidatePath("/");
	return await response.json();
}

export async function deleteUser(id: string) {
	const response = await fetch(`${API_URL}/${id}`, {
		method: "DELETE",
	});

	if (!response.ok) throw new Error("Error en la solicitud al API");

	revalidatePath("/");
	return await response.json();
}
