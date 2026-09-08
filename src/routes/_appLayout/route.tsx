import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_appLayout")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			layout
			<Outlet />
		</div>
	);
}
