import { ActionIcon, TextInput } from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import { SearchIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Logo } from "#/components/Logo";

export function AppHeader() {
	const [isSearchOpen, setSearchOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const navigate = useNavigate();

	const closeSearch = () => setSearchOpen(false);

	const submit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const query = inputRef.current?.value.trim();
		if (!query) return;
		closeSearch();
		navigate({ to: "/movies", search: { q: query } });
	};

	return (
		<div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
			<Logo />

			{isSearchOpen ? (
				<search className="flex flex-1 sm:max-w-sm">
					<form onSubmit={submit} className="flex flex-1 items-center gap-2">
						<TextInput
							ref={inputRef}
							autoFocus
							name="q"
							type="search"
							aria-label="Search movies"
							placeholder="Search movies"
							radius="xl"
							className="flex-1"
							leftSection={<SearchIcon size={16} />}
							onKeyDown={(event) => event.key === "Escape" && closeSearch()}
						/>
						<ActionIcon
							variant="subtle"
							color="gray"
							size="lg"
							radius="xl"
							aria-label="Close search"
							onClick={closeSearch}
						>
							<XIcon size={18} />
						</ActionIcon>
					</form>
				</search>
			) : (
				<ActionIcon
					variant="subtle"
					color="gray"
					size="xl"
					radius="xl"
					aria-label="Search movies"
					onClick={() => setSearchOpen(true)}
				>
					<SearchIcon size={22} />
				</ActionIcon>
			)}
		</div>
	);
}
