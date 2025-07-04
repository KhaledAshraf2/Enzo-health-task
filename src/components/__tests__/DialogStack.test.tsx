import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { DialogStack } from "../DialogStack"
import { DialogState } from "../types"

const mockDialogs = [
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

describe("DialogStack Component", () => {
	const mockProps = {
		onClose: vi.fn(),
		onNext: vi.fn(),
		onPrevious: vi.fn(),
		canNavigateNext: true,
		canNavigatePrevious: true,
	}

	it("Should apply correct Y-offset (8px per dialog in stack)", () => {
		const dialogState: DialogState = {
			isOpen: true,
			dialogStack: mockDialogs,
			currentDialogIndex: 2, // Third dialog is current
		}

		render(<DialogStack dialogState={dialogState} {...mockProps} />)

		// Get all dialog containers by finding elements with specific styles
		const dialogContainers = document.querySelectorAll('[style*="translateY"]')

		// First dialog should be at -16px (2 * 8px behind current)
		expect(dialogContainers[0]).toHaveStyle(
			"transform: translate(-50%, -50%) translateY(0px)",
		)

		// Second dialog should be at -8px (1 * 8px behind current)
		expect(dialogContainers[1]).toHaveStyle(
			"transform: translate(-50%, -50%) translateY(8px)",
		)

		// Third dialog (current) should be at 0px + 16px offset
		expect(dialogContainers[2]).toHaveStyle(
			"transform: translate(-50%, -50%) translateY(16px)",
		)
	})

	it("Should maintain proper z-index layering (higher index = higher z-index)", () => {
		const dialogState: DialogState = {
			isOpen: true,
			dialogStack: mockDialogs,
			currentDialogIndex: 2,
		}

		render(<DialogStack dialogState={dialogState} {...mockProps} />)

		const dialogContainers = document.querySelectorAll('[style*="translateY"]')

		// Z-index should increase with dialog index
		expect(dialogContainers[0]).toHaveStyle("z-index: 50")
		expect(dialogContainers[1]).toHaveStyle("z-index: 51")
		expect(dialogContainers[2]).toHaveStyle("z-index: 52")
	})

	it("Should show background dialogs partially visible behind current dialog", () => {
		const dialogState: DialogState = {
			isOpen: true,
			dialogStack: mockDialogs,
			currentDialogIndex: 1, // Second dialog is current
		}

		render(<DialogStack dialogState={dialogState} {...mockProps} />)

		// First dialog should be visible (in stack)
		expect(screen.getByText("I'm first dialog")).toBeInTheDocument()

		// Second dialog should be visible (current)
		expect(screen.getByText("I'm second dialog")).toBeInTheDocument()

		// Third dialog should not be visible (not in stack yet)
		expect(screen.queryByText("I'm third dialog")).not.toBeInTheDocument()
	})

	it("Should stack dialogs correctly when navigating forward", () => {
		const dialogState: DialogState = {
			isOpen: true,
			dialogStack: mockDialogs,
			currentDialogIndex: 1,
		}

		render(<DialogStack dialogState={dialogState} {...mockProps} />)

		// Should show first two dialogs (0 to currentDialogIndex)
		expect(screen.getByText("I'm first dialog")).toBeInTheDocument()
		expect(screen.getByText("I'm second dialog")).toBeInTheDocument()
		expect(screen.queryByText("I'm third dialog")).not.toBeInTheDocument()
	})

	it("Should remove dialogs from stack when navigating backward", () => {
		const dialogState: DialogState = {
			isOpen: true,
			dialogStack: mockDialogs.slice(0, 1), // Only first dialog after going back
			currentDialogIndex: 0,
		}

		render(<DialogStack dialogState={dialogState} {...mockProps} />)

		// Should only show first dialog
		expect(screen.getByText("I'm first dialog")).toBeInTheDocument()
		expect(screen.queryByText("I'm second dialog")).not.toBeInTheDocument()
		expect(screen.queryByText("I'm third dialog")).not.toBeInTheDocument()
	})
})
