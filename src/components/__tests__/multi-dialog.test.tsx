import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { describe, it, expect } from "vitest"
import { Demo } from "../demo"

describe("Multi-Dialog Core Requirements", () => {
	it('Requirement 1: Clicking "Show me" should open the first dialog', async () => {
		render(<Demo />)

		const showButton = screen.getByText("Show me")
		await userEvent.click(showButton)

		expect(screen.getByText("I'm first dialog")).toBeInTheDocument()
		expect(screen.getByText("With a fancy description")).toBeInTheDocument()
	})

	it("Requirement 2: Clicking Next should navigate to next dialog", async () => {
		render(<Demo />)

		// Open first dialog
		const showButton = screen.getByText("Show me")
		await userEvent.click(showButton)

		// Click Next to go to second dialog
		const nextButtons = screen.getAllByText("Next")
		const enabledNext = nextButtons.find((btn) => !btn.hasAttribute("disabled"))
		await userEvent.click(enabledNext!)

		expect(screen.getByText("I'm second dialog")).toBeInTheDocument()
	})

	it("Requirement 3: Clicking Previous should remove current dialog and show previous", async () => {
		render(<Demo />)

		// Open first dialog
		const showButton = screen.getByText("Show me")
		await userEvent.click(showButton)

		// Navigate to second dialog
		const nextButtons = screen.getAllByText("Next")
		const enabledNext = nextButtons.find((btn) => !btn.hasAttribute("disabled"))
		await userEvent.click(enabledNext!)

		// Click Previous to go back to first dialog
		const prevButtons = screen.getAllByText("Previous")
		const enabledPrev = prevButtons.find((btn) => !btn.hasAttribute("disabled"))
		await userEvent.click(enabledPrev!)

		expect(screen.getByText("I'm first dialog")).toBeInTheDocument()
		expect(screen.queryByText("I'm second dialog")).not.toBeInTheDocument()
	})

	it("Requirement 4: First dialog should not show Previous button", async () => {
		render(<Demo />)

		const showButton = screen.getByText("Show me")
		await userEvent.click(showButton)

		// Previous button should be disabled for first dialog
		const prevButton = screen.getByText("Previous")
		expect(prevButton).toBeDisabled()

		// Next button should be enabled for first dialog
		const nextButton = screen.getByText("Next")
		expect(nextButton).not.toBeDisabled()
	})

	it("Requirement 5: Last dialog should not show Next button", async () => {
		render(<Demo />)

		// Open first dialog
		const showButton = screen.getByText("Show me")
		await userEvent.click(showButton)

		// Navigate to second dialog
		let nextButtons = screen.getAllByText("Next")
		let enabledNext = nextButtons.find((btn) => !btn.hasAttribute("disabled"))
		await userEvent.click(enabledNext!)

		// Navigate to third (last) dialog
		nextButtons = screen.getAllByText("Next")
		enabledNext = nextButtons.find((btn) => !btn.hasAttribute("disabled"))
		await userEvent.click(enabledNext!)

		expect(screen.getByText("I'm third dialog")).toBeInTheDocument()
		// Check that no Next button is enabled (all should be disabled)
		const allNextButtons = screen.getAllByText("Next")
		expect(allNextButtons.every((btn) => btn.hasAttribute("disabled"))).toBe(
			true,
		)
		// Check that there's at least one enabled Previous button
		const allPrevButtons = screen.getAllByText("Previous")
		expect(allPrevButtons.some((btn) => !btn.hasAttribute("disabled"))).toBe(
			true,
		)
	})

	it("Requirement 6: Clicking outside dialogs should close all dialogs", async () => {
		render(<Demo />)

		// Open first dialog
		const showButton = screen.getByText("Show me")
		await userEvent.click(showButton)

		// Navigate to second dialog to create a stack
		const nextButtons = screen.getAllByText("Next")
		const enabledNext = nextButtons.find((btn) => !btn.hasAttribute("disabled"))
		await userEvent.click(enabledNext!)

		// Click on overlay to close
		const overlay = screen.getByTestId("dialog-overlay")
		await userEvent.click(overlay)

		// All dialogs should be closed
		expect(screen.queryByText("I'm first dialog")).not.toBeInTheDocument()
		expect(screen.queryByText("I'm second dialog")).not.toBeInTheDocument()
		expect(screen.getByText("Show me")).toBeInTheDocument()
	})
})
