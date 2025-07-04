# Multi-Dialog Component Implementation Plan

## Overview

Create a robust multi-dialog component that opens 3 stacked dialogs with navigation controls, starting from the existing `demo.tsx` file.

## Current State Analysis

- **Starting Point**: `src/components/demo.tsx` with a "Show me" button
- **Available Dependencies**:
  - `@radix-ui/react-dialog` (already installed)
  - `shadcn/ui` Dialog components (already configured)
  - `lucide-react` for icons
  - Tailwind CSS for styling
- **Existing UI Components**: Button, Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription

## Requirements

1. **Keep existing demo.tsx**: Use the current file as-is, only modify the button behavior
2. **Dialog Stack**: 3 dialogs with specific content and navigation
3. **Navigation**:
   - Next button opens new dialog stacked on top with 8px Y-offset
   - Previous button removes current dialog from stack
4. **Visual Stacking**: Dialogs stack on top of each other with slight offset
5. **Close Behavior**: Clicking outside closes all dialogs
6. **Focus**: Core functionality only - no testing files for now

## Architecture Design

### 1. Component Structure

```
src/components/
├── demo.tsx (existing - will be modified to use DialogStack)
├── DialogStack.tsx (manages dialog state)
├── DialogNavigation.tsx (navigation logic)
├── useMultiDialog.ts (custom hook for state management)
└── types.ts (TypeScript interfaces)
```

### 2. Dialog Configuration

```typescript
interface DialogConfig {
	id: string
	title: string
	description: string
}

const dialogConfigs: DialogConfig[] = [
	{
		id: "dialog-1",
		title: "I'm first dialog",
		description: "With a fancy description",
	},
	{
		id: "dialog-2",
		title: "I'm second dialog",
		description: "With a fancy description",
	},
	{
		id: "dialog-3",
		title: "I'm third dialog",
		description: "With a fancy description",
	},
]
```

### 3. State Management Strategy

```typescript
interface DialogState {
	isOpen: boolean
	currentDialogIndex: number
	dialogStack: DialogConfig[]
}
```

## Implementation Steps

### Phase 1: Core Dialog System

1. **Create useMultiDialog Hook**

   - Implement basic dialog state management
   - Add navigation functions (next, previous, close)
   - Handle edge cases (first/last dialog)

2. **Create DialogStack Component**

   - Manage dialog rendering logic
   - Handle dialog opening/closing
   - Integrate with useMultiDialog hook

3. **Create DialogNavigation Component**

   - Implement Previous/Next button logic
   - Handle conditional button display
   - Integrate with navigation callbacks

4. **Modify existing demo.tsx**
   - Import and use DialogStack component
   - Keep existing button trigger
   - Add dialog state management

### Phase 2: Enhanced Features

1. **Dialog Stacking Visual Effect** ✅ (Implemented in Phase 1)

   - Multiple dialogs rendered simultaneously for stacking
   - 8px Y-offset for each subsequent dialog
   - Proper z-index management (50 + index)
   - Navigation only on topmost dialog

2. **Keyboard Navigation**

   - Arrow key navigation between dialogs
   - Escape key to close all dialogs
   - Tab navigation within dialogs

3. **Animation & Transitions**
   - Smooth slide transitions when adding/removing dialogs
   - Fade effects for dialog switching
   - Loading states during navigation

### Phase 3: Robustness & Polish

1. **Error Handling**

   - Graceful handling of invalid states
   - Fallback mechanisms for navigation
   - Proper cleanup on unmount

2. **Accessibility**

   - ARIA labels and descriptions
   - Focus management between dialogs
   - Screen reader compatibility

3. **Performance Optimization**
   - Lazy loading of dialog content
   - Efficient re-renders
   - Memory leak prevention

## Technical Implementation Details

### 1. Dialog State Management

```typescript
const useMultiDialog = () => {
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
```

### 2. Modified Demo Component Structure

```typescript
// Updated demo.tsx
import { Button } from '@/components/ui/button';
import { DialogStack } from './DialogStack';
import { useMultiDialog } from './useMultiDialog';

export const Demo = () => {
  const {
    dialogState,
    openDialog,
    closeAllDialogs,
    navigateToNext,
    navigateToPrevious,
    canNavigateNext,
    canNavigatePrevious
  } = useMultiDialog();

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
        canNavigateNext={canNavigateNext}
        canNavigatePrevious={canNavigatePrevious}
      />
    </div>
  );
};
```

### 3. Dialog Stack Implementation

```typescript
const DialogStack = ({ dialogState, onClose, onNext, onPrevious, canNavigateNext, canNavigatePrevious }) => {
  const currentDialog = dialogState.dialogStack[dialogState.currentDialogIndex];

  return (
    <Dialog open={dialogState.isOpen} onOpenChange={onClose}>
      {/* Render all dialogs up to current index for stacking effect */}
      {dialogState.dialogStack.slice(0, dialogState.currentDialogIndex + 1).map((dialog, index) => (
        <DialogContent
          key={dialog.id}
          className="sm:max-w-[425px]"
          style={{
            transform: `translateY(${index * 8}px)`,
            zIndex: 50 + index,
            position: 'fixed',
            left: '50%',
            top: '50%',
            marginTop: `${index * 8}px`,
            marginLeft: '-212.5px', // Half of max-width (425px / 2)
          }}
        >
          <DialogHeader>
            <DialogTitle>{dialog.title}</DialogTitle>
            <DialogDescription>{dialog.description}</DialogDescription>
          </DialogHeader>

          {/* Only show navigation on the topmost (current) dialog */}
          {index === dialogState.currentDialogIndex && (
            <DialogNavigation
              canNavigatePrevious={canNavigatePrevious}
              canNavigateNext={canNavigateNext}
              onNext={onNext}
              onPrevious={onPrevious}
            />
          )}
        </DialogContent>
      ))}
    </Dialog>
  );
};
```

