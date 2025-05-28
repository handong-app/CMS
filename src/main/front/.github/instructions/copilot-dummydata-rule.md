// Copilot Rule: When using default (dummy) data for a component, always define and export an explicit props type (e.g., MyComponentProps) for the component.
// The default data should match the props type structure, and the component should accept the data as a prop, falling back to the default only if the prop is not provided.
// This ensures type safety, reusability, and clarity for both real and dummy data usage.
// Example:
// export interface MyComponentProps { items?: Array<{ name: string }> }
// const defaultItems = [{ name: 'Example' }];
// function MyComponent({ items }: MyComponentProps) { const data = items && items.length > 0 ? items : defaultItems; ... }
