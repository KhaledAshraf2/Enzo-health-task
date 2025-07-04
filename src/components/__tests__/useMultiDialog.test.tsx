import { renderHook, act } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { useMultiDialog } from "../useMultiDialog"

describe("useMultiDialog Hook", () => {
	it("Should handle navigation through all dialogs sequentially", () => {
		const { result } = renderHook(() => useMultiDialog())

		// Open dialog
		act(() => {
			result.current.openDialog()
		})

		// Should start at first dialog - all dialogs are in stack for visual stacking
		expect(result.current.dialogState.currentDialogIndex).toBe(0)
		expect(result.current.dialogState.dialogStack).toHaveLength(3)

		// Navigate to second dialog
		act(() => {
			result.current.navigateToNext()
		})

		expect(result.current.dialogState.currentDialogIndex).toBe(1)
		expect(result.current.dialogState.dialogStack).toHaveLength(3)

		// Navigate to third dialog
		act(() => {
			result.current.navigateToNext()
		})

		expect(result.current.dialogState.currentDialogIndex).toBe(2)
		expect(result.current.dialogState.dialogStack).toHaveLength(3)
	})

	it("Should handle mixed forward/backward navigation correctly", () => {
		const { result } = renderHook(() => useMultiDialog())

		// Open dialog and navigate forward
		act(() => {
			result.current.openDialog()
			result.current.navigateToNext()
			result.current.navigateToNext()
		})

		// Should be at third dialog
		expect(result.current.dialogState.currentDialogIndex).toBe(2)
		expect(result.current.dialogState.dialogStack).toHaveLength(3)

		// Navigate backward
		act(() => {
			result.current.navigateToPrevious()
		})

		// Should be at second dialog - stack remains same for visual stacking
		expect(result.current.dialogState.currentDialogIndex).toBe(1)
		expect(result.current.dialogState.dialogStack).toHaveLength(3)

		// Navigate forward again
		act(() => {
			result.current.navigateToNext()
		})

		// Should be at third dialog again
		expect(result.current.dialogState.currentDialogIndex).toBe(2)
		expect(result.current.dialogState.dialogStack).toHaveLength(3)
	})

	it("Should reset to first dialog when reopening after close", () => {
		const { result } = renderHook(() => useMultiDialog())

		// Open dialog and navigate to second
		act(() => {
			result.current.openDialog()
			result.current.navigateToNext()
		})

		// Close dialog
		act(() => {
			result.current.closeAllDialogs()
		})

		expect(result.current.dialogState.isOpen).toBe(false)

		// Reopen dialog
		act(() => {
			result.current.openDialog()
		})

		// Should be back at first dialog - all dialogs remain in stack
		expect(result.current.dialogState.currentDialogIndex).toBe(0)
		expect(result.current.dialogState.dialogStack).toHaveLength(3)
	})

	it("Should maintain correct dialog stack size during navigation", () => {
		const { result } = renderHook(() => useMultiDialog())

		act(() => {
			result.current.openDialog()
		})

		// Stack should contain all dialogs for visual stacking
		expect(result.current.dialogState.dialogStack).toHaveLength(3)
		expect(result.current.dialogState.currentDialogIndex).toBe(0)

		act(() => {
			result.current.navigateToNext()
		})

		expect(result.current.dialogState.dialogStack).toHaveLength(3)
		expect(result.current.dialogState.currentDialogIndex).toBe(1)

		act(() => {
			result.current.navigateToPrevious()
		})

		expect(result.current.dialogState.dialogStack).toHaveLength(3)
		expect(result.current.dialogState.currentDialogIndex).toBe(0)
	})

	it("Should handle navigation at dialog boundaries (first/last)", () => {
		const { result } = renderHook(() => useMultiDialog())

		act(() => {
			result.current.openDialog()
		})

		// At first dialog - can't go previous
		expect(result.current.canNavigatePrevious()).toBe(false)
		expect(result.current.canNavigateNext()).toBe(true)

		// Navigate to last dialog
		act(() => {
			result.current.navigateToNext()
			result.current.navigateToNext()
		})

		// At last dialog - can't go next
		expect(result.current.canNavigatePrevious()).toBe(true)
		expect(result.current.canNavigateNext()).toBe(false)
	})
})
