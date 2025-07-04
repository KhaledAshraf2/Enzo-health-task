import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { describe, it, expect } from "vitest"
import { Demo } from "../demo"

describe("Multi-Dialog Integration Tests", () => {
	it("Full Forward Flow: Navigate through all dialogs from first to last", async () => {
		render(<Demo />)

		// Open first dialog
		const showButton = screen.getByText("Show me")
		await userEvent.click(showButton)

		// Should be at first dialog
		expect(screen.getByText("I'm first dialog")).toBeInTheDocument()
		// Previous button should be disabled for first dialog
		expect(screen.getByText("Previous")).toBeDisabled()
		expect(screen.getByText("Next")).not.toBeDisabled()

		// Navigate to second dialog
		let nextButtons = screen.getAllByText("Next")
		let enabledNext = nextButtons.find((btn) => !btn.hasAttribute("disabled"))
		await userEvent.click(enabledNext!)

		// Should be at second dialog
		expect(screen.getByText("I'm second dialog")).toBeInTheDocument()
		expect(screen.getAllByText("Previous").length).toBeGreaterThan(0)
		expect(screen.getAllByText("Next").length).toBeGreaterThan(0)

		// Navigate to third dialog
		nextButtons = screen.getAllByText("Next")
		enabledNext = nextButtons.find((btn) => !btn.hasAttribute("disabled"))
		await userEvent.click(enabledNext!)

		// Should be at third dialog (last)
		expect(screen.getByText("I'm third dialog")).toBeInTheDocument()
		expect(screen.getAllByText("Previous").length).toBeGreaterThan(0)
		// Next buttons should be disabled but still present
		const allNextButtons = screen.getAllByText("Next")
		expect(allNextButtons.every((btn) => btn.hasAttribute("disabled"))).toBe(
			true,
		)
	})

	it("Full Backward Flow: Navigate from last back to first", async () => {
		render(<Demo />)

		// Open and navigate to last dialog
		const showButton = screen.getByText("Show me")
		await userEvent.click(showButton)

		let nextButtons = screen.getAllByText("Next")
		let enabledNext = nextButtons.find((btn) => !btn.hasAttribute("disabled"))
		await userEvent.click(enabledNext!)

		nextButtons = screen.getAllByText("Next")
		enabledNext = nextButtons.find((btn) => !btn.hasAttribute("disabled"))
		await userEvent.click(enabledNext!)

		// Should be at third dialog
		expect(screen.getByText("I'm third dialog")).toBeInTheDocument()

		// Navigate back to second dialog
		let prevButtons = screen.getAllByText("Previous")
		let enabledPrev = prevButtons.find((btn) => !btn.hasAttribute("disabled"))
		await userEvent.click(enabledPrev!)

		// Should be at second dialog
		expect(screen.getByText("I'm second dialog")).toBeInTheDocument()
		expect(screen.queryByText("I'm third dialog")).not.toBeInTheDocument()

		// Navigate back to first dialog
		prevButtons = screen.getAllByText("Previous")
		enabledPrev = prevButtons.find((btn) => !btn.hasAttribute("disabled"))
		await userEvent.click(enabledPrev!)

		// Should be at first dialog
		expect(screen.getByText("I'm first dialog")).toBeInTheDocument()
		expect(screen.queryByText("I'm second dialog")).not.toBeInTheDocument()
		// Previous button should be disabled for first dialog
		const allPrevButtons = screen.getAllByText("Previous")
		expect(allPrevButtons.some((btn) => !btn.hasAttribute("disabled"))).toBe(
			false,
		)
	})

	it("Mixed Navigation: Forward and backward navigation in sequence", async () => {
		render(<Demo />)

		// Open first dialog
		const showButton = screen.getByText("Show me")
		await userEvent.click(showButton)

		// Forward to second
		let nextButtons = screen.getAllByText("Next")
		let enabledNext = nextButtons.find((btn) => !btn.hasAttribute("disabled"))
		await userEvent.click(enabledNext!)
		expect(screen.getByText("I'm second dialog")).toBeInTheDocument()

		// Back to first
		let prevButtons = screen.getAllByText("Previous")
		let enabledPrev = prevButtons.find((btn) => !btn.hasAttribute("disabled"))
		await userEvent.click(enabledPrev!)
		expect(screen.getByText("I'm first dialog")).toBeInTheDocument()

		// Forward to second again
		nextButtons = screen.getAllByText("Next")
		enabledNext = nextButtons.find((btn) => !btn.hasAttribute("disabled"))
		await userEvent.click(enabledNext!)
		expect(screen.getByText("I'm second dialog")).toBeInTheDocument()

		// Forward to third
		nextButtons = screen.getAllByText("Next")
		enabledNext = nextButtons.find((btn) => !btn.hasAttribute("disabled"))
		await userEvent.click(enabledNext!)
		expect(screen.getByText("I'm third dialog")).toBeInTheDocument()

		// Back to second
		prevButtons = screen.getAllByText("Previous")
		enabledPrev = prevButtons.find((btn) => !btn.hasAttribute("disabled"))
		await userEvent.click(enabledPrev!)
		expect(screen.getByText("I'm second dialog")).toBeInTheDocument()
		expect(screen.queryByText("I'm third dialog")).not.toBeInTheDocument()
	})

	it("Close at Different Points: Close dialogs at various navigation states", async () => {
		render(<Demo />)

		// Test closing from first dialog
		const showButton = screen.getByText("Show me")
		await userEvent.click(showButton)

		const overlay = screen.getByTestId("dialog-overlay")
		await userEvent.click(overlay)

		expect(screen.queryByText("I'm first dialog")).not.toBeInTheDocument()
		expect(screen.getByText("Show me")).toBeInTheDocument()

		// Test closing from second dialog
		await userEvent.click(showButton)

		const nextButtons = screen.getAllByText("Next")
		const enabledNext = nextButtons.find((btn) => !btn.hasAttribute("disabled"))
		await userEvent.click(enabledNext!)

		expect(screen.getByText("I'm second dialog")).toBeInTheDocument()

		const overlay2 = screen.getByTestId("dialog-overlay")
		await userEvent.click(overlay2)

		expect(screen.queryByText("I'm second dialog")).not.toBeInTheDocument()
		expect(screen.getByText("Show me")).toBeInTheDocument()

		// When reopened, should start from first dialog again
		await userEvent.click(showButton)
		expect(screen.getByText("I'm first dialog")).toBeInTheDocument()
		// Previous button should be disabled for first dialog
		expect(screen.getByText("Previous")).toBeDisabled()
	})
})
