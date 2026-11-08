import { Container, Skeleton } from "@mantine/core";
import { FULL_BLEED, LAYOUT } from "../../utils/hero-layout";

/** Mirrors the hero's layout so the content does not jump when it arrives. */
export function MediaDetailSkeleton() {
	return (
		<div aria-busy className={`relative ${FULL_BLEED}`}>
			<Skeleton
				className="absolute inset-x-0 top-0 h-[78svh] max-h-full md:h-[80vh]"
				radius={0}
			/>
			<Container
				size="lg"
				px={0}
				className="relative pt-[48svh] pb-10 md:pt-[38vh]"
			>
				<div className={LAYOUT}>
					<Skeleton radius="lg" className="aspect-2/3 lg:row-span-2" />
					<div>
						<Skeleton height={18} width={80} radius="sm" />
						<Skeleton height={32} width="80%" mt="md" radius="sm" />
						<Skeleton height={14} width="60%" mt="md" radius="sm" />
						<Skeleton height={12} mt="lg" radius="sm" />
						<Skeleton height={12} mt={8} radius="sm" />
						<Skeleton height={12} mt={8} width="70%" radius="sm" />
					</div>
					<div className="col-span-2 lg:col-span-1 lg:col-start-2">
						<Skeleton height={50} radius="xl" className="md:max-w-46" />
					</div>
				</div>
			</Container>
		</div>
	);
}
