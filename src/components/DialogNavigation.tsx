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
		<DialogFooter className="flex justify-between">
			<div className="flex gap-2">
				{canNavigatePrevious && (
					<Button
						variant="outline"
						onClick={isCurrentDialog ? onPrevious : undefined}
						disabled={!isCurrentDialog}
					>
						<ChevronLeft className="mr-1 h-4 w-4" />
						Previous
					</Button>
				)}
			</div>

			<div className="flex gap-2">
				{canNavigateNext && (
					<Button
						onClick={isCurrentDialog ? onNext : undefined}
						disabled={!isCurrentDialog}
					>
						Next
						<ChevronRight className="ml-1 h-4 w-4" />
					</Button>
				)}
			</div>
		</DialogFooter>
	)
}
