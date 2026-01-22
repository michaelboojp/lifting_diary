# UI Coding Standards

This document outlines the UI coding standards and conventions for the lifting diary application.

## Component Library

### shadcn/ui Components ONLY

**CRITICAL RULE**: This project uses **shadcn/ui** as the exclusive component library.

- ✅ **ALWAYS** use shadcn/ui components for all UI elements
- ❌ **NEVER** create custom UI components
- ❌ **ABSOLUTELY NO** custom buttons, inputs, cards, dialogs, or any other UI elements
- ✅ If a UI element is needed, find the appropriate shadcn/ui component

### Component Usage Guidelines

1. **Before writing any UI code**, check if shadcn/ui has a component for your needs
2. **Reference the shadcn/ui documentation**: https://ui.shadcn.com/
3. **Install components as needed** using the shadcn CLI: `npx shadcn@latest add [component-name]`
4. **Import from the components directory**: All shadcn components should be imported from `@/components/ui/[component-name]`

### Example Component Usage

```tsx
// ✅ CORRECT: Using shadcn/ui components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Example</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter text" />
        <Button>Submit</Button>
      </CardContent>
    </Card>
  )
}

// ❌ WRONG: Creating custom UI components
const CustomButton = ({ children }) => (
  <button className="px-4 py-2 bg-blue-500">{children}</button>
)
```

## Date Formatting

### date-fns Library

All date formatting in this project **must** use the `date-fns` library.

### Standard Date Format

The standard date format for displaying dates throughout the application is:

```
1st Sep 2025
```

### Implementation

```tsx
import { format } from 'date-fns'

// ✅ CORRECT: Using date-fns with the standard format
const formattedDate = format(new Date(), 'do MMM yyyy')
// Output: "1st Sep 2025"

// Examples:
format(new Date('2025-01-15'), 'do MMM yyyy') // "15th Jan 2025"
format(new Date('2025-12-25'), 'do MMM yyyy') // "25th Dec 2025"
```

### Date Format Reference

- `do` - Day of month with ordinal (1st, 2nd, 3rd, etc.)
- `MMM` - Abbreviated month name (Jan, Feb, Mar, etc.)
- `yyyy` - Full year (2025)

### Alternative Formats (if needed)

If alternative date formats are required for specific use cases, they must be documented here:

```tsx
// Full date with day name
format(date, 'EEEE, do MMM yyyy') // "Monday, 1st Sep 2025"

// Short date
format(date, 'dd/MM/yyyy') // "01/09/2025"

// ISO format (for API/database)
format(date, 'yyyy-MM-dd') // "2025-09-01"
```

## Summary

1. **Component Library**: shadcn/ui ONLY - no custom components
2. **Date Formatting**: date-fns ONLY - standard format is `do MMM yyyy` (1st Sep 2025)
3. **Before coding**: Check this document and shadcn/ui documentation
4. **When in doubt**: Use shadcn/ui components - they exist for almost every use case
