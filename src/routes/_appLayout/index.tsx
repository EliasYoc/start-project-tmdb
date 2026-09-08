import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_appLayout/")({ component: Home });

function Home() {
	return <div>home</div>;
}
