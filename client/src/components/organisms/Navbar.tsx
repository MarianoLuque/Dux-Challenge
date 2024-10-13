import { Toolbar } from "primereact/toolbar";
import { Image } from "primereact/image";
import { Button } from "primereact/button";

function Navbar() {
	const start = (
		<div className="pl-3">
			<Image
				src="/dux-logo.png"
				alt="Logo de la empresa"
				className="navbar-logo"
				width="50"
				height="50"
			/>
		</div>
	);
	const end = (
		<div className="pr-2">
			<Button
				icon="pi pi-cog"
				style={{
					fontSize: "2rem",
					backgroundColor: "#0062EA",
					border: "none",
				}}
			/>
		</div>
	);

	return (
		<div style={{ backgroundColor: "#0062EA" }}>
			<Toolbar
				start={start}
				end={end}
				style={{ backgroundColor: "#0062EA", border: "none" }}
			/>
		</div>
	);
}

export default Navbar;
