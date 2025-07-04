import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DialogNavigationProps } from "./types"

export const DialogNavigation = ({
	canNavigatePrevious,
	canNavigateNext,
	onNext,
	onPrevious,
	isCurrentDialog,
}: DialogNavigationProps) => {
	return (
		<DialogFooter className="flex w-full items-center justify-between">
			<Button
				variant="outline"
				onClick={isCurrentDialog ? onPrevious : undefined}
				disabled={!isCurrentDialog || !canNavigatePrevious}
			>
				<ChevronLeft className="mr-1 h-4 w-4" />
				Previous
			</Button>

			<Button
				onClick={isCurrentDialog ? onNext : undefined}
				disabled={!isCurrentDialog || !canNavigateNext}
			>
				Next
				<ChevronRight className="ml-1 h-4 w-4" />
			</Button>
		</DialogFooter>
	)
}