### 4. Navigation Component

```typescript
const DialogNavigation = ({ canNavigatePrevious, canNavigateNext, onNext, onPrevious }) => {
  return (
    <DialogFooter className="flex justify-between">
      <div className="flex gap-2">
        {canNavigatePrevious && (
          <Button variant="outline" onClick={onPrevious}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        {canNavigateNext && (
          <Button onClick={onNext}>
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </DialogFooter>
  );
};
```

### 5. Navigation Behavior

**Next Button Logic:**

- Increases `currentDialogIndex` by 1
- Adds a new dialog to the visual stack with 8px Y-offset
- New dialog appears on top with higher z-index
- Navigation appears only on the topmost dialog

**Previous Button Logic:**

- Decreases `currentDialogIndex` by 1
- Removes the current (topmost) dialog from the stack
- Previous dialog becomes active and shows navigation
- Maintains visual hierarchy of remaining dialogs

**Outside Click Behavior:**

- Closes all dialogs at once
- Resets `currentDialogIndex` to 0
- Clears the entire dialog stack

## Edge Cases & Considerations

### 1. State Edge Cases

- **Invalid Dialog Index**: Ensure index bounds checking
- **Rapid Navigation**: Debounce navigation to prevent state conflicts
- **Component Unmount**: Cleanup dialog state on unmount

### 2. Visual Stacking Considerations

- **Z-Index Management**: Ensure proper layering with z-index: 50 + index
- **Responsive Positioning**: Dialog positioning works on different screen sizes
- **Overflow Handling**: Stack doesn't exceed viewport boundaries
- **Performance**: Rendering multiple dialogs efficiently

### 3. User Experience

- **Loading States**: Show loading indicators during navigation
- **Keyboard Support**: Full keyboard navigation support
- **Mobile Responsiveness**: Ensure stacked dialogs work well on mobile devices
- **Visual Feedback**: Clear indication of which dialog is active

### 4. Accessibility

- **Focus Management**: Proper focus trapping within the active (topmost) dialog
- **ARIA Labels**: Comprehensive ARIA labeling for stacked dialogs
- **Screen Reader Support**: Announce dialog changes and stack position

## Performance Considerations

### 1. Optimization Techniques

- **Memoization**: Use React.memo for dialog components
- **Lazy Loading**: Load dialog content on demand
- **Efficient Re-renders**: Minimize unnecessary re-renders

### 2. Bundle Size

- **Code Splitting**: Split dialog logic if needed
- **Tree Shaking**: Ensure unused code is removed
- **Dependency Optimization**: Use only necessary parts of libraries

## Security Considerations

### 1. XSS Prevention

- Sanitize any dynamic content
- Use safe rendering practices
- Validate all user inputs

### 2. Content Security

- Ensure dialog content is secure
- Validate navigation parameters
- Prevent unauthorized dialog access

## Future Enhancements

### 1. Advanced Features

- **Dialog Preloading**: Preload next dialog content
- **Custom Animations**: Configurable transition animations
- **Dialog Templates**: Reusable dialog templates

### 2. Developer Experience

- **Debug Mode**: Enhanced debugging capabilities
- **Configuration Options**: Extensive customization options
- **TypeScript Support**: Full TypeScript integration

## Files to Create/Modify

### New Files

1. `src/components/DialogStack.tsx`
2. `src/components/DialogNavigation.tsx`
3. `src/components/useMultiDialog.ts`
4. `src/components/types.ts`

### Modified Files

1. `src/components/demo.tsx` (modify to use DialogStack)

## Dependencies Assessment

### Currently Available

- ✅ `@radix-ui/react-dialog` - Core dialog functionality
- ✅ `lucide-react` - Icons for navigation
- ✅ `clsx` & `tailwind-merge` - Styling utilities
- ✅ `class-variance-authority` - Variant handling

### No Additional Dependencies Needed

The implementation can be completed with existing dependencies, ensuring minimal bundle size impact.

## Success Metrics

### 1. Functionality

- ✅ Dialog opens on button click
- ✅ Navigation works correctly (Next adds, Previous removes)
- ✅ Outside click closes all dialogs
- ✅ Proper content display in each dialog
- ✅ Visual stacking effect with 8px Y-offset
- ✅ Proper z-index layering

### 2. Performance

- ✅ Smooth animations (60fps)
- ✅ Quick navigation response (<100ms)
- ✅ Minimal bundle size increase

### 3. Accessibility

- ✅ WCAG 2.1 AA compliance
- ✅ Screen reader compatibility
- ✅ Keyboard navigation support

## Conclusion

This focused plan provides a practical approach to building a robust multi-dialog component that meets all specified requirements. The implementation leverages existing shadcn/ui components, keeps the existing demo.tsx file, and focuses on core functionality without over-engineering. The modular structure with DialogStack, DialogNavigation, and useMultiDialog hook ensures maintainable and testable code when needed.

The visual stacking effect with 8px Y-offset creates an intuitive user experience where users can see the dialog hierarchy and understand their navigation context. The "Next" button progressively builds the stack while "Previous" removes dialogs, providing clear visual feedback of the user's journey through the dialog flow.
