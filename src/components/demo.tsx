import { Button } from "@/components/ui/button"
import { DialogStack } from "./DialogStack"
import { useMultiDialog } from "./useMultiDialog"

export const Demo = () => {
	const {
		dialogState,
		openDialog,
		closeAllDialogs,
		navigateToNext,
		navigateToPrevious,
		canNavigateNext,
		canNavigatePrevious,
	} = useMultiDialog()

	return (
		<div className="not-prose flex aspect-video items-center justify-center rounded-lg border bg-secondary">
			<Button variant="outline" onClick={openDialog}>
				Show me
			</Button>

			<DialogStack
				dialogState={dialogState}
				onClose={closeAllDialogs}
				onNext={navigateToNext}
				onPrevious={navigateToPrevious}
				canNavigateNext={canNavigateNext()}
				canNavigatePrevious={canNavigatePrevious()}
			/>
		</div>
	)
}
