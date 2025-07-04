# Multi-Dialog Component Testing Plan

## Testing Framework Setup

### Required Dependencies

```json
{
	"devDependencies": {
		"vitest": "^1.0.0",
		"@testing-library/react": "^14.0.0",
		"@testing-library/jest-dom": "^6.0.0",
		"@testing-library/user-event": "^14.0.0",
		"jsdom": "^23.0.0"
	}
}
```

### Configuration Files Needed

- `vite.config.ts` - Update with Vitest configuration
- `src/test-setup.ts` - Setup file for jest-dom matchers
- `vitest.config.ts` - Vitest specific configuration

### Package.json Scripts

```json
{
	"scripts": {
		"test": "vitest",
		"test:ui": "vitest --ui",
		"test:coverage": "vitest --coverage"
	}
}
```

## Test Structure

### Test Files to Create

```
src/components/__tests__/
├── multi-dialog.test.tsx           # Core requirements tests
├── DialogStack.test.tsx            # Dialog stacking logic
├── useMultiDialog.test.tsx         # Navigation logic tests
└── multi-dialog.integration.test.tsx # Complete user flows
```

## Test Cases

### 1. Core Requirements Tests (`multi-dialog.test.tsx`)

#### Primary Functionality

- ✅ **Requirement 1**: Clicking "Show me" should open the first dialog
- ✅ **Requirement 2**: Clicking Next should navigate to next dialog
- ✅ **Requirement 3**: Clicking Previous should remove current dialog and show previous
- ✅ **Requirement 4**: First dialog should not show Previous button
- ✅ **Requirement 5**: Last dialog should not show Next button
- ✅ **Requirement 6**: Clicking outside dialogs should close all dialogs

### 2. Dialog Stacking Logic Tests (`DialogStack.test.tsx`)

#### Visual Stacking Behavior

- ✅ Should apply correct Y-offset (8px per dialog in stack)
- ✅ Should maintain proper z-index layering (higher index = higher z-index)
- ✅ Should show background dialogs partially visible behind current dialog
- ✅ Should stack dialogs correctly when navigating forward
- ✅ Should remove dialogs from stack when navigating backward

### 3. Navigation Logic Tests (`useMultiDialog.test.tsx`)

#### Multi-Dialog Navigation

- ✅ Should handle navigation through all dialogs sequentially
- ✅ Should handle mixed forward/backward navigation correctly
- ✅ Should reset to first dialog when reopening after close
- ✅ Should maintain correct dialog stack size during navigation

#### Edge Cases

- ✅ Should handle navigation at dialog boundaries (first/last)
- ✅ Should handle empty dialog configuration gracefully
- ✅ Should handle single dialog configuration correctly

### 4. Integration Tests (`multi-dialog.integration.test.tsx`)

#### Complete User Flows

- ✅ **Full Forward Flow**: Navigate through all dialogs from first to last
- ✅ **Full Backward Flow**: Navigate from last back to first
- ✅ **Mixed Navigation**: Forward and backward navigation in sequence
- ✅ **Close at Different Points**: Close dialogs at various navigation states

### Sample Dialog Configuration

```typescript
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
```

### Mock Functions

```typescript
const mockOnClose = vi.fn()
const mockOnNext = vi.fn()
const mockOnPrevious = vi.fn()
```

## Test Coverage Goals

- **Statements**: 95%+
- **Branches**: 90%+
- **Functions**: 100%
- **Lines**: 95%+

## Test Focus

### Core Multi-Dialog Functionality

- All 6 specified requirements
- Dialog stacking visual behavior
- Navigation logic specific to multi-dialog
- Complete user flow integration

### Edge Cases

- Navigation boundaries (first/last dialog)
- Empty or single dialog configurations
- Mixed navigation patterns

## Test Execution Strategy

### Development Phase

1. Run tests in watch mode during development
2. Use test-driven development for new features
3. Maintain test coverage above 90%

### CI/CD Integration

1. Run full test suite on every commit
2. Generate coverage reports
3. Prevent merge if tests fail or coverage drops

### Manual Testing Checklist

- [ ] Visual inspection of dialog stacking
- [ ] Cross-browser compatibility
- [ ] Mobile device testing
- [ ] Keyboard navigation testing
- [ ] Screen reader compatibility
