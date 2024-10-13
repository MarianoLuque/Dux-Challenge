"use client";
import { Button } from "primereact/button";
import { useFormStatus } from "react-dom";

interface FormButtonProps {
	onClick: (e: React.FormEvent) => Promise<void>;
	className?: string;
	type: "confirm" | "cancel";
}

function FormButton({ onClick, className, type }: FormButtonProps) {
	const { pending } = useFormStatus();
	return (
		<Button
			disabled={pending}
			label={
				type === "cancel"
					? "Cancelar"
					: pending
					? "Procesando..."
					: "Confirmar"
			}
			icon="pi pi-check"
			className={`${className} w-3 text-xl p-1`}
			style={{
				background: type === "confirm" ? "#2563EB" : "white",
				color: type === "confirm" ? "white" : "#2563EB",
				borderColor: type === "confirm" ? "#2563EB" : "#3B82F6",
				borderRadius: "0.5rem",
			}}
			onClick={onClick}
		/>
	);
}

export default FormButton;
