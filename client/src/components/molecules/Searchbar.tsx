"use client";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";

interface SearchbarProps {
	handleSearch: (filters: { usuario: string; estado: string }) => void;
}

function Searchbar({ handleSearch }: SearchbarProps) {
	const [search, setSearch] = useState<string>("");
	const [selectedState, setSelectedState] = useState<string>("");
	const states = [
		{ label: "TODOS", value: "" },
		{ label: "ACTIVO", value: "ACTIVO" },
		{ label: "INACTIVO", value: "INACTIVO" },
	];

	useEffect(() => {
		handleSearch({ usuario: search, estado: selectedState });
	}, [search, selectedState]);

	const handleClearFilters = () => {
		setSearch("");
		setSelectedState("");
	};

	return (
		<div className="flex gap-3">
			<div className="field col-5 p-inputgroup p-0">
				<span className="p-inputgroup-addon">
					<i className="pi pi-search"></i>
				</span>
				<InputText
					id="search"
					name="search"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Buscar"
				/>
			</div>
			<div className="field col-5 p-inputgroup p-0">
				<span className="p-inputgroup-addon">
					<i className="pi pi-search"></i>
				</span>
				<Dropdown
					value={selectedState}
					onChange={(e) => setSelectedState(e.value)}
					options={states}
					optionLabel="label"
					placeholder="Seleccionar el Estado"
					className="align-items-center"
				/>
			</div>
			<div className="field flex col-2 gap-3">
				<Button
					icon="pi pi-filter-fill"
					className="p-button-secondary p-1"
					onClick={handleClearFilters}
					tooltip="Limpiar filtros"
					tooltipOptions={{ position: "bottom" }}
				/>
				<Button
					icon="pi pi-sliders-v"
					className="p-button-secondary p-1"
				/>
			</div>
		</div>
	);
}

export default Searchbar;
