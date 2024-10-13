import { Button } from "primereact/button";

function SideBar() {
	return (
		<div
			className="flex flex-column w-5rem align-items-center pt-2"
			style={{ backgroundColor: "#2D3E50", gap: "5px" }}
		>
			<Button
				icon="pi pi-box"
				className="p-button-text p-button-rounded text-white"
			/>
			<Button
				icon="pi pi-box"
				className="p-button-text p-button-rounded text-white"
			/>
			<Button
				icon="pi pi-box"
				className="p-button-text p-button-rounded text-white"
			/>
			<Button
				icon="pi pi-box"
				className="p-button-text p-button-rounded text-white"
			/>
			<Button
				icon="pi pi-box"
				className="p-button-text p-button-rounded text-white"
			/>
			<Button
				icon="pi pi-box"
				className="p-button-text p-button-rounded text-white"
			/>
		</div>
	);
}

export default SideBar;
