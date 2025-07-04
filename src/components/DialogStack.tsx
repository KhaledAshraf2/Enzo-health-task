import {
	Dialog,
	DialogOverlay,
	DialogPortal,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog"
import { DialogNavigation } from "./DialogNavigation"
import { DialogStackProps } from "./types"

export const DialogStack = ({
	dialogState,
	onClose,
	onNext,
	onPrevious,
	canNavigateNext,
	canNavigatePrevious,
}: DialogStackProps) => {
	return (
		<Dialog open={dialogState.isOpen} onOpenChange={onClose}>
			<DialogPortal>
				<DialogOverlay onClick={onClose} />
				{/* Render all dialogs from 0 to current index */}
				{dialogState.dialogStack
					.slice(0, dialogState.currentDialogIndex + 1)
					.map((dialog, index) => (
						<div
							key={dialog.id}
							className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg animate-none gap-4 border bg-background p-6 shadow-lg sm:rounded-lg"
							style={{
								transform: `translate(-50%, -50%) translateY(${(index - dialogState.currentDialogIndex) * 8 + dialogState.currentDialogIndex * 8}px)`,
								zIndex: 50 + index,
							}}
						>
							<DialogHeader>
								<DialogTitle>{dialog.title}</DialogTitle>
								<DialogDescription>{dialog.description}</DialogDescription>
							</DialogHeader>

							<DialogNavigation
								canNavigatePrevious={canNavigatePrevious}
								canNavigateNext={canNavigateNext}
								onNext={onNext}
								onPrevious={onPrevious}
								isCurrentDialog={index === dialogState.currentDialogIndex}
							/>
						</div>
					))}
			</DialogPortal>
		</Dialog>
	)
}
