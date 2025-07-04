import { useState } from "react"
import { DialogConfig, DialogState } from "./types"

const dialogConfigs: DialogConfig[] = [
	{
		id: "1",
		title: "I'm first dialog",
		description: "With a fancy description",
	},
	{
		id: "2",
		title: "I'm second dialog",
		description: "With a fancy description",
	},
	{
		id: "3",
		title: "I'm third dialog",
		description: "With a fancy description",
	},
]

export const useMultiDialog = () => {
	const [dialogState, setDialogState] = useState<DialogState>({
		isOpen: false,
		currentDialogIndex: 0,
		dialogStack: dialogConfigs,
	})

	const openDialog = () => {
		setDialogState((prev) => ({ ...prev, isOpen: true, currentDialogIndex: 0 }))
	}

	const closeAllDialogs = () => {
		setDialogState((prev) => ({
			...prev,
			isOpen: false,
			currentDialogIndex: 0,
		}))
	}

	const navigateToNext = () => {
		setDialogState((prev) => ({
			...prev,
			currentDialogIndex: Math.min(
				prev.currentDialogIndex + 1,
				prev.dialogStack.length - 1,
			),
		}))
	}

	const navigateToPrevious = () => {
		setDialogState((prev) => ({
			...prev,
			currentDialogIndex: Math.max(prev.currentDialogIndex - 1, 0),
		}))
	}

	// Helper functions to determine button visibility
	const canNavigateNext = () => {
		return dialogState.currentDialogIndex < dialogState.dialogStack.length - 1
	}

	const canNavigatePrevious = () => {
		return dialogState.currentDialogIndex > 0
	}

	return {
		dialogState,
		openDialog,
		closeAllDialogs,
		navigateToNext,
		navigateToPrevious,
		canNavigateNext,
		canNavigatePrevious,
	}
}
