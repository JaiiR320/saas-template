# Component design

## Preserve data flow

Rendering and callbacks must observe current props. For controlled values, initial defaults, and reset behavior, see [State and effects](state-and-effects.md).

## Make components resilient

A component must remain correct when its parent renders more or less often than expected. It must not reset drafts, perform visible side effects during rendering, depend on mount timing, or require memoization for correctness.

Assume two copies can be mounted simultaneously. Prevent interference through mutable module state, shared refs, unscoped subscriptions, or global state used for instance-local interactions.

## Design explicit APIs

Follow project naming conventions. Otherwise, use `on<Event>` for callback props and `handle<Event>` for internal handlers. Domain components should pass the next domain value to callbacks; reserve raw DOM events for thin native-element wrappers.

Preserve the underlying MUI component's accessibility and supported contract when wrapping it.

## Prefer composition

Choose the smallest API that expresses what callers actually vary:

| Caller need                                                    | Starting point                                                                    |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Supply a value or one independent behavior, such as `disabled` | Ordinary props, including booleans                                                |
| Supply content or layout                                       | `children` or named React-node slots                                              |
| Render using data supplied by the component                    | A render callback, such as `renderItem(item)`                                     |
| Arrange cooperating parts with shared interaction state        | Compound components with a scoped provider when props are insufficient            |
| Select substantially different workflows                       | Separate domain components, sharing existing components or helpers where they fit |

Prop forwarding is normal for thin wrappers. Introduce composition when it simplifies callers or ownership, rather than to eliminate every forwarded prop. 

## Split by responsibility

Consider splitting when a region owns independent state, conditional branches represent distinct modes, props mix unrelated concerns, or synchronization obscures intent. Do not split only because a file is long, two components look similar, or extraction merely moves lines.

Never define a component inside another component's render; its identity changes each render and resets its subtree. Hoist it and pass data through props.

A custom hook should name a cohesive React behavior with a stable contract. Do not use hooks as miscellaneous containers or speculative reuse points.

## Split and share deliberately

Keep feature-specific code near its consumers, following local ownership. Expose domain operations rather than requiring callers to coordinate raw setters or provider internals. Keep deterministic calculations independent of React.

Compare real callers before extracting shared behavior. Identify stable responsibility and observed variation; extract when callers need to understand fewer concepts. Avoid occurrence-count rules and speculative frameworks. Verify shared contract changes through representative consumers.

### Configuration growth

Repeated `variant`, `mode`, layout, and behavior flags can indicate several components hidden behind one API. Prefer separate components, composable parts, named slots, or a small shared component or helper when combinations produce unrelated branches.

```tsx
// Wrong: `hasHeader`/`hasFooter` duplicate structure the content already implies
<Panel hasHeader header="Warning" hasFooter footer={<Dismiss />} collapsible>
  <p>Disk almost full.</p>
</Panel>

// Right: content defines structure; the genuine behavior flag stays a prop
<Panel header="Warning" footer={<Dismiss />} collapsible>
  <p>Disk almost full.</p>
</Panel>
```

### Recovering from a wrong abstraction

1. Inline the shared code into its callers.
2. Remove branches each caller does not use.
3. Compare the resulting implementations.
4. Extract only the smaller common behavior that becomes evident.

Do not add another mode flag to shared code that no longer fits its callers.

Earlier abstraction is justified when a contract already exists independently, such as a native-element wrapper, accessibility component, established design-system component, or mandatory shared policy.

## Provider boundaries

Scope providers to the interaction they own so separate editors remain independent. Cooperating content can share a provider without sharing a visual frame. Add compound components or interchangeable state adapters only when real callers need them. Expose domain actions instead of raw setters, and keep missing-provider checks explicit.

## Sources

Retains the local guidance based on Dan Abramov's "Writing Resilient Components," React's "You Might Not Need an Effect," and Kent C. Dodds' composition, colocation, and AHA guidance. Compound-component and provider-boundary guidance is adapted from Vercel Engineering; see [attribution](../SKILL.md#attribution).
