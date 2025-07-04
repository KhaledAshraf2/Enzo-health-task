export interface DialogConfig {
	id: string
	title: string
	description: string
}

export interface DialogState {
	isOpen: boolean
	currentDialogIndex: number
	dialogStack: DialogConfig[]
}

export interface DialogStackProps {
	dialogState: DialogState
	onClose: () => void
	onNext: () => void
	onPrevious: () => void
	canNavigateNext: boolean
	canNavigatePrevious: boolean
}

export interface DialogNavigationProps {
	canNavigatePrevious: boolean
	canNavigateNext: boolean
	onNext: () => void
	onPrevious: () => void
	isCurrentDialog: boolean
}
