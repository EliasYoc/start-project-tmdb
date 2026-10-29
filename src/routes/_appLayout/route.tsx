import { createFileRoute, Outlet } from "@tanstack/react-router";
import MyAppShell from "#/components/MyAppShell";

export const Route = createFileRoute("/_appLayout")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<MyAppShell>
			<Outlet />
		</MyAppShell>
	);
}
