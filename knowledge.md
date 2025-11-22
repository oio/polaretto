# KNOWLEDGE BASE - Comprehensive Documentation

> Merged documentation for Svelte 5, SvelteKit, Vite, Sharp, Astro ImageTools, and Responsive Images

**📚 Merge Information:**
- **Date:** November 22, 2025
- **Total Size:** 425 KB
- **Total Lines:** 21,593 lines
- **Purpose:** Consolidated reference documentation for AI agents and developers

---

## Merged Documents

This knowledge base is a comprehensive merge of the following documentation files:

1. **SVELTE_BIBLE.md** (5,195 lines)
   - Svelte 5 framework documentation
   - Runes, components, reactivity, and best practices

2. **SVELTEKIT_BIBLE.md** (3,907 lines)
   - SvelteKit application framework
   - Routing, load functions, form actions, and deployment

3. **VITE_BIBLE.md** (6,741 lines)
   - Vite build tool and dev server
   - Configuration, plugins, optimization, and build process

4. **responsive_images.md** (168 lines)
   - HTML responsive images implementation
   - Picture element, srcset, and modern image formats

5. **SHARP_BIBLE.md** (2,604 lines)
   - Sharp image processing library
   - Image transformation, optimization, and manipulation

6. **ASTRO_IMAGETOOLS_BIBLE.md** (2,978 lines)
   - Astro ImageTools integration
   - Image optimization for Astro framework

---

## How to Use This Document

This merged knowledge base is organized sequentially by topic. Each section maintains its original structure and table of contents. Use your editor's search functionality (Ctrl+F / Cmd+F) to quickly find specific topics.

**Quick Navigation Tips:**
- Search for specific framework names: "Svelte", "SvelteKit", "Vite", "Sharp"
- Look for section headers marked with `#` symbols
- Original tables of contents are preserved within each section

---

## Document Organization

The content below is organized in the following order:

1. **Svelte 5 Documentation** (lines 1-5,195)
2. **SvelteKit Documentation** (lines 5,196-9,102)
3. **Vite Build Tool** (lines 9,103-15,843)
4. **Responsive Images** (lines 15,844-16,011)
5. **Sharp Image Processing** (lines 16,012-18,615)
6. **Astro ImageTools** (lines 18,616-21,593)

---

# SVELTE 5 BIBLE

> Comprehensive knowledge document for AI agents implementing Svelte 5 code

**📊 Document Stats:**
- **~24,000 tokens** (~97KB)
- **5,187 lines** of documentation
- **12,732 words**
- **Coverage:** ~95% of official Svelte 5 documentation

---

## Table of Contents

1. [Introduction](#introduction)
2. [Core Concepts](#core-concepts)
3. [Runes - The Foundation of Reactivity](#runes---the-foundation-of-reactivity)
4. [Component Structure](#component-structure)
5. [Template Syntax](#template-syntax)
6. [Props and Component Communication](#props-and-component-communication)
7. [Event Handling](#event-handling)
8. [Bindings](#bindings)
9. [Attachments](#attachments-attach)
10. [Styling](#styling)
11. [Control Flow](#control-flow)
12. [Snippets - Reusable UI Blocks](#snippets---reusable-ui-blocks)
13. [Template Tags](#template-tags)
14. [Effects and Lifecycle](#effects-and-lifecycle)
15. [Imperative Component API](#imperative-component-api)
16. [Stores (Legacy Compatibility)](#stores-legacy-compatibility)
17. [Context API](#context-api)
18. [Animations and Transitions](#animations-and-transitions)
19. [Special Elements](#special-elements)
20. [Actions (Legacy)](#actions-use---legacy)
21. [Testing](#testing)
22. [Custom Elements (Web Components)](#custom-elements-web-components)
23. [TypeScript Integration](#typescript-integration)
24. [Best Practices](#best-practices)
25. [Migration from Svelte 4](#migration-from-svelte-4)
26. [Common Patterns](#common-patterns)
27. [Anti-Patterns to Avoid](#anti-patterns-to-avoid)

---

## Introduction

Svelte 5 represents a fundamental shift in how reactivity works in Svelte. The new **runes** system replaces the implicit reactivity of Svelte 4 with explicit, compile-time reactivity primitives.

### Key Changes from Svelte 4

- **Runes replace magic:** `$state` replaces reactive `let`, `$derived` replaces `$:`, `$effect` replaces `$:` side effects
- **Props are explicit:** `$props()` replaces `export let`
- **Events are just props:** Callback props replace `createEventDispatcher`
- **Snippets replace slots:** More powerful and flexible content passing
- **Components are functions:** No longer classes, use `mount()` instead of `new Component()`

---

## Core Concepts

### What are Runes?

Runes are compiler instructions that control reactivity. They:

- Start with `$` prefix
- Look like functions but are keywords
- Don't need to be imported
- Only work in specific positions
- Are the **only** way to create reactivity in Svelte 5

```svelte
<script>
	// Runes are keywords, not imports
	let count = $state(0);
	let doubled = $derived(count * 2);
</script>
```

---

## Runes - The Foundation of Reactivity

### `$state` - Reactive State

Creates reactive state that triggers UI updates when changed.

#### Basic Usage

```svelte
<script>
	let count = $state(0);
</script>

<button onclick={() => count++}>
	clicks: {count}
</button>
```

**Key Points:**

- `count` is the number itself, not a wrapper
- Read and write directly: `count++`, `count = 5`
- No `.value` property needed

#### Deep Reactivity

Objects and arrays become deeply reactive proxies:

```svelte
<script>
	let todos = $state([{ done: false, text: 'add more todos' }]);
</script>

<button onclick={() => (todos[0].done = !todos[0].done)}> Toggle first todo </button>

<button onclick={() => todos.push({ done: false, text: 'new todo' })}> Add todo </button>
```

**Key Points:**

- Nested properties are reactive
- Array methods (`push`, `splice`, etc.) trigger updates
- New objects added to arrays/objects become reactive

#### Destructuring Caveat

```svelte
<script>
	let todos = $state([{ done: false, text: 'todo' }]);

	// ❌ DON'T DO THIS - loses reactivity
	let { done, text } = todos[0];

	// ✅ DO THIS - keeps reactivity
	// Reference the object directly
	$effect(() => {
		console.log(todos[0].done); // This is reactive
	});
</script>
```

#### State in Classes

```svelte
<script>
	class Todo {
		done = $state(false);

		constructor(text) {
			this.text = $state(text);
		}

		// Use arrow function to maintain 'this' binding
		reset = () => {
			this.text = '';
			this.done = false;
		};
	}

	let todo = new Todo('Learn Svelte 5');
</script>

<button onclick={todo.reset}>reset</button>
```

**Key Points:**

- `$state` fields become getters/setters
- Use arrow functions for methods that reference `this`
- Properties are not enumerable

#### `$state.raw` - Non-Reactive State

For performance when deep reactivity isn't needed:

```svelte
<script>
	let person = $state.raw({
		name: 'Heraclitus',
		age: 49
	});

	// ❌ This won't trigger updates
	person.age += 1;

	// ✅ This will work - reassignment
	person = { name: 'Heraclitus', age: 50 };
</script>
```

**Use Cases:**

- Large arrays/objects that won't be mutated
- Performance optimization
- Can contain reactive state

#### `$state.snapshot` - Static Snapshots

Get a static copy of reactive state:

```svelte
<script>
	let counter = $state({ count: 0 });

	function logState() {
		// Logs plain object, not Proxy
		console.log($state.snapshot(counter));
	}
</script>
```

**Use Cases:**

- Passing to external libraries
- `structuredClone` operations
- Debugging

#### Sharing State Across Modules

```javascript
// ❌ DON'T export directly reassigned state
// state.svelte.js
export let count = $state(0); // ERROR!

// ✅ DO use objects (not reassigned)
export const counter = $state({ count: 0 });

export function increment() {
	counter.count += 1;
}

// ✅ OR use getter functions
let count = $state(0);

export function getCount() {
	return count;
}

export function increment() {
	count += 1;
}
```

---

### `$derived` - Computed Values

Creates values that automatically update when their dependencies change.

#### Basic Usage

```svelte
<script>
	let count = $state(0);
	let doubled = $derived(count * 2);
</script>

<button onclick={() => count++}>
	{count} * 2 = {doubled}
</button>
```

**Key Points:**

- Must be side-effect free
- State changes inside `$derived` are disallowed
- Runs whenever dependencies change
- Returns the value, not a wrapper

#### `$derived.by` - Complex Derivations

For multi-line computations:

```svelte
<script>
	let numbers = $state([1, 2, 3]);

	let total = $derived.by(() => {
		let sum = 0;
		for (const n of numbers) {
			sum += n;
		}
		return sum;
	});
</script>

<button onclick={() => numbers.push(numbers.length + 1)}>
	{numbers.join(' + ')} = {total}
</button>
```

**Equivalent Forms:**

```javascript
let doubled = $derived(count * 2);
// is equivalent to
let doubled = $derived.by(() => count * 2);
```

#### Understanding Dependencies

Dependencies are determined at **runtime** by what is **synchronously** read:

```svelte
<script>
	let count = $state(0);
	let size = $state(10);

	let result = $derived.by(() => {
		const value = count; // count is a dependency

		setTimeout(() => {
			console.log(size); // size is NOT a dependency (async)
		}, 0);

		return value * 2;
	});
</script>
```

#### Push-Pull Reactivity

Svelte uses "push-pull" reactivity:

- **Push:** When state changes, derived values are marked dirty immediately
- **Pull:** Derived values only recalculate when read

```svelte
<script>
	let count = $state(0);
	let large = $derived(count > 10);
</script>

<button onclick={() => count++}>
	{large}
	<!-- Only updates when 'large' changes, not when 'count' changes -->
</button>
```

#### Overriding Derived Values

Since Svelte 5.25, you can temporarily override derived values (unless `const`):

```svelte
<script>
	let { post, like } = $props();

	let likes = $derived(post.likes);

	async function onclick() {
		// Optimistic UI - immediately increment
		likes += 1;

		try {
			await like();
		} catch {
			// Failed! Roll back
			likes -= 1;
		}
	}
</script>

<button {onclick}>🧡 {likes}</button>
```

#### Destructuring with $derived

```svelte
<script>
	function stuff() {
		return { a: 1, b: 2, c: 3 };
	}

	// All variables become reactive
	let { a, b, c } = $derived(stuff());

	// Roughly equivalent to:
	let _stuff = $derived(stuff());
	let a = $derived(_stuff.a);
	let b = $derived(_stuff.b);
	let c = $derived(_stuff.c);
</script>
```

---

### `$effect` - Side Effects

Runs code when dependencies change. Use sparingly.

#### Basic Usage

```svelte
<script>
	let size = $state(50);
	let color = $state('#ff3e00');
	let canvas;

	$effect(() => {
		const context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);

		// Re-runs whenever `color` or `size` change
		context.fillStyle = color;
		context.fillRect(0, 0, size, size);
	});
</script>

<canvas bind:this={canvas} width="100" height="100"></canvas>
```

**Key Points:**

- Runs **after** component mounts
- Runs in a microtask after state changes
- Tracks dependencies automatically
- Use for: DOM manipulation, external APIs, side effects
- **Avoid** updating state inside effects (use `$derived` instead)

#### Lifecycle

- Runs after component mount
- Runs in microtask after state changes
- Re-runs are batched
- Runs after DOM updates

#### Teardown Functions

```svelte
<script>
	let count = $state(0);
	let milliseconds = $state(1000);

	$effect(() => {
		const interval = setInterval(() => {
			count += 1;
		}, milliseconds);

		return () => {
			// Cleanup runs:
			// a) before effect re-runs
			// b) when component is destroyed
			clearInterval(interval);
		};
	});
</script>

<h1>{count}</h1>
<button onclick={() => (milliseconds *= 2)}>slower</button>
<button onclick={() => (milliseconds /= 2)}>faster</button>
```

#### Understanding Dependencies

Dependencies are values read **synchronously**:

```svelte
<script>
	let color = $state('#ff3e00');
	let size = $state(50);

	$effect(() => {
		// `color` is tracked
		context.fillStyle = color;

		setTimeout(() => {
			// `size` is NOT tracked (async)
			context.fillRect(0, 0, size, size);
		}, 0);
	});
</script>
```

Only depends on **objects**, not properties:

```svelte
<script>
	let state = $state({ value: 0 });
	let derived = $derived({ value: state.value * 2 });

	// Runs once - `state` never reassigned
	$effect(() => {
		state;
	});

	// Runs whenever `state.value` changes
	$effect(() => {
		state.value;
	});

	// Runs whenever `derived` changes (new object each time)
	$effect(() => {
		derived;
	});
</script>
```

#### Conditional Dependencies

```svelte
<script>
	let condition = $state(true);
	let color = $state('#ff3e00');

	$effect(() => {
		if (condition) {
			confetti({ colors: [color] }); // Both are dependencies
		} else {
			confetti(); // Only `condition` is a dependency
		}
	});
</script>
```

#### `$effect.pre` - Before DOM Updates

For rare cases where you need to run before DOM updates:

```svelte
<script>
	import { tick } from 'svelte';

	let div = $state();
	let messages = $state([]);

	$effect.pre(() => {
		if (!div) return;

		messages.length; // Track dependency

		// Autoscroll when new messages added
		if (div.offsetHeight + div.scrollTop > div.scrollHeight - 20) {
			tick().then(() => {
				div.scrollTo(0, div.scrollHeight);
			});
		}
	});
</script>

<div bind:this={div}>
	{#each messages as message}
		<p>{message}</p>
	{/each}
</div>
```

#### `$effect.tracking()` - Check Tracking Context

```svelte
<script>
	console.log('in setup:', $effect.tracking()); // false

	$effect(() => {
		console.log('in effect:', $effect.tracking()); // true
	});
</script>

<p>in template: {$effect.tracking()}</p> <!-- true -->
```

#### `$effect.pending()` - Count Pending Promises

```svelte
<script>
	let a = $state(0);
	let b = $state(0);
</script>

<button onclick={() => a++}>a++</button>
<button onclick={() => b++}>b++</button>

<p>{a} + {b} = {await add(a, b)}</p>

{#if $effect.pending()}
	<p>pending promises: {$effect.pending()}</p>
{/if}
```

#### `$effect.root` - Manual Effect Management

For advanced use cases:

```svelte
<script>
	const destroy = $effect.root(() => {
		$effect(() => {
			// setup
		});

		return () => {
			// cleanup
		};
	});

	// later...
	destroy();
</script>
```

#### When NOT to Use `$effect`

❌ **Don't synchronize state:**

```svelte
<script>
	let count = $state(0);
	let doubled = $state();

	// ❌ WRONG!
	$effect(() => {
		doubled = count * 2;
	});
</script>
```

✅ **Use `$derived` instead:**

```svelte
<script>
	let count = $state(0);
	let doubled = $derived(count * 2);
</script>
```

❌ **Don't create complex interdependent effects:**

```svelte
<script>
	const total = 100;
	let spent = $state(0);
	let left = $state(total);

	// ❌ WRONG!
	$effect(() => {
		left = total - spent;
	});

	$effect(() => {
		spent = total - left;
	});
</script>
```

✅ **Use `$derived` and function bindings:**

```svelte
<script>
	const total = 100;
	let spent = $state(0);
	let left = $derived(total - spent);

	function updateLeft(value) {
		spent = total - value;
	}
</script>

<input type="range" bind:value={spent} max={total} />
<input type="range" bind:value={() => left, updateLeft} max={total} />
```

---

### `$props` - Component Props

Declares component props with destructuring.

#### Basic Usage

```svelte
<!-- MyComponent.svelte -->
<script>
	let { adjective } = $props();
</script>

<p>this component is {adjective}</p>
```

```svelte
<!-- Usage -->
<MyComponent adjective="cool" />
```

**Key Points:**

- Use destructuring to declare props
- Props are reactive automatically
- Can have default values

#### Fallback Values

```svelte
<script>
	let { adjective = 'happy' } = $props();
</script>
```

**Important:** Fallback values are not reactive proxies.

#### Renaming Props

```svelte
<script>
	// Rename reserved keywords or invalid identifiers
	let { class: klass, super: trouper = 'lights are gonna find me' } = $props();
</script>
```

#### Rest Props

```svelte
<script>
	let { a, b, c, ...others } = $props();
</script>

<Component {a} {b} {c} {...others} />
```

#### Updating Props

Props can be temporarily overridden in the child (useful for ephemeral state):

```svelte
<!-- Parent.svelte -->
<script>
	let count = $state(0);
</script>

<button onclick={() => count++}>
	parent: {count}
</button>

<Child {count} />
```

```svelte
<!-- Child.svelte -->
<script>
	let { count } = $props();
</script>

<button onclick={() => count++}>
	child: {count}
	<!-- temporary override -->
</button>
```

**Rules:**

- Can **reassign** props temporarily
- Cannot **mutate** props (unless `$bindable`)
- Mutations have no effect on non-reactive props
- Mutations trigger warnings on reactive props

#### Type Safety

```svelte
<script lang="ts">
	interface Props {
		adjective: string;
		optional?: boolean;
	}

	let { adjective, optional }: Props = $props();
</script>
```

#### `$props.id()` - Unique IDs

Generates consistent IDs for SSR and client hydration:

```svelte
<script>
	const uid = $props.id();
</script>

<form>
	<label for="{uid}-firstname">First Name:</label>
	<input id="{uid}-firstname" type="text" />

	<label for="{uid}-lastname">Last Name:</label>
	<input id="{uid}-lastname" type="text" />
</form>
```

---

### `$bindable` - Two-Way Binding

Marks props as bindable for two-way data flow.

#### Basic Usage

```svelte
<!-- FancyInput.svelte -->
<script>
	let { value = $bindable(), ...props } = $props();
</script>

<input bind:value {...props} />

<style>
	input {
		font-family: 'Comic Sans MS';
		color: deeppink;
	}
</style>
```

```svelte
<!-- Usage -->
<script>
	import FancyInput from './FancyInput.svelte';

	let message = $state('hello');
</script>

<FancyInput bind:value={message} /><p>{message}</p>
```

**Key Points:**

- Parent can use `bind:` to create two-way binding
- Parent can also pass as normal prop (one-way)
- Allows child to mutate the state proxy

#### Fallback Values

```svelte
<script>
	let { value = $bindable('fallback') } = $props();
</script>
```

**Important:** Fallback only applies when prop not bound. Parent must provide non-`undefined` value when binding.

---

### `$inspect` - Debugging

Development-only debugging tool (becomes noop in production).

#### Basic Usage

```svelte
<script>
	let count = $state(0);
	let message = $state('hello');

	$inspect(count, message); // console.log when they change
</script>

<button onclick={() => count++}>Increment</button>
<input bind:value={message} />
```

#### Custom Logging

```svelte
<script>
	let count = $state(0);

	$inspect(count).with((type, count) => {
		if (type === 'update') {
			debugger; // or console.trace
		}
	});
</script>
```

**Convenience:**

```javascript
$inspect(stuff).with(console.trace);
```

#### `$inspect.trace()` - Trace Effects

Traces which state causes effects to re-run:

```svelte
<script>
	import { doSomeWork } from './elsewhere';

	$effect(() => {
		// Must be first statement
		$inspect.trace('my-effect');
		doSomeWork();
	});
</script>
```

---

### `$host` - Custom Elements

Provides access to the custom element host.

```svelte
<!-- Stepper.svelte -->
<svelte:options customElement="my-stepper" />

<script>
	function dispatch(type) {
		$host().dispatchEvent(new CustomEvent(type));
	}
</script>

<button onclick={() => dispatch('decrement')}>decrement</button>
<button onclick={() => dispatch('increment')}>increment</button>
```

```svelte
<!-- Usage -->
<script>
	import './Stepper.svelte';

	let count = $state(0);
</script>

<my-stepper ondecrement={() => (count -= 1)} onincrement={() => (count += 1)}></my-stepper>

<p>count: {count}</p>
```

---

## Component Structure

### File Structure

```svelte
<!-- MyComponent.svelte -->

<!-- Module script (runs once per module load) -->
<script module>
	// Runs when module first evaluates
	let total = 0;

	export function getTotal() {
		return total;
	}
</script>

<!-- Instance script (runs per component instance) -->
<script>
	// Instance-level logic
	let { name } = $props();

	total += 1;
</script>

<!-- Markup (zero or more elements) -->
<div>
	<h1>Hello {name}!</h1>
</div>

<!-- Styles (scoped by default) -->
<style>
	div {
		color: burlywood;
	}
</style>
```

**Key Points:**

- All sections are optional
- Script can be TypeScript: `<script lang="ts">`
- Module script: `<script module>` (Svelte 4: `<script context="module">`)
- Export from module script becomes module export

### TypeScript Support

```svelte
<script lang="ts">
	let name: string = 'world';

	function greet(name: string) {
		alert(`Hello, ${name}!`);
	}
</script>

<button onclick={(e: Event) => greet((e.target as HTMLButtonElement).innerText)}>
	{name as string}
</button>
```

---

## Template Syntax

### Basic Markup

#### Tags

```svelte
<script>
	import Widget from './Widget.svelte';
</script>

<!-- lowercase = HTML element -->
<div>
	<!-- Capitalized or dot notation = component -->
	<Widget />
	<my.stuff />
</div>
```

#### Element Attributes

```svelte
<!-- Static -->
<div class="foo">
	<button disabled>can't touch this</button>
</div>

<!-- JavaScript expressions -->
<a href="page/{p}">page {p}</a>
<button disabled={!clickable}>...</button>

<!-- Boolean attributes -->
<input required={false} placeholder="not required" />
<div title={null}>no title attribute</div>

<!-- Shorthand when name matches value -->
<button {disabled}>...</button>
<!-- equivalent to -->
<button {disabled}>...</button>
```

**Rules:**

- Boolean attributes: included if truthy, excluded if falsy
- Other attributes: included unless nullish (`null`/`undefined`)
- Unquoted values allowed: `<input type=checkbox />`

#### Component Props

```svelte
<Widget foo={bar} answer={42} text="hello" />

<!-- Shorthand -->
<Widget {foo} {answer} {text} />
```

#### Spread Attributes

```svelte
<Widget a="b" {...things} c="d" />
<!-- Order matters: later values override earlier ones -->
```

#### Text Expressions

```svelte
<h1>Hello {name}!</h1>
<p>{a} + {b} = {a + b}</p>

<!-- RegEx needs parentheses -->
<div>{/^[A-Za-z ]+$/.test(value) ? x : y}</div>
```

**Special cases:**

- `null`/`undefined` are omitted
- Others are coerced to strings
- Automatically escaped (use `{@html}` for HTML)

#### Comments

```svelte
<!-- Regular HTML comment -->
<h1>Hello world</h1>

<!-- svelte-ignore disables warnings -->
<!-- svelte-ignore a11y_autofocus -->
<input bind:value={name} autofocus />
```

**Component documentation:**

````svelte
<!--
@component
- You can use markdown here
- Usage:
  ```html
  <Main name="Arethra">
  ```
-->
<script>
	let { name } = $props();
</script>
````

---

## Props and Component Communication

### Declaring Props

```svelte
<script>
	let { foo, bar = 'default', ...rest } = $props();
</script>
```

### TypeScript Props

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		requiredProp: number;
		optionalProp?: boolean;
		snippet: Snippet<[string]>;
		callback: (arg: string) => void;
		[key: string]: unknown; // Index signature
	}

	let { requiredProp, optionalProp, snippet, callback, ...rest }: Props = $props();
</script>
```

### Generic Props

```svelte
<script lang="ts" generics="Item extends { text: string }">
	interface Props {
		items: Item[];
		select(item: Item): void;
	}

	let { items, select }: Props = $props();
</script>

{#each items as item}
	<button onclick={() => select(item)}>
		{item.text}
	</button>
{/each}
```

### Wrapper Components

```svelte
<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	let { children, ...rest }: HTMLButtonAttributes = $props();
</script>

<button {...rest}>
	{@render children?.()}
</button>
```

For elements without dedicated types:

```svelte
<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	let { children, ...rest }: SvelteHTMLElements['div'] = $props();
</script>

<div {...rest}>
	{@render children?.()}
</div>
```

---

## Event Handling

### Event Attributes

Events are properties, not directives:

```svelte
<script>
  let count = $state(0);
</script>

<!-- Svelte 5: event attributes -->
<button onclick={() => count++}>
  clicks: {count}
</button>

<!-- Shorthand -->
<script>
  function onclick() {
    count++;
  }
</script>

<button {onclick}>
  clicks: {count}
</button>
```

**Key Points:**

- No `on:` prefix (that's legacy)
- Case-sensitive: `onclick` ≠ `onClick`
- Can use shorthand and spread
- Fire after bindings update

### Component Events (Callback Props)

Replace `createEventDispatcher` with callback props:

```svelte
<!-- Pump.svelte -->
<script>
	let { inflate, deflate } = $props();
	let power = $state(5);
</script>

<button onclick={() => inflate(power)}>inflate</button>
<button onclick={() => deflate(power)}>deflate</button>
```

```svelte
<!-- App.svelte -->
<script>
	import Pump from './Pump.svelte';

	let size = $state(15);
	let burst = $state(false);
</script>

<Pump
	inflate={(power) => {
		size += power;
		if (size > 75) burst = true;
	}}
	deflate={(power) => {
		if (size > 0) size -= power;
	}}
/>

{#if burst}
	<span class="boom">💥</span>
{:else}
	<span class="balloon" style="scale: {0.01 * size}">🎈</span>
{/if}
```

### Event Delegation

Certain events are delegated for performance:

**Delegated events:**

- `beforeinput`, `click`, `change`, `dblclick`, `contextmenu`
- `focusin`, `focusout`, `input`, `keydown`, `keyup`
- `mousedown`, `mousemove`, `mouseout`, `mouseover`, `mouseup`
- `pointerdown`, `pointermove`, `pointerout`, `pointerover`, `pointerup`
- `touchend`, `touchmove`, `touchstart`

**Important:**

- Set `{ bubbles: true }` when manually dispatching
- Avoid `stopPropagation` on delegated events
- Use `on` from `svelte/events` for manual listeners

### Passive Event Handlers

`ontouchstart` and `ontouchmove` are passive for better performance.

To prevent defaults (rare), use the `on` function from `svelte/events`.

---

## Bindings

### Input Bindings

#### Text Input

```svelte
<script>
	let message = $state('hello');
</script>

<input bind:value={message} /><p>{message}</p>
```

#### Numeric Input

```svelte
<script>
	let a = $state(1);
	let b = $state(2);
</script>

<input type="number" bind:value={a} min="0" max="10" />
<input type="range" bind:value={a} min="0" max="10" />
<p>{a} + {b} = {a + b}</p>
```

**Key Points:**

- Empty/invalid numeric inputs are `undefined`
- Default values: `<input bind:value defaultValue="..." />`

#### Checkbox

```svelte
<script>
	let accepted = $state(false);
	let checked = $state(true);
</script>

<input type="checkbox" bind:checked={accepted} />
<input type="checkbox" bind:checked defaultChecked={true} />
```

#### Checkbox Indeterminate

```svelte
<script>
	let checked = $state(false);
	let indeterminate = $state(true);
</script>

<input type="checkbox" bind:checked bind:indeterminate />

{#if indeterminate}
	waiting...
{:else if checked}
	checked
{:else}
	unchecked
{/if}
```

#### Group Bindings

```svelte
<script>
	let tortilla = $state('Plain');
	let fillings = $state([]);
</script>

<!-- Radio inputs (mutually exclusive) -->
<input type="radio" bind:group={tortilla} value="Plain" />
<input type="radio" bind:group={tortilla} value="Whole wheat" />

<!-- Checkbox inputs (populate array) -->
<input type="checkbox" bind:group={fillings} value="Rice" />
<input type="checkbox" bind:group={fillings} value="Beans" />
<input type="checkbox" bind:group={fillings} value="Cheese" />
```

**Note:** `bind:group` only works within same component.

#### File Input

```svelte
<script>
	let files = $state();

	function clear() {
		files = new DataTransfer().files;
	}
</script>

<input type="file" bind:files accept="image/png, image/jpeg" />
<button onclick={clear}>clear</button>
```

**Key Points:**

- Value must be `FileList`, `null`, or `undefined`
- Use `DataTransfer` to create `FileList`
- Cannot be modified directly

### Select Bindings

```svelte
<script>
	let selected = $state(a);
</script>

<!-- Single select -->
<select bind:value={selected}>
	<option value={a}>a</option>
	<option value={b} selected>b</option>
	<option value={c}>c</option>
</select>

<!-- Multiple select -->
<select multiple bind:value={fillings}>
	<option>Rice</option>
	<option>Beans</option>
	<option>Cheese</option>
</select>
```

### Media Bindings

#### Audio/Video

**Two-way bindings:**

- `currentTime`, `playbackRate`, `paused`, `volume`, `muted`

**Read-only bindings:**

- `duration`, `buffered`, `seekable`, `seeking`, `ended`, `readyState`, `played`

**Video-only:**

- `videoWidth`, `videoHeight` (read-only)

```svelte
<script>
	let paused = $state(true);
	let currentTime = $state(0);
	let duration = $state(0);
</script>

<video src={clip} bind:paused bind:currentTime bind:duration></video>
```

### Image Bindings

```svelte
<script>
	let naturalWidth = $state(0);
	let naturalHeight = $state(0);
</script>

<img {src} bind:naturalWidth bind:naturalHeight />
```

### Details Binding

```svelte
<script>
	let isOpen = $state(false);
</script>

<details bind:open={isOpen}>
	<summary>How do you comfort a JavaScript bug?</summary>
	<p>You console it.</p>
</details>
```

### Contenteditable Bindings

```svelte
<script>
	let html = $state('<p>Edit me!</p>');
</script>

<div contenteditable="true" bind:innerHTML={html}></div>
```

**Bindings:**

- `innerHTML`
- `innerText`
- `textContent`

### Dimension Bindings

All visible elements (readonly, uses `ResizeObserver`):

```svelte
<script>
	let width = $state(0);
	let height = $state(0);
</script>

<div bind:offsetWidth={width} bind:offsetHeight={height}>
	<Chart {width} {height} />
</div>
```

**Available bindings:**

- `clientWidth`, `clientHeight`
- `offsetWidth`, `offsetHeight`
- `contentRect`, `contentBoxSize`, `borderBoxSize`, `devicePixelContentBoxSize`

**Important:**

- Doesn't work with `display: inline` (use `inline-block`)
- CSS transforms don't trigger updates

### Element Bindings

```svelte
<script>
	let canvas;

	$effect(() => {
		const ctx = canvas.getContext('2d');
		drawStuff(ctx);
	});
</script>

<canvas bind:this={canvas}></canvas>
```

**Key Points:**

- Value is `undefined` until mounted
- Read in effects or event handlers
- Works with components too

### Component Bindings

```svelte
<!-- Requires $bindable in child -->
<Keypad bind:value={pin} />
```

Child component:

```svelte
<script>
	let { value = $bindable() } = $props();
</script>
```

### Function Bindings

Transform values during binding:

```svelte
<script>
	let value = $state('');
</script>

<!-- Transform to lowercase -->
<input bind:value={() => value, (v) => (value = v.toLowerCase())} />

<!-- Read-only binding (dimension) -->
<div bind:clientWidth={null, redraw} bind:clientHeight={null, redraw}>...</div>
```

**Syntax:** `bind:prop={() => getter, (v) => setter}`

---

## Attachments (`{@attach}`)

**Svelte 5.29+:** Attachments are functions that run in an effect when an element mounts or when state updates.

### Basic Usage

```svelte
<script>
	/** @type {import('svelte/attachments').Attachment} */
	function myAttachment(element) {
		console.log(element.nodeName); // 'DIV'

		return () => {
			console.log('cleaning up');
		};
	}
</script>

<div {@attach myAttachment}>...</div>
```

**Key Points:**

- Run in `$effect` when element mounts
- Re-run when reactive state read inside changes
- Return cleanup function (called before re-run or unmount)
- Multiple attachments per element allowed

### Attachment Factories

Functions that return attachments (common pattern):

```svelte
<script>
	import tippy from 'tippy.js';

	let content = $state('Hello!');

	/**
	 * @param {string} content
	 * @returns {import('svelte/attachments').Attachment}
	 */
	function tooltip(content) {
		return (element) => {
			const tooltip = tippy(element, { content });
			return tooltip.destroy;
		};
	}
</script>

<input bind:value={content} />

<button {@attach tooltip(content)}>Hover me</button>
```

**Reactive Behavior:**

- `{@attach tooltip(content)}` re-runs when `content` changes
- Also re-runs if state is read inside `tooltip` function
- Completely reactive (unlike legacy `use:` actions)

### Inline Attachments

```svelte
<canvas
	width={32}
	height={32}
	{@attach (canvas) => {
		const context = canvas.getContext('2d');

		$effect(() => {
			context.fillStyle = color;
			context.fillRect(0, 0, canvas.width, canvas.height);
		});
	}}
></canvas>
```

**Nested Effects:**

- Outer effect runs once (when canvas mounts)
- Inner `$effect` re-runs when `color` changes

### Passing to Components

Attachments can be passed as props to components:

```svelte
<!-- Button.svelte -->
<script>
	/** @type {import('svelte/elements').HTMLButtonAttributes} */
	let { children, ...props } = $props();
</script>

<!-- props includes attachments -->
<button {...props}>
	{@render children?.()}
</button>
```

```svelte
<!-- App.svelte -->
<Button {@attach tooltip(content)}>Hover me</Button>
```

**How It Works:**

- `{@attach ...}` creates a prop with `Symbol` key
- When spread onto element, attachments are applied
- Enables wrapper components

### Controlling Re-runs

By default, attachments re-run when any dependency changes:

```javascript
// ❌ Re-runs on EVERY dependency change
function foo(bar) {
	return (node) => {
		veryExpensiveSetupWork(node); // Runs every time!
		update(node, bar);
	};
}
```

**Solution:** Pass data in function, read in nested effect:

```javascript
// ✅ Expensive setup runs once
function foo(getBar) {
	return (node) => {
		veryExpensiveSetupWork(node); // Runs once

		$effect(() => {
			update(node, getBar()); // Only this re-runs
		});
	};
}
```

### Creating Attachments Programmatically

```javascript
import { createAttachmentKey } from 'svelte/attachments';

const key = createAttachmentKey();
const props = { [key]: myAttachment };

// Spread onto element
```

### Converting Actions to Attachments

```javascript
import { fromAction } from 'svelte/attachments';

const attachment = fromAction(legacyAction);
```

### Attachments vs Actions

| Feature          | `{@attach}` (Svelte 5.29+) | `use:` (Legacy)    |
| ---------------- | -------------------------- | ------------------ |
| Reactivity       | Fully reactive             | Manual updates     |
| Component spread | ✅ Works                   | ❌ Doesn't work    |
| API              | Returns cleanup function   | Receives `update`  |
| Re-runs          | Automatic                  | Call `update()`    |
| Preferred        | ✅ Yes (new code)          | Legacy only        |

---

## Animations and Transitions

### Transitions (`transition:`)

Transitions are triggered when elements enter or leave the DOM due to state changes.

**Basic Usage:**

```svelte
<script>
	import { fade } from 'svelte/transition';

	let visible = $state(false);
</script>

<button onclick={() => (visible = !visible)}>toggle</button>

{#if visible}
	<div transition:fade>fades in and out</div>
{/if}
```

**Key Points:**

- Bidirectional: smoothly reversed if toggled mid-transition
- All elements in a block wait for transitions to complete before removing from DOM
- Local by default (only when immediate block changes)

#### Local vs Global

```svelte
{#if x}
	{#if y}
		<!-- Local: only when y changes -->
		<p transition:fade>local transition</p>

		<!-- Global: when x OR y changes -->
		<p transition:fade|global>global transition</p>
	{/if}
{/if}
```

#### Built-in Transitions

Import from `svelte/transition`:

**`fade`** - Fades opacity:
```svelte
<div transition:fade={{ duration: 200, delay: 0 }}>...</div>
```

**`fly`** - Flies in from position:
```svelte
<div transition:fly={{ y: 200, duration: 200, easing: cubicOut }}>...</div>
```

**`slide`** - Slides in vertically:
```svelte
<div transition:slide={{ duration: 300, easing: cubicOut }}>...</div>
```

**`scale`** - Scales size and opacity:
```svelte
<div transition:scale={{ start: 0, opacity: 0, duration: 300 }}>...</div>
```

**`draw`** - Draws SVG path (for `<path>` elements):
```svelte
<svg>
	<path transition:draw={{ duration: 1000 }} d="..." />
</svg>
```

**`crossfade`** - Crossfades between two elements:
```svelte
<script>
	import { crossfade } from 'svelte/transition';
	const [send, receive] = crossfade({
		duration: 300
	});
</script>

{#if visible}
	<div in:receive={{ key: 'item' }} out:send={{ key: 'item' }}>...</div>
{/if}
```

#### Transition Parameters

```svelte
<div transition:fade={{ duration: 2000, delay: 500 }}>
	fades over 2 seconds after 500ms delay
</div>
```

Common parameters:
- `duration` - Transition length in ms
- `delay` - Delay before starting in ms
- `easing` - Easing function (from `svelte/easing`)
- Custom params per transition

#### Custom Transitions

```javascript
/**
 * @param {HTMLElement} node
 * @param {any} params
 * @param {{ direction: 'in' | 'out' | 'both' }} options
 */
function customTransition(node, params, options) {
	return {
		delay: 0,
		duration: 400,
		easing: cubicOut,
		css: (t, u) => `
			transform: scale(${t});
			opacity: ${t};
		`,
		tick: (t, u) => {
			// Optional JS animation
			// Prefer css when possible (runs off main thread)
		}
	};
}
```

**Parameters:**

- `node` - The DOM element
- `params` - Parameters passed to transition
- `options.direction` - `'in'`, `'out'`, or `'both'`

**Return object:**

- `delay` - Delay before starting (ms)
- `duration` - Transition length (ms)
- `easing` - Easing function
- `css` - Function returning CSS keyframes (preferred)
- `tick` - Function called during transition (fallback)

**`t` and `u` values:**

- `t` goes from `0` → `1` for `in`, `1` → `0` for `out`
- `u` equals `1 - t`
- Both values are post-easing

#### Separate In/Out Transitions

```svelte
<script>
	import { fade, fly } from 'svelte/transition';
	let visible = $state(false);
</script>

{#if visible}
	<div in:fly={{ y: 200 }} out:fade>
		flies in, fades out
	</div>
{/if}
```

**Key Difference:**

- Not bidirectional (unlike `transition:`)
- `in` and `out` run independently
- If aborted, transitions restart from scratch

#### Transition Events

```svelte
<p
	transition:fly={{ y: 200, duration: 2000 }}
	onintrostart={() => console.log('intro started')}
	onoutrostart={() => console.log('outro started')}
	onintroend={() => console.log('intro ended')}
	onoutroend={() => console.log('outro ended')}
>
	Flies in and out
</p>
```

**Available events:**

- `introstart`
- `introend`
- `outrostart`
- `outroend`

### Animations (`animate:`)

Animations trigger when keyed each block contents are reordered (NOT when items are added/removed).

**Basic Usage:**

```svelte
<script>
	import { flip } from 'svelte/animate';
</script>

{#each list as item (item.id)}
	<li animate:flip={{ duration: 300 }}>
		{item.name}
	</li>
{/each}
```

**Requirements:**

- Must be on immediate child of keyed `{#each}` block
- Item must have a key: `{#each items as item (item.id)}`
- Only runs on reordering, not add/remove

#### Built-in Animations

**`flip`** - First Last Invert Play animation:

```svelte
import { flip } from 'svelte/animate';

{#each list as item (item.id)}
	<div animate:flip={{ duration: 300, delay: 0 }}>
		{item}
	</div>
{/each}
```

**Parameters:**

- `duration` - Animation length (default: `d => Math.sqrt(d) * 120`)
- `delay` - Delay before starting
- `easing` - Easing function

#### Custom Animations

```javascript
/**
 * @param {HTMLElement} node
 * @param {{ from: DOMRect, to: DOMRect }} positions
 * @param {any} params
 */
function customAnimation(node, { from, to }, params) {
	const dx = from.left - to.left;
	const dy = from.top - to.top;
	const distance = Math.sqrt(dx * dx + dy * dy);

	return {
		delay: 0,
		duration: Math.sqrt(distance) * 120,
		easing: cubicOut,
		css: (t, u) => `
			transform: translate(${u * dx}px, ${u * dy}px) rotate(${t * 360}deg);
		`
	};
}
```

**Parameters:**

- `node` - The DOM element
- `from` - DOMRect of starting position
- `to` - DOMRect of ending position
- `params` - Custom parameters

### Motion Utilities (`svelte/motion`)

#### `tweened`

Smoothly interpolates between values:

```svelte
<script>
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	const progress = tweened(0, {
		duration: 400,
		easing: cubicOut
	});
</script>

<progress value={$progress}></progress>

<button onclick={() => progress.set(0)}>0%</button>
<button onclick={() => progress.set(0.5)}>50%</button>
<button onclick={() => progress.set(1)}>100%</button>
```

**Methods:**

- `set(value, options)` - Set value with optional override options
- `update(fn, options)` - Update based on current value

**Options:**

- `duration` - Tween length in ms (or function)
- `delay` - Delay before starting
- `easing` - Easing function
- `interpolate` - Custom interpolation function

**Advanced:**

```javascript
const coords = tweened({ x: 0, y: 0 }, {
	duration: 500,
	interpolate: (from, to) => t => ({
		x: from.x + (to.x - from.x) * t,
		y: from.y + (to.y - from.y) * t
	})
});
```

#### `spring`

Physics-based spring animation:

```svelte
<script>
	import { spring } from 'svelte/motion';

	const coords = spring({ x: 50, y: 50 }, {
		stiffness: 0.1,
		damping: 0.25
	});
</script>

<div
	style="transform: translate({$coords.x}px, {$coords.y}px)"
	onmousemove={(e) => coords.set({ x: e.clientX, y: e.clientY })}
>
	Follows mouse with spring physics
</div>
```

**Options:**

- `stiffness` - Spring stiffness (0-1, default: 0.15)
- `damping` - Spring damping (0-1, default: 0.8)
- `precision` - Threshold for settling (default: 0.01)

**Methods:**

- `set(value, options)` - Set target value
- `update(fn, options)` - Update based on current value
- `stiffness` and `damping` can be stores too

### Easing Functions (`svelte/easing`)

Import from `svelte/easing`:

**Linear:**
- `linear` - Constant speed

**Quadratic:**
- `easeInQuad`, `easeOutQuad`, `easeInOutQuad`

**Cubic:**
- `easeInCubic`, `easeOutCubic`, `easeInOutCubic`, `cubicIn`, `cubicOut`, `cubicInOut`

**Quartic:**
- `easeInQuart`, `easeOutQuart`, `easeInOutQuart`, `quartIn`, `quartOut`, `quartInOut`

**Quintic:**
- `easeInQuint`, `easeOutQuint`, `easeInOutQuint`, `quintIn`, `quintOut`, `quintInOut`

**Sinusoidal:**
- `easeInSine`, `easeOutSine`, `easeInOutSine`, `sineIn`, `sineOut`, `sineInOut`

**Exponential:**
- `easeInExpo`, `easeOutExpo`, `easeInOutExpo`, `expoIn`, `expoOut`, `expoInOut`

**Circular:**
- `easeInCirc`, `easeOutCirc`, `easeInOutCirc`, `circIn`, `circOut`, `circInOut`

**Back:**
- `easeInBack`, `easeOutBack`, `easeInOutBack`, `backIn`, `backOut`, `backInOut`

**Elastic:**
- `easeInElastic`, `easeOutElastic`, `easeInOutElastic`, `elasticIn`, `elasticOut`, `elasticInOut`

**Bounce:**
- `easeInBounce`, `easeOutBounce`, `easeInOutBounce`, `bounceIn`, `bounceOut`, `bounceInOut`

**Usage:**

```svelte
<script>
	import { fly } from 'svelte/transition';
	import { elasticOut, bounceIn } from 'svelte/easing';
</script>

<div transition:fly={{ y: 200, easing: elasticOut }}>
	Bounces in
</div>
```

**Custom Easing:**

```javascript
function customEasing(t) {
	return t < 0.5
		? 2 * t * t
		: -1 + (4 - 2 * t) * t;
}
```

### Best Practices

#### Transitions

- ✅ Use `css` over `tick` when possible (better performance)
- ✅ Keep durations under 400ms for snappy feel
- ✅ Use appropriate easing functions
- ✅ Consider reduced motion preferences
- ❌ Don't overuse transitions (UI fatigue)

#### Animations

- ✅ Always use keys in `{#each}` blocks
- ✅ Use `flip` for list reordering
- ✅ Keep animations subtle
- ❌ Don't animate every list change

#### Motion

- ✅ Use `tweened` for UI feedback (progress bars, counters)
- ✅ Use `spring` for natural, physics-based movement
- ✅ Adjust `stiffness`/`damping` for desired feel
- ❌ Don't use spring for precise timing requirements

---

## Styling

### Scoped Styles

CSS in `<style>` is scoped by default:

```svelte
<style>
	p {
		/* Only affects <p> in this component */
		color: burlywood;
	}
</style>
```

**How it works:**

- Adds hash class (e.g., `.svelte-123xyz`)
- Increases specificity by 0-1-0
- Uses `:where(.svelte-123xyz)` for subsequent occurrences

### Scoped Keyframes

```svelte
<style>
	.bouncy {
		animation: bounce 10s;
	}

	/* Only accessible inside this component */
	@keyframes bounce {
		/* ... */
	}
</style>
```

### Global Styles

```svelte
<style>
	:global(body) {
		margin: 0;
	}

	/* Target everything inside article */
	article :global {
		a {
			color: hotpink;
		}
		img {
			width: 100%;
		}
	}
</style>
```

### Style Directive

```svelte
<script>
	let color = $state('red');
	let width = $state('12rem');
</script>

<!-- Shorthand -->
<div style:color style:width="12rem">...</div>

<!-- Expression -->
<div style:color>...</div>

<!-- Important -->
<div style:color|important="red">...</div>

<!-- Multiple -->
<div style:color style:width style:background-color={darkMode ? 'black' : 'white'}>...</div>
```

**Key Points:**

- Directives take precedence over attributes
- Even over `!important` in attributes

### Class Directive

#### Objects and Arrays (since 5.16)

```svelte
<script>
	let { cool } = $props();
	let faded = $state(false);
	let large = $state(false);
</script>

<!-- Object form -->
<div class={{ cool, lame: !cool }}>...</div>

<!-- Array form -->
<div class={[faded && 'opacity-50 saturate-0', large && 'scale-200']}>...</div>

<!-- Nested -->
<button {...props} class={['cool-button', props.class]}>
	{@render props.children?.()}
</button>
```

#### Legacy `class:` Directive

```svelte
<div class:cool class:lame={!cool}>...</div>

<!-- Shorthand when name === value -->
<div class:cool>...</div>
```

**Recommendation:** Use object/array form in new code.

### CSS Custom Properties

```svelte
<!-- Parent -->
<style>
  .container {
    --theme-color: #ff3e00;
  }
</style>

<!-- Child component -->
<style>
  p {
    color: var(--theme-color);
  }
</style>
```

---

## Control Flow

### Conditional Rendering

```svelte
{#if answer === 42}
	<p>what was the question?</p>
{:else if answer > 42}
	<p>too high!</p>
{:else}
	<p>too low!</p>
{/if}
```

### Lists

```svelte
<script>
	let items = $state([
		{ id: 1, name: 'apples', qty: 5 },
		{ id: 2, name: 'bananas', qty: 10 }
	]);
</script>

<!-- Basic -->
{#each items as item}
	<li>{item.name} x {item.qty}</li>
{/each}

<!-- With index -->
{#each items as item, i}
	<li>{i + 1}: {item.name} x {item.qty}</li>
{/each}

<!-- Keyed (for efficient updates) -->
{#each items as item (item.id)}
	<li>{item.name} x {item.qty}</li>
{/each}

<!-- Destructuring -->
{#each items as { id, name, qty }, i (id)}
	<li>{i + 1}: {name} x {qty}</li>
{/each}

<!-- Rest patterns -->
{#each objects as { id, ...rest }}
	<li><MyComponent {id} {...rest} /></li>
{/each}

<!-- Without item (repeat n times) -->
{#each { length: 8 }, rank}
	{#each { length: 8 }, file}
		<div class:black={(rank + file) % 2 === 1}></div>
	{/each}
{/each}

<!-- Else block -->
{#each todos as todo}
	<p>{todo.text}</p>
{:else}
	<p>No tasks today!</p>
{/each}
```

**Key Points:**

- Keys should be unique and stable
- Keys can be any value (prefer strings/numbers)
- Use keys for proper list updates

### Promises

```svelte
<script>
	async function getUser(id) {
		const res = await fetch(`/api/users/${id}`);
		return res.json();
	}

	let promise = $state(getUser(1));
</script>

<!-- Full form -->
{#await promise}
	<p>loading...</p>
{:then user}
	<p>Hello {user.name}!</p>
{:catch error}
	<p>Error: {error.message}</p>
{/await}

<!-- Skip pending -->
{#await promise then user}
	<p>Hello {user.name}!</p>
{/await}

<!-- Skip fulfilled -->
{#await promise catch error}
	<p>Error: {error.message}</p>
{/await}
```

**Key Points:**

- SSR only renders pending block
- Non-promises only render `:then` block
- Can use with `import()`: `{#await import('./Component.svelte') then { default: Component }}`

### Top-Level Await Expressions (Svelte 5.36+)

**EXPERIMENTAL:** Requires opt-in configuration:

```javascript
// svelte.config.js
export default {
	compilerOptions: {
		experimental: {
			async: true
		}
	}
};
```

**Usage in Three Contexts:**

```svelte
<script>
	// 1. Top-level in <script>
	const data = await loadData();

	// 2. In $derived
	let result = $derived(await computeAsync());

	// 3. In markup
</script>

<p>{a} + {b} = {await add(a, b)}</p>
```

**Synchronized Updates:**

When an `await` depends on state, UI updates are synchronized:

```svelte
<script>
	let a = $state(1);
	let b = $state(2);

	async function add(a, b) {
		await new Promise((f) => setTimeout(f, 500));
		return a + b;
	}
</script>

<input type="number" bind:value={a} />
<input type="number" bind:value={b} />

<!-- UI won't show "2 + 2 = 3" inconsistency -->
<p>{a} + {b} = {await add(a, b)}</p>
```

**Concurrency:**

Multiple independent `await` expressions run in parallel:

```svelte
<!-- Both run simultaneously -->
<p>{await one()}</p>
<p>{await two()}</p>
```

**Loading States:**

```svelte
<svelte:boundary>
	<p>{await delayed('hello!')}</p>

	{#snippet pending()}
		<p>loading...</p>
	{/snippet}
</svelte:boundary>
```

Use `$effect.pending()` for subsequent updates:

```javascript
import { tick, settled } from 'svelte';

async function onclick() {
	updating = true;
	await tick();

	color = 'octarine';
	answer = 42;

	await settled();
	updating = false;
}
```

**Error Handling:**

Errors bubble to nearest `<svelte:boundary>`.

**SSR:**

```javascript
import { render } from 'svelte/server';
import App from './App.svelte';

const { head, body } = await render(App);
```

**Important Notes:**

- Experimental flag will be removed in Svelte 6
- Updates can overlap - fast updates show while slow updates are pending
- Effects run in slightly different order when `experimental.async` is enabled
- Currently SSR is synchronous (streaming planned for future)

### Key Blocks

Forces recreation when value changes:

```svelte
{#key value}
	<Component />
{/key}
```

**Use Cases:**

- Force component reinstantiation and reinitialization
- Replay transitions when values change
- Reset component state

```svelte
{#key value}
	<div transition:fade>{value}</div>
{/key}
```

**Key Points:**

- Destroys and recreates contents when expression changes
- Causes components to be reinstantiated
- Useful for triggering transitions on value changes

---

## Snippets - Reusable UI Blocks

Snippets replace slots and are more powerful.

### Basic Snippets

```svelte
<script>
	let { message = 'hello!' } = $props();
</script>

{#snippet hello(name)}
	<p>hello {name}! {message}</p>
{/snippet}

{@render hello('alice')}
{@render hello('bob')}
```

**Key Points:**

- Can have parameters with defaults
- No rest parameters
- Can reference outer scope
- Visible to siblings and children

### Passing to Components

#### Explicit Props

```svelte
<script>
	import Table from './Table.svelte';

	const fruits = [
		{ name: 'apples', qty: 5, price: 2 },
		{ name: 'bananas', qty: 10, price: 1 }
	];
</script>

{#snippet header()}
	<th>fruit</th>
	<th>qty</th>
	<th>price</th>
{/snippet}

{#snippet row(d)}
	<td>{d.name}</td>
	<td>{d.qty}</td>
	<td>{d.price}</td>
{/snippet}

<Table data={fruits} {header} {row} />
```

#### Implicit Props

```svelte
<!-- Snippets inside component tags become props -->
<Table data={fruits}>
	{#snippet header()}
		<th>fruit</th>
		<th>qty</th>
		<th>price</th>
	{/snippet}

	{#snippet row(d)}
		<td>{d.name}</td>
		<td>{d.qty}</td>
		<td>{d.price}</td>
	{/snippet}
</Table>
```

### Children Snippet

Content not in snippets becomes `children`:

```svelte
<!-- Button.svelte -->
<script>
	let { children } = $props();
</script>

<!-- App.svelte -->
<Button>click me</Button>

<button>{@render children()}</button>
```

**Important:** Cannot have a prop named `children` with content inside tags.

### Optional Snippets

```svelte
<script>
	let { children } = $props();
</script>

<!-- Option 1: Optional chaining -->
{@render children?.()}

<!-- Option 2: Fallback -->
{#if children}
	{@render children()}
{:else}
	<p>fallback content</p>
{/if}
```

### Snippet Scope

```svelte
<div>
	{#snippet x()}
		{#snippet y()}...{/snippet}
		{@render y()}
		<!-- ✅ Works -->
	{/snippet}

	{@render y()}
	<!-- ❌ Error - not in scope -->
</div>

{@render x()}
<!-- ❌ Error - not in scope -->
```

### Recursive Snippets

```svelte
{#snippet countdown(n)}
	{#if n > 0}
		<span>{n}...</span>
		{@render countdown(n - 1)}
	{:else}
		{@render blastoff()}
	{/if}
{/snippet}

{#snippet blastoff()}
	<span>🚀</span>
{/snippet}

{@render countdown(10)}
```

### Typing Snippets

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		data: any[];
		children: Snippet;
		row: Snippet<[any]>; // Takes one parameter
	}

	let { data, children, row }: Props = $props();
</script>
```

Generic example:

```svelte
<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';

	let {
		data,
		children,
		row
	}: {
		data: T[];
		children: Snippet;
		row: Snippet<[T]>;
	} = $props();
</script>
```

### Exporting Snippets

```svelte
<!-- utils.svelte -->
<script module>
	export { add };
</script>

{#snippet add(a, b)}
	{a} + {b} = {a + b}
{/snippet}
```

```svelte
<!-- Usage -->
<script>
	import { add } from './utils.svelte';
</script>

{@render add(1, 2)}
```

---

## Template Tags

### `{@render}` - Rendering Snippets

Invokes a snippet with optional parameters:

```svelte
{#snippet sum(a, b)}
	<p>{a} + {b} = {a + b}</p>
{/snippet}

{@render sum(1, 2)}
{@render sum(3, 4)}
{@render sum(5, 6)}
```

**Dynamic Rendering:**

```svelte
{@render (cool ? coolSnippet : lameSnippet)()}
```

**Optional Snippets:**

```svelte
<!-- Option 1: Optional chaining -->
{@render children?.()}

<!-- Option 2: Conditional with fallback -->
{#if children}
	{@render children()}
{:else}
	<p>fallback content</p>
{/if}
```

**Key Points:**

- Expression can be identifier or arbitrary JS expression
- Use optional chaining for potentially undefined snippets
- Commonly used for component `children` prop

---

### `{@const}` - Template-Scoped Constants

Defines local constants within template blocks:

```svelte
{#each boxes as box}
	{@const area = box.width * box.height}
	{box.width} * {box.height} = {area}
{/each}
```

**Scope Rules:**

- Only allowed as immediate child of blocks (`{#if}`, `{#each}`, `{#snippet}`, etc.)
- Can be used inside `<Component />` or `<svelte:boundary>`
- Evaluated once per iteration/block instance

**Use Cases:**

```svelte
{#each items as item}
	{@const isExpensive = item.price > 100}
	{@const discount = isExpensive ? 0.1 : 0.05}
	<div class:expensive={isExpensive}>
		{item.name}: ${item.price * (1 - discount)}
	</div>
{/each}
```

---

### `{@debug}` - Template Debugging

Logs values and pauses execution when variables change:

```svelte
<script>
	let user = {
		firstname: 'Ada',
		lastname: 'Lovelace'
	};
</script>

{@debug user}

<h1>Hello {user.firstname}!</h1>
```

**Multiple Variables:**

```svelte
{@debug user1, user2, user3}
```

**Watch All State:**

```svelte
{@debug}
<!-- Triggers debugger on ANY state change -->
```

**Important Restrictions:**

- Accepts comma-separated variable names only
- Cannot use expressions: `{@debug user.firstname}` ❌
- Cannot use array indices: `{@debug myArray[0]}` ❌
- Cannot use operators: `{@debug !isReady}` ❌

**Behavior:**

- Logs values to console when they change
- Pauses code execution if devtools are open
- Only works in development mode

---

## Effects and Lifecycle

### Lifecycle Hooks

Svelte 5 simplifies lifecycle to creation and destruction.

#### `onMount`

Runs after component mounts (client-side only):

```svelte
<script>
	import { onMount } from 'svelte';

	onMount(() => {
		console.log('mounted');

		return () => {
			console.log('unmounted');
		};
	});
</script>
```

**Key Points:**

- Doesn't run on server
- Return function for cleanup
- Cleanup only works with synchronous functions

#### `onDestroy`

Runs before component unmounts:

```svelte
<script>
	import { onDestroy } from 'svelte';

	onDestroy(() => {
		console.log('destroying');
	});
</script>
```

**Only lifecycle hook that runs on server.**

#### `tick`

Waits for pending state updates:

```svelte
<script>
	import { tick } from 'svelte';

	$effect.pre(() => {
		console.log('about to update');
		tick().then(() => {
			console.log('just updated');
		});
	});
</script>
```

**Returns promise that resolves:**

- After all pending state changes applied
- Or next microtask if no changes

### beforeUpdate/afterUpdate (Deprecated)

Use `$effect.pre` and `$effect` instead:

```svelte
<script>
	import { tick } from 'svelte';

	let messages = $state([]);
	let viewport;

	$effect.pre(() => {
		// Runs before DOM updates (like beforeUpdate)
		messages;
		const autoscroll =
			viewport && viewport.offsetHeight + viewport.scrollTop > viewport.scrollHeight - 20;

		if (autoscroll) {
			tick().then(() => {
				viewport.scrollTo(0, viewport.scrollHeight);
			});
		}
	});
</script>

<div bind:this={viewport}>
	{#each messages as message}
		<p>{message}</p>
	{/each}
</div>
```

---

## Imperative Component API

Every Svelte application creates root components imperatively. These APIs allow you to mount, unmount, and render components programmatically.

### `mount`

Instantiates a component and mounts it to a target element:

```javascript
import { mount } from 'svelte';
import App from './App.svelte';

const app = mount(App, {
	target: document.querySelector('#app'),
	props: { some: 'property' }
});
```

**Key Points:**

- Can mount multiple components per page
- Can mount dynamically (e.g., tooltips attached to hovered elements)
- Effects (including `onMount`) do NOT run during `mount`
- Use `flushSync()` to force pending effects to run (useful in tests)

**Multiple Components:**

```javascript
// Mount different components to different targets
mount(Header, { target: document.querySelector('#header') });
mount(Sidebar, { target: document.querySelector('#sidebar') });
mount(Content, { target: document.querySelector('#content') });
```

**Dynamic Mounting:**

```javascript
function showTooltip(element, content) {
	const tooltip = mount(Tooltip, {
		target: document.body,
		props: { content, anchor: element }
	});

	return () => unmount(tooltip);
}
```

### `unmount`

Unmounts a component created with `mount` or `hydrate`:

```javascript
import { mount, unmount } from 'svelte';
import App from './App.svelte';

const app = mount(App, { target: document.body });

// Later...
unmount(app);
```

**With Transitions:**

```javascript
// Play transitions before removing
await unmount(app, { outro: true });
console.log('Transitions complete, component removed');
```

**Options:**

- `outro: true` - Play transitions before unmounting
- Returns `Promise` that resolves after transitions (or immediately if no transitions)

**Use Cases:**

```javascript
// Modal cleanup
function closeModal() {
	if (modalComponent) {
		unmount(modalComponent, { outro: true });
		modalComponent = null;
	}
}
```

### `hydrate`

Makes server-rendered HTML interactive by attaching Svelte's runtime:

```javascript
import { hydrate } from 'svelte';
import App from './App.svelte';

const app = hydrate(App, {
	target: document.querySelector('#app'),
	props: { some: 'property' }
});
```

**How It Works:**

1. Server renders HTML with `render()` function
2. HTML is sent to client
3. Client calls `hydrate()` to make it interactive
4. Svelte reuses existing DOM nodes instead of recreating

**Important:**

- Like `mount`, effects do NOT run during `hydrate`
- Use `flushSync()` immediately after if you need effects to run
- Assumes HTML structure matches server-rendered output
- Mismatches between server/client can cause hydration errors

**SvelteKit Example:**

```javascript
// SvelteKit does this automatically
// You typically don't call hydrate() yourself
```

### `render` (Server-Only)

Renders a component to HTML on the server:

```javascript
import { render } from 'svelte/server';
import App from './App.svelte';

const result = render(App, {
	props: { some: 'property' }
});

console.log(result.body); // HTML for <body>
console.log(result.head); // HTML for <head>
```

**Return Value:**

```javascript
{
	body: '<div>...</div>', // Component HTML
	head: '<title>...</title>' // Contents for <head>
}
```

**Async Rendering (Svelte 5.36+):**

```javascript
const result = await render(App, {
	props: { userId: 123 }
});
```

**Use Cases:**

- Server-side rendering (SSR)
- Static site generation
- Email template generation
- PDF generation

### `flushSync`

Forces pending effects to run immediately:

```javascript
import { mount, flushSync } from 'svelte';

const app = mount(App, { target: document.body });

// Effects haven't run yet
flushSync(); // Now they run

// Useful in tests
test('component behavior', () => {
	const component = mount(MyComponent, { target: document.body });
	flushSync(); // Ensure onMount ran
	expect(component).toBeDefined();
});
```

**When to Use:**

- Testing (ensure effects run)
- Synchronous DOM measurements
- Imperative animations

**Warning:** Can cause performance issues if overused.

### Migration from Svelte 4

```javascript
// Svelte 4
import App from './App.svelte';

const app = new App({
	target: document.getElementById('app'),
	props: { name: 'world' }
});

app.$on('event', handler);
app.$set({ name: 'everybody' });
app.$destroy();

// Svelte 5
import { mount, unmount } from 'svelte';
import App from './App.svelte';

const props = $state({ name: 'world' });
const app = mount(App, {
	target: document.getElementById('app'),
	props,
	events: { event: handler }
});

props.name = 'everybody'; // Reactive update
unmount(app);
```

**Key Differences:**

| Svelte 4              | Svelte 5           | Notes                    |
| --------------------- | ------------------ | ------------------------ |
| `new App(...)`        | `mount(App, ...)` | Imperative instantiation |
| `app.$on()`           | `events` option    | Event handlers           |
| `app.$set()`          | `props.x = y`      | Reactive props           |
| `app.$destroy()`      | `unmount(app)`     | Cleanup                  |
| Effects run instantly | `flushSync()` needed | Testing                  |

---

## Stores (Legacy Compatibility)

In Svelte 5, prefer runes over stores. Use stores for:

- Complex async data streams
- Manual control over updates
- RxJS interop

### When to Use Stores vs Runes

**Use Runes:**

- Shared state: `export const state = $state({ ... })`
- Derived state: `$derived`
- Side effects: `$effect`
- Component state

**Use Stores:**

- Complex async streams
- Fine-grained subscription control
- RxJS compatibility

### Store Contract

```typescript
interface Store<T> {
	subscribe(subscriber: (value: T) => void): () => void;
	set?(value: T): void; // Writable stores
}
```

### Writable Stores

```javascript
import { writable } from 'svelte/store';

const count = writable(0);

// Subscribe
const unsubscribe = count.subscribe((value) => {
	console.log(value);
});

// Update
count.set(1);
count.update((n) => n + 1);

// Cleanup
unsubscribe();
```

### Readable Stores

```javascript
import { readable } from 'svelte/store';

const time = readable(new Date(), (set) => {
	const interval = setInterval(() => {
		set(new Date());
	}, 1000);

	return () => clearInterval(interval);
});
```

### Derived Stores

```javascript
import { derived } from 'svelte/store';

const doubled = derived(count, ($count) => $count * 2);

// Multiple stores
const sum = derived([a, b], ([$a, $b]) => $a + $b);
```

### Using Stores in Components

```svelte
<script>
	import { writable } from 'svelte/store';

	const count = writable(0);

	console.log($count); // Auto-subscribe with $ prefix

	$count = 2; // Auto-calls set()
</script>

<button onclick={() => $count++}>
	{$count}
</button>
```

**Key Points:**

- `$` prefix auto-subscribes
- Auto-unsubscribes on destroy
- Must be top-level declaration
- Cannot prefix local variables with `$`

---

## Context API

Pass data through component tree without prop drilling.

### Basic Usage

```svelte
<!-- Parent.svelte -->
<script>
  import { setContext } from 'svelte';

  setContext('my-context', 'hello from Parent');
</script>

<!-- Child.svelte -->
<script>
  import { getContext } from 'svelte';

  const message = getContext('my-context');
</script>

<h1>{message}, inside Child</h1>
```

### With Reactive State

```svelte
<!-- Parent.svelte -->
<script>
	import { setContext } from 'svelte';
	import Child from './Child.svelte';

	let counter = $state({ count: 0 });

	setContext('counter', counter);
</script>

<button onclick={() => counter.count++}>increment</button>

<Child />
<Child />
```

**Important:** Don't reassign context, mutate it:

```svelte
<!-- ❌ WRONG - breaks the link -->
<button onclick={() => (counter = { count: 0 })}>reset</button>

<!-- ✅ CORRECT -->
<button onclick={() => (counter.count = 0)}>reset</button>
```

### Type-Safe Context

```javascript
// context.js
import { getContext, setContext } from 'svelte';

const key = {};

export function setUserContext(user) {
	setContext(key, user);
}

export function getUserContext() {
	return getContext(key);
}
```

### Context vs Global State

**Global state risk:**

```javascript
// ❌ Shared between requests on server!
export const myGlobalState = $state({
  user: { ... }
});
```

**Context solution:**

```svelte
<!-- App.svelte -->
<script>
	import { setContext } from 'svelte';

	let { data } = $props();

	// ✅ Request-specific
	if (data.user) {
		setContext('user', data.user);
	}
</script>
```

### Available Functions

- `setContext(key, value)` - Set context
- `getContext(key)` - Get context
- `hasContext(key)` - Check if context exists
- `getAllContexts()` - Get all contexts

---

## Special Elements

### `<svelte:boundary>` - Error Boundaries (Svelte 5.3+)

Boundaries allow you to "wall off" parts of your app for:

1. Providing UI for pending `await` expressions
2. Handling errors during rendering or effects

**When error occurs:** Existing content is removed and replaced with `failed` snippet.

**Important:** Errors in event handlers, `setTimeout`, or async work are NOT caught.

#### `pending` Snippet (Svelte 5.36+)

Shows UI while initial `await` expressions resolve:

```svelte
<svelte:boundary>
	<p>{await delayed('hello!')}</p>

	{#snippet pending()}
		<p>loading...</p>
	{/snippet}
</svelte:boundary>
```

**Key Points:**

- Only shown for initial async work
- NOT shown for subsequent updates (use `$effect.pending()` instead)
- Playground apps render inside boundary with empty `pending` snippet

#### `failed` Snippet

Renders when error is thrown inside boundary:

```svelte
<svelte:boundary>
	<FlakyComponent />

	{#snippet failed(error, reset)}
		<p>Error: {error.message}</p>
		<button onclick={reset}>oops! try again</button>
	{/snippet}
</svelte:boundary>
```

**Parameters:**

- `error` - The thrown error object
- `reset` - Function to recreate the boundary contents

**Can be passed explicitly:**

```svelte
{#snippet myFailed(error, reset)}
	<button onclick={reset}>retry</button>
{/snippet}

<svelte:boundary failed={myFailed}>...</svelte:boundary>
```

#### `onerror` Callback

Called when error occurs, receives same `error` and `reset` arguments:

```svelte
<script>
	let error = $state(null);
	let reset = $state(() => {});

	function onerror(e, r) {
		error = e;
		reset = r;
		// Also report to error service
		reportError(e);
	}
</script>

<svelte:boundary {onerror}><FlakyComponent /></svelte:boundary>

{#if error}
	<button onclick={() => {
		error = null;
		reset();
	}}>
		oops! try again
	</button>
{/if}
```

**Error Handling:**

- If error occurs in `onerror` function, it bubbles to parent boundary
- Can rethrow errors for parent to handle

#### Combining Features

```svelte
<script>
	function onerror(e) {
		console.error('Boundary caught:', e);
	}
</script>

<svelte:boundary {onerror}>
	<p>{await loadData()}</p>

	{#snippet pending()}
		<p>loading...</p>
	{/snippet}

	{#snippet failed(error, reset)}
		<div class="error">
			<p>Failed: {error.message}</p>
			<button onclick={reset}>retry</button>
		</div>
	{/snippet}
</svelte:boundary>
```

**Best Practices:**

- ✅ Use for error recovery UI
- ✅ Report errors in `onerror` callback
- ✅ Provide helpful error messages
- ✅ Always include retry mechanism
- ❌ Don't rely on for event handler errors
- ❌ Don't use as try-catch replacement

### `<svelte:window>` - Window Bindings

```svelte
<script>
	let y = $state(0);
	let online = $state(true);

	function handleKeydown(event) {
		console.log(`pressed ${event.key}`);
	}
</script>

<svelte:window onkeydown={handleKeydown} bind:scrollY={y} bind:online />

<p>scrolled {y}px, {online ? 'online' : 'offline'}</p>
```

**Bindable properties:**

- `innerWidth`, `innerHeight` (readonly)
- `outerWidth`, `outerHeight` (readonly)
- `scrollX`, `scrollY`
- `online` (readonly, alias for `navigator.onLine`)
- `devicePixelRatio` (readonly)

### `<svelte:document>` - Document Events

```svelte
<script>
	function handleVisibilityChange() {
		console.log(document.hidden ? 'hidden' : 'visible');
	}
</script>

<svelte:document onvisibilitychange={handleVisibilityChange} />
```

### `<svelte:body>` - Body Events

```svelte
<script>
	function handleMouseEnter() {
		console.log('mouse entered body');
	}
</script>

<svelte:body onmouseenter={handleMouseEnter} />
```

### `<svelte:head>` - Document Head

```svelte
<svelte:head>
	<title>My App</title>
	<meta name="description" content="..." />
	<link rel="stylesheet" href="/styles.css" />
</svelte:head>
```

**Note:** In SvelteKit, use `<svelte:head>` sparingly; prefer page options.

### `<svelte:element>` - Dynamic Elements

```svelte
<script>
  let tag = $state('div');
</script>

<svelte:element this={tag}>
  content
</svelte:element>

<!-- Must be expression, not literal -->
<svelte:element this={"div"}> <!-- OK -->
<svelte:element this="div"> <!-- ERROR in Svelte 5 -->
```

### `<svelte:component>` - Dynamic Components

No longer necessary in Svelte 5 (components are dynamic by default):

```svelte
<script>
	import A from './A.svelte';
	import B from './B.svelte';

	let Thing = $state(A);
</script>

<select bind:value={Thing}>
	<option value={A}>A</option>
	<option value={B}>B</option>
</select>

<!-- These are equivalent -->
<Thing />
<svelte:component this={Thing} />
```

**Dot notation:**

```svelte
{#each items as item}
	<item.component {...item.props} />
{/each}
```

### `<svelte:options>` - Compiler Options

```svelte
<svelte:options runes={true} namespace="svg" customElement="my-element" css="injected" />
```

**Options:**

- `runes={true|false}` - Force runes/legacy mode
- `namespace="html|svg|mathml"` - Element namespace
- `customElement={...}` - Custom element config
- `css="injected"` - Inline styles

**Deprecated (Svelte 4):**

- `immutable` - Use `$state` semantics instead
- `accessors` - Use component exports instead

---

## TypeScript Integration

### Script Lang

```svelte
<script lang="ts">
	let name: string = 'world';

	function greet(name: string): void {
		alert(`Hello, ${name}!`);
	}
</script>

<button onclick={(e: Event) => greet((e.target as HTMLButtonElement).innerText)}>
	{name as string}
</button>
```

### Type-Only Features

Svelte supports type-only TypeScript:

**✅ Supported:**

- Type annotations
- Interfaces
- Type aliases
- Generics

**❌ Not Supported (need preprocessor):**

- Enums
- `private`/`protected`/`public` with initializers
- Non-standard ECMAScript features

### Preprocessor Setup

```javascript
// svelte.config.js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
	preprocess: vitePreprocess({ script: true })
};
```

### Typing Props

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		requiredProp: number;
		optionalProp?: boolean;
		snippet: Snippet<[string]>;
		callback: (arg: string) => void;
		[key: string]: unknown;
	}

	let { requiredProp, optionalProp, snippet, callback, ...rest }: Props = $props();
</script>
```

### Generic Props

```svelte
<script lang="ts" generics="T extends { text: string }">
	interface Props {
		items: T[];
		select(item: T): void;
	}

	let { items, select }: Props = $props();
</script>

{#each items as item}
	<button onclick={() => select(item)}>
		{item.text}
	</button>
{/each}
```

### Typing State

```typescript
let count: number = $state(0);

// Undefined initial value
let count: number = $state(); // Error: Type includes undefined

// Use type assertion
class Counter {
	count = $state() as number;

	constructor(initial: number) {
		this.count = initial;
	}
}
```

### Component Type

```svelte
<script lang="ts">
	import type { Component } from 'svelte';

	interface Props {
		DynamicComponent: Component<{ prop: string }>;
	}

	let { DynamicComponent }: Props = $props();
</script>

<DynamicComponent prop="foo" />
```

**Extract component props:**

```typescript
import type { Component, ComponentProps } from 'svelte';
import MyComponent from './MyComponent.svelte';

function withProps<TComponent extends Component<any>>(
	component: TComponent,
	props: ComponentProps<TComponent>
) {}

withProps(MyComponent, { foo: 'bar' });
```

**Instance type:**

```svelte
<script lang="ts">
	import MyComponent from './MyComponent.svelte';

	let componentConstructor: typeof MyComponent = MyComponent;
	let componentInstance: MyComponent;
</script>

<MyComponent bind:this={componentInstance} />
```

### Augmenting DOM Types

```typescript
// additional-svelte-typings.d.ts
import { HTMLButtonAttributes } from 'svelte/elements';

declare module 'svelte/elements' {
	export interface SvelteHTMLElements {
		'custom-button': HTMLButtonAttributes;
	}

	export interface HTMLAttributes<T> {
		globalattribute?: string;
	}

	export interface HTMLButtonAttributes {
		experimentalattr?: string;
	}
}

export {};
```

---

## Best Practices

### State Management

#### ✅ DO: Use $state for local component state

```svelte
<script>
	let count = $state(0);
	let user = $state({ name: 'Alice', age: 30 });
</script>
```

#### ✅ DO: Use $derived for computed values

```svelte
<script>
	let count = $state(0);
	let doubled = $derived(count * 2);
</script>
```

#### ❌ DON'T: Update state in $effect

```svelte
<script>
	let count = $state(0);
	let doubled = $state(0);

	// ❌ WRONG!
	$effect(() => {
		doubled = count * 2;
	});

	// ✅ CORRECT!
	let doubled = $derived(count * 2);
</script>
```

### Component Communication

#### ✅ DO: Use callback props for events

```svelte
<!-- Child.svelte -->
<script>
	let { onsubmit } = $props();
</script>

<button onclick={onsubmit}>Submit</button>

<!-- Parent.svelte -->
<Child onsubmit={() => console.log('submitted')} />
```

#### ❌ DON'T: Use createEventDispatcher

```svelte
<!-- ❌ Deprecated in Svelte 5 -->
<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<button onclick={() => dispatch('submit')}>Submit</button>
```

### Props

#### ✅ DO: Destructure props

```svelte
<script>
	let { name, age = 18, ...rest } = $props();
</script>
```

#### ✅ DO: Use TypeScript for props

```svelte
<script lang="ts">
	interface Props {
		name: string;
		age?: number;
	}

	let { name, age = 18 }: Props = $props();
</script>
```

#### ❌ DON'T: Mutate non-bindable props

```svelte
<script>
	let { user } = $props();

	// ❌ WRONG! (unless user is $bindable)
	function updateUser() {
		user.name = 'Bob';
	}

	// ✅ CORRECT! Use callbacks
	let { user, onupdate } = $props();

	function updateUser() {
		onupdate({ ...user, name: 'Bob' });
	}
</script>
```

### Effects

#### ✅ DO: Use effects for side effects

```svelte
<script>
	let count = $state(0);

	$effect(() => {
		document.title = `Count: ${count}`;
	});
</script>
```

#### ✅ DO: Return cleanup functions

```svelte
<script>
	$effect(() => {
		const interval = setInterval(() => {
			console.log('tick');
		}, 1000);

		return () => clearInterval(interval);
	});
</script>
```

#### ❌ DON'T: Create infinite loops

```svelte
<script>
	let count = $state(0);

	// ❌ WRONG! Infinite loop
	$effect(() => {
		count++;
	});
</script>
```

### Snippets

#### ✅ DO: Use snippets for reusable UI

```svelte
{#snippet card(title, content)}
	<div class="card">
		<h2>{title}</h2>
		<p>{content}</p>
	</div>
{/snippet}

{@render card('Title 1', 'Content 1')}
{@render card('Title 2', 'Content 2')}
```

#### ✅ DO: Pass snippets to components

```svelte
<Table data={items}>
	{#snippet row(item)}
		<td>{item.name}</td>
		<td>{item.value}</td>
	{/snippet}
</Table>
```

#### ❌ DON'T: Use slots (deprecated)

```svelte
<!-- ✅ Use snippets instead -->
<script>
	let { children, header } = $props();
</script>

<!-- ❌ Deprecated (Svelte 4 syntax) -->
<slot />
<slot name="header" />

{@render header?.()}
{@render children?.()}
```

### Performance

#### ✅ DO: Use $state.raw for large non-mutated data

```svelte
<script>
	// Won't be mutated, skip deep reactivity
	let largeDataset = $state.raw(hugeArray);
</script>
```

#### ✅ DO: Use keyed each blocks

```svelte
{#each items as item (item.id)}
	<Item {item} />
{/each}
```

#### ❌ DON'T: Create unnecessary reactivity

```svelte
<script>
  // ❌ WRONG if data never changes
  let staticData = $state({ ... });

  // ✅ CORRECT
  const staticData = { ... };
</script>
```

---

## Migration from Svelte 4

### Reactivity Changes

```svelte
<!-- Svelte 4 -->
<script>
  let count = 0; // Implicitly reactive
  $: doubled = count * 2; // Derived
  $: console.log(count); // Side effect
</script>

<!-- Svelte 5 -->
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);

  $effect(() => {
    console.log(count);
  });
</script>
```

### Props Changes

```svelte
<!-- Svelte 4 -->
<script>
  export let name;
  export let age = 18;
  export { klass as class };
</script>

<!-- Svelte 5 -->
<script>
  let { name, age = 18, class: klass } = $props();
</script>
```

### Event Changes

```svelte
<!-- Svelte 4 -->
<button on:click={handler}>click</button>

<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  function submit() {
    dispatch('submit', { data });
  }
</script>

<!-- Svelte 5 -->
<button onclick={handler}>click</button>

<script>
  let { onsubmit } = $props();

  function submit() {
    onsubmit({ data });
  }
</script>
```

### Slots → Snippets

```svelte
<!-- Svelte 5 -->
<script>
	let { children, header, row } = $props();
</script>

<!-- Svelte 4 -->
<slot />
<slot name="header" />
<slot name="row" item={data} />

{@render header?.()}
{@render row?.(data)}
{@render children?.()}
```

### Component Instantiation

```javascript
// Svelte 4
import App from './App.svelte';

const app = new App({
	target: document.getElementById('app'),
	props: { name: 'world' }
});

app.$on('event', handler);
app.$set({ name: 'everybody' });
app.$destroy();

// Svelte 5
import { mount, unmount } from 'svelte';
import App from './App.svelte';

const props = $state({ name: 'world' });
const app = mount(App, {
	target: document.getElementById('app'),
	props,
	events: { event: handler }
});

props.name = 'everybody'; // Reactive update
unmount(app);
```

### Migration Script

Run automatic migration:

```bash
npx sv migrate svelte-5
```

**Migrates:**

- `let` → `$state`
- `$:` → `$derived`/`$effect`
- `export let` → `$props()`
- `on:click` → `onclick`
- `<slot />` → `{@render children()}`
- Slot usage → snippets
- `new Component()` → `mount()`

**Manual migration needed:**

- `createEventDispatcher`
- `beforeUpdate`/`afterUpdate`
- Complex reactivity patterns

---

## Common Patterns

### Form Handling

```svelte
<script>
	let formData = $state({
		name: '',
		email: '',
		message: ''
	});

	let errors = $derived.by(() => {
		const err = {};
		if (!formData.name) err.name = 'Required';
		if (!formData.email) err.email = 'Required';
		return err;
	});

	let isValid = $derived(Object.keys(errors).length === 0);

	function handleSubmit(e) {
		e.preventDefault();
		if (isValid) {
			console.log('Submit:', formData);
		}
	}
</script>

<form onsubmit={handleSubmit}>
	<input bind:value={formData.name} placeholder="Name" />
	{#if errors.name}<span>{errors.name}</span>{/if}

	<input bind:value={formData.email} placeholder="Email" />
	{#if errors.email}<span>{errors.email}</span>{/if}

	<textarea bind:value={formData.message}></textarea>

	<button disabled={!isValid}>Submit</button>
</form>
```

### Async Data Loading

```svelte
<script>
	let data = $state(null);
	let loading = $state(true);
	let error = $state(null);

	async function loadData() {
		loading = true;
		error = null;

		try {
			const res = await fetch('/api/data');
			data = await res.json();
		} catch (e) {
			error = e.message;
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		loadData();
	});
</script>

{#if loading}
	<p>Loading...</p>
{:else if error}
	<p>Error: {error}</p>
{:else}
	<pre>{JSON.stringify(data, null, 2)}</pre>
{/if}
```

### Debounced Input

```svelte
<script>
	let searchTerm = $state('');
	let debouncedTerm = $state('');

	$effect(() => {
		const timeout = setTimeout(() => {
			debouncedTerm = searchTerm;
		}, 300);

		return () => clearTimeout(timeout);
	});

	$effect(() => {
		if (debouncedTerm) {
			console.log('Search for:', debouncedTerm);
		}
	});
</script>

<input bind:value={searchTerm} placeholder="Search..." /><p>Searching for: {debouncedTerm}</p>
```

### Modal Dialog

```svelte
<script>
  let { open = $bindable(false) } = $props();

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      open = false;
    }
  }
</script>

{#if open}
  <div class="modal-backdrop" onclick={() => open = false}>
    <div class="modal" onclick={(e) => e.stopPropagation()}>
      <slot />
      <button onclick={() => open = false}>Close</button>
    </div>
  </div>

  <svelte:window onkeydown={handleKeydown} />
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal {
    background: white;
    padding: 2rem;
    border-radius: 8px;
  }
</style>
```

### Pagination

```svelte
<script>
	let items = $props();
	let currentPage = $state(1);
	let itemsPerPage = 10;

	let totalPages = $derived(Math.ceil(items.length / itemsPerPage));

	let paginatedItems = $derived.by(() => {
		const start = (currentPage - 1) * itemsPerPage;
		return items.slice(start, start + itemsPerPage);
	});
</script>

{#each paginatedItems as item}
	<div>{item.name}</div>
{/each}

<div class="pagination">
	<button onclick={() => currentPage--} disabled={currentPage === 1}> Previous </button>

	<span>Page {currentPage} of {totalPages}</span>

	<button onclick={() => currentPage++} disabled={currentPage === totalPages}> Next </button>
</div>
```

### Tooltip

```svelte
<!-- Tooltip.svelte -->
<script>
	let { content } = $props();
	let visible = $state(false);
	let x = $state(0);
	let y = $state(0);

	function handleMouseMove(e) {
		x = e.clientX;
		y = e.clientY;
	}
</script>

<span
	onmouseenter={() => (visible = true)}
	onmouseleave={() => (visible = false)}
	onmousemove={handleMouseMove}
>
	<slot />
</span>

{#if visible}
	<div class="tooltip" style="left: {x}px; top: {y}px;">
		{content}
	</div>
{/if}

<style>
	.tooltip {
		position: fixed;
		background: black;
		color: white;
		padding: 0.5rem;
		border-radius: 4px;
		pointer-events: none;
		transform: translate(10px, 10px);
	}
</style>
```

---

## Anti-Patterns to Avoid

### ❌ Updating State in Effects

```svelte
<!-- ❌ WRONG -->
<script>
  let count = $state(0);
  let doubled = $state(0);

  $effect(() => {
    doubled = count * 2; // Creates unnecessary complexity
  });
</script>

<!-- ✅ CORRECT -->
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);
</script>
```

### ❌ Circular Dependencies

```svelte
<!-- ❌ WRONG -->
<script>
	let a = $state(1);
	let b = $state(2);

	$effect(() => {
		b = a + 1;
	});

	$effect(() => {
		a = b - 1;
	});
</script>
```

### ❌ Mutating Props

```svelte
<!-- ❌ WRONG -->
<script>
  let { user } = $props();

  function updateName(name) {
    user.name = name; // Mutating parent state
  }
</script>

<!-- ✅ CORRECT -->
<script>
  let { user, onupdate } = $props();

  function updateName(name) {
    onupdate({ ...user, name });
  }
</script>
```

### ❌ Over-Using Effects

```svelte
<!-- ❌ WRONG -->
<script>
  let firstName = $state('');
  let lastName = $state('');
  let fullName = $state('');

  $effect(() => {
    fullName = `${firstName} ${lastName}`;
  });
</script>

<!-- ✅ CORRECT -->
<script>
  let firstName = $state('');
  let lastName = $state('');
  let fullName = $derived(`${firstName} ${lastName}`);
</script>
```

### ❌ Destructuring Reactive State

```svelte
<!-- ❌ WRONG -->
<script>
  let user = $state({ name: 'Alice', age: 30 });
  let { name, age } = user; // Loses reactivity

  $effect(() => {
    console.log(name); // Won't update when user.name changes
  });
</script>

<!-- ✅ CORRECT -->
<script>
  let user = $state({ name: 'Alice', age: 30 });

  $effect(() => {
    console.log(user.name); // Reactive
  });
</script>
```

### ❌ Using Stores When Runes Suffice

```svelte
<!-- ❌ WRONG (unnecessary complexity) -->
<script>
  import { writable } from 'svelte/store';

  const count = writable(0);
</script>

<button onclick={() => count.update(n => n + 1)}>
  {$count}
</button>

<!-- ✅ CORRECT -->
<script>
  let count = $state(0);
</script>

<button onclick={() => count++}>
  {count}
</button>
```

### ❌ Not Using Keys in Lists

```svelte
<!-- ❌ WRONG (inefficient updates) -->
{#each items as item}
	<Item {item} />
{/each}

<!-- ✅ CORRECT -->
{#each items as item (item.id)}
	<Item {item} />
{/each}
```

### ❌ Inline Functions in Loops

```svelte
<!-- ❌ LESS OPTIMAL (creates new function each render) -->
{#each items as item}
	<button onclick={() => handleClick(item)}>
		{item.name}
	</button>
{/each}

<!-- ✅ BETTER (but above is fine for most cases) -->
{#each items as item}
	<button onclick={(e) => handleClick(e, item)}>
		{item.name}
	</button>
{/each}
```

---

## Quick Reference

### Runes Cheat Sheet

```svelte
<script>
	// State
	let count = $state(0);
	let user = $state({ name: 'Alice' });
	let items = $state([1, 2, 3]);
	let large = $state.raw(hugeArray);

	// Derived
	let doubled = $derived(count * 2);
	let sum = $derived.by(() => {
		return items.reduce((a, b) => a + b, 0);
	});

	// Effects
	$effect(() => {
		console.log(count);
		return () => console.log('cleanup');
	});

	$effect.pre(() => {
		// Before DOM updates
	});

	// Props
	let { name, age = 18, ...rest } = $props();
	let { value = $bindable() } = $props();

	// Utilities
	$inspect(count, user);
	$inspect(count).with(console.trace);

	const id = $props.id();
</script>
```

### Template Cheat Sheet

```svelte
<!-- Text interpolation -->
<p>Hello {name}!</p>

<!-- Attributes -->
<button disabled={!active}>Click</button>
<button {disabled}>Click</button>

<!-- Events -->
<button onclick={handler}>Click</button>

<!-- Bindings -->
<input bind:value={text} />
<input bind:checked={accepted} />
<div bind:this={element} />

<!-- Class and style -->
<div class={{ active, disabled }}>...</div>
<div style:color style:background={bg}>...</div>

<!-- Control flow -->
{#if condition}
	...
{:else if otherCondition}
	...
{:else}
	...
{/if}

{#each items as item (item.id)}
	...
{:else}
	No items
{/each}

{#await promise}
	Loading...
{:then value}
	{value}
{:catch error}
	{error.message}
{/await}

<!-- Snippets -->
{#snippet name(param)}
	...
{/snippet}

{@render name(arg)}

<!-- Special tags -->
{@html content}
{@const value = expression}

<!-- Special elements -->
<svelte:window onkeydown={handler} />
<svelte:document onvisibilitychange={handler} />
<svelte:body onmouseenter={handler} />
<svelte:head>
	<title>Page Title</title>
</svelte:head>
<svelte:element this={tag}>...</svelte:element>
<svelte:boundary>
	...
	{#snippet failed(error, reset)}
		<button onclick={reset}>Retry</button>
	{/snippet}
</svelte:boundary>
```

---

## Actions (`use:`) - Legacy

> **Note:** In Svelte 5.29+, prefer [`{@attach}`](#attachments-attach) for new code. Actions are legacy but still supported.

Actions are functions called when an element mounts, typically using `$effect` for cleanup.

### Basic Usage

```svelte
<script>
	/** @type {import('svelte/action').Action} */
	function myaction(node) {
		// node has been mounted in DOM

		$effect(() => {
			// setup
			console.log('Element mounted:', node);

			return () => {
				// teardown
				console.log('Element unmounting');
			};
		});
	}
</script>

<div use:myaction>...</div>
```

### Actions with Parameters

```svelte
<script>
	/** @type {import('svelte/action').Action} */
	function myaction(node, data) {
		$effect(() => {
			console.log('Data:', data);
			// setup with data

			return () => {
				// cleanup
			};
		});
	}
</script>

<div use:myaction={data}>...</div>
```

**Important:** Action only called once. Does NOT re-run when argument changes (use `$effect` inside for reactivity).

### Practical Example: Tooltip

```svelte
<script>
	import tippy from 'tippy.js';

	/** @type {import('svelte/action').Action<HTMLElement, string>} */
	function tooltip(node, text) {
		let instance;

		$effect(() => {
			instance = tippy(node, { content: text });

			return () => {
				instance?.destroy();
			};
		});
	}
</script>

<button use:tooltip="Hello!">Hover me</button>
```

### TypeScript Typing

```typescript
import type { Action } from 'svelte/action';

const gestures: Action<
	HTMLDivElement,                  // Element type
	undefined,                        // Parameter type
	{                                 // Custom events
		onswiperight: (e: CustomEvent) => void;
		onswipeleft: (e: CustomEvent) => void;
	}
> = (node) => {
	$effect(() => {
		// Detect gestures
		node.dispatchEvent(new CustomEvent('swipeleft'));
		node.dispatchEvent(new CustomEvent('swiperight'));
	});
};
```

### Legacy API (Pre-$effect)

```javascript
// ❌ Old way (still works)
function action(node, params) {
	// setup

	return {
		update(newParams) {
			// called when params change
		},
		destroy() {
			// cleanup
		}
	};
}

// ✅ New way (preferred)
function action(node, params) {
	$effect(() => {
		// setup (re-runs when dependencies change)

		return () => {
			// cleanup
		};
	});
}
```

### Why Use Attachments Instead?

| Feature           | `use:` Actions | `{@attach}` Attachments |
| ----------------- | -------------- | ----------------------- |
| **Reactivity**    | Manual         | Automatic               |
| **Component spread** | ❌             | ✅                      |
| **API**           | Complex        | Simple                  |
| **Svelte version** | All            | 5.29+                   |

---

## Testing

Svelte is unopinionated about testing frameworks. Use [Vitest](https://vitest.dev/), [Jasmine](https://jasmine.github.io/), [Cypress](https://www.cypress.io/), or [Playwright](https://playwright.dev/).

### Unit Testing with Vitest

**Installation:**

```bash
npm install -D vitest
```

**Configuration:**

```javascript
// vite.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
	// Tell Vitest to use browser entry points
	resolve: process.env.VITEST
		? { conditions: ['browser'] }
		: undefined
});
```

### Testing Svelte Code

```javascript
// multiplier.svelte.test.js
import { flushSync } from 'svelte';
import { expect, test } from 'vitest';
import { multiplier } from './multiplier.svelte.js';

test('Multiplier', () => {
	let double = multiplier(0, 2);

	expect(double.value).toEqual(0);

	double.set(5);

	expect(double.value).toEqual(10);
});
```

```javascript
// multiplier.svelte.js
export function multiplier(initial, k) {
	let count = $state(initial);

	return {
		get value() {
			return count * k;
		},
		set: (c) => {
			count = c;
		}
	};
}
```

### Using Runes in Tests

Test files with `.svelte.js` extension can use runes:

```javascript
// test.svelte.test.js
import { expect, test } from 'vitest';

test('Runes in tests', () => {
	let count = $state(0);
	let doubled = $derived(count * 2);

	expect(doubled).toBe(0);

	count = 5;

	expect(doubled).toBe(10);
});
```

### Testing Components

```javascript
import { mount, unmount, flushSync } from 'svelte';
import { expect, test } from 'vitest';
import Component from './Component.svelte';

test('Component renders', () => {
	const target = document.createElement('div');
	const component = mount(Component, {
		target,
		props: { name: 'world' }
	});

	flushSync(); // Ensure effects run

	expect(target.textContent).toContain('Hello world');

	unmount(component);
});
```

### Testing Library

For more advanced component testing, use [@testing-library/svelte](https://testing-library.com/docs/svelte-testing-library/intro/):

```javascript
import { render, screen } from '@testing-library/svelte';
import { expect, test } from 'vitest';
import Component from './Component.svelte';

test('Component interaction', async () => {
	const { component } = render(Component, { name: 'world' });

	const button = screen.getByRole('button');
	await button.click();

	expect(screen.getByText('Clicked!')).toBeInTheDocument();
});
```

### End-to-End Testing

Use Playwright for E2E tests:

```javascript
import { test, expect } from '@playwright/test';

test('homepage has title', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveTitle(/My App/);
});
```

---

## Custom Elements (Web Components)

Svelte components can be compiled to custom elements using the `customElement` compiler option.

### Basic Usage

```svelte
<svelte:options customElement="my-element" />

<script>
	let { name = 'world' } = $props();
</script>

<h1>Hello {name}!</h1>
<slot />
```

**Compile with:**

```javascript
// vite.config.js or svelte.config.js
export default {
	compilerOptions: {
		customElement: true
	}
};
```

### Registering Custom Element

```javascript
import MyElement from './MyElement.svelte';

// Automatic registration (if tag specified in <svelte:options>)
// Or manual:
customElements.define('my-element', MyElement.element);
```

### Using in HTML

```html
<my-element name="everyone">
	<p>This is slotted content</p>
</my-element>
```

```javascript
const el = document.querySelector('my-element');

// Get prop
console.log(el.name); // 'everyone'

// Set prop (updates shadow DOM)
el.name = 'everybody';
```

### Component Options

```svelte
<svelte:options
	customElement={{
		tag: 'custom-element',
		shadow: 'none', // Disable shadow DOM
		props: {
			name: {
				reflect: true, // Reflect to attribute
				type: 'Number',
				attribute: 'element-index' // Custom attribute name
			}
		},
		extend: (customElementConstructor) => {
			// Extend the custom element class
			return class extends customElementConstructor {
				static formAssociated = true;

				constructor() {
					super();
					this.attachedInternals = this.attachInternals();
				}

				randomIndex() {
					this.elementIndex = Math.random();
				}
			};
		}
	}}
/>
```

**Options:**

- `tag` - Custom element tag name
- `shadow` - `"none"` to disable shadow DOM (no style encapsulation)
- `props` - Configure prop behavior:
  - `attribute` - Custom attribute name
  - `reflect` - Reflect prop changes to attribute
  - `type` - Type conversion (`'String'`, `'Boolean'`, `'Number'`, `'Array'`, `'Object'`)
- `extend` - Extend the custom element class

### Lifecycle

**Creation:**

1. Custom element created
2. Svelte component created on next tick after `connectedCallback`
3. Props assigned before insertion are saved and set on creation

**Updates:**

- Shadow DOM reflects changes on next tick (batched)
- Temporary detachment doesn't unmount component

**Destruction:**

- Component destroyed on next tick after `disconnectedCallback`

### Accessing Host Element

```svelte
<svelte:options customElement="my-stepper" />

<script>
	function dispatch(type) {
		$host().dispatchEvent(new CustomEvent(type));
	}
</script>

<button onclick={() => dispatch('increment')}>+</button>
<button onclick={() => dispatch('decrement')}>-</button>
```

**Usage:**

```html
<my-stepper
	onincrement={() => count++}
	ondecrement={() => count--}
></my-stepper>
```

### Best Practices

- ✅ Use for framework-agnostic components
- ✅ Explicitly list all props
- ✅ Consider shadow DOM implications
- ✅ Test in multiple browsers
- ❌ Don't expect immediate updates
- ❌ Don't rely on synchronous lifecycle

---

## Conclusion

Svelte 5 represents a major evolution in the framework, bringing:

1. **Explicit Reactivity:** Runes make reactivity clear and predictable
2. **Universal Reactivity:** Works anywhere, not just component top-level
3. **Better Performance:** Fine-grained reactivity with less overhead
4. **TypeScript-First:** Better type inference and safety
5. **Simpler Mental Model:** Fewer concepts to learn

**Key Takeaways:**

- **Use runes everywhere:** `$state`, `$derived`, `$effect`
- **Props are just destructuring:** `$props()` is intuitive
- **Events are callbacks:** No more `createEventDispatcher`
- **Snippets over slots:** More powerful and flexible
- **Effects are rare:** Most cases want `$derived`, not `$effect`

**Remember:**

- State is just values, not wrappers
- Derived values are lazy (pull-based)
- Effects are for side effects only
- TypeScript is first-class
- Migration is mostly automatic

This guide serves as a comprehensive reference for implementing Svelte 5 applications.

## What's New in This Updated Bible

This bible has been significantly expanded to include **all** official Svelte 5 documentation topics:

### New Svelte 5.3+ Features
- **`<svelte:boundary>`** - Error boundaries with pending states (5.3+)
- **`@attach` directive** - Reactive element attachments (5.29+)
- **Top-level `await` expressions** - Async markup, scripts, and derived (5.36+, experimental)

### Template & Syntax
- **`{@render}`** - Rendering snippets with parameters
- **`{@const}`** - Template-scoped constants
- **`{@debug}`** - Template debugging
- **Enhanced `{#key}` blocks** - Force component recreation

### Component APIs
- **Imperative API** - `mount()`, `unmount()`, `hydrate()`, `render()`, `flushSync()`
- **Component lifecycle** - Modern approach to SSR and hydration

### Animation & Motion
- **`svelte/transition`** - fade, fly, slide, scale, draw, crossfade
- **`svelte/motion`** - tweened, spring for physics-based animations
- **`svelte/animate`** - flip animations for list reordering
- **`svelte/easing`** - Complete catalog of 40+ easing functions

### Advanced Topics
- **Actions (`use:`)** - Legacy directive pattern (prefer `@attach`)
- **Testing** - Vitest setup, component testing, E2E with Playwright
- **Custom Elements** - Web Components API, shadow DOM, lifecycle
- **Attachments** - Modern replacement for actions with better reactivity

### Coverage Summary

| Category | Coverage |
|----------|----------|
| **Core Runes** | ✅ 100% - All 8 runes documented |
| **Template Syntax** | ✅ 100% - All directives and tags |
| **Transitions/Animations** | ✅ 100% - All built-in functions |
| **Special Elements** | ✅ 100% - All 8 special elements |
| **Module APIs** | ✅ 95% - Core modules covered |
| **Testing** | ✅ Full - Vitest, component, E2E patterns |
| **Custom Elements** | ✅ Full - Complete web components guide |

**Total Coverage:** ~95% of official Svelte 5 documentation

Refer to [official Svelte documentation](https://svelte.dev/docs) for the latest updates and edge cases.
# SVELTEKIT BIBLE

**Comprehensive Knowledge Document for SvelteKit Development**

> **Document Stats:** ~20,000 tokens | 10,190 words | 3,905 lines | 78,539 characters

This document synthesizes all official SvelteKit documentation into a practical reference guide for building robust SvelteKit applications. Use this as the authoritative source for SvelteKit patterns, conventions, and best practices.

---

## Table of Contents

1. [Project Structure & File Conventions](#1-project-structure--file-conventions)
2. [Routing](#2-routing)
3. [Load Functions](#3-load-functions)
4. [Form Actions](#4-form-actions)
5. [Page Options](#5-page-options)
6. [State Management](#6-state-management)
7. [Remote Functions](#7-remote-functions)
8. [Hooks](#8-hooks)
9. [Error Handling](#9-error-handling)
10. [Navigation & Links](#10-navigation--links)
11. [API Routes (+server.js)](#11-api-routes-serverjs)
12. [Service Workers](#12-service-workers)
13. [Advanced Patterns](#13-advanced-patterns)
14. [Adapters & Deployment](#14-adapters--deployment)
15. [Environment Variables](#15-environment-variables)
16. [CLI Commands](#16-cli-commands)
17. [SEO](#17-seo)
18. [Performance Optimization](#18-performance-optimization)
19. [Observability & Instrumentation](#19-observability--instrumentation)
20. [Configuration Reference](#20-configuration-reference)
21. [Important Conventions](#21-important-conventions)
22. [Type Safety](#22-type-safety)
23. [Web Standards](#23-web-standards)
24. [Common Pitfalls](#24-common-pitfalls)
25. [Best Practices](#25-best-practices)
26. [Migration Guide (v1 to v2)](#26-migration-guide-v1-to-v2)

---

## 1. Project Structure & File Conventions

### Directory Structure

```
my-project/
├── src/
│   ├── lib/                          # Shared components and utilities
│   │   ├── server/                   # Server-only code (not bundled to client)
│   │   │   └── [server modules]
│   │   └── [shared modules]
│   ├── params/                       # Route parameter matchers
│   │   └── [param matchers]
│   ├── routes/                       # Your app routes (filesystem-based)
│   │   └── [route files]
│   ├── app.html                      # Page template
│   ├── error.html                    # Static fallback error page
│   ├── hooks.client.js               # Client-side hooks
│   ├── hooks.server.js               # Server-side hooks
│   ├── hooks.js                      # Universal hooks (client & server)
│   ├── service-worker.js             # Service worker
│   └── instrumentation.server.js     # Observability setup
├── static/                           # Static assets (served as-is)
├── tests/                            # Tests (Playwright, Vitest)
├── package.json
├── svelte.config.js                  # SvelteKit configuration
├── tsconfig.json                     # TypeScript config
└── vite.config.js                    # Vite configuration
```

### File Naming Conventions

**Route Files (all start with `+`):**

- `+page.svelte` - Page component (visible to users)
- `+page.js` - Universal load function (runs server + client)
- `+page.server.js` - Server-only load function + actions
- `+layout.svelte` - Layout component
- `+layout.js` - Layout universal load
- `+layout.server.js` - Layout server load
- `+server.js` - API endpoint (GET, POST, etc.)
- `+error.svelte` - Error page boundary

**Special Files:**

- `.server.js` - Server-only modules
- `.remote.js` - Remote functions (experimental)
- `[param]` - Dynamic route parameter
- `[...rest]` - Rest/catch-all parameter
- `[[optional]]` - Optional parameter
- `(group)` - Layout group (doesn't affect URL)

### Important Rules

1. **All files can run on the server**
2. **All files run on client EXCEPT `+server` files**
3. **`+layout` and `+error` files apply to subdirectories**
4. **Only `+page.svelte` creates accessible routes**

---

## 2. Routing

### Basic Routing

**Route Hierarchy:**

```
src/routes/                      → /
src/routes/about/                → /about
src/routes/blog/[slug]/          → /blog/:slug
```

**Route Priority (most to least specific):**

1. `foo-abc/+page.svelte`
2. `foo-[c]/+page.svelte`
3. `[[optional]]/+page.svelte`
4. `[param]/+page.svelte`
5. `[...rest]/+page.svelte`

### Dynamic Routes

```js
/// file: src/routes/blog/[slug]/+page.js
export function load({ params }) {
	return {
		slug: params.slug // From URL /blog/hello-world
	};
}
```

### Rest Parameters

```js
/// file: src/routes/[org]/[repo]/tree/[branch]/[...file]/+page.js
/// Matches: /sveltejs/kit/tree/main/docs/routing.md

export function load({ params }) {
	return {
		org: params.org, // 'sveltejs'
		repo: params.repo, // 'kit'
		branch: params.branch, // 'main'
		file: params.file // 'docs/routing.md'
	};
}
```

### Optional Parameters

```js
/// file: src/routes/[[lang]]/home/+page.svelte
/// Matches: /home AND /en/home
```

### Parameter Matchers

```js
/// file: src/params/fruit.js
export function match(param) {
	return param === 'apple' || param === 'orange';
}
```

```
// Use with: src/routes/fruits/[page=fruit]/+page.svelte
// Only matches if param is 'apple' or 'orange'
```

### Advanced Routing

**Layout Groups** - Group routes without affecting URL:

```
src/routes/
  (app)/              # Group name doesn't appear in URL
    dashboard/        → /dashboard
    +layout.svelte    # Shared layout for group
  (marketing)/
    about/            → /about
    +layout.svelte
```

**Breaking Out of Layouts** - Reset layout hierarchy:

```svelte
<!-- +page@.svelte - Reset to root layout -->
<!-- +page@(app).svelte - Reset to (app) layout -->
<!-- +page@item.svelte - Reset to item layout -->
```

### 404 Handling

```
src/routes/
  marx-brothers/
    [...path]/+page.js    # Catches all unmatched routes
    +error.svelte         # Custom error page
```

```js
/// file: [...path]/+page.js
import { error } from '@sveltejs/kit';

export function load() {
	error(404, 'Not Found');
}
```

---

## 3. Load Functions

### Universal Load (`+page.js` / `+layout.js`)

Runs on **both server and client**.

```js
/// file: +page.js
/** @type {import('./$types').PageLoad} */
export function load({ params, url, route, fetch, setHeaders, parent, depends, untrack }) {
	return {
		post: {
			title: `Title for ${params.slug}`,
			content: 'Content here'
		}
	};
}
```

**Available to universal load:**

- `params` - Route parameters
- `url` - URL object
- `route` - Current route info
- `fetch` - Enhanced fetch
- `setHeaders` - Set response headers (SSR only)
- `parent` - Parent layout data
- `depends` - Manual dependency tracking
- `untrack` - Exclude from dependency tracking
- `data` - Data from server load (if both exist)

### Server Load (`+page.server.js` / `+layout.server.js`)

Runs **only on server**.

```js
/// file: +page.server.js
import * as db from '$lib/server/database';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, cookies, locals, platform, request }) {
	const post = await db.getPost(params.slug);

	if (!post) {
		error(404, 'Not found');
	}

	return { post };
}
```

**Additional server load properties:**

- `cookies` - Cookie API
- `locals` - Server-side data from hooks
- `platform` - Deployment platform info
- `request` - Request object
- `clientAddress` - Client IP

**Data must be serializable** with [devalue](https://github.com/rich-harris/devalue):

- JSON types
- `Date`, `Map`, `Set`, `RegExp`
- `BigInt`
- Cyclic references
- Promises (streamed to client)

### When to Use Which

**Universal Load (`+page.js`):**

- Fetching from public APIs
- Client-side only data manipulation
- Need to return non-serializable data (component constructors)
- No sensitive data/credentials

**Server Load (`+page.server.js`):**

- Database queries
- Private API keys/environment variables
- Sensitive operations
- Need `cookies`, `locals`, `request`

### Load Function Patterns

**Streaming with Promises:**

```js
/// file: +page.server.js
export async function load({ params }) {
	return {
		// Awaited - blocks render
		post: await loadPost(params.slug),
		// Not awaited - streams in after
		comments: loadComments(params.slug)
	};
}
```

**Using Parent Data:**

```js
/// file: +page.js
export async function load({ parent }) {
	const { user } = await parent();
	return {
		recommendations: fetchRecommendations(user.id)
	};
}
```

**Avoiding Waterfalls:**

```js
/// file: +page.js
export async function load({ params, parent }) {
	// ❌ BAD - waterfall
	const parentData = await parent();
	const data = await getData(params);

	// ✓ GOOD - parallel
	const data = await getData(params);
	const parentData = await parent();

	return { ...data, ...parentData };
}
```

### Load Rerunning

Load functions rerun when:

- Referenced `params` property changes
- Referenced `url` property changes (except `url.hash`)
- Called `url.searchParams.get()` and that param changed
- `await parent()` was called and parent reran
- Dependency was invalidated with `invalidate(url)`
- `invalidateAll()` was called
- `depends()` was used and that dependency was invalidated

**Manual Invalidation:**

```svelte
<script>
	import { invalidate, invalidateAll } from '$app/navigation';

	function refresh() {
		invalidate('app:data'); // Invalidate specific
		invalidate((url) => url.href.includes('/api/'));
		invalidateAll(); // Invalidate everything
	}
</script>
```

**Track Dependencies:**

```js
export async function load({ fetch, depends }) {
	depends('app:posts'); // Custom identifier
	const res = await fetch('/api/posts');
	return { posts: await res.json() };
}
```

**Untrack Dependencies:**

```js
export async function load({ url, untrack }) {
	// Don't rerun when pathname changes
	if (untrack(() => url.pathname) === '/') {
		return { message: 'Welcome!' };
	}
}
```

### Using fetch in Load

```js
export async function load({ fetch, params }) {
	// Enhanced fetch:
	// - Inherits cookies/auth headers on server
	// - Can make relative requests on server
	// - Direct handler call for internal endpoints
	// - Response inlined into HTML (no duplicate request)
	const res = await fetch(`/api/items/${params.id}`);
	return { item: await res.json() };
}
```

### Cookies in Server Load

```js
export async function load({ cookies }) {
	const sessionid = cookies.get('sessionid');

	return {
		user: await db.getUser(sessionid)
	};
}
```

### Setting Headers

```js
export async function load({ fetch, setHeaders }) {
	const res = await fetch('https://api.example.com/data');

	// Cache page for same duration as API
	setHeaders({
		age: res.headers.get('age'),
		'cache-control': res.headers.get('cache-control')
	});

	return res.json();
}
```

**Important:**

- Can only set header once
- Cannot use `set-cookie` (use `cookies.set()`)
- Only works during SSR

---

## 4. Form Actions

### Default Action

```js
/// file: +page.server.js
export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		const user = await db.getUser(email);
		cookies.set('sessionid', await db.createSession(user), { path: '/' });

		return { success: true };
	}
};
```

```svelte
<!--- file: +page.svelte --->
<form method="POST">
	<input name="email" type="email" />
	<input name="password" type="password" />
	<button>Log in</button>
</form>
```

### Named Actions

```js
/// file: +page.server.js
export const actions = {
	login: async (event) => {
		// Login logic
	},
	register: async (event) => {
		// Register logic
	}
};
```

```svelte
<form method="POST" action="?/login">
	<button>Log in</button>
</form>

<form method="POST" action="?/register">
	<button>Register</button>
</form>

<!-- Or use formaction -->
<form method="POST" action="?/login">
	<button>Log in</button>
	<button formaction="?/register">Register</button>
</form>
```

### Validation Errors

```js
import { fail } from '@sveltejs/kit';

export const actions = {
	login: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email');

		if (!email) {
			return fail(400, { email, missing: true });
		}

		const user = await db.getUser(email);
		if (!user) {
			return fail(400, { email, incorrect: true });
		}

		return { success: true };
	}
};
```

```svelte
<script>
	let { form } = $props();
</script>

<form method="POST">
	{#if form?.missing}
		<p class="error">Email required</p>
	{/if}
	{#if form?.incorrect}
		<p class="error">Invalid credentials</p>
	{/if}

	<input name="email" type="email" value={form?.email ?? ''} />
	<button>Log in</button>
</form>
```

### Progressive Enhancement

```svelte
<script>
	import { enhance } from '$app/forms';
	let { form } = $props();
</script>

<!-- Basic enhancement (no full-page reload) -->
<form method="POST" use:enhance>
	<!-- form fields -->
</form>
```

**Default `use:enhance` behavior:**

- Updates `form` prop and `page.form` on success/failure
- Resets the `<form>` element
- Invalidates all data on success
- Calls `goto` on redirect
- Renders nearest `+error` on error
- Resets focus appropriately

### Custom Enhancement

```svelte
<script>
  import { enhance } from '$app/forms';
</script>

<form
  method="POST"
  use:enhance={({ formElement, formData, action, cancel, submitter }) => {
    // Before submission
    console.log('Submitting to:', action);

    return async ({ result, update }) => {
      // After submission
      if (result.type === 'success') {
        showToast('Success!');
      }
      // Call default behavior
      await update();
    };
  }}
>
```

### Manual Form Handling

```svelte
<script>
	import { invalidateAll } from '$app/navigation';
	import { applyAction, deserialize } from '$app/forms';

	async function handleSubmit(event) {
		event.preventDefault();

		const data = new FormData(event.currentTarget);
		const response = await fetch(event.currentTarget.action, {
			method: 'POST',
			body: data,
			headers: {
				'x-sveltekit-action': 'true' // Required if +server.js exists
			}
		});

		const result = deserialize(await response.text());

		if (result.type === 'success') {
			await invalidateAll();
		}

		applyAction(result);
	}
</script>

<form method="POST" onsubmit={handleSubmit}>
	<!-- form fields -->
</form>
```

### Redirects from Actions

```js
import { redirect } from '@sveltejs/kit';

export const actions = {
	login: async ({ cookies, url }) => {
		// ... login logic ...

		if (url.searchParams.has('redirectTo')) {
			redirect(303, url.searchParams.get('redirectTo'));
		}

		return { success: true };
	}
};
```

---

## 5. Page Options

Export these from `+page.js`, `+page.server.js`, `+layout.js`, or `+layout.server.js`:

### prerender

```js
export const prerender = true; // Prerender at build time
export const prerender = false; // Never prerender
export const prerender = 'auto'; // Prerender but include in manifest
```

**Requirements for prerendering:**

- All users get same content
- No personalized data
- No form actions
- No accessing `url.searchParams` during render

**Prerendering server routes:**

```js
/// file: +server.js
export const prerender = true;

export function GET() {
	return new Response('This will be prerendered');
}
```

### ssr

```js
export const ssr = false; // Client-only rendering (SPA mode)
```

**When `ssr = false`:**

- Empty shell sent to client
- Worse SEO
- Slower initial render
- Better for apps with auth gates

### csr

```js
export const csr = false; // No client-side JavaScript
```

**When `csr = false`:**

- No JavaScript shipped
- No `<script>` tags in components
- No progressive enhancement
- No client-side navigation
- All links cause full page reload

### trailingSlash

```js
export const trailingSlash = 'never'; // Default
export const trailingSlash = 'always'; // /about → /about/
export const trailingSlash = 'ignore'; // Don't normalize
```

**Affects prerendering:**

- `'always'`: Creates `/about/index.html`
- `'never'`: Creates `/about.html`

### entries (for prerendering)

```js
/// file: +page.server.js
export function entries() {
	return [{ slug: 'hello-world' }, { slug: 'another-post' }];
}

export const prerender = true;
```

### config (adapter-specific)

```js
/// file: +page.js
export const config = {
	runtime: 'edge',
	regions: ['us1', 'us2']
};
```

---

## 6. State Management

### Server State Rules

**NEVER do this on server:**

```js
// ❌ BAD - shared across all users
let user;

export function load() {
	return { user };
}

export const actions = {
	default: async ({ request }) => {
		user = await request.formData(); // DANGEROUS!
	}
};
```

**✓ Good patterns:**

```js
// Use cookies + database
export async function load({ cookies }) {
	const sessionid = cookies.get('sessionid');
	return {
		user: await db.getUser(sessionid)
	};
}
```

### No Side Effects in Load

```js
// ❌ BAD
import { user } from '$lib/user';

export async function load({ fetch }) {
	const res = await fetch('/api/user');
	user.set(await res.json()); // Side effect!
}

// ✓ GOOD
export async function load({ fetch }) {
	const res = await fetch('/api/user');
	return {
		user: await res.json()
	};
}
```

### Using Context for State

```svelte
<!--- file: +layout.svelte --->
<script>
	import { setContext } from 'svelte';
	let { data } = $props();

	// Pass function to maintain reactivity
	setContext('user', () => data.user);
</script>
```

```svelte
<!--- file: +page.svelte --->
<script>
	import { getContext } from 'svelte';

	const user = getContext('user');
</script>

<p>Welcome {user().name}</p>
```

### Component State Preservation

```svelte
<script>
	let { data } = $props();

	// ❌ NOT reactive across navigation
	const wordCount = data.content.split(' ').length;

	// ✓ Reactive
	let wordCount = $derived(data.content.split(' ').length);
</script>
```

**Forcing component remount:**

```svelte
<script>
	import { page } from '$app/state';
</script>

{#key page.url.pathname}
	<Component {data} />
{/key}
```

### URL State

For state that should survive reload:

```js
// Store in URL search params
// ?sort=price&order=ascending

export async function load({ url }) {
	const sort = url.searchParams.get('sort') ?? 'name';
	const order = url.searchParams.get('order') ?? 'ascending';

	return {
		items: await db.getItems({ sort, order })
	};
}
```

### Snapshots (Ephemeral State)

```svelte
<script>
	let comment = $state('');

	export const snapshot = {
		capture: () => comment,
		restore: (value) => (comment = value)
	};
</script>

<form method="POST">
	<textarea bind:value={comment} />
	<button>Post</button>
</form>
```

**Snapshot data:**

- Must be JSON-serializable
- Stored in sessionStorage
- Restored on back/forward navigation

---

## 7. Remote Functions

**Available since SvelteKit 2.27** - Experimental feature requiring opt-in.

Remote functions provide type-safe communication between client and server. They always run on the server but can be called from anywhere in your app.

### Enabling Remote Functions

```js
/// file: svelte.config.js
const config = {
	kit: {
		experimental: {
			remoteFunctions: true
		}
	},
	compilerOptions: {
		experimental: {
			async: true  // Optional: for await in components
		}
	}
};
```

### query - Reading Data

```js
/// file: src/routes/blog/data.remote.js
import { query } from '$app/server';
import * as db from '$lib/server/database';

export const getPosts = query(async () => {
	const posts = await db.sql`
		SELECT title, slug
		FROM post
		ORDER BY published_at DESC
	`;
	return posts;
});
```

**Using in components:**

```svelte
<script>
	import { getPosts } from './data.remote';
</script>

<ul>
	{#each await getPosts() as { title, slug }}
		<li><a href="/blog/{slug}">{title}</a></li>
	{/each}
</ul>
```

**Alternative syntax (without await):**

```svelte
<script>
	const query = getPosts();
</script>

{#if query.error}
	<p>oops!</p>
{:else if query.loading}
	<p>loading...</p>
{:else}
	<ul>
		{#each query.current as { title, slug }}
			<li><a href="/blog/{slug}">{title}</a></li>
		{/each}
	</ul>
{/if}
```

### Query Arguments with Validation

```js
import * as v from 'valibot';
import { query } from '$app/server';
import { error } from '@sveltejs/kit';

export const getPost = query(v.string(), async (slug) => {
	const [post] = await db.sql`
		SELECT * FROM post WHERE slug = ${slug}
	`;
	if (!post) error(404, 'Not found');
	return post;
});
```

### Refreshing Queries

```svelte
<button onclick={() => getPosts().refresh()}>
	Check for new posts
</button>
```

**Note:** Queries are cached while on the page, so `getPosts() === getPosts()`.

### query.batch - Solving N+1 Problem

```js
export const getWeather = query.batch(v.string(), async (cities) => {
	// cities is array of all arguments from simultaneous calls
	const weather = await db.sql`
		SELECT * FROM weather
		WHERE city = ANY(${cities})
	`;
	const lookup = new Map(weather.map(w => [w.city, w]));

	// Return resolver function
	return (city) => lookup.get(city);
});
```

### form - Writing Data

```js
/// file: src/routes/blog/data.remote.js
import { form } from '$app/server';
import * as v from 'valibot';

export const createPost = form(
	v.object({
		title: v.pipe(v.string(), v.nonEmpty()),
		content: v.pipe(v.string(), v.nonEmpty())
	}),
	async ({ title, content }) => {
		const user = await auth.getUser();
		if (!user) error(401, 'Unauthorized');

		const slug = title.toLowerCase().replace(/ /g, '-');
		await db.sql`
			INSERT INTO post (slug, title, content)
			VALUES (${slug}, ${title}, ${content})
		`;

		redirect(303, `/blog/${slug}`);
	}
);
```

**Using in components:**

```svelte
<script>
	import { createPost } from '../data.remote';
</script>

<form {...createPost}>
	<label>
		<h2>Title</h2>
		<input name="title" />
	</label>

	<label>
		<h2>Write your post</h2>
		<textarea name="content"></textarea>
	</label>

	<button>Publish!</button>
</form>
```

### Form Validation

```svelte
<form {...createPost}>
	<label>
		<h2>Title</h2>
		{#if createPost.issues.title}
			{#each createPost.issues.title as issue}
				<p class="issue">{issue.message}</p>
			{/each}
		{/if}
		<input name="title" aria-invalid={!!createPost.issues.title} />
	</label>
	<button>Publish!</button>
</form>
```

**Programmatic validation:**

```svelte
<form {...createPost} oninput={() => createPost.validate()}>
	<!-- validates on every keystroke -->
</form>
```

### Preflight Schema (Client-side Validation)

```svelte
<script>
	import * as v from 'valibot';
	import { createPost } from '../data.remote';

	const schema = v.object({
		title: v.pipe(v.string(), v.nonEmpty()),
		content: v.pipe(v.string(), v.nonEmpty())
	});
</script>

<form {...createPost.preflight(schema)}>
	<!-- Won't submit if validation fails -->
</form>
```

### Live Form Input

```svelte
<form {...createPost}>
	<!-- form fields -->
</form>

<div class="preview">
	<h2>{createPost.input.title}</h2>
	<div>{@html render(createPost.input.content)}</div>
</div>
```

### Sensitive Data Protection

```svelte
<input name="_password" type="password" />
<!-- Leading underscore prevents data from being sent back to user -->
```

### Single-Flight Mutations

**Server-driven:**

```js
export const createPost = form(
	v.object({...}),
	async (data) => {
		// ... form logic ...

		// Refresh specific queries
		await getPosts().refresh();

		// Or set data directly
		await getPost(post.id).set(result);

		redirect(303, `/blog/${slug}`);
	}
);
```

**Client-driven with enhance:**

```svelte
<form
	{...createPost.enhance(async ({ form, data, submit }) => {
		try {
			await submit().updates(getPosts());
			form.reset();
			showToast('Success!');
		} catch (error) {
			showToast('Error!');
		}
	})}
>
```

**Optimistic updates:**

```js
await submit().updates(
	getPosts().withOverride((posts) => [newPost, ...posts])
);
```

### command - Mutations Without Forms

```js
/// file: likes.remote.js
import { command } from '$app/server';
import * as v from 'valibot';

export const addLike = command(v.string(), async (id) => {
	await db.sql`
		UPDATE item
		SET likes = likes + 1
		WHERE id = ${id}
	`;

	// Refresh related query
	getLikes(id).refresh();
});
```

**Usage:**

```svelte
<button
	onclick={async () => {
		try {
			await addLike(item.id).updates(getLikes(item.id));
		} catch (error) {
			showToast('Error!');
		}
	}}
>
	add like
</button>
```

**Note:** Commands cannot be called during render.

### prerender - Build-Time Data

```js
import { prerender } from '$app/server';

export const getPosts = prerender(async () => {
	const posts = await db.sql`
		SELECT title, slug FROM post
		ORDER BY published_at DESC
	`;
	return posts;
});
```

**With arguments:**

```js
export const getPost = prerender(
	v.string(),
	async (slug) => { /* ... */ },
	{
		inputs: () => ['first-post', 'second-post', 'third-post'],
		dynamic: true  // Allow runtime calls with non-prerendered args
	}
);
```

**Benefits:**
- Data prerendered at build time
- Cached using Cache API (survives page reloads)
- Cleared on new deployment
- Can use on otherwise dynamic pages

### Using getRequestEvent

```js
import { getRequestEvent, query } from '$app/server';

export const getProfile = query(async () => {
	const { cookies } = getRequestEvent();
	const user = await findUser(cookies.get('session_id'));

	return {
		name: user.name,
		avatar: user.avatar
	};
});
```

**Note:** Inside remote functions, some `RequestEvent` properties differ:
- No `params` or `route.id`
- Cannot set headers (except cookies in `form`/`command`)
- `url.pathname` is always `/`

### Handling Validation Errors

```js
/// file: src/hooks.server.js
export function handleValidationError({ event, issues }) {
	return {
		message: 'Nice try, hacker!'
	};
}
```

### Important Notes

- Remote files must be in `src` directory
- File extensions: `.remote.js` or `.remote.ts`
- Both arguments and return values serialized with devalue
- Validation uses Standard Schema (Zod, Valibot, etc.)
- `redirect()` works in `query`, `form`, `prerender` (NOT in `command`)

---

## 8. Hooks

### Server Hooks (`src/hooks.server.js`)

#### handle

```js
export async function handle({ event, resolve }) {
	// Runs for every request

	// Add user to locals
	event.locals.user = await getUser(event.cookies.get('sessionid'));

	// Custom route handling
	if (event.url.pathname.startsWith('/custom')) {
		return new Response('custom response');
	}

	// Modify response
	const response = await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('old', 'new'),
		filterSerializedResponseHeaders: (name) => name.startsWith('x-'),
		preload: ({ type }) => type === 'js'
	});

	response.headers.set('x-custom-header', 'value');

	return response;
}
```

**Multiple handles with sequence:**

```js
import { sequence } from '@sveltejs/kit/hooks';

async function handleAuth({ event, resolve }) {
	// Auth logic
	return resolve(event);
}

async function handleLogging({ event, resolve }) {
	// Logging logic
	return resolve(event);
}

export const handle = sequence(handleAuth, handleLogging);
```

#### handleFetch

```js
export async function handleFetch({ request, fetch, event }) {
	// Modify server-side fetch calls

	if (request.url.startsWith('https://api.external.com/')) {
		// Use internal URL
		request = new Request(
			request.url.replace('https://api.external.com/', 'http://localhost:9999/'),
			request
		);
	}

	// Add cookie for sibling subdomain
	if (request.url.startsWith('https://api.my-domain.com/')) {
		request.headers.set('cookie', event.request.headers.get('cookie'));
	}

	return fetch(request);
}
```

#### handleValidationError

```js
export function handleValidationError({ event, issues }) {
	// Called when remote function validation fails
	return {
		message: 'Invalid request'
	};
}
```

### Shared Hooks (`hooks.server.js` and `hooks.client.js`)

#### handleError

```js
/// file: hooks.server.js
import * as Sentry from '@sentry/sveltekit';

export async function handleError({ error, event, status, message }) {
	const errorId = crypto.randomUUID();

	Sentry.captureException(error, {
		extra: { event, errorId, status }
	});

	return {
		message: 'Whoops!',
		errorId
	};
}
```

**Type-safe error shape:**

```ts
/// file: src/app.d.ts
declare global {
	namespace App {
		interface Error {
			message: string;
			errorId: string;
		}
	}
}
```

#### init

```js
/// file: hooks.server.js
import * as db from '$lib/server/database';

export async function init() {
	// Runs once when server starts
	await db.connect();
}
```

### Universal Hooks (`src/hooks.js`)

#### reroute

```js
const translated = {
	'/en/about': '/en/about',
	'/de/ueber-uns': '/de/about',
	'/fr/a-propos': '/fr/about'
};

export function reroute({ url }) {
	if (url.pathname in translated) {
		return translated[url.pathname];
	}
}
```

**Async reroute (2.18+):**

```js
export async function reroute({ url, fetch }) {
	const api = new URL('/api/reroute', url);
	const result = await fetch(api).then((r) => r.json());
	return result.pathname;
}
```

#### transport

```js
import { Vector } from '$lib/math';

export const transport = {
	Vector: {
		encode: (value) => value instanceof Vector && [value.x, value.y],
		decode: ([x, y]) => new Vector(x, y)
	}
};
```

---

## 8. Error Handling

### Expected Errors

```js
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const post = await db.getPost(params.slug);

	if (!post) {
		error(404, 'Not found'); // Throws, no need to return
	}

	return { post };
}
```

**With additional properties:**

```js
error(404, {
	message: 'Not found',
	code: 'POST_NOT_FOUND'
});
```

### Error Boundaries

```svelte
<!--- file: +error.svelte --->
<script>
	import { page } from '$app/state';
</script>

<h1>{page.status}: {page.error.message}</h1>
```

**Error boundary hierarchy:**

```
src/routes/
  +error.svelte          # Root error boundary
  blog/
    +error.svelte        # Blog error boundary
    [slug]/
      +error.svelte      # Post error boundary
      +page.svelte
```

### Unexpected Errors

Handled by `handleError` hook:

```js
/// file: hooks.server.js
export async function handleError({ error, event }) {
	console.error('Unexpected error:', error);

	return {
		message: 'Something went wrong',
		errorId: crypto.randomUUID()
	};
}
```

### Fallback Error Page

```html
<!--- file: src/error.html --->
<!DOCTYPE html>
<html>
	<head>
		<title>%sveltekit.error.message%</title>
	</head>
	<body>
		<h1>Error</h1>
		<p>Status: %sveltekit.status%</p>
		<p>%sveltekit.error.message%</p>
	</body>
</html>
```

---

## 10. Navigation & Links

### Link Options (data-sveltekit-\*)

```html
<!-- Preload data on hover -->
<a href="/about" data-sveltekit-preload-data="hover">About</a>

<!-- Preload data on tap/click -->
<a href="/about" data-sveltekit-preload-data="tap">About</a>

<!-- Preload code eagerly -->
<a href="/about" data-sveltekit-preload-code="eager">About</a>

<!-- Preload code when in viewport -->
<a href="/about" data-sveltekit-preload-code="viewport">About</a>

<!-- Full page reload instead of client-side navigation -->
<a href="/path" data-sveltekit-reload>Path</a>

<!-- Replace history instead of push -->
<a href="/path" data-sveltekit-replacestate>Path</a>

<!-- Keep focus after navigation -->
<form data-sveltekit-keepfocus>
	<input type="text" name="query" />
</form>

<!-- Don't scroll to top after navigation -->
<a href="/path" data-sveltekit-noscroll>Path</a>

<!-- Disable options -->
<div data-sveltekit-preload-data="false">
	<!-- Links here won't preload -->
</div>
```

**Important:** Data preloading respects user's data preferences:
- If `navigator.connection.saveData === true`, preloading is disabled
- Honors reduced data usage settings

### Programmatic Preloading

```js
import { preloadData } from '$app/navigation';

// Preload route data
await preloadData('/about');

// Preload with specific URL
await preloadData(new URL('/blog', window.location));
```

**Use cases:**
- Preload before navigation
- Preload on custom events
- Preload based on user behavior

### Programmatic Navigation

```svelte
<script>
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';

	async function navigate() {
		await goto('/dashboard', {
			replaceState: false,
			noScroll: false,
			keepFocus: false,
			invalidateAll: false,
			state: { modal: true }
		});
	}

	function refresh() {
		invalidate('app:data');
		invalidateAll();
	}
</script>
```

### Navigation Lifecycle

```svelte
<script>
	import { beforeNavigate, afterNavigate, onNavigate } from '$app/navigation';

	beforeNavigate(({ from, to, cancel, type }) => {
		// Before navigation starts
		if (hasUnsavedChanges) {
			if (!confirm('Leave page?')) {
				cancel();
			}
		}
	});

	afterNavigate(({ from, to, type }) => {
		// After navigation completes
		console.log('Navigated to:', to.url);
	});

	onNavigate((navigation) => {
		// Runs during navigation
		// Useful for view transitions
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>
```

### Shallow Routing (History-driven UI)

```svelte
<script>
	import { pushState, replaceState } from '$app/navigation';
	import { page } from '$app/state';

	function showModal() {
		pushState('', { showModal: true });
	}
</script>

{#if page.state.showModal}
	<Modal close={() => history.back()} />
{/if}

<button onclick={showModal}>Open Modal</button>
```

**Type-safe page state:**

```ts
/// file: src/app.d.ts
declare global {
	namespace App {
		interface PageState {
			showModal?: boolean;
			selected?: any;
		}
	}
}
```

---

## 10. API Routes (+server.js)

### Basic Endpoint

```js
/// file: +server.js
import { json, error } from '@sveltejs/kit';

export function GET({ url }) {
	const min = Number(url.searchParams.get('min') ?? '0');
	const max = Number(url.searchParams.get('max') ?? '1');

	if (isNaN(min) || isNaN(max)) {
		error(400, 'Invalid parameters');
	}

	const random = min + Math.random() * (max - min);
	return new Response(String(random));
}

export async function POST({ request }) {
	const data = await request.json();
	const result = await processData(data);
	return json(result);
}
```

### All HTTP Methods

```js
export function GET({ request }) {
	/* ... */
}
export function POST({ request }) {
	/* ... */
}
export function PUT({ request }) {
	/* ... */
}
export function PATCH({ request }) {
	/* ... */
}
export function DELETE({ request }) {
	/* ... */
}
export function OPTIONS({ request }) {
	/* ... */
}
export function HEAD({ request }) {
	/* ... */
}

// Catch-all for other methods
export function fallback({ request }) {
	return new Response(`Caught ${request.method}`);
}
```

### Streaming Responses

```js
export function GET() {
	const stream = new ReadableStream({
		start(controller) {
			controller.enqueue('Hello ');
			setTimeout(() => {
				controller.enqueue('world!');
				controller.close();
			}, 1000);
		}
	});

	return new Response(stream);
}
```

### FormData Handling

```js
export async function POST({ request }) {
	const data = await request.formData();
	const file = data.get('file');
	const name = data.get('name');

	// Process file and name
	return json({ success: true });
}
```

### Content Negotiation

`+server.js` and `+page.svelte` can coexist:

- `PUT`/`PATCH`/`DELETE`/`OPTIONS` always go to `+server.js`
- `GET`/`POST`/`HEAD` with `accept: text/html` go to page
- `GET`/`POST`/`HEAD` with other accepts go to `+server.js`

---

## 12. Service Workers

Service workers act as proxy servers for network requests, enabling offline support and performance optimization through precaching.

### Setup

Create `src/service-worker.js` (or `src/service-worker/index.js`). It will be automatically bundled and registered.

**Disable automatic registration:**

```js
/// file: svelte.config.js
export default {
	kit: {
		serviceWorker: {
			register: false
		}
	}
};
```

**Manual registration:**

```js
import { dev } from '$app/environment';

if ('serviceWorker' in navigator) {
	addEventListener('load', function () {
		navigator.serviceWorker.register('./path/to/service-worker.js', {
			type: dev ? 'module' : 'classic'
		});
	});
}
```

### Inside the Service Worker

**$service-worker module provides:**

- `build` - Array of app files
- `files` - Array of files from `static` directory
- `version` - App version string for cache naming
- `base` - Base path from configuration

**Complete caching example:**

```js
/// file: src/service-worker.js
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
/// <reference types="@sveltejs/kit" />

import { build, files, version } from '$service-worker';

const self = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (globalThis.self));

// Create unique cache name
const CACHE = `cache-${version}`;

const ASSETS = [
	...build,  // The app itself
	...files   // Everything in static
];

self.addEventListener('install', (event) => {
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	}

	event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
	}

	event.waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;

	async function respond() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		// Serve build/files from cache
		if (ASSETS.includes(url.pathname)) {
			const response = await cache.match(url.pathname);
			if (response) return response;
		}

		// Try network first, fallback to cache
		try {
			const response = await fetch(event.request);

			if (!(response instanceof Response)) {
				throw new Error('invalid response from fetch');
			}

			if (response.status === 200) {
				cache.put(event.request, response.clone());
			}

			return response;
		} catch (err) {
			const response = await cache.match(event.request);
			if (response) return response;

			throw err;
		}
	}

	event.respondWith(respond());
});
```

### Development Notes

- Service worker bundled for production only
- Development requires browsers with [module service worker support](https://web.dev/es-modules-in-sw)
- `build` and `prerendered` arrays are empty in development
- Must use `type: dev ? 'module' : 'classic'` for manual registration

### Caching Strategies

**Cache-first (for static assets):**
```js
if (ASSETS.includes(url.pathname)) {
	const cached = await cache.match(url.pathname);
	if (cached) return cached;
}
```

**Network-first with cache fallback (for dynamic content):**
```js
try {
	const response = await fetch(event.request);
	cache.put(event.request, response.clone());
	return response;
} catch {
	return await cache.match(event.request);
}
```

### Important Warnings

- Be careful when caching - stale data can be worse than no data
- Browsers empty caches if they get too full
- Don't cache large assets like videos without consideration
- Service worker updates when any file changes

### Alternative Solutions

- [Vite PWA plugin](https://vite-pwa-org.netlify.app/frameworks/sveltekit.html) for Workbox users
- [Workbox](https://web.dev/learn/pwa/workbox) library for complex PWA requirements

---

## 13. Advanced Patterns

### Using getRequestEvent

```js
/// file: $lib/server/auth.js
import { redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';

export function requireLogin() {
	const { locals, url } = getRequestEvent();

	if (!locals.user) {
		redirect(307, `/login?redirectTo=${url.pathname}`);
	}

	return locals.user;
}
```

```js
/// file: +page.server.js
import { requireLogin } from '$lib/server/auth';

export function load() {
	const user = requireLogin();
	return { message: `Hello ${user.name}` };
}
```

### Parallel Loading

```js
// SvelteKit runs all loads concurrently
// Layout load and page load run in parallel
// Multiple server loads are batched into single request
```

### Auth Patterns

**In hooks (recommended for multiple routes):**

```js
/// file: hooks.server.js
export async function handle({ event, resolve }) {
	event.locals.user = await getUser(event.cookies.get('session'));

	if (event.url.pathname.startsWith('/admin')) {
		if (!event.locals.user?.isAdmin) {
			return new Response('Unauthorized', { status: 401 });
		}
	}

	return resolve(event);
}
```

**In page load (for specific route):**

```js
/// file: +page.server.js
export async function load({ locals }) {
	if (!locals.user) {
		error(401, 'Not logged in');
	}

	if (!locals.user.isAdmin) {
		error(403, 'Not an admin');
	}

	return { user: locals.user };
}
```

### Performance Optimization

**Code splitting with dynamic imports:**

```js
async function loadHeavyLibrary() {
	const { method } = await import('heavy-library');
	return method();
}
```

**Selective prerendering:**

```js
export const prerender = 'auto'; // Prerender but keep in manifest
```

**Link preloading:**

```html
<body data-sveltekit-preload-data="hover"></body>
```

**Streaming slow data:**

```js
export async function load() {
	return {
		fast: await fastQuery(),
		slow: slowQuery() // Streams in
	};
}
```

---

## 12. Adapters & Deployment

### Adapter Configuration

```js
/// file: svelte.config.js
import adapter from '@sveltejs/adapter-auto';

export default {
	kit: {
		adapter: adapter()
	}
};
```

### Common Adapters

**adapter-auto** - Auto-detects platform:

```js
import adapter from '@sveltejs/adapter-auto';
```

**adapter-node** - Node.js server:

```js
import adapter from '@sveltejs/adapter-node';

export default {
	kit: {
		adapter: adapter({
			out: 'build',
			precompress: true,  // gzip/brotli precompression
			envPrefix: ''       // Custom environment variable prefix
		})
	}
};
```

**Environment Variables:**

- `PORT` - Port to listen on (default: 3000)
- `HOST` - Host to bind to (default: 0.0.0.0)
- `SOCKET_PATH` - Unix socket path (overrides PORT/HOST)
- `ORIGIN` - Full origin URL (e.g., https://example.com)
- `PROTOCOL_HEADER` - Header containing protocol (e.g., x-forwarded-proto)
- `HOST_HEADER` - Header containing host (e.g., x-forwarded-host)
- `PORT_HEADER` - Header containing port (e.g., x-forwarded-port)
- `ADDRESS_HEADER` - Header containing client IP (e.g., True-Client-IP)
- `XFF_DEPTH` - Number of trusted proxies for X-Forwarded-For
- `BODY_SIZE_LIMIT` - Max request body size (default: 512KB, e.g., "50mb" or Infinity)
- `SHUTDOWN_TIMEOUT` - Graceful shutdown timeout in seconds (default: 30)
- `IDLE_TIMEOUT` - Socket activation idle timeout in seconds

**Production setup:**

```bash
npm install dotenv
node -r dotenv/config build

# Or Node 20.6+:
node --env-file=.env build
```

**adapter-static** - Static site:

```js
import adapter from '@sveltejs/adapter-static';

export default {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '200.html', // For SPAs (or 404.html, index.html)
			precompress: false,    // Generate .gz and .br files
			strict: true           // Fail build if any pages aren't prerendered
		})
	}
};
```

**Options:**
- `pages` - Directory for prerendered pages
- `assets` - Directory for static assets (usually same as pages)
- `fallback` - SPA fallback page (200.html, 404.html, index.html)
- `precompress` - Create gzip/brotli compressed files
- `strict` - Enforce all pages prerendered or fallback set

**Zero-config platforms:** Vercel (omit options for automatic config)

**SPA mode:**
```js
/// file: src/routes/+layout.js
export const ssr = false;  // Disable SSR
export const prerender = true;  // Prerender what you can
```

**adapter-vercel**, **adapter-netlify**, **adapter-cloudflare**:

```js
import adapter from '@sveltejs/adapter-vercel';

export default {
	kit: {
		adapter: adapter({
			edge: false, // Use edge functions
			split: false // Code splitting
		})
	}
};
```

### Building

```bash
npm run build        # Create production build
npm run preview      # Preview production build
```

---

## 15. Environment Variables

SvelteKit provides four modules for environment variables, each with different characteristics:

### Static vs Dynamic

**Static** (`$env/static/*`):
- Replaced at build time
- Better performance (values inlined)
- Cannot change at runtime
- Use for values known at build time

**Dynamic** (`$env/dynamic/*`):
- Read at runtime
- Can change without rebuild
- Slightly slower (runtime lookup)
- Use for values that may change between deployments

### Public vs Private

**Public** (`$env/*/public`):
- Available in browser and server
- Must be prefixed (default: `PUBLIC_`)
- Visible to users (inspect source code)
- Use for non-sensitive config

**Private** (`$env/*/private`):
- **Server-only**
- Any variable without public prefix
- Never sent to client
- Use for API keys, secrets, database URLs

### The Four Modules

#### $env/static/private

```js
/// file: src/routes/+page.server.js
import { API_KEY } from '$env/static/private';

export async function load({ fetch }) {
	const res = await fetch('https://api.example.com', {
		headers: { Authorization: `Bearer ${API_KEY}` }
	});
	return { data: await res.json() };
}
```

**Characteristics:**
- Build-time replacement
- Server-only
- Best performance
- Use for secrets that don't change between builds

#### $env/static/public

```js
/// file: src/routes/+page.svelte
import { PUBLIC_API_URL } from '$env/static/public';

fetch(`${PUBLIC_API_URL}/posts`);
```

**Characteristics:**
- Build-time replacement
- Available everywhere
- Visible in client code
- Use for public config URLs

#### $env/dynamic/private

```js
/// file: src/routes/+page.server.js
import { env } from '$env/dynamic/private';

// Runtime value
const dbUrl = env.DATABASE_URL;
```

**Characteristics:**
- Runtime lookup
- Server-only
- Can change without rebuild
- **Cannot be used during prerendering** (will error in SvelteKit 2)

#### $env/dynamic/public

```js
/// file: src/lib/utils.js
import { env } from '$env/dynamic/public';

// Available in browser and server
const apiUrl = env.PUBLIC_API_URL;
```

**Characteristics:**
- Runtime lookup
- Available everywhere
- Fetched from `/_app/env.js` in browser
- Use for values that change between deployments

### Loading Environment Variables

**Development:**

```bash
# .env file (auto-loaded by Vite)
DATABASE_URL=postgresql://localhost/mydb
PUBLIC_API_URL=https://api.example.com
```

**Production (adapter-node):**

```bash
# Option 1: Using dotenv
npm install dotenv
node -r dotenv/config build

# Option 2: Node 20.6+ built-in
node --env-file=.env build

# Option 3: System environment
export DATABASE_URL=postgresql://prod/mydb
node build
```

### Naming Conventions

```bash
# Private (server-only)
DATABASE_URL=...
API_SECRET=...
STRIPE_KEY=...

# Public (visible to browser)
PUBLIC_API_URL=...
PUBLIC_ANALYTICS_ID=...
PUBLIC_FEATURE_FLAG=...
```

### Best Practices

```js
// ✓ GOOD: Use static for build-time values
import { PUBLIC_API_URL } from '$env/static/public';

// ✓ GOOD: Use dynamic for runtime values
import { env } from '$env/dynamic/private';
const secret = env.JWT_SECRET;

// ❌ BAD: Don't use dynamic during prerendering
export const prerender = true;
export async function load() {
	const { env } = await import('$env/dynamic/private'); // ERROR!
}

// ❌ BAD: Don't expose secrets publicly
import { API_KEY } from '$env/static/public'; // Visible in browser!
```

### Prefixes

Configure public prefix in `svelte.config.js`:

```js
export default {
	kit: {
		env: {
			publicPrefix: 'PUB_'  // Default is 'PUBLIC_'
		}
	}
};
```

### Type Safety

```ts
/// file: src/app.d.ts
declare global {
	namespace App {
		interface Platform {
			env: {
				DATABASE_URL: string;
				API_KEY: string;
			}
		}
	}
}
```

---

## 16. CLI Commands

SvelteKit uses Vite's CLI with some additional commands:

### Development

```bash
vite dev
# or
npm run dev
```

**Options:**
- `--port 3000` - Specify port
- `--host` - Expose to network
- `--open` - Auto-open browser

### Build

```bash
vite build
# or
npm run build
```

**Process:**
1. Creates production build
2. Runs prerendering
3. Adapter creates output

**Check if building:**

```js
import { building } from '$app/environment';

if (building) {
	// Code only runs during build
}
```

### Preview

```bash
vite preview
# or
npm run preview
```

**Purpose:**
- Test production build locally
- Verify adapter output
- **Required for accurate performance testing**

### Type Generation

```bash
svelte-kit sync
```

**What it does:**
- Creates `tsconfig.json`
- Generates `./$types` files
- Updates type definitions

**When to run:**
- Automatically runs as `prepare` script
- After adding new routes
- When types seem out of sync

### Package Scripts

```json
{
	"scripts": {
		"dev": "vite dev",
		"build": "vite build",
		"preview": "vite preview",
		"check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
		"check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
		"lint": "prettier --check . && eslint .",
		"format": "prettier --write ."
	}
}
```

---

## 17. SEO

### Out of the Box

#### Server-Side Rendering

SSR is enabled by default and critical for SEO:

```js
// ✓ Default - good for SEO
export const ssr = true;

// ❌ Avoid unless necessary
export const ssr = false;
```

#### Performance Matters

Core Web Vitals impact search ranking:
- Use [PageSpeed Insights](https://pagespeed.web.dev/)
- Leverage SvelteKit's code-splitting
- Optimize images with `@sveltejs/enhanced-img`
- See [Performance section](#18-performance-optimization)

#### URL Normalization

SvelteKit auto-redirects trailing slashes:

```js
/// file: +page.js
export const trailingSlash = 'never';  // /about (default)
export const trailingSlash = 'always'; // /about/
export const trailingSlash = 'ignore'; // No redirect
```

**Importance:** Duplicate URLs harm SEO.

### Manual Setup

#### Title and Meta Tags

```svelte
<!--- file: src/routes/+layout.svelte --->
<script>
	import { page } from '$app/state';

	// Get SEO data from page data
	let { data, children } = $props();
</script>

<svelte:head>
	<title>{data.title || 'My Site'}</title>
	<meta name="description" content={data.description || 'Default description'} />

	<!-- Open Graph -->
	<meta property="og:title" content={data.title} />
	<meta property="og:description" content={data.description} />
	<meta property="og:image" content={data.image} />
	<meta property="og:url" content={page.url} />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.title} />
	<meta name="twitter:description" content={data.description} />
</svelte:head>

{@render children()}
```

```js
/// file: src/routes/blog/[slug]/+page.server.js
export async function load({ params }) {
	const post = await getPost(params.slug);

	return {
		post,
		title: post.title,
		description: post.excerpt,
		image: post.coverImage
	};
}
```

#### Sitemaps

```js
/// file: src/routes/sitemap.xml/+server.js
export async function GET() {
	const posts = await getAllPosts();

	const sitemap = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset
	xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
	xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
	xmlns:xhtml="https://www.w3.org/1999/xhtml"
	xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
	xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
>
	<url>
		<loc>https://example.com</loc>
		<changefreq>daily</changefreq>
		<priority>1.0</priority>
	</url>
	${posts.map(post => `
	<url>
		<loc>https://example.com/blog/${post.slug}</loc>
		<lastmod>${post.updatedAt}</lastmod>
		<changefreq>weekly</changefreq>
		<priority>0.8</priority>
	</url>
	`).join('')}
</urlset>`.trim();

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
}
```

#### AMP Support

```js
/// file: svelte.config.js
export default {
	kit: {
		// Inline all styles (required for AMP)
		inlineStyleThreshold: Infinity
	}
};
```

```js
/// file: src/routes/+layout.server.js
export const csr = false; // Disable client-side JS
```

```html
<!-- file: src/app.html -->
<html amp>
	<!-- ... -->
</html>
```

```js
/// file: src/hooks.server.js
import * as amp from '@sveltejs/amp';

export async function handle({ event, resolve }) {
	let buffer = '';
	return await resolve(event, {
		transformPageChunk: ({ html, done }) => {
			buffer += html;
			if (done) return amp.transform(buffer);
		}
	});
}
```

### SEO Checklist

- ✓ Use SSR for all public pages
- ✓ Unique `<title>` and `<meta description>` per page
- ✓ Implement sitemaps
- ✓ Optimize Core Web Vitals
- ✓ Use semantic HTML
- ✓ Add structured data (JSON-LD)
- ✓ Implement proper heading hierarchy (h1 → h6)
- ✓ Add alt text to images
- ✓ Configure trailing slash handling
- ✓ Test with PageSpeed Insights
- ✓ Verify in Google Search Console

---

## 18. Performance Optimization

### Built-in Optimizations

SvelteKit provides these automatically:

- **Code-splitting** - Only load code for current page
- **Asset preloading** - Prevent file request waterfalls
- **File hashing** - Enable permanent caching
- **Request coalescing** - Batch server loads into single request
- **Parallel loading** - Universal loads fetch simultaneously
- **Data inlining** - SSR fetch responses embedded in HTML
- **Conservative invalidation** - Rerun loads only when needed
- **Prerendering** - Static pages served instantly
- **Link preloading** - Anticipate navigation needs

### Diagnosing Performance

**Tools:**
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- Browser DevTools (Network, Performance tabs)

**Important:** Always test in `preview` mode, not `dev`:

```bash
npm run build
npm run preview
```

### Image Optimization

```bash
npm i -D @sveltejs/enhanced-img
```

```js
/// file: svelte.config.js
import { enhancedImages } from '@sveltejs/enhanced-img';

export default {
	kit: { /* ... */ },
	plugins: [enhancedImages()]
};
```

```svelte
<script>
	import { Image } from '@sveltejs/enhanced-img';
	import myImage from '$lib/assets/image.jpg';
</script>

<Image src={myImage} alt="Description" />
```

**Benefits:**
- Automatic format conversion (WebP, AVIF)
- Responsive srcset generation
- Lazy loading
- Size optimization

### Video Optimization

```html
<!-- Compress with Handbrake, use web formats -->
<video preload="none">
	<source src="video.webm" type="video/webm" />
	<source src="video.mp4" type="video/mp4" />
</video>
```

**Tips:**
- Use `preload="none"` below the fold
- Strip audio from muted videos
- Convert to WebM/MP4
- Consider lazy-loading

### Font Optimization

**Preload critical fonts:**

```js
/// file: src/hooks.server.js
export async function handle({ event, resolve }) {
	return await resolve(event, {
		preload: ({ type, path }) => {
			if (type === 'font' && path.includes('critical')) {
				return true;
			}
		}
	});
}
```

**Subset fonts:**
- Use [Google Fonts](https://fonts.google.com/) with `&text=` parameter
- Or subset locally with tools like `glyphhanger`

### Code Size Reduction

**Use latest Svelte:**

```bash
npm install svelte@latest
```

**Analyze bundle:**

```bash
npm i -D rollup-plugin-visualizer
```

```js
/// file: vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';

export default {
	plugins: [
		visualizer({ open: true })
	]
};
```

**Lazy load when appropriate:**

```svelte
<script>
	let HeavyComponent;

	async function loadComponent() {
		HeavyComponent = (await import('$lib/HeavyComponent.svelte')).default;
	}
</script>

<button onclick={loadComponent}>Load</button>

{#if HeavyComponent}
	<HeavyComponent />
{/if}
```

**Use Partytown for third-party scripts:**

```bash
npm i @builder.io/partytown
```

```svelte
<script>
	import { partytownSnippet } from '@builder.io/partytown/integration';
</script>

<svelte:head>
	{@html partytownSnippet()}
	<script type="text/partytown" src="https://analytics.example.com/script.js"></script>
</svelte:head>
```

### Navigation Performance

**Preload aggressively:**

```html
<body data-sveltekit-preload-data="hover">
	%sveltekit.body%
</body>
```

**Stream slow data:**

```js
export async function load() {
	return {
		fast: await fastQuery(),
		slow: slowQuery() // Streams after initial render
	};
}
```

### Preventing Waterfalls

**❌ Bad - Sequential requests:**

```js
// Universal load - runs in browser
export async function load({ fetch, parent }) {
	const parentData = await parent(); // Request 1
	const data = await fetch(`/api/data`); // Request 2 (waits for 1)
	return { data };
}
```

**✓ Good - Parallel requests:**

```js
// Server load - runs on server (closer to database)
export async function load({ fetch }) {
	const [user, posts] = await Promise.all([
		fetch('/api/user'),
		fetch('/api/posts')
	]);

	return { user, posts };
}
```

**Use database joins:**

```js
// ❌ N+1 problem
const users = await db.query('SELECT * FROM users');
for (const user of users) {
	user.posts = await db.query('SELECT * FROM posts WHERE user_id = ?', user.id);
}

// ✓ Single query
const users = await db.query(`
	SELECT users.*, posts.*
	FROM users
	LEFT JOIN posts ON posts.user_id = users.id
`);
```

### Hosting Considerations

- **Edge deployment** - Serve from nearest server
- **HTTP/2** - Parallel file loading
- **CDN** - Cache static assets
- **Co-location** - Frontend + backend in same datacenter

---

## 19. Observability & Instrumentation

**Available since SvelteKit 2.31** - Experimental feature for OpenTelemetry tracing.

### Enabling Observability

```js
/// file: svelte.config.js
export default {
	kit: {
		experimental: {
			tracing: {
				server: true
			},
			instrumentation: {
				server: true
			}
		}
	}
};
```

### What Gets Traced

- `handle` hooks and `sequence` functions
- Server `load` functions
- Universal `load` functions (when run on server)
- Form actions
- Remote functions

### Setup (Jaeger Example)

**Install dependencies:**

```bash
npm i @opentelemetry/sdk-node \
      @opentelemetry/auto-instrumentations-node \
      @opentelemetry/exporter-trace-otlp-proto \
      import-in-the-middle
```

**Create instrumentation file:**

```js
/// file: src/instrumentation.server.js
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { createAddHookMessageChannel } from 'import-in-the-middle';
import { register } from 'node:module';

const { registerOptions } = createAddHookMessageChannel();
register('import-in-the-middle/hook.mjs', import.meta.url, registerOptions);

const sdk = new NodeSDK({
	serviceName: 'my-sveltekit-app',
	traceExporter: new OTLPTraceExporter(),
	instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start();
```

### Augmenting Built-in Tracing

**Access spans via event:**

```js
/// file: $lib/authenticate.js
import { getRequestEvent } from '$app/server';

async function authenticate() {
	const user = await getAuthenticatedUser();
	const event = getRequestEvent();

	// Annotate root span
	event.tracing.root.setAttribute('userId', user.id);

	// Annotate current span
	event.tracing.current.setAttribute('userRole', user.role);
}
```

**Properties:**
- `event.tracing.root` - Root `handle` span
- `event.tracing.current` - Current context span (handle, load, action, or remote function)

### Viewing Traces

1. Start Jaeger locally:
```bash
docker run -d --name jaeger \
  -p 16686:16686 \
  -p 4318:4318 \
  jaegertracing/all-in-one:latest
```

2. View at [localhost:16686](http://localhost:16686)

### Performance Considerations

**Warning:** Tracing has overhead. Consider:
- Enable only in development/preview
- Sample traces in production (not every request)
- Use conditional logic:

```js
const shouldTrace = process.env.NODE_ENV !== 'production' || Math.random() < 0.01;

if (shouldTrace) {
	// Setup tracing
}
```

### @opentelemetry/api

SvelteKit uses `@opentelemetry/api` as an optional peer dependency. If you see errors about missing `@opentelemetry/api`, you may need to install it:

```bash
npm i @opentelemetry/api
```

---

## 20. Configuration Reference

### Complete svelte.config.js Options

```js
/// file: svelte.config.js
/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Svelte compiler options
	compilerOptions: {
		preserveComments: false,
		preserveWhitespace: false,
		experimental: {
			async: false  // Enable await in components
		}
	},

	// SvelteKit options
	kit: {
		// Adapter
		adapter: adapter(),

		// Path aliases
		alias: {
			$components: 'src/lib/components',
			$utils: 'src/lib/utils'
		},

		// App directory name
		appDir: '_app',

		// Content Security Policy
		csp: {
			mode: 'auto',  // or 'hash' or 'nonce'
			directives: {
				'script-src': ['self']
			}
		},

		// For embedding in iframes
		embedded: false,

		// Environment variables
		env: {
			dir: process.cwd(),
			publicPrefix: 'PUBLIC_'
		},

		// File locations
		files: {
			assets: 'static',
			hooks: {
				client: 'src/hooks.client',
				server: 'src/hooks.server',
				universal: 'src/hooks'
			},
			lib: 'src/lib',
			params: 'src/params',
			routes: 'src/routes',
			serviceWorker: 'src/service-worker',
			appTemplate: 'src/app.html',
			errorTemplate: 'src/error.html'
		},

		// Inline styles threshold (for AMP)
		inlineStyleThreshold: 0,

		// Module extensions
		moduleExtensions: ['.js', '.ts'],

		// Output directory
		outDir: '.svelte-kit',

		// Output configuration
		output: {
			preloadStrategy: 'modulepreload' // or 'preload-js' or 'preload-mjs'
		},

		// Paths
		paths: {
			assets: '',
			base: '',
			relative: true
		},

		// Prerendering
		prerender: {
			concurrency: 1,
			crawl: true,
			enabled: true,
			entries: ['*'],
			handleHttpError: 'warn', // or 'fail' or 'ignore' or custom function
			handleMissingId: 'warn',
			origin: 'http://sveltekit-prerender'
		},

		// Service worker
		serviceWorker: {
			register: true,
			files: (filepath) => !/\.DS_Store/.test(filepath)
		},

		// TypeScript
		typescript: {
			config: (config) => config
		},

		// Version
		version: {
			name: Date.now().toString(),
			pollInterval: 0
		},

		// Experimental features
		experimental: {
			remoteFunctions: false,
			tracing: {
				server: false
			},
			instrumentation: {
				server: false
			}
		}
	}
};

export default config;
```

### Key Configuration Options

#### adapter

```js
import adapter from '@sveltejs/adapter-auto';

kit: {
	adapter: adapter()
}
```

#### alias

```js
kit: {
	alias: {
		'$components': 'src/lib/components',
		'$ui': 'src/lib/ui',
		'@models': 'src/lib/server/models'
	}
}
```

#### csp

```js
kit: {
	csp: {
		mode: 'hash',  // Generate hashes for inline scripts/styles
		directives: {
			'script-src': ['self', 'https://cdn.example.com'],
			'style-src': ['self', 'unsafe-inline']
		}
	}
}
```

#### inlineStyleThreshold

```js
kit: {
	inlineStyleThreshold: Infinity  // Inline all styles (required for AMP)
}
```

#### paths.base

```js
kit: {
	paths: {
		base: '/my-app'  // App served from /my-app instead of /
	}
}
```

#### paths.relative

```js
kit: {
	paths: {
		relative: true  // Use relative paths (default in v2)
	}
}
```

#### prerender.entries

```js
kit: {
	prerender: {
		entries: ['*', '/custom-page', '/sitemap.xml']
	}
}
```

#### version.pollInterval

```js
kit: {
	version: {
		pollInterval: 60000  // Check for new version every 60s
	}
}
```

---

## 21. Important Conventions

### DO's

✓ Use `<a>` elements for navigation (not `<Link>`)
✓ Use `data` prop name in components (not `body`)
✓ Use `result` variable name (not `response`)
✓ Use logger in server code (not console.log)
✓ Return from load functions (not side effects)
✓ Use cookies + database for user state
✓ Use `error()` and `redirect()` (they throw automatically)
✓ Use camelCase for variables
✓ Use `err` in catch blocks

### DON'T's

✗ Don't throw `error()` or `redirect()` (they throw automatically in 2.0+)
✗ Don't use shared state on server
✗ Don't use `console.log` in server code
✗ Don't use `$:` reactive statements (Svelte 4 syntax)
✗ Don't use `export let` (Svelte 4 syntax)
✗ Don't access `url.hash` in load (not available on server)
✗ Don't use `url.searchParams` during prerendering

### Svelte 5 Runes

```svelte
<script>
	// State
	let count = $state(0);

	// Derived
	let doubled = $derived(count * 2);

	// Effects
	$effect(() => {
		console.log('Count:', count);
	});

	// Props
	let { name, age = 18 } = $props();

	// Bindable props (two-way binding)
	let { value = $bindable('') } = $props();
</script>
```

---

## 14. Type Safety

### Generated Types

```svelte
<!--- file: +page.svelte --->
<script>
	/** @type {import('./$types').PageProps} */
	let { data, form } = $props();
</script>
```

```js
/// file: +page.js
/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	// ...
}
```

```js
/// file: +page.server.js
/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	// ...
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
	// ...
};
```

### App Interfaces

```ts
/// file: src/app.d.ts
declare global {
	namespace App {
		interface Error {
			message: string;
			errorId?: string;
		}

		interface Locals {
			user?: {
				name: string;
				isAdmin: boolean;
			};
		}

		interface PageData {
			// Merged return types from all load functions
		}

		interface PageState {
			showModal?: boolean;
		}

		interface Platform {
			// Platform-specific (Cloudflare, etc.)
		}
	}
}

export {};
```

---

## 15. Web Standards

SvelteKit uses standard web APIs:

**Fetch APIs:**

- `fetch()` - Enhanced in load functions
- `Request` - Available as `event.request`
- `Response` - Return from endpoints
- `Headers` - `request.headers`, `response.headers`
- `FormData` - From `request.formData()`

**URL APIs:**

- `URL` - `event.url` in load/hooks
- `URLSearchParams` - `url.searchParams`

**Stream APIs:**

- `ReadableStream`
- `WritableStream`
- `TransformStream`

**Web Crypto:**

- `crypto.randomUUID()`
- `crypto.getRandomValues()`

---

## 16. Common Pitfalls

### 1. Shared State on Server

```js
// ❌ DANGEROUS
let user; // Shared across all requests!

// ✓ SAFE
export async function load({ cookies }) {
	return { user: await getUser(cookies) };
}
```

### 2. Side Effects in Load

```js
// ❌ BAD
export async function load() {
	store.set(data); // Side effect
}

// ✓ GOOD
export async function load() {
	return { data }; // Return data
}
```

### 3. Not Using $derived

```svelte
<script>
	let { data } = $props();

	// ❌ Won't update on navigation
	const count = data.items.length;

	// ✓ Reactive
	let count = $derived(data.items.length);
</script>
```

### 4. Forgetting await parent()

```js
// ❌ Waterfall
const parentData = await parent();
const data = await getData();

// ✓ Parallel
const data = await getData();
const parentData = await parent();
```

### 5. Wrong Load Type

```js
// If you need cookies, use .server.js
// If you need non-serializable data, use .js
```

### 6. Preloading Everything

```html
<!-- ❌ Too aggressive -->
<a data-sveltekit-preload-code="eager">
	<!-- ✓ More conservative -->
	<body data-sveltekit-preload-data="hover"></body
></a>
```

### 7. Missing Error Boundaries

```
src/routes/
  +error.svelte  ← Always have this!
  blog/
    +error.svelte  ← Consider this too
```

---

## 17. Best Practices

### Performance

- Use streaming for slow data
- Preload critical routes
- Optimize images with `@sveltejs/enhanced-img`
- Use edge functions where appropriate
- Minimize third-party scripts
- Use HTTP/2

### Security

- Use server load for sensitive operations
- Validate all user input (Zod, Valibot)
- Use CSRF protection (built into form actions)
- Set secure cookie options
- Use CSP headers

### SEO

- Use SSR by default (`ssr = true`)
- Implement proper meta tags
- Use semantic HTML
- Provide alt text
- Use proper heading hierarchy

### Accessibility

- Use semantic HTML
- Provide ARIA labels where needed
- Test with keyboard navigation
- Use `data-sveltekit-keepfocus` sparingly
- Test with screen readers

### Code Organization

- Use `$lib` for shared code
- Keep `$lib/server` for server-only code
- Colocate components with routes when route-specific
- Extract reusable load functions
- Use consistent naming conventions

---

## Quick Reference: When to Use What

| Need                    | Use                                      |
| ----------------------- | ---------------------------------------- |
| Server-only code        | `+page.server.js` or `$lib/server/`      |
| Universal code          | `+page.js`                               |
| Database queries        | `+page.server.js`                        |
| Public API calls        | `+page.js` (or `.server.js` for caching) |
| User authentication     | `hooks.server.js` + `locals`             |
| Form submission         | Form actions in `+page.server.js`        |
| API endpoint            | `+server.js`                             |
| Shared layout           | `+layout.svelte`                         |
| Error handling          | `+error.svelte`                          |
| Route groups            | `(group)` folders                        |
| Dynamic routes          | `[param]` folders                        |
| Client-side navigation  | `<a>` tags (automatic)                   |
| Programmatic navigation | `goto()` from `$app/navigation`          |
| Page state              | `page` from `$app/state`                 |
| Reactivity              | `$state`, `$derived`, `$effect`          |
| Props                   | `let { prop } = $props()`                |

---

## 26. Migration Guide (v1 to v2)

### Overview

Upgrade to the latest 1.x version first to see deprecation warnings. Then upgrade to Svelte 4 before moving to SvelteKit 2.

```bash
npx sv migrate sveltekit-2  # Auto-migrates many changes
```

### Breaking Changes

#### 1. error() and redirect() No Longer Thrown

**Before (v1):**
```js
import { error, redirect } from '@sveltejs/kit';

throw error(500, 'something went wrong');
throw redirect(303, '/login');
```

**After (v2):**
```js
import { error, redirect } from '@sveltejs/kit';

error(500, 'something went wrong');  // Just call, don't throw
redirect(303, '/login');
```

**Distinguishing from unexpected errors:**

```js
import { isHttpError, isRedirect } from '@sveltejs/kit';

try {
	// Some code
} catch (e) {
	if (isHttpError(e)) {
		// Expected error
	} else if (isRedirect(e)) {
		// Redirect
	} else {
		// Unexpected error
	}
}
```

#### 2. path Required for Cookies

**Before (v1):**
```js
export function load({ cookies }) {
	cookies.set(name, value);
}
```

**After (v2):**
```js
export function load({ cookies }) {
	cookies.set(name, value, { path: '/' });  // path required
	cookies.delete(name, { path: '/' });
	cookies.serialize(name, value, { path: '/' });
}
```

**Common paths:**
- `{ path: '/' }` - Entire domain (most common)
- `{ path: '' }` - Current path
- `{ path: '.' }` - Current directory
- `{ path: '/admin' }` - Specific path

#### 3. Top-level Promises No Longer Awaited

**Before (v1):**
```js
export function load({ fetch }) {
	// Top-level promises auto-awaited
	const a = fetch(url1).then(r => r.json());
	const b = fetch(url2).then(r => r.json());
	return { a, b };
}
```

**After (v2):**
```js
// Single promise
export async function load({ fetch }) {
	const response = await fetch(url).then(r => r.json());
	return { response };
}

// Multiple promises
export async function load({ fetch }) {
	const [a, b] = await Promise.all([
		fetch(url1).then(r => r.json()),
		fetch(url2).then(r => r.json())
	]);
	return { a, b };
}
```

#### 4. goto() Changes

**No longer accepts external URLs:**

```js
// ❌ Before
goto('https://example.com');

// ✓ After
window.location.href = 'https://example.com';
```

**state parameter changed:**

```js
goto('/path', {
	state: { modal: true }  // Sets $page.state (must match App.PageState)
});
```

#### 5. Paths Are Relative by Default

In v2, `paths.relative` defaults to `true`.

**Impact:**
- `base` and `assets` from `$app/paths` are now relative by default
- `%sveltekit.assets%` in `app.html` is relative
- Set `paths.relative: false` for absolute paths

```js
/// file: svelte.config.js
export default {
	kit: {
		paths: {
			relative: false  // Use absolute paths
		}
	}
};
```

#### 6. Server Fetch Tracking Removed

`dangerZone.trackServerFetches` is removed (security risk).

**If you were using it:**
```js
// ❌ Before
export default {
	kit: {
		dangerZone: {
			trackServerFetches: true
		}
	}
};

// ✓ After - explicitly track with depends()
export async function load({ fetch, depends }) {
	depends('app:user-data');
	const res = await fetch('/api/user');
	return await res.json();
}
```

#### 7. preloadCode Arguments Must Be Prefixed with base

```js
import { preloadCode } from '$app/navigation';
import { base } from '$app/paths';

// ❌ Before
preloadCode('/about', '/contact');

// ✓ After
preloadCode(`${base}/about`);  // Single argument, with base prefix
```

#### 8. resolvePath Replaced with resolveRoute

```js
// ❌ Before
import { resolvePath } from '@sveltejs/kit';
import { base } from '$app/paths';

const path = base + resolvePath('/blog/[slug]', { slug });

// ✓ After
import { resolveRoute } from '$app/paths';

const path = resolveRoute('/blog/[slug]', { slug });
```

#### 9. Improved Error Handling

`handleError` now receives `status` and `message`:

```js
/// file: src/hooks.server.js
export async function handleError({ error, event, status, message }) {
	// status: 500 for unhandled errors, 404 for missing routes
	// message: Safe message (not error.message which may contain secrets)

	return {
		message: 'Something went wrong',
		code: error?.code
	};
}
```

#### 10. Dynamic Environment Variables During Prerendering

**No longer works:**

```js
export const prerender = true;

export async function load() {
	const { env } = await import('$env/dynamic/private');  // ❌ ERROR
	return { value: env.SOME_VALUE };
}
```

**Solution - use static:**

```js
export const prerender = true;

export async function load() {
	const { SOME_VALUE } = await import('$env/static/private');
	return { value: SOME_VALUE };
}
```

#### 11. use:enhance Callback Changes

```js
// ❌ Before
use:enhance={({ form, data }) => {
	// ...
}}

// ✓ After
use:enhance={({ formElement, formData }) => {
	// ...
}}
```

#### 12. File Input Forms Must Use multipart/form-data

```html
<!-- ❌ Before (worked but shouldn't have) -->
<form use:enhance>
	<input type="file" name="avatar" />
</form>

<!-- ✓ After (required) -->
<form use:enhance enctype="multipart/form-data">
	<input type="file" name="avatar" />
</form>
```

#### 13. tsconfig.json Stricter

**Must not use `paths` or `baseUrl`:**

```json
{
	"compilerOptions": {
		"baseUrl": ".",
		"paths": {
			"$lib": ["src/lib"]
		}
	}
}
```

**Use `alias` in svelte.config.js instead:**

```js
export default {
	kit: {
		alias: {
			$lib: 'src/lib'
		}
	}
};
```

#### 14. vitePreprocess Import Changed

```js
// ❌ Before
import { vitePreprocess } from '@sveltejs/kit/vite';

// ✓ After
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
```

### Dependency Requirements

**Update package.json:**

```json
{
	"devDependencies": {
		"@sveltejs/adapter-auto": "^3.0.0",
		"@sveltejs/kit": "^2.0.0",
		"@sveltejs/vite-plugin-svelte": "^3.0.0",
		"svelte": "^4.0.0",
		"vite": "^5.0.0",
		"typescript": "^5.0.0"
	}
}
```

**Specific adapters:**
- `@sveltejs/adapter-cloudflare@3`
- `@sveltejs/adapter-cloudflare-workers@2`
- `@sveltejs/adapter-netlify@3`
- `@sveltejs/adapter-node@2`
- `@sveltejs/adapter-static@3`
- `@sveltejs/adapter-vercel@4`

### TypeScript Changes

**Generated tsconfig.json now uses:**

```json
{
	"compilerOptions": {
		"moduleResolution": "bundler",
		"verbatimModuleSyntax": true
	}
}
```

**Remove deprecated flags:**
```json
{
	"compilerOptions": {
		"importsNotUsedAsValues": "...",  // Remove
		"preserveValueImports": true      // Remove
	}
}
```

### SvelteKit 2.12+ Changes

#### $app/stores Deprecated

**Migrating from stores to state:**

```svelte
<!-- ❌ Before -->
<script>
	import { page } from '$app/stores';
</script>

{$page.data}

<!-- ✓ After -->
<script>
	import { page } from '$app/state';
</script>

{page.data}
```

**Use migration tool:**

```bash
npx sv migrate app-state  # Auto-migrates .svelte components
```

**Benefits of $app/state:**
- Fine-grained reactivity (`page.state` changes don't invalidate `page.data`)
- Use anywhere (not just components)
- More flexible than stores

### Migration Checklist

- ✓ Update to latest SvelteKit 1.x
- ✓ Update to Svelte 4
- ✓ Run `npx sv migrate sveltekit-2`
- ✓ Remove `throw` from `error()` and `redirect()` calls
- ✓ Add `path` to all `cookies.set()`, `.delete()`, `.serialize()`
- ✓ Add `await` to top-level promises in load functions
- ✓ Replace `goto()` for external URLs with `window.location.href`
- ✓ Update `preloadCode()` calls to include `base` and use single argument
- ✓ Replace `resolvePath()` with `resolveRoute()`
- ✓ Update `handleError` to use new parameters
- ✓ Replace dynamic env imports in prerendered pages with static
- ✓ Update `use:enhance` callbacks (`form` → `formElement`, `data` → `formData`)
- ✓ Add `enctype="multipart/form-data"` to file upload forms
- ✓ Move `paths`/`baseUrl` from tsconfig.json to `alias` in svelte.config.js
- ✓ Change `vitePreprocess` import
- ✓ Update all adapter versions
- ✓ Update Node.js to 18.13+
- ✓ Update TypeScript to 5.0+
- ✓ Update Vite to 5.0+
- ✓ Remove deprecated tsconfig flags
- ✓ Migrate from `$app/stores` to `$app/state`

---

**This document is comprehensive. Use it as your authoritative source for all SvelteKit development.**
# VITE BUILD TOOL BIBLE

> Comprehensive knowledge document for AI agents implementing Vite-powered projects

**📊 Document Stats:**
- **Framework Version:** Vite 7.x (latest major version)
- **Vite 6 Environment API:** Complete coverage
- **Node.js Required:** 20.19+ / 22.12+
- **Browser Support (Dev):** Baseline Newly Available (2025-05-01)
- **Browser Support (Prod):** Chrome >=107, Edge >=107, Firefox >=104, Safari >=16
- **Coverage:** ~95% of official Vite documentation
- **Document Size:** 6,741 lines | ~41,570 tokens
- **Last Updated:** 2025

---

## Table of Contents

1. [Introduction](#introduction)
2. [Core Concepts & Philosophy](#core-concepts--philosophy)
3. [Why Vite?](#why-vite)
4. [Getting Started](#getting-started)
5. [Features](#features)
6. [Configuration Reference](#configuration-reference)
7. [CLI Commands](#cli-commands)
8. [Static Asset Handling](#static-asset-handling)
9. [CSS & Styling](#css--styling)
10. [TypeScript](#typescript)
11. [Environment Variables](#environment-variables)
12. [Dependency Pre-Bundling](#dependency-pre-bundling)
13. [Build & Production](#build--production)
14. [Plugin System](#plugin-system)
15. [JavaScript API](#javascript-api)
16. [Server-Side Rendering (SSR)](#server-side-rendering-ssr)
17. [Hot Module Replacement (HMR)](#hot-module-replacement-hmr)
18. [Backend Integration](#backend-integration)
19. [Performance Optimization](#performance-optimization)
20. [Deployment](#deployment)
21. [Rolldown Integration](#rolldown-integration)
22. [Environment API (Vite 6+)](#environment-api-vite-6)
23. [Breaking Changes and Future Deprecations](#breaking-changes-and-future-deprecations)
24. [Migration Guide](#migration-guide)
25. [Troubleshooting](#troubleshooting)
26. [Best Practices](#best-practices)
27. [Common Patterns](#common-patterns)
28. [Anti-Patterns to Avoid](#anti-patterns-to-avoid)

---

## Introduction

**Vite** (French for "quick", pronounced `/vit/`) is a next-generation frontend build tool that provides:

### What is Vite?

1. **Dev Server** - A development server with rich feature enhancements over native ES modules, featuring extremely fast Hot Module Replacement (HMR)
2. **Build Command** - A build command that bundles your code with Rollup (or Rolldown), pre-configured to output highly optimized static assets for production

### Key Characteristics

- **Lightning Fast** - 10-100x faster cold starts than traditional bundlers
- **Instant HMR** - Consistently fast regardless of app size
- **Native ESM** - Leverages native ES modules in the browser
- **Rich Features** - TypeScript, JSX, CSS preprocessors out of the box
- **Universal Plugin Interface** - Rollup-superset plugin interface shared between dev and build
- **Optimized Build** - Pre-configured Rollup build with multi-page and library mode support

---

## Core Concepts & Philosophy

### Philosophy

Vite follows three core principles:

#### 1. Lean Extendable Core

- Supports the most common patterns for building web apps out-of-the-box
- Features that can be implemented as external plugins won't be added to the Vite core
- Maintains a small API surface for long-term maintainability

#### 2. Pushing the Modern Web

- **ESM-First**: Source code must be written in ES modules format
- **No Legacy Support**: Non-ESM dependencies need to be pre-bundled to ESM
- **Modern Syntax**: Web workers must use `new Worker` syntax
- **Browser-Only**: Node.js modules cannot be used in the browser

#### 3. Pragmatic Performance

- Uses **native tools** (esbuild, SWC, Rolldown) for intensive tasks to achieve best performance
- Keeps the rest of the code in JavaScript for flexibility and maintainability
- Evolves with ecosystem by adopting new libraries while maintaining stable API

### Architecture

**Development Mode:**
```
Source Files → Vite Dev Server → Native ESM → Browser
                    ↓
              Pre-bundled Dependencies (esbuild)
```

**Production Build:**
```
Source Files → Rollup/Rolldown → Optimized Bundle → Static Files
```

---

## Why Vite?

### Problems with Traditional Bundlers

#### 1. Slow Server Start

**Problem:**
- Traditional bundlers (Webpack, Parcel) must crawl and build entire application before serving
- Large applications take minutes to spin up dev server

**Vite's Solution:**
- Divides modules into two categories:
  - **Dependencies** - Pre-bundled with esbuild (10-100x faster than JavaScript bundlers)
  - **Source Code** - Served over native ESM, transformed on-demand
- Only processes code that's actually needed for current page

**Performance Comparison:**
```
Traditional Bundler: 30-60 seconds
Vite: 200-500 milliseconds
```

#### 2. Slow Updates

**Problem:**
- Traditional HMR rebuilds entire module graph
- Update speed degrades linearly with app size

**Vite's Solution:**
- HMR over native ESM
- Only invalidates the chain between edited module and closest HMR boundary
- Leverages HTTP headers for speed:
  - **Dependencies**: `Cache-Control: max-age=31536000,immutable`
  - **Source Code**: `304 Not Modified`

**Update Speed:**
```
Traditional Bundler: 1-10 seconds
Vite: 10-50 milliseconds
```

#### 3. Why Bundle for Production?

Despite native ESM support in browsers, shipping unbundled ESM is inefficient:

- **Network Round Trips** - Nested imports cause excessive requests
- **No Tree Shaking** - Dead code cannot be eliminated
- **No Code Splitting** - All code loaded upfront

**Vite's Approach:**
- Pre-configured Rollup build with:
  - Tree-shaking
  - Lazy-loading
  - Common chunk splitting
  - CSS code splitting

---

## Getting Started

### Installation

**With Package Manager:**
```bash
# npm
npm create vite@latest my-app

# yarn
yarn create vite my-app

# pnpm
pnpm create vite my-app

# bun
bun create vite my-app
```

**Manual Setup:**
```bash
npm install -D vite
```

**package.json:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Project Structure

```
my-app/
├── index.html           # Entry point (front and center!)
├── package.json
├── vite.config.js       # Optional config file
├── public/              # Static assets (copied as-is)
│   └── favicon.ico
└── src/
    ├── main.js          # App entry
    ├── App.vue
    └── components/
```

### index.html as Entry Point

Unlike traditional bundlers, Vite treats `index.html` as source code:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="app"></div>
    <!-- Module script - entry point -->
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

**Key Features:**
- URLs are automatically rebased
- `<script type="module" src>` handled specially
- `<link href>` resolved relative to HTML file
- Multi-page apps supported via multiple `.html` files

---

## Features

### 1. NPM Dependency Resolving and Pre-Bundling

**Bare Module Imports:**
```js
import { createApp } from 'vue' // Bare import - resolved from node_modules
```

**Pre-Bundling Benefits:**
1. **CommonJS/UMD Compatibility** - Converts to ESM
2. **Performance** - Combines many internal modules into single module
3. **Caching** - Strongly cached via HTTP headers

**Pre-Bundling Process:**
```
Scan Entry Points → Detect Dependencies → Pre-bundle with esbuild → Cache in node_modules/.vite
```

**Cache Invalidation:**
- Changes to `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`
- Changes to patches in `package.json`
- Changes to Vite config files
- Changes to `NODE_ENV` value

**Force Re-Bundling:**
```bash
vite --force
```

### 2. Hot Module Replacement (HMR)

**Native ESM-Based HMR:**
- Instant updates without full page reload
- Preserves application state
- Precision updates - only affected modules reload

**HMR API:**
```js
if (import.meta.hot) {
  // Accept updates to this module
  import.meta.hot.accept((newModule) => {
    // Handle the update
    updateApp(newModule)
  })

  // Accept updates from a dependency
  import.meta.hot.accept('./dep.js', (newDep) => {
    // Handle dependency update
  })

  // Cleanup before update
  import.meta.hot.dispose((data) => {
    // Store state
    data.state = getCurrentState()
  })

  // Custom events
  import.meta.hot.on('my-event', (data) => {
    console.log('Received:', data)
  })

  // Invalidate module (force full reload)
  import.meta.hot.invalidate()
}
```

**Framework Integration:**
- **Vue SFC** - Official `@vitejs/plugin-vue` provides HMR out of the box
- **React** - `@vitejs/plugin-react` with React Fast Refresh
- **Preact** - `@preact/preset-vite` with Prefresh
- **Svelte** - `vite-plugin-svelte`
- **Solid** - `vite-plugin-solid`

### 3. TypeScript Support

**Out-of-the-Box Support:**
```js
import MyComponent from './MyComponent.vue'
import type { ComponentProps } from './types'
import tsWorker from './worker?worker'
```

**Transpile Only:**
- Vite only performs transpilation, **not type checking**
- Uses esbuild (20-30x faster than `tsc`)
- Type errors won't stop dev server or build

**Type Checking:**
```bash
# In development
tsc --noEmit --watch

# In build
tsc --noEmit && vite build
```

**tsconfig.json Requirements:**
```json
{
  "compilerOptions": {
    // REQUIRED
    "isolatedModules": true,

    // RECOMMENDED
    "useDefineForClassFields": true,

    // For client code
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "target": "ES2020",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "skipLibCheck": true,

    // For strictness
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Client Types:**
```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // Add more env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### 4. HTML Processing

**URL Resolution:**
```html
<!-- All URLs are automatically resolved -->
<link rel="stylesheet" href="./src/style.css" />
<img src="./src/image.png" />
<script type="module" src="./src/main.js"></script>
```

**Supported Elements:**
```html
<audio src="...">
<embed src="...">
<img src="...">
<image src="...">
<input src="...">
<link href="...">
<object data="...">
<script src="...">
<source src="..." srcset="...">
<track src="...">
<use href="..." xlink:href="...">
<video src="..." poster="...">
<meta content="...">
```

**Multi-Page Apps:**
```
├── index.html
├── about.html
└── contact.html
```

```bash
vite build  # Automatically detects all .html files
```

### 5. JSON Import

**Direct Import:**
```js
import data from './data.json'
console.log(data.name)
```

**Named Imports (Tree-Shaking):**
```js
import { name, version } from './package.json'
```

### 6. Glob Import

**Lazy Loading (Default):**
```js
const modules = import.meta.glob('./dir/*.js')
// Produces:
// {
//   './dir/foo.js': () => import('./dir/foo.js'),
//   './dir/bar.js': () => import('./dir/bar.js')
// }

// Use:
for (const path in modules) {
  modules[path]().then((mod) => {
    console.log(path, mod)
  })
}
```

**Eager Loading:**
```js
const modules = import.meta.glob('./dir/*.js', { eager: true })
// Produces:
// import * as __glob__0_0 from './dir/foo.js'
// import * as __glob__0_1 from './dir/bar.js'
// {
//   './dir/foo.js': __glob__0_0,
//   './dir/bar.js': __glob__0_1
// }
```

**Named Imports:**
```js
const modules = import.meta.glob('./dir/*.js', {
  import: 'setup',
  eager: true
})
// Imports only 'setup' export from each module
```

**Custom Queries:**
```js
const modules = import.meta.glob('./dir/*.js', {
  query: { foo: 'bar', bar: true }
})
// Produces: import('./dir/foo.js?foo=bar&bar=true')
```

**Negative Patterns:**
```js
const modules = import.meta.glob([
  './dir/*.js',
  '!**/bar.js'  // Exclude bar.js
])
```

**Base Path:**
```js
const modules = import.meta.glob('./dir/*.js', {
  import: 'default',
  as: 'url',
  base: './dir'
})
// Keys become relative to base: { 'foo.js': '/dir/foo.js' }
```

### 7. WebAssembly

**Import with Init:**
```js
import wasmInit from './example.wasm?init'

wasmInit().then((instance) => {
  instance.exports.test()
})
```

**Inline:**
```js
import wasmModule from './example.wasm'
// Inlined as base64 string if smaller than assetsInlineLimit
```

### 8. Web Workers

**Constructor Syntax (Recommended):**
```js
const worker = new Worker(
  new URL('./worker.js', import.meta.url),
  { type: 'module' }
)

worker.postMessage({ msg: 'Hello' })
```

**Query Suffix:**
```js
import MyWorker from './worker?worker'

const worker = new MyWorker()
```

**Worker Options:**
- `?worker` - Web Worker
- `?sharedworker` - Shared Worker
- `?worker&inline` - Inline as base64
- `?worker&url` - Import as URL

**Worker with Dependencies:**
```js
// worker.js
import { helper } from './utils'

self.addEventListener('message', (e) => {
  const result = helper(e.data)
  self.postMessage(result)
})
```

---

## Configuration Reference

### Config File

**Supported Formats:**
```js
// vite.config.js (ESM)
export default {
  // config options
}

// vite.config.ts (TypeScript)
import { defineConfig } from 'vite'
export default defineConfig({
  // config options
})

// vite.config.mjs, vite.config.cjs also supported
```

**Conditional Config:**
```js
import { defineConfig } from 'vite'

export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  if (command === 'serve') {
    return {
      // dev specific config
    }
  } else {
    return {
      // build specific config
    }
  }
})
```

**Async Config:**
```js
export default defineConfig(async ({ command, mode }) => {
  const data = await fetchData()
  return {
    // config using data
  }
})
```

**Environment Variables in Config:**
```js
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // Use env variables
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV)
    }
  }
})
```

### Shared Options

#### root
- **Type:** `string`
- **Default:** `process.cwd()`
- **Description:** Project root directory

```js
export default defineConfig({
  root: './src'
})
```

#### base
- **Type:** `string`
- **Default:** `/`
- **Description:** Public base path

```js
// Absolute URL
base: 'https://cdn.example.com/'

// Root-relative path
base: '/my-app/'

// Relative path (auto-determined)
base: './'
```

#### mode
- **Type:** `string`
- **Default:** `'development'` for serve, `'production'` for build

#### define
- **Type:** `Record<string, any>`
- **Description:** Define global constant replacements

```js
define: {
  __APP_VERSION__: JSON.stringify('1.0.0'),
  __DEV__: true,
  'import.meta.env.CUSTOM': JSON.stringify('custom value')
}
```

#### plugins
- **Type:** `(Plugin | Plugin[] | Promise<Plugin | Plugin[]>)[]`

```js
import vue from '@vitejs/plugin-vue'
import react from '@vitejs/plugin-react'

plugins: [vue(), react()]
```

#### publicDir
- **Type:** `string | false`
- **Default:** `"public"`
- **Description:** Directory for static assets (copied as-is to outDir)

#### cacheDir
- **Type:** `string`
- **Default:** `"node_modules/.vite"`
- **Description:** Directory to cache files

#### resolve.alias
- **Type:** `Record<string, string> | Array<{ find: string | RegExp, replacement: string }>`

```js
resolve: {
  alias: {
    '@': '/src',
    '~': '/src',
    'components': '/src/components'
  }
}

// Or with regex
resolve: {
  alias: [
    { find: /^~/, replacement: '/src' }
  ]
}
```

#### resolve.dedupe
- **Type:** `string[]`
- **Description:** Force dedupe listed dependencies

```js
resolve: {
  dedupe: ['vue']  // Use single copy of vue
}
```

#### resolve.conditions
- **Type:** `string[]`
- **Default:** `['module', 'browser', 'development|production']`
- **Description:** Additional allowed conditions for exports field

#### resolve.mainFields
- **Type:** `string[]`
- **Default:** `['browser', 'module', 'jsnext:main', 'jsnext']`
- **Description:** package.json fields to try for entry point

#### resolve.extensions
- **Type:** `string[]`
- **Default:** `['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']`
- **Description:** File extensions to try

#### resolve.preserveSymlinks
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Preserve symlinks instead of resolving to real path

#### css.modules
- **Type:** `CSSModulesOptions`

```js
css: {
  modules: {
    scopeBehaviour: 'local',
    globalModulePaths: [/\.global\.css$/],
    generateScopedName: '[name]__[local]___[hash:base64:5]',
    hashPrefix: '',
    localsConvention: 'camelCaseOnly'
  }
}
```

#### css.postcss
- **Type:** `string | PostCSSConfig`

```js
css: {
  postcss: './postcss.config.js'
}

// Inline
css: {
  postcss: {
    plugins: [
      require('autoprefixer'),
      require('postcss-nested')
    ]
  }
}
```

#### css.preprocessorOptions
- **Type:** `Record<string, object>`

```js
css: {
  preprocessorOptions: {
    scss: {
      additionalData: `$injectedColor: orange;`,
      api: 'modern-compiler'  // or 'modern'
    },
    less: {
      math: 'parens-division'
    },
    stylus: {
      define: {
        $specialColor: new stylus.nodes.RGBA(51, 197, 255, 1)
      }
    }
  }
}
```

#### css.devSourcemap
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Enable sourcemaps during dev

#### css.transformer
- **Type:** `'postcss' | 'lightningcss'`
- **Default:** `'postcss'`

```js
css: {
  transformer: 'lightningcss'
}
```

#### css.lightningcss
- **Type:** `LightningCSSOptions`

```js
css: {
  transformer: 'lightningcss',
  lightningcss: {
    targets: {
      chrome: 107,
      safari: 16
    },
    cssModules: {
      pattern: '[name]__[local]--[hash]'
    }
  }
}
```

#### json.namedExports
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Support named imports from JSON

#### json.stringify
- **Type:** `boolean | 'auto'`
- **Default:** `'auto'`
- **Description:** Import large JSON as string

#### esbuild
- **Type:** `ESBuildOptions | false`

```js
esbuild: {
  jsxFactory: 'h',
  jsxFragment: 'Fragment',
  jsxInject: `import React from 'react'`,
  loader: 'tsx',
  include: /\.[jt]sx?$/,
  exclude: /node_modules/
}
```

#### assetsInclude
- **Type:** `string | RegExp | (string | RegExp)[]`

```js
assetsInclude: ['**/*.gltf', '**/*.glb']
```

#### logLevel
- **Type:** `'info' | 'warn' | 'error' | 'silent'`
- **Default:** `'info'`

#### clearScreen
- **Type:** `boolean`
- **Default:** `true`

#### envDir
- **Type:** `string`
- **Default:** `root`
- **Description:** Directory to load .env files

#### envPrefix
- **Type:** `string | string[]`
- **Default:** `'VITE_'`

```js
envPrefix: ['VITE_', 'APP_']
```

#### appType
- **Type:** `'spa' | 'mpa' | 'custom'`
- **Default:** `'spa'`

### Server Options

#### server.host
- **Type:** `string | boolean`
- **Default:** `'localhost'`

```js
server: {
  host: true  // Listen on all addresses (0.0.0.0)
}
```

#### server.allowedHosts
- **Type:** `string[] | true`
- **Default:** `[]`
- **Description:** Security feature to limit allowed hostnames

```js
server: {
  allowedHosts: ['example.com', 'api.example.com']
}
```

#### server.port
- **Type:** `number`
- **Default:** `5173`

#### server.strictPort
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Exit if port is already in use

#### server.https
- **Type:** `https.ServerOptions`

```js
import fs from 'fs'

server: {
  https: {
    key: fs.readFileSync('path/to/key.pem'),
    cert: fs.readFileSync('path/to/cert.pem')
  }
}
```

#### server.open
- **Type:** `boolean | string`
- **Description:** Auto-open browser on server start

```js
server: {
  open: '/docs/index.html'
}
```

#### server.proxy
- **Type:** `Record<string, string | ProxyOptions>`

```js
server: {
  proxy: {
    // String shorthand
    '/api': 'http://localhost:4000',

    // With options
    '/api': {
      target: 'http://jsonplaceholder.typicode.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    },

    // Proxy websockets
    '/socket.io': {
      target: 'ws://localhost:4000',
      ws: true
    },

    // Regex
    '^/fallback/.*': {
      target: 'http://jsonplaceholder.typicode.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/fallback/, '')
    }
  }
}
```

#### server.cors
- **Type:** `boolean | CorsOptions`
- **Default:** Allows localhost

```js
server: {
  cors: {
    origin: ['http://localhost:3000', 'https://example.com'],
    credentials: true
  }
}
```

#### server.headers
- **Type:** `OutgoingHttpHeaders`

```js
server: {
  headers: {
    'X-Custom-Header': 'value'
  }
}
```

#### server.hmr
- **Type:** `boolean | HMROptions`

```js
server: {
  hmr: {
    protocol: 'ws',
    host: 'localhost',
    port: 5173,
    clientPort: 443,
    overlay: true
  }
}
```

#### server.watch
- **Type:** `object` (chokidar options)

```js
server: {
  watch: {
    ignored: ['!**/node_modules/your-package-name/**']
  }
}
```

#### server.middlewareMode
- **Type:** `boolean | 'ssr' | 'html'`
- **Default:** `false`

```js
server: {
  middlewareMode: true  // For custom server integration
}
```

#### server.fs.strict
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Restrict serving files outside workspace root

#### server.fs.allow
- **Type:** `string[]`

```js
server: {
  fs: {
    allow: ['..', '/path/to/custom/dir']
  }
}
```

#### server.fs.deny
- **Type:** `string[]`
- **Default:** `['.env', '.env.*', '*.{crt,pem}']`

#### server.origin
- **Type:** `string`
- **Description:** Define origin for generated asset URLs

#### server.warmup
- **Type:** `{ clientFiles?: string[], ssrFiles?: string[] }`

```js
server: {
  warmup: {
    clientFiles: ['./src/components/heavy.vue'],
    ssrFiles: ['./src/server/utils.js']
  }
}
```

### Build Options

#### build.target
- **Type:** `string | string[]`
- **Default:** `'baseline-widely-available'`

```js
// Single target
build: {
  target: 'es2020'
}

// Multiple targets
build: {
  target: ['chrome90', 'firefox88', 'safari15']
}

// Baseline targets
build: {
  target: 'baseline-widely-available'  // Chrome 107+, Edge 107+, Firefox 104+, Safari 16+
}
```

#### build.modulePreload
- **Type:** `boolean | { polyfill?: boolean, resolveDependencies?: Function }`
- **Default:** `{ polyfill: true }`

```js
build: {
  modulePreload: {
    polyfill: true,
    resolveDependencies: (filename, deps, { hostId, hostType }) => {
      return deps.filter(dep => condition)
    }
  }
}
```

#### build.outDir
- **Type:** `string`
- **Default:** `'dist'`

#### build.assetsDir
- **Type:** `string`
- **Default:** `'assets'`

#### build.assetsInlineLimit
- **Type:** `number | ((filePath: string, content: Buffer) => boolean)`
- **Default:** `4096` (4 KiB)

```js
build: {
  assetsInlineLimit: 8192  // 8 KiB
}

// Function form
build: {
  assetsInlineLimit: (filePath, content) => {
    return filePath.endsWith('.svg') && content.length < 1024
  }
}
```

#### build.cssCodeSplit
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Enable CSS code splitting

#### build.cssTarget
- **Type:** `string | string[]`
- **Default:** Same as `build.target`

#### build.cssMinify
- **Type:** `boolean | 'esbuild' | 'lightningcss'`
- **Default:** Same as `build.minify`

#### build.sourcemap
- **Type:** `boolean | 'inline' | 'hidden'`
- **Default:** `false`

```js
build: {
  sourcemap: true  // External .map files
  // or 'inline' - Inline as data URI
  // or 'hidden' - Generate but don't reference in files
}
```

#### build.rollupOptions
- **Type:** `RollupOptions`

```js
build: {
  rollupOptions: {
    input: {
      main: resolve(__dirname, 'index.html'),
      nested: resolve(__dirname, 'nested/index.html')
    },
    output: {
      manualChunks: {
        vendor: ['vue', 'vue-router']
      },
      chunkFileNames: 'js/[name]-[hash].js',
      entryFileNames: 'js/[name]-[hash].js',
      assetFileNames: 'assets/[name]-[hash].[ext]'
    },
    external: ['vue'],
    plugins: []
  }
}
```

#### build.commonjsOptions
- **Type:** `RollupCommonJSOptions`

```js
build: {
  commonjsOptions: {
    include: [/node_modules/],
    exclude: [],
    transformMixedEsModules: true,
    strictRequires: false
  }
}
```

#### build.dynamicImportVarsOptions
- **Type:** `{ include?: string[], exclude?: string[], warnOnError?: boolean }`

```js
build: {
  dynamicImportVarsOptions: {
    include: ['src/**/*.js'],
    exclude: ['node_modules/**']
  }
}
```

#### build.lib
- **Type:** `LibraryOptions`

```js
import { resolve } from 'path'

build: {
  lib: {
    entry: resolve(__dirname, 'lib/main.js'),
    name: 'MyLib',
    formats: ['es', 'cjs', 'umd', 'iife'],
    fileName: (format) => `my-lib.${format}.js`,
    cssFileName: 'style'
  },
  rollupOptions: {
    external: ['vue', 'react'],
    output: {
      globals: {
        vue: 'Vue',
        react: 'React'
      }
    }
  }
}
```

#### build.license
- **Type:** `boolean | { fileName?: string }`
- **Default:** `false`

```js
build: {
  license: {
    fileName: 'LICENSES.txt'
  }
}
```

#### build.manifest
- **Type:** `boolean | string`
- **Default:** `false`

```js
build: {
  manifest: true  // Creates .vite/manifest.json
}
```

#### build.ssrManifest
- **Type:** `boolean | string`
- **Default:** `false`

```js
build: {
  ssrManifest: true  // Creates .vite/ssr-manifest.json
}
```

#### build.ssr
- **Type:** `boolean | string`
- **Default:** `false`

```js
build: {
  ssr: 'src/entry-server.js'
}
```

#### build.ssrEmitAssets
- **Type:** `boolean`
- **Default:** `false`

#### build.minify
- **Type:** `boolean | 'terser' | 'esbuild'`
- **Default:** `'esbuild'` for client, `false` for SSR

#### build.terserOptions
- **Type:** `TerserOptions`

```js
build: {
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true,
      drop_debugger: true
    }
  }
}
```

#### build.write
- **Type:** `boolean`
- **Default:** `true`

#### build.emptyOutDir
- **Type:** `boolean`
- **Default:** `true` if outDir is inside root

#### build.copyPublicDir
- **Type:** `boolean`
- **Default:** `true`

#### build.reportCompressedSize
- **Type:** `boolean`
- **Default:** `true`

#### build.chunkSizeWarningLimit
- **Type:** `number`
- **Default:** `500` (KiB)

#### build.watch
- **Type:** `WatcherOptions | null`

```js
build: {
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**'
  }
}
```

### Preview Options

#### preview.host
- **Type:** `string | boolean`
- **Default:** `server.host`

#### preview.port
- **Type:** `number`
- **Default:** `4173`

#### preview.strictPort
- **Type:** `boolean`
- **Default:** `server.strictPort`

#### preview.https
- **Type:** `https.ServerOptions`

#### preview.open
- **Type:** `boolean | string`

#### preview.proxy
- **Type:** `Record<string, string | ProxyOptions>`

#### preview.cors
- **Type:** `boolean | CorsOptions`

#### preview.headers
- **Type:** `OutgoingHttpHeaders`

### Dependency Optimization Options

#### optimizeDeps.entries
- **Type:** `string | string[]`

```js
optimizeDeps: {
  entries: ['./src/**/*.vue', './src/**/*.tsx']
}
```

#### optimizeDeps.include
- **Type:** `string[]`

```js
optimizeDeps: {
  include: ['lodash-es', 'vue', 'pinia']
}
```

#### optimizeDeps.exclude
- **Type:** `string[]`

```js
optimizeDeps: {
  exclude: ['@my-company/private-package']
}
```

#### optimizeDeps.esbuildOptions
- **Type:** `EsbuildBuildOptions`

```js
optimizeDeps: {
  esbuildOptions: {
    define: {
      global: 'globalThis'
    },
    plugins: [
      // Custom esbuild plugin
    ]
  }
}
```

#### optimizeDeps.force
- **Type:** `boolean`
- **Description:** Force re-optimize dependencies

#### optimizeDeps.disabled
- **Type:** `boolean | 'build' | 'dev'`
- **Default:** `'build'`

#### optimizeDeps.needsInterop
- **Type:** `string[]`

```js
optimizeDeps: {
  needsInterop: ['problematic-dep']
}
```

### SSR Options

#### ssr.external
- **Type:** `string[]`

```js
ssr: {
  external: ['some-package']
}
```

#### ssr.noExternal
- **Type:** `string | RegExp | (string | RegExp)[] | true`

```js
ssr: {
  noExternal: ['vue', 'vuex']
}
```

#### ssr.target
- **Type:** `'node' | 'webworker'`
- **Default:** `'node'`

#### ssr.resolve.conditions
- **Type:** `string[]`

```js
ssr: {
  resolve: {
    conditions: ['node', 'production']
  }
}
```

#### ssr.resolve.externalConditions
- **Type:** `string[]`

```js
ssr: {
  resolve: {
    externalConditions: ['node']
  }
}
```

### Worker Options

#### worker.format
- **Type:** `'es' | 'iife'`
- **Default:** `'iife'`

#### worker.plugins
- **Type:** `() => (Plugin | Plugin[])[]`

```js
worker: {
  plugins: () => [
    vue()
  ]
}
```

#### worker.rollupOptions
- **Type:** `RollupOptions`

```js
worker: {
  rollupOptions: {
    output: {
      format: 'es'
    }
  }
}
```

---

## CLI Commands

### `vite`
Start dev server (alias: `vite dev`, `vite serve`)

**Usage:**
```bash
vite [root]
```

**Options:**
- `--host [host]` - Specify hostname (default: localhost)
- `--port <port>` - Specify port (default: 5173)
- `--open [path]` - Open browser on startup
- `--cors` - Enable CORS
- `--strictPort` - Exit if port is already in use
- `--force` - Force optimizer to re-bundle dependencies
- `-c, --config <file>` - Use specified config file
- `--base <path>` - Public base path (default: /)
- `-l, --logLevel <level>` - info | warn | error | silent
- `--clearScreen` - Allow/disable clear screen when logging
- `--configLoader <loader>` - bundle | runner | native
- `--profile` - Start built-in Node.js inspector
- `-m, --mode <mode>` - Set env mode

**Examples:**
```bash
vite
vite --port 3000
vite --host 0.0.0.0
vite --open
vite --force
vite --mode staging
```

### `vite build`
Build for production

**Usage:**
```bash
vite build [root]
```

**Options:**
- `--target <target>` - Transpile target (default: "modules")
- `--outDir <dir>` - Output directory (default: dist)
- `--assetsDir <dir>` - Assets directory under outDir (default: "assets")
- `--assetsInlineLimit <number>` - Static asset base64 inline threshold in bytes (default: 4096)
- `--ssr [entry]` - Build specified entry for server-side rendering
- `--sourcemap [output]` - Output source maps for build (default: false)
- `--minify [minifier]` - Enable/disable minification, or specify minifier to use (default: "esbuild")
- `--manifest [name]` - Emit build manifest json
- `--ssrManifest [name]` - Emit SSR manifest json
- `-w, --watch` - Rebuilds when modules have changed on disk

**Examples:**
```bash
vite build
vite build --outDir public
vite build --sourcemap
vite build --minify terser
vite build --ssr src/entry-server.js
vite build --watch
```

### `vite preview`
Locally preview production build

**Usage:**
```bash
vite preview [root]
```

**Options:**
- `--host [host]` - Specify hostname
- `--port <port>` - Specify port (default: 4173)
- `--strictPort` - Exit if specified port is already in use
- `--open [path]` - Open browser on startup
- `--outDir <dir>` - Output directory (default: dist)

**Examples:**
```bash
vite preview
vite preview --port 8080
vite preview --open
```

### `vite optimize`
Pre-bundle dependencies

**Usage:**
```bash
vite optimize [root]
```

**Options:**
- `--force` - Force optimizer to re-bundle dependencies

---

## Static Asset Handling

### Importing Assets

**Import Returns URL:**
```js
import imgUrl from './img.png'
// imgUrl will be '/img.2d8efhg.png' in production

<img src={imgUrl} alt="image" />
```

**TypeScript:**
```ts
/// <reference types="vite/client" />

declare module '*.svg' {
  const content: string
  export default content
}
```

### Special Queries

#### `?url` - Explicit URL Import
```js
import assetUrl from './asset.js?url'
// Force import as URL even for JavaScript
```

#### `?raw` - Import as String
```js
import shaderCode from './shader.glsl?raw'
console.log(shaderCode) // Shader source code as string
```

#### `?inline` - Force Inline
```js
import inlineSvg from './icon.svg?inline'
// Inlined as base64 regardless of size
```

#### `?worker` / `?sharedworker` - Web Workers
```js
import Worker from './worker?worker'
const worker = new Worker()
```

### Public Directory

**Structure:**
```
public/
├── favicon.ico
├── robots.txt
└── images/
    └── logo.png
```

**Usage:**
```html
<!-- Always referenced with absolute path -->
<img src="/images/logo.png" />
```

**Important:**
- Assets in `public` are served at root path `/`
- Not transformed or bundled
- Must be referenced with absolute path
- Copied as-is to dist root

**When to Use:**
- Referenced by absolute URLs (robots.txt, manifest.json)
- Must keep exact filename
- Thousands of images (dynamic reference)
- Some library requires specific file structure

**When NOT to Use:**
- Referenced from source code → Use `src/assets/`
- Need transformation → Use `src/assets/`
- Need versioning/hashing → Use `src/assets/`

### `new URL(url, import.meta.url)`

**Dynamic Asset URLs:**
```js
function getImageUrl(name) {
  return new URL(`./dir/${name}.png`, import.meta.url).href
}
```

**TypeScript:**
```ts
const imageUrl = new URL('./image.png', import.meta.url).href
```

**During Production:**
- Vite performs static analysis
- Resolves URLs to versioned paths

**Limitations:**
- `import.meta.url` must be exact string
- Cannot use variables in `new URL()` path

---

## CSS & Styling

### Basic CSS Import

**Direct Import:**
```js
import './style.css'
```

**Side Effects:**
- Creates `<style>` tag in page
- Supports HMR
- CSS is extracted to separate file in production

### CSS Modules

**File Naming:**
- `*.module.css`
- `*.module.scss`
- `*.module.less`
- `*.module.styl`

**Usage:**
```js
import styles from './component.module.css'

<div className={styles.container}>
  <h1 className={styles.title}>Hello</h1>
</div>
```

**Configuration:**
```js
css: {
  modules: {
    scopeBehaviour: 'local', // or 'global'
    globalModulePaths: [/\.global\.css$/],

    // Custom class name pattern
    generateScopedName: '[name]__[local]___[hash:base64:5]',

    // Or function
    generateScopedName: (name, filename, css) => {
      return `${name}_${hash(filename)}`
    },

    // Hash prefix for generated classes
    hashPrefix: '',

    // Class naming style
    localsConvention: 'camelCase'
    // 'camelCase' | 'camelCaseOnly' | 'dashes' | 'dashesOnly'
  }
}
```

**TypeScript:**
```ts
declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}
```

### CSS Pre-processors

**Supported:**
- `.scss` and `.sass` (Sass/SCSS)
- `.less` (Less)
- `.styl` and `.stylus` (Stylus)

**Installation:**
```bash
# Sass
npm install -D sass-embedded  # Recommended
# or
npm install -D sass

# Less
npm install -D less

# Stylus
npm install -D stylus
```

**Usage:**
```js
import './styles.scss'
import './styles.less'
import './styles.styl'
```

**Configuration:**
```js
css: {
  preprocessorOptions: {
    scss: {
      additionalData: `$injectedColor: orange;`,
      api: 'modern-compiler',  // or 'modern', 'legacy'

      // Vite-specific options
      includePaths: ['./src/styles']
    },

    less: {
      math: 'parens-division',
      globalVars: {
        primaryColor: '#1890ff'
      }
    },

    stylus: {
      define: {
        $specialColor: new stylus.nodes.RGBA(51, 197, 255, 1)
      },
      imports: ['./src/styles/variables.styl']
    }
  }
}
```

**Import Resolution:**
```scss
/* Vite aliases work */
@import '@/styles/variables';

/* Node modules */
@import 'normalize.css/normalize.css';

/* Relative paths */
@import './mixins';
```

### PostCSS

**Config File:**
```js
// postcss.config.js
export default {
  plugins: {
    autoprefixer: {},
    'postcss-nested': {},
    cssnano: {
      preset: 'default'
    }
  }
}
```

**Inline Config:**
```js
css: {
  postcss: {
    plugins: [
      require('autoprefixer'),
      require('postcss-nested')
    ]
  }
}
```

**CSS Modules with PostCSS:**
- PostCSS runs before CSS Modules
- Use `postcss-modules` plugin if needed

### Lightning CSS

**Enable:**
```js
css: {
  transformer: 'lightningcss'
}
```

**Configuration:**
```js
css: {
  transformer: 'lightningcss',
  lightningcss: {
    targets: {
      chrome: 107,
      edge: 107,
      firefox: 104,
      safari: 16
    },
    drafts: {
      nesting: true,
      customMedia: true
    },
    nonStandard: {
      deepSelectorCombinator: true
    },
    cssModules: {
      pattern: '[name]__[local]--[hash]'
    }
  }
}
```

**Features:**
- CSS parsing and transformation
- CSS minification (faster than esbuild)
- Modern CSS features (nesting, custom media)
- CSS Modules support

**Replaces:**
- PostCSS (for transformation)
- autoprefixer
- postcss-preset-env

### `@import` Inlining and Rebasing

**Automatic Inlining:**
```css
/* Inlines and rebases URLs */
@import './nested.css';
```

**Alias Support:**
```css
@import '@/styles/base.css';
```

**Disable Rebasing:**
```css
/* Use data URI or absolute URL */
@import url('https://fonts.googleapis.com/css2?family=Roboto');
```

---

## TypeScript

### Configuration

**Compiler Target:**
- Vite uses esbuild for transpilation
- `tsconfig.json` `target` field is **ignored**
- Use `build.target` or `esbuild.target` in vite.config.js

**Required Options:**
```json
{
  "compilerOptions": {
    "isolatedModules": true,
    "useDefineForClassFields": true
  }
}
```

**Recommended Options:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true
  }
}
```

### Type Checking

**Development:**
```bash
# Run alongside dev server
tsc --noEmit --watch
```

**Build:**
```json
{
  "scripts": {
    "build": "tsc --noEmit && vite build"
  }
}
```

**IDE Integration:**
- VS Code: Built-in TypeScript support
- WebStorm: Built-in TypeScript support
- Vim/Neovim: Use coc.nvim or ALE

### Client Types

**vite/client:**
```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_URL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
  readonly hot: {
    accept: (cb: (mod: any) => void) => void
    dispose: (cb: (data: any) => void) => void
    // ...more HMR API
  }
}
```

### TypeScript for Config

**vite.config.ts:**
```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],

  // All config is typed
  build: {
    target: 'esnext',
    outDir: 'dist'
  }
})
```

**Type Helpers:**
```ts
import type { UserConfig } from 'vite'

const config: UserConfig = {
  // ...
}

export default config
```

### Transpile-Only Warning

**What Vite Does:**
- Transpiles `.ts` to `.js`
- Removes type annotations
- **Does NOT check types**

**Type Errors Won't:**
- Stop dev server
- Prevent builds
- Show up without separate type checking

**Solutions:**
1. Run `tsc --noEmit` separately
2. Use editor with TypeScript integration
3. Add to build script: `tsc && vite build`

---

## Environment Variables

### .env Files

**File Priority:**
```
.env                # loaded in all cases
.env.local          # loaded in all cases, ignored by git
.env.[mode]         # only loaded in specified mode
.env.[mode].local   # only loaded in specified mode, ignored by git
```

**Example:**
```
# .env
VITE_APP_TITLE=My App
DB_PASSWORD=secret123
```

```
# .env.production
VITE_API_URL=https://api.production.com
```

**Loading Priority:**
```
.env.production.local > .env.production > .env.local > .env
```

### Env Variables in Code

**Client-Side:**
```js
// Only VITE_ prefixed variables exposed
console.log(import.meta.env.VITE_APP_TITLE)
console.log(import.meta.env.VITE_API_URL)

// Built-in variables
console.log(import.meta.env.MODE)        // 'development' or 'production'
console.log(import.meta.env.BASE_URL)    // Public base path
console.log(import.meta.env.PROD)        // boolean
console.log(import.meta.env.DEV)         // boolean
console.log(import.meta.env.SSR)         // boolean
```

**Server-Side (Config):**
```js
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // Load all env variables (not just VITE_)
  const env = loadEnv(mode, process.cwd(), '')

  return {
    define: {
      __APP_VERSION__: JSON.stringify(env.npm_package_version)
    }
  }
})
```

### TypeScript IntelliSense

**env.d.ts:**
```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_URL: string
  readonly VITE_SOME_KEY: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### Custom Prefix

```js
export default defineConfig({
  envPrefix: 'APP_'  // Expose APP_* variables instead of VITE_*
})

// Or multiple prefixes
export default defineConfig({
  envPrefix: ['VITE_', 'APP_', 'CUSTOM_']
})
```

### Modes

**Built-in Modes:**
- `development` - vite
- `production` - vite build

**Custom Modes:**
```bash
# Load .env.staging
vite build --mode staging

# Custom development mode
vite --mode development-local
```

**Check Mode in Code:**
```js
if (import.meta.env.MODE === 'staging') {
  // staging-specific code
}
```

### Security

**DO NOT:**
```
# ❌ WRONG - Exposed to client
VITE_DB_PASSWORD=secret
VITE_API_KEY=sensitive
```

**DO:**
```
# ✅ CORRECT - Not exposed (no VITE_ prefix)
DB_PASSWORD=secret
API_KEY=sensitive

# ✅ OK - Public information
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My App
```

---

## Dependency Pre-Bundling

### What is Pre-Bundling?

Vite pre-bundles dependencies on first run to:

1. **Convert CommonJS/UMD to ESM**
   ```js
   // lodash is CommonJS
   import { debounce } from 'lodash-es'  // Converted to ESM
   ```

2. **Improve Performance**
   ```js
   // Instead of 100+ module requests
   import { Button, Input, Form } from 'antd'

   // Vite creates single pre-bundled module
   ```

### How It Works

**1. Discovery Phase:**
```
Scan entry files → Find bare imports → Identify dependencies
```

**2. Pre-Bundle Phase:**
```
Run esbuild → Convert to ESM → Cache in node_modules/.vite
```

**3. Serve Phase:**
```
Serve pre-bundled modules with strong cache headers
```

### Cache Behavior

**File System Cache:**
- Location: `node_modules/.vite`
- Invalidated by:
  - `package-lock.json` / `yarn.lock` / `pnpm-lock.yaml` changes
  - Patches folder in `package.json`
  - `vite.config.js` changes
  - `NODE_ENV` value changes

**Browser Cache:**
- Headers: `Cache-Control: max-age=31536000,immutable`
- Refresh: Disable cache in DevTools or use `vite --force`

**Force Re-Bundle:**
```bash
# Option 1: CLI flag
vite --force

# Option 2: Delete cache
rm -rf node_modules/.vite

# Option 3: Config
export default defineConfig({
  optimizeDeps: {
    force: true
  }
})
```

### Manual Configuration

**Include Dependencies:**
```js
optimizeDeps: {
  include: [
    'lodash-es',           // Specify package
    'vue > @vue/shared',   // Nested dependency
    '@my/nested/package',  // Monorepo package
    'some-package/deep/import'  // Deep import
  ]
}
```

**Exclude Dependencies:**
```js
optimizeDeps: {
  exclude: [
    'your-package-name',
    '@my/local-package'
  ]
}
```

**Why Include?**
- Linked packages (via `npm link`, `yarn link`)
- Files imported via plugin transformation
- Dynamic imports with variables
- Pre-bundle large ESM libraries for fewer requests

**Why Exclude?**
- Small, pure ESM libraries
- Local linked packages during development
- Libraries with side effects

### Custom Entries

```js
optimizeDeps: {
  entries: [
    './src/main.js',
    './src/admin/main.js',
    './src/**/*.vue'
  ]
}
```

### esbuild Options

```js
optimizeDeps: {
  esbuildOptions: {
    define: {
      global: 'globalThis'
    },

    plugins: [
      // Custom esbuild plugin
      {
        name: 'my-plugin',
        setup(build) {
          // ...
        }
      }
    ],

    target: 'es2020',

    supported: {
      bigint: true
    }
  }
}
```

### Monorepos & Linked Dependencies

**Problem:**
Linked packages treated as source code, not pre-bundled

**Solution 1: Include in Pre-Bundle**
```js
optimizeDeps: {
  include: ['linked-package']
}
```

**Solution 2: Build Watch Mode**
```json
{
  "scripts": {
    "dev": "concurrently \"tsc -w\" \"vite\""
  }
}
```

### Automatic Discovery

Vite automatically scans:
- `.html` files
- Vue/Svelte component files
- JavaScript/TypeScript files

**Manual Discovery:**
```js
optimizeDeps: {
  entries: './src/special-entry.js'
}
```

---

## Build & Production

### Production Build

**Basic Build:**
```bash
npm run build
# or
vite build
```

**Output:**
```
dist/
├── index.html
├── assets/
│   ├── index-a1b2c3d4.js
│   ├── vendor-e5f6g7h8.js
│   └── index-i9j0k1l2.css
└── favicon.ico
```

### Build Optimizations

**1. Code Splitting**
```js
// Automatic code splitting
const AdminPage = () => import('./pages/Admin.vue')

// Manual chunks
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor': ['vue', 'vue-router', 'pinia'],
        'ui-lib': ['element-plus']
      }
    }
  }
}
```

**2. CSS Code Splitting**
```js
build: {
  cssCodeSplit: true  // Default
}
```

**Behavior:**
- Async chunks get separate CSS files
- CSS loaded on-demand with chunk

**Single CSS File:**
```js
build: {
  cssCodeSplit: false
}
```

**3. Preload Directives**
```html
<!-- Automatically generated for entry chunks -->
<link rel="modulepreload" href="/assets/index-a1b2c3d4.js" />
```

**Custom Resolution:**
```js
build: {
  modulePreload: {
    resolveDependencies: (filename, deps, { hostId, hostType }) => {
      // Filter or modify dependencies
      return deps.filter(dep => !dep.includes('polyfill'))
    }
  }
}
```

**4. Async Chunk Loading**

Vite automatically optimizes:
```js
// Before optimization
const foo = await import('./foo.js')

// After optimization (preloads dependencies)
const [foo, bar, baz] = await Promise.all([
  import('./foo.js'),
  import('./bar.js'),  // foo's dependency
  import('./baz.js')   // foo's dependency
])
```

### Library Mode

**Configuration:**
```js
// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.js'),
      name: 'MyLib',

      // Output formats
      formats: ['es', 'cjs', 'umd', 'iife'],

      // Output file names
      fileName: (format) => `my-lib.${format}.js`,

      // CSS output name
      cssFileName: 'style'
    },

    rollupOptions: {
      // Externalize dependencies
      external: ['vue', 'react'],

      output: {
        // Global names for UMD build
        globals: {
          vue: 'Vue',
          react: 'React'
        }
      }
    }
  }
})
```

**package.json:**
```json
{
  "name": "my-lib",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/my-lib.cjs",
  "module": "./dist/my-lib.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "require": "./dist/my-lib.cjs"
    },
    "./style.css": "./dist/style.css"
  }
}
```

**Multiple Entries:**
```js
build: {
  lib: {
    entry: {
      'main': resolve(__dirname, 'lib/main.js'),
      'utils': resolve(__dirname, 'lib/utils.js')
    }
  }
}
```

### Advanced Chunking

**Manual Chunks:**
```js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['vue', 'vue-router'],
        utils: ['lodash-es', 'axios']
      }
    }
  }
}
```

**Function Form:**
```js
build: {
  rollupOptions: {
    output: {
      manualChunks(id) {
        if (id.includes('node_modules')) {
          return 'vendor'
        }
        if (id.includes('src/components')) {
          return 'components'
        }
      }
    }
  }
}
```

**Chunk File Names:**
```js
build: {
  rollupOptions: {
    output: {
      chunkFileNames: 'js/[name]-[hash].js',
      entryFileNames: 'js/[name]-[hash].js',
      assetFileNames: 'assets/[name]-[hash].[ext]'
    }
  }
}
```

### Multi-Page App

**Directory Structure:**
```
├── index.html
├── about.html
├── contact.html
└── vite.config.js
```

**Configuration:**
```js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html')
      }
    }
  }
})
```

**Nested Structure:**
```
├── packages/
│   ├── pkg1/
│   │   └── index.html
│   └── pkg2/
│       └── index.html
```

```js
build: {
  rollupOptions: {
    input: {
      pkg1: resolve(__dirname, 'packages/pkg1/index.html'),
      pkg2: resolve(__dirname, 'packages/pkg2/index.html')
    }
  }
}
```

### Backend Integration

**Generate Manifest:**
```js
build: {
  manifest: true  // Creates .vite/manifest.json
}
```

**manifest.json:**
```json
{
  "src/main.js": {
    "file": "assets/main-a1b2c3d4.js",
    "src": "src/main.js",
    "isEntry": true,
    "imports": ["_vendor-e5f6g7h8.js"],
    "css": ["assets/main-i9j0k1l2.css"]
  },
  "_vendor-e5f6g7h8.js": {
    "file": "assets/vendor-e5f6g7h8.js"
  }
}
```

**Server-Side Usage (PHP Example):**
```php
<?php
$manifest = json_decode(file_get_contents('dist/.vite/manifest.json'), true);
$entry = $manifest['src/main.js'];
?>

<link rel="stylesheet" href="/<?= $entry['css'][0] ?>">
<script type="module" src="/<?= $entry['file'] ?>"></script>
```

### Watch Mode

```bash
vite build --watch
```

```js
build: {
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**'
  }
}
```

---

## Plugin System

### Plugin Anatomy

```js
export default function myPlugin(options = {}) {
  return {
    name: 'my-plugin',

    // Vite-specific hooks
    config(config, { command, mode }) {
      // Modify config before it's resolved
    },

    configResolved(resolvedConfig) {
      // Store resolved config
    },

    configureServer(server) {
      // Configure dev server
      server.middlewares.use((req, res, next) => {
        // Custom middleware
      })
    },

    configurePreviewServer(server) {
      // Configure preview server
    },

    transformIndexHtml(html, ctx) {
      // Transform index.html
      return html.replace('<!-- inject -->', '<script>...</script>')
    },

    handleHotUpdate({ server, file, timestamp, modules }) {
      // Custom HMR handling
      if (file.endsWith('.custom')) {
        server.ws.send({ type: 'custom', event: 'update' })
        return []
      }
    },

    // Universal Rollup hooks
    options(options) {
      // Modify Rollup options
    },

    buildStart(options) {
      // Called at start of build
    },

    resolveId(source, importer, options) {
      // Custom module resolution
      if (source === 'virtual-module') {
        return source
      }
    },

    load(id) {
      // Custom module loading
      if (id === 'virtual-module') {
        return 'export default "This is virtual"'
      }
    },

    transform(code, id) {
      // Transform module code
      if (id.endsWith('.custom')) {
        return {
          code: transformedCode,
          map: sourceMap
        }
      }
    },

    buildEnd(error) {
      // Called at end of build
    },

    closeBundle() {
      // Called after bundle is written
    }
  }
}
```

### Plugin Ordering

**Execution Order:**
1. Alias resolution
2. User plugins with `enforce: 'pre'`
3. Vite core plugins
4. User plugins without enforce value
5. Vite build plugins
6. User plugins with `enforce: 'post'`
7. Vite post build plugins

**Example:**
```js
export default function myPlugin() {
  return {
    name: 'my-plugin',
    enforce: 'pre',  // or 'post'
    // ...
  }
}
```

### Conditional Application

**Apply to Specific Command:**
```js
export default function myPlugin() {
  return {
    name: 'my-plugin',
    apply: 'build'  // or 'serve'
  }
}
```

**Function Form:**
```js
export default function myPlugin() {
  return {
    name: 'my-plugin',
    apply(config, { command }) {
      return command === 'build' && config.build.ssr
    }
  }
}
```

### Hook Filters (Rolldown/Rollup 4.38+)

**Optimize Performance:**
```js
export default function myPlugin() {
  return {
    name: 'my-plugin',
    transform: {
      filter: {
        id: /\.js$/,        // Only .js files
        code: /import/      // Only files with 'import'
      },
      handler(code, id) {
        // Transform code
        return { code }
      }
    }
  }
}
```

### Official Plugins

**Vue:**
```bash
npm install -D @vitejs/plugin-vue
npm install -D @vitejs/plugin-vue-jsx
```

```js
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx()
  ]
})
```

**React:**
```bash
npm install -D @vitejs/plugin-react
# or
npm install -D @vitejs/plugin-react-swc
```

```js
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()]
})
```

**Legacy Browser Support:**
```bash
npm install -D @vitejs/plugin-legacy
```

```js
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ]
})
```

### Common Plugin Patterns

**Virtual Modules:**
```js
export default function virtualPlugin() {
  const virtualModuleId = 'virtual:my-module'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'virtual-module',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export const msg = "from virtual module"`
      }
    }
  }
}
```

**Usage:**
```js
import { msg } from 'virtual:my-module'
console.log(msg)
```

**Custom File Types:**
```js
export default function customFilePlugin() {
  return {
    name: 'custom-file',
    transform(code, id) {
      if (id.endsWith('.custom')) {
        const transformed = processCustomFile(code)
        return {
          code: `export default ${JSON.stringify(transformed)}`,
          map: null
        }
      }
    }
  }
}
```

**Inject Code:**
```js
export default function injectPlugin() {
  return {
    name: 'inject-code',
    transformIndexHtml(html) {
      return html.replace(
        '</head>',
        `
          <script>
            window.__INJECTED__ = true
          </script>
        </head>
        `
      )
    }
  }
}
```

### Plugin Development Tips

**TypeScript:**
```ts
import type { Plugin } from 'vite'

export default function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    // ...
  }
}
```

**Options:**
```ts
interface MyPluginOptions {
  include?: string | string[]
  exclude?: string | string[]
}

export default function myPlugin(options: MyPluginOptions = {}): Plugin {
  return {
    name: 'my-plugin',
    // Use options
  }
}
```

**Logging:**
```js
export default function myPlugin() {
  let config

  return {
    name: 'my-plugin',
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    transform(code, id) {
      config.logger.info(`Transforming ${id}`)
    }
  }
}
```

---

## JavaScript API

### createServer()

**Create Dev Server:**
```js
import { createServer } from 'vite'

const server = await createServer({
  // Any valid config option, plus:
  configFile: false,
  root: __dirname,
  server: {
    port: 3000
  }
})

await server.listen()

server.printUrls()
server.bindCLIShortcuts({ print: true })
```

**ViteDevServer Properties:**
```ts
interface ViteDevServer {
  config: ResolvedConfig
  middlewares: Connect.Server
  httpServer: http.Server | null
  watcher: FSWatcher
  ws: WebSocketServer
  pluginContainer: PluginContainer
  moduleGraph: ModuleGraph

  // Methods
  transformRequest(url: string, options?: TransformOptions): Promise<TransformResult | null>
  transformIndexHtml(url: string, html: string, originalUrl?: string): Promise<string>
  ssrLoadModule(url: string, options?: { fixStacktrace?: boolean }): Promise<Record<string, any>>
  ssrFixStacktrace(e: Error): void
  listen(port?: number, isRestart?: boolean): Promise<ViteDevServer>
  restart(forceOptimize?: boolean): Promise<void>
  close(): Promise<void>
}
```

### build()

**Production Build:**
```js
import { build } from 'vite'

await build({
  root: __dirname,
  base: '/app/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      // ...
    }
  }
})
```

**Multiple Builds:**
```js
await build({ /* config */ })
await build({
  build: {
    ssr: 'src/entry-server.js'
  }
})
```

**Watch Mode:**
```js
const watcher = await build({
  build: {
    watch: {}
  }
})

// watcher is RollupWatcher
watcher.on('event', (event) => {
  if (event.code === 'END') {
    console.log('Build complete')
  }
})

// Stop watching
watcher.close()
```

### preview()

**Preview Server:**
```js
import { preview } from 'vite'

const previewServer = await preview({
  preview: {
    port: 8080,
    open: true
  }
})

previewServer.printUrls()
```

### resolveConfig()

**Resolve Vite Config:**
```js
import { resolveConfig } from 'vite'

const config = await resolveConfig(
  { /* inline config */ },
  'build',  // command: 'build' | 'serve'
  'production',  // mode
  'production'   // NODE_ENV
)

console.log(config.root)
```

### mergeConfig()

**Merge Configs:**
```js
import { mergeConfig } from 'vite'

const baseConfig = {
  plugins: [vue()],
  server: { port: 3000 }
}

const overrides = {
  server: { port: 4000 }
}

const merged = mergeConfig(baseConfig, overrides)
// { plugins: [vue()], server: { port: 4000 } }
```

### Other Utilities

**Load Environment:**
```js
import { loadEnv } from 'vite'

const env = loadEnv(
  'production',        // mode
  process.cwd(),       // envDir
  'VITE_'              // prefix
)

console.log(env.VITE_API_URL)
```

**Search Workspace Root:**
```js
import { searchForWorkspaceRoot } from 'vite'

const root = searchForWorkspaceRoot(process.cwd())
```

**Normalize Path:**
```js
import { normalizePath } from 'vite'

// Convert Windows paths to POSIX
const normalized = normalizePath('C:\\Users\\file.js')
// '/C:/Users/file.js'
```

**Transform with esbuild:**
```js
import { transformWithEsbuild } from 'vite'

const result = await transformWithEsbuild(
  code,
  filename,
  {
    loader: 'tsx',
    target: 'es2020'
  }
)

console.log(result.code)
```

**Load Config File:**
```js
import { loadConfigFromFile } from 'vite'

const config = await loadConfigFromFile(
  { command: 'build', mode: 'production' },
  'vite.config.js',
  process.cwd()
)

console.log(config.config)
console.log(config.path)
```

---

## Server-Side Rendering (SSR)

### Source Structure

```
- index.html
- server.js              # Main application server
- src/
  - main.js              # Exports env-agnostic app code
  - entry-client.js      # Mounts app to DOM
  - entry-server.js      # Renders app using framework's SSR API
```

### Entry Files

**src/entry-client.js:**
```js
import { createApp } from './main.js'

const { app, router } = createApp()

router.isReady().then(() => {
  app.mount('#app')
})
```

**src/entry-server.js:**
```js
import { createApp } from './main.js'
import { renderToString } from 'vue/server-renderer'

export async function render(url, manifest) {
  const { app, router } = createApp()

  await router.push(url)
  await router.isReady()

  const ctx = {}
  const html = await renderToString(app, ctx)

  return { html }
}
```

### Development Server

**server.js (Dev):**
```js
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import { createServer as createViteServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer() {
  const app = express()

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  // Use vite's connect instance as middleware
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl

      // 1. Read index.html
      let template = fs.readFileSync(
        path.resolve(__dirname, 'index.html'),
        'utf-8'
      )

      // 2. Apply Vite HTML transforms
      template = await vite.transformIndexHtml(url, template)

      // 3. Load server entry
      const { render } = await vite.ssrLoadModule('/src/entry-server.js')

      // 4. Render app HTML
      const { html: appHtml } = await render(url)

      // 5. Inject HTML
      const html = template.replace('<!--app-html-->', appHtml)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      vite.ssrFixStacktrace(e)
      console.error(e)
      res.status(500).end(e.message)
    }
  })

  app.listen(5173)
}

createServer()
```

### Production Server

**Build Scripts:**
```json
{
  "scripts": {
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build --outDir dist/client",
    "build:server": "vite build --outDir dist/server --ssr src/entry-server.js"
  }
}
```

**server.js (Production):**
```js
import fs from 'fs'
import path from 'path'
import express from 'express'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer() {
  const app = express()

  // Serve static files
  app.use(express.static('dist/client'))

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl

      // 1. Read index.html
      const template = fs.readFileSync(
        path.resolve(__dirname, 'dist/client/index.html'),
        'utf-8'
      )

      // 2. Load server entry
      const { render } = await import('./dist/server/entry-server.js')

      // 3. Render app
      const { html: appHtml } = await render(url)

      // 4. Inject HTML
      const html = template.replace('<!--app-html-->', appHtml)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      console.error(e)
      res.status(500).end(e.message)
    }
  })

  app.listen(5173)
}

createServer()
```

### SSR Configuration

**SSR Target:**
```js
ssr: {
  target: 'node',  // or 'webworker'

  // External dependencies
  external: ['some-node-module'],

  // Include dependencies in SSR bundle
  noExternal: ['vue', 'vuex'],

  // Conditions
  resolve: {
    conditions: ['node', 'production'],
    externalConditions: ['node']
  }
}
```

### SSR Manifest

**Generate Manifest:**
```js
build: {
  ssrManifest: true
}
```

**Use in Rendering:**
```js
import { render } from './dist/server/entry-server.js'
import manifest from './dist/client/.vite/ssr-manifest.json'

const { html, preloadLinks } = await render(url, manifest)

const finalHtml = template
  .replace('<!--preload-links-->', preloadLinks)
  .replace('<!--app-html-->', html)
```

### Handling CSS

**Development:**
- CSS injected via `<style>` tags
- No special handling needed

**Production:**
```js
// Collect CSS modules during render
const { html, css } = await render(url)

const finalHtml = template
  .replace('<!--app-html-->', html)
  .replace('</head>', `<style>${css}</style></head>`)
```

---

## Hot Module Replacement (HMR)

### HMR API

**Accept Self Updates:**
```js
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    // newModule is updated version of this module
    console.log('Updated:', newModule)
  })
}
```

**Accept Dependency Updates:**
```js
import { foo } from './foo.js'

if (import.meta.hot) {
  import.meta.hot.accept('./foo.js', (newFoo) => {
    // Update foo
    foo = newFoo.foo
  })
}
```

**Accept Multiple Dependencies:**
```js
import.meta.hot.accept(
  ['./foo.js', './bar.js'],
  ([newFoo, newBar]) => {
    // Update both
  }
)
```

**Dispose Handler:**
```js
if (import.meta.hot) {
  let cleanup = setupSomething()

  import.meta.hot.dispose((data) => {
    // Cleanup before update
    cleanup()

    // Store data for next version
    data.someState = getCurrentState()
  })

  // Access previous state
  if (import.meta.hot.data.someState) {
    restoreState(import.meta.hot.data.someState)
  }
}
```

**Invalidate Module:**
```js
import.meta.hot.invalidate()
// Forces full page reload
```

**Custom Events:**
```js
// Client
if (import.meta.hot) {
  import.meta.hot.on('my-event', (data) => {
    console.log('Received:', data)
  })
}

// Plugin
handleHotUpdate({ server }) {
  server.ws.send({
    type: 'custom',
    event: 'my-event',
    data: { msg: 'Hello' }
  })
}
```

**Send Custom Event:**
```js
import.meta.hot.send('my-event-from-client', { some: 'data' })
```

### HMR for Custom File Types

**Plugin:**
```js
export default function customHMR() {
  return {
    name: 'custom-hmr',

    handleHotUpdate({ file, server }) {
      if (file.endsWith('.custom')) {
        // Notify clients
        server.ws.send({
          type: 'custom',
          event: 'custom-update',
          data: { file }
        })

        // Return empty to prevent default HMR
        return []
      }
    }
  }
}
```

**Client:**
```js
if (import.meta.hot) {
  import.meta.hot.on('custom-update', ({ file }) => {
    console.log('Custom file updated:', file)
    // Handle update
  })
}
```

### HMR Best Practices

**1. Preserve State:**
```js
let count = import.meta.hot?.data.count ?? 0

if (import.meta.hot) {
  import.meta.hot.dispose((data) => {
    data.count = count
  })
}
```

**2. Cleanup Side Effects:**
```js
const eventHandler = () => {}
window.addEventListener('resize', eventHandler)

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    window.removeEventListener('resize', eventHandler)
  })
}
```

**3. Conditionally Accept:**
```js
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    if (canUpdate(newModule)) {
      update(newModule)
    } else {
      import.meta.hot.invalidate()
    }
  })
}
```

---

## Backend Integration

### Development Mode

**HTML Setup:**
```html
<!DOCTYPE html>
<html>
  <head>
    <title>App</title>

    <!-- DEV MODE -->
    <?php if (getenv('NODE_ENV') === 'development'): ?>
      <script type="module" src="http://localhost:5173/@vite/client"></script>
      <script type="module" src="http://localhost:5173/src/main.js"></script>
    <?php endif; ?>

    <!-- PRODUCTION MODE -->
    <?php if (getenv('NODE_ENV') === 'production'): ?>
      <!-- Load from manifest -->
      ...
    <?php endif; ?>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

**CORS Configuration:**
```js
// vite.config.js
export default defineConfig({
  server: {
    cors: true,
    origin: 'http://localhost:8000'
  }
})
```

### Production Mode

**Generate Manifest:**
```js
// vite.config.js
export default defineConfig({
  build: {
    manifest: true
  }
})
```

**manifest.json:**
```json
{
  "src/main.js": {
    "file": "assets/main-4ds332.js",
    "src": "src/main.js",
    "isEntry": true,
    "css": ["assets/main-5da443.css"]
  }
}
```

**Backend Helper (PHP):**
```php
<?php
class ViteManifest {
  private $manifest;

  public function __construct($manifestPath) {
    $this->manifest = json_decode(
      file_get_contents($manifestPath),
      true
    );
  }

  public function getEntry($entry) {
    return $this->manifest[$entry] ?? null;
  }

  public function renderTags($entry) {
    $data = $this->getEntry($entry);
    if (!$data) return '';

    $tags = '';

    // CSS
    if (isset($data['css'])) {
      foreach ($data['css'] as $css) {
        $tags .= sprintf(
          '<link rel="stylesheet" href="/%s">',
          $css
        );
      }
    }

    // JS
    $tags .= sprintf(
      '<script type="module" src="/%s"></script>',
      $data['file']
    );

    return $tags;
  }
}

$manifest = new ViteManifest('dist/.vite/manifest.json');
?>

<!DOCTYPE html>
<html>
  <head>
    <?= $manifest->renderTags('src/main.js') ?>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

**Backend Helper (Ruby on Rails):**
```ruby
# app/helpers/vite_helper.rb
module ViteHelper
  def vite_manifest
    @vite_manifest ||= JSON.parse(
      File.read(Rails.root.join('public', '.vite', 'manifest.json'))
    )
  end

  def vite_asset_path(name)
    manifest_entry = vite_manifest[name]
    return '' unless manifest_entry

    "/#{manifest_entry['file']}"
  end

  def vite_javascript_tag(name)
    javascript_include_tag vite_asset_path(name), type: 'module'
  end

  def vite_stylesheet_tag(name)
    manifest_entry = vite_manifest[name]
    return '' unless manifest_entry

    tags = ''
    (manifest_entry['css'] || []).each do |css_file|
      tags += stylesheet_link_tag("/#{css_file}")
    end
    tags.html_safe
  end
end
```

**Usage in Views:**
```erb
<%= vite_stylesheet_tag 'src/main.js' %>
<%= vite_javascript_tag 'src/main.js' %>
```

---

## Performance Optimization

### Development Performance

#### 1. Review Browser Setup
```
❌ DON'T: Use browser cache during development
✅ DO: Disable cache in DevTools Network tab
✅ DO: Use dev-only browser profile
✅ DO: Disable unnecessary browser extensions
✅ DO: Use incognito mode for testing
```

#### 2. Audit Vite Plugins

**Check Plugin Performance:**
```js
// vite.config.js
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'

export default defineConfig({
  plugins: [
    Inspect()  // Visit /__inspect/ to see plugin transform times
  ]
})
```

**Optimize Slow Plugins:**
```
❌ Avoid large dependencies in plugins
❌ Avoid long operations in buildStart, config, configResolved
✅ Make resolveId, load, transform as fast as possible
✅ Use hook filters when available
```

#### 3. Reduce Resolve Operations

**Be Explicit:**
```js
// ❌ Slow - tries multiple extensions
import Component from './Component'

// ✅ Fast - direct hit
import Component from './Component.vue'
```

**Narrow Extensions:**
```js
resolve: {
  extensions: ['.js', '.vue', '.json']  // Only what you need
}
```

#### 4. Avoid Barrel Files

**Barrel File (Slow):**
```js
// utils/index.js
export * from './math'
export * from './string'
export * from './array'
export * from './object'

// App.vue
import { add } from './utils'  // Must process all exports
```

**Direct Import (Fast):**
```js
// App.vue
import { add } from './utils/math'  // Only processes math.js
```

#### 5. Warm Up Files

**Pre-transform Frequently Used:**
```js
server: {
  warmup: {
    clientFiles: [
      './src/components/HeavyComponent.vue',
      './src/utils/complexLib.js'
    ],
    ssrFiles: [
      './src/server/utils.js'
    ]
  }
}
```

#### 6. Use Native Tooling

**CSS:**
```
❌ Sass/Less when not needed
✅ Native CSS or PostCSS
✅ Lightning CSS (transformer: 'lightningcss')
```

**SVG:**
```
❌ Transform SVGs to components (heavy)
✅ Import as URL or raw string
```

**React:**
```
❌ @vitejs/plugin-react (Babel)
✅ @vitejs/plugin-react-swc (SWC - faster)
```

### Build Performance

#### 1. Use Rolldown

**Enable Rolldown:**
```bash
npm install -D vite@npm:rolldown-vite
```

```json
{
  "devDependencies": {
    "vite": "npm:rolldown-vite@latest"
  }
}
```

**Benefits:**
- Faster builds (Rust-powered)
- Unified bundler (replaces esbuild + Rollup)
- Better chunking strategies

#### 2. Minimize Bundle Size

**Analyze Bundle:**
```bash
npm install -D rollup-plugin-visualizer
```

```js
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ]
})
```

**Tree Shaking:**
```js
// ❌ Imports entire library
import _ from 'lodash'

// ✅ Imports only what's needed
import debounce from 'lodash-es/debounce'
```

**Code Splitting:**
```js
// Automatic code splitting
const AdminPanel = () => import('./AdminPanel.vue')

// Manual chunks
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['vue', 'vue-router'],
        ui: ['element-plus']
      }
    }
  }
}
```

#### 3. Disable Unnecessary Features

**Source Maps:**
```js
build: {
  sourcemap: false  // Disable in production if not needed
}
```

**Compressed Size Reporting:**
```js
build: {
  reportCompressedSize: false  // Faster builds
}
```

---

## Deployment

### Static Site Deployment

#### Building

```bash
npm run build
```

**Output:**
```
dist/
├── index.html
├── assets/
│   ├── index.a1b2c3d4.js
│   └── index.e5f6g7h8.css
└── favicon.ico
```

#### GitHub Pages

**Configuration:**
```js
// vite.config.js
export default defineConfig({
  base: '/repo-name/'  // Important for GitHub Pages
})
```

**GitHub Actions:**
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

#### Netlify

**Configuration:**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Deploy:**
```bash
# Via CLI
npm install -g netlify-cli
ntl init
ntl deploy --prod

# Or via Git
# Just push to GitHub and connect in Netlify UI
```

#### Vercel

**Configuration:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

**Deploy:**
```bash
# Via CLI
npm install -g vercel
vercel

# Or via Git
# Push to GitHub and import in Vercel
```

#### Cloudflare Pages

**Deploy:**
```bash
# Via Wrangler
npm install -g wrangler
wrangler pages deploy dist

# Or via Git
# Connect repository in Cloudflare Pages dashboard
```

**Configuration:**
```
Build command: npm run build
Build output directory: dist
```

#### Other Platforms

**Firebase:**
```bash
npm install -g firebase-tools
firebase init hosting
firebase deploy
```

**Surge:**
```bash
npm install -g surge
surge dist
```

**Azure Static Web Apps:**
```yaml
# .github/workflows/azure-static-web-apps.yml
# Use GitHub Actions integration
```

**Render:**
- Static Site
- Build command: `npm run build`
- Publish directory: `dist`

### SSR Deployment

**Node.js:**
```bash
# Build client and server
npm run build

# Start production server
NODE_ENV=production node server.js
```

**Docker:**
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist
COPY server.js ./

EXPOSE 3000
CMD ["node", "server.js"]
```

**PM2:**
```json
{
  "apps": [{
    "name": "my-app",
    "script": "server.js",
    "instances": "max",
    "exec_mode": "cluster",
    "env": {
      "NODE_ENV": "production"
    }
  }]
}
```

```bash
pm2 start ecosystem.config.json
```

---

## Rolldown Integration

### What is Rolldown?

Rolldown is a Rust-powered JavaScript bundler designed as a drop-in replacement for Rollup, offering significant performance improvements while maintaining compatibility.

**Key Features:**
- **Speed**: Significantly faster than Rollup (Rust implementation)
- **Compatibility**: Supports existing Rollup plugins
- **Advanced**: Better chunking, built-in HMR, Module Federation support
- **Unified**: Single bundler for dev and build (replaces esbuild + Rollup)

### Using Rolldown

**Installation:**
```bash
npm install -D vite@npm:rolldown-vite@latest
```

**package.json:**
```json
{
  "devDependencies": {
    "vite": "npm:rolldown-vite@latest"
  }
}
```

**For Meta-Frameworks (Nuxt, Astro, SvelteKit, etc.):**
```json
{
  "overrides": {
    "vite": "npm:rolldown-vite@latest"
  }
}
```

### Major Changes

**1. Build Bundler**
```
Was: Rollup
Now: Rolldown
```

**2. Dependency Optimizer**
```
Was: esbuild
Now: Rolldown
```

**3. CommonJS Plugin**
```
Was: @rollup/plugin-commonjs
Now: Built-in Rolldown CommonJS support
```

**4. Syntax Lowering**
```
Was: esbuild
Now: Oxc (faster TypeScript/JSX transform)
```

**5. CSS Minification**
```
Was: esbuild
Now: Lightning CSS (default)
```

**6. JS Minification**
```
Was: esbuild
Now: Oxc minifier (default)
```

### API Differences

#### manualChunks → advancedChunks

**Rollup (Old):**
```js
build: {
  rollupOptions: {
    output: {
      manualChunks(id) {
        if (id.includes('node_modules')) {
          if (/\/react(?:-dom)?/.test(id)) {
            return 'vendor'
          }
        }
      }
    }
  }
}
```

**Rolldown (New):**
```js
build: {
  rollupOptions: {
    output: {
      advancedChunks: {
        groups: [
          {
            name: 'vendor',
            test: /\/react(?:-dom)?/
          }
        ]
      }
    }
  }
}
```

**Benefits:**
- More powerful chunking strategies
- Better performance
- Cleaner API

### Compatibility

**Supported:**
- Most Rollup plugins
- Vite plugins
- Standard build configurations

**May Need Updates:**
- Custom Rollup plugins using advanced features
- Direct Rollup API usage

### Performance Gains

**Typical Improvements:**
- **Dev Server Start**: 2-3x faster
- **Build Time**: 3-5x faster
- **HMR**: Near-instant updates

---

## Migration Guide

### Vite 6 → Vite 7

#### Node.js Support

**Removed:**
- Node.js 18

**Required:**
- Node.js 20.19+
- Node.js 22.12+

**Action:**
```bash
# Check version
node --version

# Update if needed
nvm install 20
nvm use 20
```

#### Browser Target

**Changed:**
```js
// Old default (Vite 6)
build: {
  target: 'esnext'  // Or specific browsers
}

// New default (Vite 7)
build: {
  target: 'baseline-widely-available'
}
```

**New Baseline:**
- Chrome: 107+ (was 87)
- Edge: 107+ (was 88)
- Firefox: 104+ (was 78)
- Safari: 16+ (was 14)

**Action:**
```js
// If you need old browser support
export default defineConfig({
  build: {
    target: ['chrome87', 'edge88', 'firefox78', 'safari14']
  }
})
```

#### Removed Features

**1. Sass Legacy API**
```js
// ❌ No longer supported
css: {
  preprocessorOptions: {
    scss: {
      api: 'legacy'
    }
  }
}

// ✅ Use modern API
css: {
  preprocessorOptions: {
    scss: {
      api: 'modern-compiler'  // or 'modern'
    }
  }
}
```

**2. splitVendorChunkPlugin**
```js
// ❌ Removed
import { splitVendorChunkPlugin } from 'vite'

plugins: [splitVendorChunkPlugin()]

// ✅ Use manual chunks
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['vue', 'vue-router']
      }
    }
  }
}
```

**3. transformIndexHtml Hook-Level enforce**
```js
// ❌ No longer supported
transformIndexHtml: {
  enforce: 'pre',
  transform(html) {
    return html
  }
}

// ✅ Use plugin-level enforce
export default function myPlugin() {
  return {
    name: 'my-plugin',
    enforce: 'pre',
    transformIndexHtml(html) {
      return html
    }
  }
}
```

#### Deprecated Type Properties

**Removed:**
- `PreRenderedChunk.code`
- `PreRenderedChunk.map`
- `RenderedChunk.code`
- `RenderedChunk.map`

**Action:**
These were type-only properties, no runtime impact.

---

## Troubleshooting

### CLI Issues

#### Cannot Find Module with `&` in Path

**Error:**
```
Error: Cannot find module 'C:\path\with&ampersand'
```

**Solution:**
- Switch from npm to pnpm/yarn/bun, or
- Remove `&` from project path

### Config Issues

#### ESM-Only Package Error

**Error:**
```
require() of ES Module not supported
```

**Solution 1: Use ESM Config**
```js
// vite.config.js → vite.config.mjs
export default defineConfig({
  // ...
})
```

**Solution 2: Use package.json type**
```json
{
  "type": "module"
}
```

**Solution 3: Node.js Flag (Experimental)**
```bash
NODE_OPTIONS='--experimental-require-module' vite
```

### Dev Server Issues

#### Requests Stall on macOS

**Cause:**
File descriptor limit too low

**Solution:**
```bash
# Check current limit
ulimit -Sn

# Increase limit
ulimit -Sn 10000

# Make permanent in ~/.zshrc or ~/.bashrc
echo "ulimit -Sn 10000" >> ~/.zshrc
```

#### Network Requests Stop Loading

**Cause:**
Untrusted SSL certificate

**Solution:**
```bash
# Use mkcert to create trusted certificate
npm install -g mkcert
mkcert -install
mkcert localhost
```

```js
// vite.config.js
import fs from 'fs'

export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem')
    }
  }
})
```

#### 431 Request Header Fields Too Large

**Cause:**
Large cookies or headers

**Solution:**
```bash
NODE_OPTIONS='--max-http-header-size=16384' vite
```

### HMR Issues

#### Full Reload Instead of HMR

**Cause:**
Circular dependency

**Solution:**
```js
// Break circular dependency
// File A imports B, File B imports A

// Bad
// a.js
import { b } from './b.js'

// b.js
import { a } from './a.js'

// Good - extract shared code
// shared.js
export const shared = {}

// a.js
import { shared } from './shared.js'

// b.js
import { shared } from './shared.js'
```

#### File Changes Not Detected

**Cause:**
Case sensitivity issues

**Solution:**
```js
server: {
  watch: {
    usePolling: true  // Use polling instead of native watchers
  }
}
```

### Build Issues

#### CORS Error with file:// Protocol

**Error:**
```
Access to script at 'file:///path/to/index.js' from origin 'null' has been blocked by CORS
```

**Solution:**
Use `vite preview` to serve with HTTP:
```bash
vite preview
```

#### Failed to Fetch Dynamically Imported Module

**Causes:**
1. Version skew (deployed new version while user has old page open)
2. Network issues
3. Browser extensions blocking requests

**Solutions:**
```js
// 1. Version hash in filename
build: {
  rollupOptions: {
    output: {
      entryFileNames: 'assets/[name].[hash].js'
    }
  }
}

// 2. Handle errors gracefully
const module = await import('./module.js').catch(err => {
  console.error('Failed to load module:', err)
  window.location.reload()
})
```

#### Optimized Dependencies Outdated

**Problem:**
Pre-bundled dependencies not updating

**Solution:**
```bash
# Force re-optimization
vite --force

# Or use npm overrides
```

```json
{
  "overrides": {
    "problematic-package": "^2.0.0"
  }
}
```

### Module Issues

#### Module Externalized for Browser

**Error:**
```
Module "fs" has been externalized for browser compatibility
```

**Cause:**
Trying to use Node.js modules in browser code

**Solution:**
```js
// Option 1: Remove Node.js code from client
// Option 2: Use browser-compatible alternatives
import { readFile } from 'node:fs'  // ❌ Won't work in browser

// Use fetch or other browser APIs
const data = await fetch('/api/file').then(r => r.text())  // ✅
```

#### Failed to Resolve Import

**Error:**
```
Failed to resolve import "./Component" from "src/App.vue"
```

**Solutions:**
```js
// 1. Add file extension
import Component from './Component.vue'  // ✅ Instead of './Component'

// 2. Configure extensions
resolve: {
  extensions: ['.js', '.vue', '.json']
}

// 3. Check case sensitivity
import Component from './component.vue'  // ❌ Wrong case
import Component from './Component.vue'  // ✅ Correct case
```

### Performance Issues

#### Slow Dev Server

**Check:**
1. Browser cache disabled? ✅
2. Using incognito mode? ✅
3. Large node_modules? → Use pnpm
4. Heavy Vite plugins? → Use vite-plugin-inspect
5. Many barrel files? → Use direct imports

#### Slow Build

**Solutions:**
```js
// 1. Disable source maps
build: {
  sourcemap: false
}

// 2. Disable compressed size reporting
build: {
  reportCompressedSize: false
}

// 3. Use Rolldown
{
  "devDependencies": {
    "vite": "npm:rolldown-vite@latest"
  }
}
```

---

## Environment API (Vite 6+)

### Release Status

The Environment API is in **Release Candidate** phase. APIs are stable between major releases to allow ecosystem experimentation, but some specific APIs are still experimental.

**Resources:**
- [Feedback Discussion](https://github.com/vitejs/vite/discussions/16358)
- [Environment API PR](https://github.com/vitejs/vite/pull/16471)

### Core Concepts

#### Formalizing Environments

Vite 6 formalizes the concept of **Environments**. Until Vite 5, there were two implicit environments (`client` and optionally `ssr`). The new Environment API allows users and framework authors to create as many environments as needed to map how their apps work in production.

**Key improvements:**
- Support for multiple custom environments (e.g., `client`, `server`, `edge`, `rsc`)
- Closer alignment between dev and production
- Support for different JS runtimes (Node, workerd, Deno, etc.)
- Independent module graphs per environment
- Environment-specific configuration

#### Closing the Gap Between Build and Dev

For simple SPAs/MPAs, no new APIs are needed - the config and behavior from Vite 5 works seamlessly. For SSR apps, you typically have two environments:

- **`client`**: Runs the app in the browser
- **`ssr`**: Runs the app in Node (or other server runtimes) for server-side rendering

Modern apps may run in more than two environments (e.g., browser + node server + edge server). Vite 6 allows configuring all environments during both build and dev.

---

### Environments Configuration

#### Basic Configuration (SPA/MPA)

For simple apps, configuration remains unchanged from Vite 5:

```js
export default defineConfig({
  build: {
    sourcemap: false,
  },
  optimizeDeps: {
    include: ['lib'],
  },
})
```

Internally, these options configure the `client` environment.

#### Multi-Environment Configuration

For apps with multiple environments:

```js
export default {
  build: {
    sourcemap: false,
  },
  optimizeDeps: {
    include: ['lib'],
  },
  environments: {
    server: {},
    edge: {
      resolve: {
        noExternal: true,
      },
    },
  },
}
```

**Inheritance:**
- Environments inherit top-level config options (e.g., `build.sourcemap: false`)
- Some options (like `optimizeDeps`) only apply to `client` environment by default
- The `client` environment can be configured via top-level options or `environments.client`

#### Environment Options Interface

```ts
interface EnvironmentOptions {
  define?: Record<string, any>
  resolve?: EnvironmentResolveOptions
  optimizeDeps: DepOptimizationOptions
  consumer?: 'client' | 'server'
  dev: DevOptions
  build: BuildOptions
}
```

#### User Config Interface

```ts
interface UserConfig extends EnvironmentOptions {
  environments: Record<string, EnvironmentOptions>
  // other options
}
```

**Default environments:**
- **Dev:** `client` and `ssr` are always present
- **Build:** `client` is always present; `ssr` only if configured

#### Custom Environment Instances

Low-level APIs allow runtime providers to create environments with proper defaults:

```js
import { customEnvironment } from 'vite-environment-provider'

export default {
  build: {
    outDir: '/dist/client',
  },
  environments: {
    ssr: customEnvironment({
      build: {
        outDir: '/dist/ssr',
      },
    }),
  },
}
```

---

### DevEnvironment Class

#### Class Definition

During dev, each environment is an instance of `DevEnvironment`:

```ts
class DevEnvironment {
  /**
   * Unique identifier for the environment in a Vite server.
   * By default Vite exposes 'client' and 'ssr' environments.
   */
  name: string

  /**
   * Communication channel to send and receive messages from the
   * associated module runner in the target runtime.
   */
  hot: NormalizedHotChannel

  /**
   * Graph of module nodes, with the imported relationship between
   * processed modules and the cached result of the processed code.
   */
  moduleGraph: EnvironmentModuleGraph

  /**
   * Resolved plugins for this environment, including the ones
   * created using the per-environment `create` hook
   */
  plugins: Plugin[]

  /**
   * Allows to resolve, load, and transform code through the
   * environment plugins pipeline
   */
  pluginContainer: EnvironmentPluginContainer

  /**
   * Resolved config options for this environment. Options at the server
   * global scope are taken as defaults for all environments, and can
   * be overridden (resolve conditions, external, optimizedDeps)
   */
  config: ResolvedConfig & ResolvedDevEnvironmentOptions

  constructor(
    name: string,
    config: ResolvedConfig,
    context: DevEnvironmentContext,
  )

  /**
   * Resolve the URL to an id, load it, and process the code using the
   * plugins pipeline. The module graph is also updated.
   */
  async transformRequest(url: string): Promise<TransformResult | null>

  /**
   * Register a request to be processed with low priority. This is useful
   * to avoid waterfalls. The Vite server has information about the
   * imported modules by other requests, so it can warmup the module graph
   * so the modules are already processed when they are requested.
   */
  async warmupRequest(url: string): Promise<void>
}
```

#### DevEnvironmentContext

```ts
interface DevEnvironmentContext {
  hot: boolean
  transport?: HotChannel | WebSocketServer
  options?: EnvironmentOptions
  remoteRunner?: {
    inlineSourceMap?: boolean
  }
  depsOptimizer?: DepsOptimizer
}
```

#### TransformResult

```ts
interface TransformResult {
  code: string
  map: SourceMap | { mappings: '' } | null
  etag?: string
  deps?: string[]
  dynamicDeps?: string[]
}
```

#### Accessing Environments

During dev:

```js
// create the server, or get it from the configureServer hook
const server = await createServer(/* options */)

const clientEnvironment = server.environments.client
clientEnvironment.transformRequest(url)
console.log(server.environments.ssr.moduleGraph)
```

---

### Module Graphs Per Environment

#### Separate Module Graphs

Each environment has an **isolated module graph**. All module graphs have the same signature, enabling generic algorithms to crawl or query the graph without depending on the environment.

**Key differences from Vite 5:**
- Vite v5: Mixed Client and SSR module graph with `clientImportedModules`, `ssrImportedModules`, `transformResult`, and `ssrTransformResult`
- Vite v6: Separate graph per environment with cleaner separation

#### EnvironmentModuleNode

```ts
class EnvironmentModuleNode {
  environment: string

  url: string
  id: string | null = null
  file: string | null = null

  type: 'js' | 'css'

  importers = new Set<EnvironmentModuleNode>()
  importedModules = new Set<EnvironmentModuleNode>()
  importedBindings: Map<string, Set<string>> | null = null

  info?: ModuleInfo
  meta?: Record<string, any>
  transformResult: TransformResult | null = null

  acceptedHmrDeps = new Set<EnvironmentModuleNode>()
  acceptedHmrExports: Set<string> | null = null
  isSelfAccepting?: boolean
  lastHMRTimestamp = 0
  lastInvalidationTimestamp = 0
}
```

#### EnvironmentModuleGraph

```ts
export class EnvironmentModuleGraph {
  environment: string

  urlToModuleMap = new Map<string, EnvironmentModuleNode>()
  idToModuleMap = new Map<string, EnvironmentModuleNode>()
  etagToModuleMap = new Map<string, EnvironmentModuleNode>()
  fileToModulesMap = new Map<string, Set<EnvironmentModuleNode>>()

  constructor(
    environment: string,
    resolveId: (url: string) => Promise<PartialResolvedId | null>,
  )

  async getModuleByUrl(
    rawUrl: string,
  ): Promise<EnvironmentModuleNode | undefined>

  getModuleById(id: string): EnvironmentModuleNode | undefined

  getModulesByFile(file: string): Set<EnvironmentModuleNode> | undefined

  onFileChange(file: string): void

  onFileDelete(file: string): void

  invalidateModule(
    mod: EnvironmentModuleNode,
    seen: Set<EnvironmentModuleNode> = new Set(),
    timestamp: number = monotonicDateNow(),
    isHmr: boolean = false,
  ): void

  invalidateAll(): void

  async ensureEntryFromUrl(
    rawUrl: string,
    setIsSelfAccepting = true,
  ): Promise<EnvironmentModuleNode>

  createFileOnlyEntry(file: string): EnvironmentModuleNode

  async resolveUrl(url: string): Promise<ResolvedUrl>

  updateModuleTransformResult(
    mod: EnvironmentModuleNode,
    result: TransformResult | null,
  ): void

  getModuleByEtag(etag: string): EnvironmentModuleNode | undefined
}
```

---

### Environment-Aware Plugins

#### Accessing the Current Environment in Hooks

Plugin hooks now expose `this.environment` in their context:

```ts
transform(code, id) {
  console.log(this.environment.config.resolve.conditions)
}
```

**Migration from `ssr` boolean:**
- Old: `server.moduleGraph.getModuleByUrl(url, { ssr })`
- New: `environment.moduleGraph.getModuleByUrl(url)`

#### Registering New Environments

Plugins can add new environments in the `config` hook:

```ts
config(config: UserConfig) {
  return {
    environments: {
      rsc: {
        resolve: {
          conditions: ['react-server', ...defaultServerConditions],
        },
      },
    },
  }
}
```

#### Configuring Environments

Use the `configEnvironment` hook to configure each environment:

```ts
configEnvironment(name: string, options: EnvironmentOptions) {
  if (name === 'rsc') {
    return {
      resolve: {
        conditions: ['workerd'],
      },
    }
  }
}
```

#### The `hotUpdate` Hook

**Type:**
```ts
(this: { environment: DevEnvironment }, options: HotUpdateOptions) =>
  Array<EnvironmentModuleNode> | void | Promise<Array<EnvironmentModuleNode> | void>
```

**Kind:** `async`, `sequential`

```ts
interface HotUpdateOptions {
  type: 'create' | 'update' | 'delete'
  file: string
  timestamp: number
  modules: Array<EnvironmentModuleNode>
  read: () => string | Promise<string>
  server: ViteDevServer
}
```

**Usage examples:**

Filter and narrow down affected modules:
```js
hotUpdate({ modules }) {
  return modules.filter(condition)
}
```

Perform a full reload:
```js
hotUpdate({ modules, timestamp }) {
  if (this.environment.name !== 'client')
    return

  const invalidatedModules = new Set()
  for (const mod of modules) {
    this.environment.moduleGraph.invalidateModule(
      mod,
      invalidatedModules,
      timestamp,
      true
    )
  }
  this.environment.hot.send({ type: 'full-reload' })
  return []
}
```

Custom HMR handling:
```js
hotUpdate() {
  if (this.environment.name !== 'client')
    return

  this.environment.hot.send({
    type: 'custom',
    event: 'special-update',
    data: {}
  })
  return []
}
```

#### Per-Environment State in Plugins

Keep state keyed by environment using `Map<Environment, State>`:

```js
function PerEnvironmentCountTransformedModulesPlugin() {
  const state = new Map<Environment, { count: number }>()
  return {
    name: 'count-transformed-modules',
    perEnvironmentStartEndDuringDev: true,
    buildStart() {
      state.set(this.environment, { count: 0 })
    },
    transform(id) {
      state.get(this.environment).count++
    },
    buildEnd() {
      console.log(this.environment.name, state.get(this.environment).count)
    }
  }
}
```

**Note:** Without the `perEnvironmentStartEndDuringDev: true` flag, `buildStart` and `buildEnd` are only called for the client environment during dev.

#### Per-Environment Plugins

Use `applyToEnvironment` to control which environments a plugin applies to:

```js
const UnoCssPlugin = () => {
  return {
    buildStart() {
      // init per-environment state
    },
    configureServer() {
      // use global hooks normally
    },
    applyToEnvironment(environment) {
      // return true if this plugin should be active in this environment,
      // or return a new plugin to replace it.
    },
    resolveId(id, importer) {
      // only called for environments this plugin applies to
    },
  }
}
```

Making non-shareable plugins per-environment:

```js
import { nonShareablePlugin } from 'non-shareable-plugin'

export default defineConfig({
  plugins: [
    {
      name: 'per-environment-plugin',
      applyToEnvironment(environment) {
        return nonShareablePlugin({ outputName: environment.name })
      },
    },
  ],
})
```

Or using the `perEnvironmentPlugin` helper:

```js
import { perEnvironmentPlugin } from 'vite'
import { nonShareablePlugin } from 'non-shareable-plugin'

export default defineConfig({
  plugins: [
    perEnvironmentPlugin('per-environment-plugin', (environment) =>
      nonShareablePlugin({ outputName: environment.name }),
    ),
  ],
})
```

#### Application-Plugin Communication

`environment.hot` allows plugins to communicate with application code:

**Plugin side:**
```js
configureServer(server) {
  server.environments.ssr.hot.on('my:greetings', (data, client) => {
    // do something with data
    client.send('my:reply', `Hello from server! You said: ${data}`)
  })

  // broadcast to all application instances
  server.environments.ssr.hot.send('my:foo', 'Hello from server!')
}
```

**Application side:**
```js
if (import.meta.hot) {
  import.meta.hot.on('special-update', (data) => {
    // perform custom update
  })
}
```

**Managing multiple instances:**
- `vite:client:connect` event: New connection established
- `vite:client:disconnect` event: Connection closed
- Each handler receives `NormalizedHotChannelClient` as second argument

#### Shared Plugins During Build

**Default behavior in Vite 6:**
- **Dev:** Plugins are shared
- **Build:** Separate plugin instances per environment (backward compatible)

**Opt-in to sharing:**
Set `builder.sharedConfigBuild` to `true` for complete alignment between dev and build.

Individual plugins can opt-in using `sharedDuringBuild`:

```js
function myPlugin() {
  const sharedState = /* ... */
  return {
    name: 'shared-plugin',
    transform(code, id) { /* ... */ },
    sharedDuringBuild: true,
  }
}
```

---

### ModuleRunner Class and API

#### Overview

A **Module Runner** is instantiated in the target runtime to execute code. It's different from `server.ssrLoadModule` because the runner implementation is decoupled from the server.

**Import from:** `vite/module-runner`

#### ModuleRunner Class

```ts
export class ModuleRunner {
  constructor(
    public options: ModuleRunnerOptions,
    public evaluator: ModuleEvaluator = new ESModulesEvaluator(),
    private debug?: ModuleRunnerDebugger,
  ) {}

  /**
   * URL to execute.
   * Accepts file path, server path, or id relative to the root.
   */
  public async import<T = any>(url: string): Promise<T>

  /**
   * Clear all caches including HMR listeners.
   */
  public clearCache(): void

  /**
   * Clear all caches, remove all HMR listeners, reset sourcemap support.
   * This method doesn't stop the HMR connection.
   */
  public async close(): Promise<void>

  /**
   * Returns `true` if the runner has been closed by calling `close()`.
   */
  public isClosed(): boolean
}
```

**Warning:** The `runner` is evaluated lazily on first access. Vite enables source map support when the runner is created.

#### ModuleRunnerOptions

```ts
interface ModuleRunnerOptions {
  /**
   * A set of methods to communicate with the server.
   */
  transport: ModuleRunnerTransport

  /**
   * Configure how source maps are resolved.
   * Prefers `node` if `process.setSourceMapsEnabled` is available.
   * Otherwise uses `prepareStackTrace` by default.
   */
  sourcemapInterceptor?:
    | false
    | 'node'
    | 'prepareStackTrace'
    | InterceptorOptions

  /**
   * Disable HMR or configure HMR options.
   * @default true
   */
  hmr?: boolean | ModuleRunnerHmr

  /**
   * Custom module cache. If not provided, creates a separate module
   * cache for each module runner instance.
   */
  evaluatedModules?: EvaluatedModules
}
```

#### ModuleEvaluator

```ts
export interface ModuleEvaluator {
  /**
   * Number of prefixed lines in the transformed code.
   */
  startOffset?: number

  /**
   * Evaluate code that was transformed by Vite.
   */
  runInlinedModule(
    context: ModuleRunnerContext,
    code: string,
    id: string,
  ): Promise<any>

  /**
   * Evaluate externalized module.
   */
  runExternalModule(file: string): Promise<any>
}
```

Vite exports `ESModulesEvaluator` that uses `new AsyncFunction` to evaluate code. It has an offset of 2 lines for inline source maps.

#### ModuleRunnerTransport

```ts
interface ModuleRunnerTransport {
  connect?(handlers: ModuleRunnerTransportHandlers): Promise<void> | void
  disconnect?(): Promise<void> | void
  send?(data: HotPayload): Promise<void> | void
  invoke?(data: HotPayload): Promise<{ result: any } | { error: any }>
  timeout?: number
}
```

**Example: Worker Thread Transport**

```js
// worker.js
import { parentPort } from 'node:worker_threads'
import {
  ESModulesEvaluator,
  ModuleRunner,
  createNodeImportMeta,
} from 'vite/module-runner'

const transport = {
  connect({ onMessage, onDisconnection }) {
    parentPort.on('message', onMessage)
    parentPort.on('close', onDisconnection)
  },
  send(data) {
    parentPort.postMessage(data)
  },
}

const runner = new ModuleRunner(
  {
    transport,
    createImportMeta: createNodeImportMeta,
  },
  new ESModulesEvaluator(),
)
```

**Example: HTTP Transport**

```ts
import { ESModulesEvaluator, ModuleRunner } from 'vite/module-runner'

export const runner = new ModuleRunner(
  {
    transport: {
      async invoke(data) {
        const response = await fetch(`http://my-vite-server/invoke`, {
          method: 'POST',
          body: JSON.stringify(data),
        })
        return response.json()
      },
    },
    hmr: false, // HMR requires transport.connect
  },
  new ESModulesEvaluator(),
)

await runner.import('/entry.js')
```

**Server-side handler:**

```ts
const customEnvironment = new DevEnvironment(name, config, context)

server.onRequest(async (request: Request) => {
  const url = new URL(request.url)
  if (url.pathname === '/invoke') {
    const payload = await request.json()
    const result = customEnvironment.hot.handleInvoke(payload)
    return new Response(JSON.stringify(result))
  }
  return Response.error()
})
```

#### Example Usage

```js
import {
  ModuleRunner,
  ESModulesEvaluator,
  createNodeImportMeta,
} from 'vite/module-runner'
import { transport } from './rpc-implementation.js'

const moduleRunner = new ModuleRunner(
  {
    transport,
    createImportMeta: createNodeImportMeta,
  },
  new ESModulesEvaluator(),
)

await moduleRunner.import('/src/entry-point.js')
```

---

### Framework Integration

#### DevEnvironment Communication Levels

Three communication levels are provided for runtime-agnostic code:

##### 1. RunnableDevEnvironment

Can communicate arbitrary values. The implicit `ssr` environment uses this by default.

```ts
export class RunnableDevEnvironment extends DevEnvironment {
  public readonly runner: ModuleRunner
}

class ModuleRunner {
  public async import(url: string): Promise<Record<string, any>>
}

if (isRunnableDevEnvironment(server.environments.ssr)) {
  await server.environments.ssr.runner.import('/entry-point.js')
}
```

**Example SSR middleware:**

```js
import { createServer } from 'vite'

const viteServer = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  environments: {
    server: {},
  },
})

const serverEnvironment = viteServer.environments.server

app.use('*', async (req, res, next) => {
  const url = req.originalUrl

  // 1. Read index.html
  let template = fs.readFileSync('index.html', 'utf-8')

  // 2. Apply Vite HTML transforms
  template = await viteServer.transformIndexHtml(url, template)

  // 3. Load the server entry
  const { render } = await serverEnvironment.runner.import(
    '/src/entry-server.js',
  )

  // 4. Render the app HTML
  const appHtml = await render(url)

  // 5. Inject the app-rendered HTML
  const html = template.replace(`<!--ssr-outlet-->`, appHtml)

  // 6. Send the rendered HTML
  res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
})
```

**HMR optimization:**

```js
// src/entry-server.js
export function render(...) { /* ... */ }

if (import.meta.hot) {
  import.meta.hot.accept()
}
```

##### 2. FetchableDevEnvironment

Communicates via the Fetch API interface (recommended for most runtimes):

```ts
import {
  createServer,
  createFetchableDevEnvironment,
  isFetchableDevEnvironment,
} from 'vite'

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  environments: {
    custom: {
      dev: {
        createEnvironment(name, config) {
          return createFetchableDevEnvironment(name, config, {
            handleRequest(request: Request): Promise<Response> | Response {
              // handle Request and return a Response
            },
          })
        },
      },
    },
  },
})

if (isFetchableDevEnvironment(server.environments.custom)) {
  const response = await server.environments.custom.dispatchFetch(
    new Request('/request-to-handle'),
  )
}
```

**Warning:** Request must be instance of global `Request` class and response must be instance of global `Response` class, or Vite will throw a `TypeError`.

##### 3. Raw DevEnvironment

For environments not implementing the above interfaces, set up communication manually using:

**Virtual modules:**
```ts
import { createServer } from 'vite'

const server = createServer({
  plugins: [
    {
      name: 'virtual-module',
      resolveId(source) {
        return source === 'virtual:entrypoint' ? '\0' + source : undefined
      },
      async load(id) {
        if (id === '\0virtual:entrypoint') {
          return `export function createHandler() { /* ... */ }`
        }
      }
    },
  ],
})

const ssrEnvironment = server.environment.ssr
if (ssrEnvironment instanceof CustomDevEnvironment) {
  ssrEnvironment.runEntrypoint('virtual:entrypoint')
}
```

**HMR communication:**
```ts
// Server side
const uniqueId = 'a-unique-id'
ssrEnvironment.send('request', serialize({ req, uniqueId }))
const response = await new Promise((resolve) => {
  ssrEnvironment.on('response', (data) => {
    data = deserialize(data)
    if (data.uniqueId === uniqueId) {
      resolve(data.res)
    }
  })
})

// Client side (virtual:entrypoint)
import.meta.hot.on('request', (data) => {
  const { req, uniqueId } = deserialize(data)
  const res = handler(req)
  import.meta.hot.send('response', serialize({ res, uniqueId }))
})
```

#### Environments During Build

**CLI:**
- `vite build`: Builds client only (backward compatible)
- `vite build --ssr`: Builds SSR only (backward compatible)
- `vite build --app`: Builds all environments

**Configuration:**

```js
export default {
  builder: {
    buildApp: async (builder) => {
      const environments = Object.values(builder.environments)
      await Promise.all(
        environments.map((environment) => builder.build(environment)),
      )
    },
  },
}
```

**Plugin hook:**
Plugins can define a `buildApp` hook:
- Order `'pre'` and `null`: Executed before configured `builder.buildApp`
- Order `'post'`: Executed after configured `builder.buildApp`
- Use `environment.isBuilt` to check if environment has been built

---

### Environment Factories (Runtime Providers)

#### Creating Environment Factories

Environment factories provide proper defaults for specific runtimes:

```ts
function createWorkerdEnvironment(
  userConfig: EnvironmentOptions,
): EnvironmentOptions {
  return mergeConfig(
    {
      resolve: {
        conditions: [/* ... */],
      },
      dev: {
        createEnvironment(name, config) {
          return createWorkerdDevEnvironment(name, config, {
            hot: true,
            transport: customHotChannel(),
          })
        },
      },
      build: {
        createEnvironment(name, config) {
          return createWorkerdBuildEnvironment(name, config)
        },
      },
    },
    userConfig,
  )
}
```

**Usage:**

```js
import { createWorkerdEnvironment } from 'vite-environment-workerd'

export default {
  environments: {
    ssr: createWorkerdEnvironment({
      build: {
        outDir: '/dist/ssr',
      },
    }),
    rsc: createWorkerdEnvironment({
      build: {
        outDir: '/dist/rsc',
      },
    }),
  },
}
```

#### Creating a Custom DevEnvironment

```ts
import { DevEnvironment, HotChannel } from 'vite'

function createWorkerdDevEnvironment(
  name: string,
  config: ResolvedConfig,
  context: DevEnvironmentContext
) {
  const connection = /* ... */
  const transport: HotChannel = {
    on: (listener) => { connection.on('message', listener) },
    send: (data) => connection.send(data),
  }

  const workerdDevEnvironment = new DevEnvironment(name, config, {
    options: {
      resolve: { conditions: ['custom'] },
      ...context.options,
    },
    hot: true,
    transport,
  })
  return workerdDevEnvironment
}
```

---

## Breaking Changes and Future Deprecations

### Status Categories

**Planned:** Breaking changes planned for next major version
- `this.environment` in Hooks
- HMR `hotUpdate` Plugin Hook
- SSR Using `ModuleRunner` API

**Considering:** Experimental APIs gathering feedback
- Move to Per-environment APIs
- Shared Plugins During Build

**Past:** No past changes yet in Vite 6

### 1. `this.environment` in Hooks

**Status:** Future Deprecation (introduced in v6.0)

**Migration from `options.ssr`:**

```ts
// Before
export function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    resolveId(id, importer, options) {
      const isSSR = options.ssr // [!code --]
      const isSSR = this.environment.config.consumer === 'server' // [!code ++]
    },
  }
}
```

**Enable warnings:**
```ts
export default {
  future: {
    removePluginHookSsrArgument: 'warn',
  },
}
```

**Benefits:**
- Access to environment name, config, module graph, transform pipeline
- No dependency on the entire dev server
- Support for multiple environments beyond client/ssr

**Long-term implementation:**
Use fine-grained environment options instead of relying on environment name:

```ts
resolveId(id, importer) {
  const conditions = this.environment.config.resolve.conditions
  // Use conditions for logic instead of checking environment name
}
```

### 2. HMR `hotUpdate` Plugin Hook

**Status:** Future Deprecation (introduced in v6.0)

**Migration from `handleHotUpdate`:**

```js
// Before: handleHotUpdate
handleHotUpdate({ modules }) {
  return modules.filter(condition)
}

// After: hotUpdate
hotUpdate({ modules }) {
  return modules.filter(condition)
}
```

**Full reload example:**

```js
// Before
handleHotUpdate({ server, modules, timestamp }) {
  const invalidatedModules = new Set()
  for (const mod of modules) {
    server.moduleGraph.invalidateModule(
      mod,
      invalidatedModules,
      timestamp,
      true
    )
  }
  server.ws.send({ type: 'full-reload' })
  return []
}

// After
hotUpdate({ modules, timestamp }) {
  const invalidatedModules = new Set()
  for (const mod of modules) {
    this.environment.moduleGraph.invalidateModule(
      mod,
      invalidatedModules,
      timestamp,
      true
    )
  }
  this.environment.hot.send({ type: 'full-reload' })
  return []
}
```

**Custom events:**

```js
// Before
handleHotUpdate({ server }) {
  server.ws.send({
    type: 'custom',
    event: 'special-update',
    data: {}
  })
  return []
}

// After
hotUpdate() {
  this.environment.hot.send({
    type: 'custom',
    event: 'special-update',
    data: {}
  })
  return []
}
```

**Enable warnings:**
```ts
export default {
  future: {
    removePluginHookHandleHotUpdate: 'warn',
  },
}
```

**Key changes:**
- Called for each environment separately (not once for all)
- Receives `EnvironmentModuleNode` instead of mixed `ModuleNode`
- Includes `type: 'create' | 'update' | 'delete'` for additional watch events
- Access via `this.environment` instead of `server`

### 3. Move to Per-environment APIs

**Status:** Future Deprecation (introduced in v6.0)

**APIs moved to DevEnvironment:**

| Old API | New API |
|---------|---------|
| `server.moduleGraph` | `environment.moduleGraph` |
| `server.reloadModule(module)` | `environment.reloadModule(module)` |
| `server.pluginContainer` | `environment.pluginContainer` |
| `server.transformRequest(url, ssr)` | `environment.transformRequest(url)` |
| `server.warmupRequest(url, ssr)` | `environment.warmupRequest(url)` |
| `server.hot` | `server.client.environment.hot` |

**Enable warnings:**
```ts
export default {
  future: {
    removeServerModuleGraph: 'warn',
    removeServerReloadModule: 'warn',
    removeServerPluginContainer: 'warn',
    removeServerHot: 'warn',
    removeServerTransformRequest: 'warn',
    removeServerWarmupRequest: 'warn',
  },
}
```

**Motivation:**
- In Vite v5: Single `ssr` boolean to identify environment
- In Vite v6: Multiple custom environments require environment-scoped APIs
- Benefits: APIs can be called without a Vite dev server instance

### 4. SSR Using `ModuleRunner` API

**Status:** Future Deprecation (introduced in v6.0)

**Migration:**

```js
// Before
const module = await server.ssrLoadModule(url)

// After
const module = await server.environments.ssr.runner.import(url)
```

**Enable warnings:**
```ts
export default {
  future: {
    removeSsrLoadModule: 'warn',
  },
}
```

**Benefits:**
- `server.ssrLoadModule` only works with `ssr` environment
- `ModuleRunner` supports custom environments
- Runner can execute in separate thread/process
- Better alignment with Environment API

**Stack traces:**
`server.ssrFixStacktrace` and `server.ssrRewriteStacktrace` are not needed with Module Runner APIs. Stack traces are automatically updated unless `sourcemapInterceptor` is set to `false`.

### 5. Shared Plugins During Build

**Status:** Future Default Change (introduced in v6.0)

**Migration for shared state:**

```js
// Before: Shared across all environments
function CountTransformedModulesPlugin() {
  let transformedModules
  return {
    name: 'count-transformed-modules',
    buildStart() {
      transformedModules = 0
    },
    transform(id) {
      transformedModules++
    },
    buildEnd() {
      console.log(transformedModules)
    },
  }
}

// After: Per-environment tracking
function PerEnvironmentCountTransformedModulesPlugin() {
  const state = new Map<Environment, { count: number }>()
  return {
    name: 'count-transformed-modules',
    perEnvironmentStartEndDuringDev: true,
    buildStart() {
      state.set(this.environment, { count: 0 })
    },
    transform(id) {
      state.get(this.environment).count++
    },
    buildEnd() {
      console.log(this.environment.name, state.get(this.environment).count)
    }
  }
}
```

**Using `perEnvironmentState` helper:**

```js
import { perEnvironmentState } from 'vite'

function PerEnvironmentCountTransformedModulesPlugin() {
  const state = perEnvironmentState<{ count: number }>(() => ({ count: 0 }))
  return {
    name: 'count-transformed-modules',
    perEnvironmentStartEndDuringDev: true,
    buildStart() {
      state(this).count = 0
    },
    transform(id) {
      state(this).count++
    },
    buildEnd() {
      console.log(this.environment.name, state(this).count)
    }
  }
}
```

**Enable shared config build:**
```ts
export default {
  builder: {
    sharedConfigBuild: true,
  },
}
```

**Current behavior:**
- **Dev:** Plugins shared
- **Build:** Separate plugin instances per environment (default for backward compatibility)

**Future behavior:**
- Both dev and build: Plugins shared with per-environment filtering

---

## Backward Compatibility

### Current Vite Server API

The current Vite server API is **not deprecated** and is backward compatible with Vite 5.

**Mixed module graph:**
- `server.moduleGraph` returns a mixed view of client and ssr module graphs
- Backward compatible mixed module nodes returned from all methods
- Same scheme used for module nodes passed to `handleHotUpdate`

### Migration Timeline

Vite team **does not recommend** switching to Environment API yet. The goal is for a good portion of the user base to adopt Vite 6 first, so plugins don't need to maintain two versions.

**Adoption strategy:**
1. Vite 6.0: Environment API introduced, old APIs still supported
2. Future minor versions: Gather ecosystem feedback
3. Future major: Deprecate old APIs with clear migration path

### Opt-in Warnings

Enable future warnings to identify usage:

```ts
export default {
  future: {
    // Plugin hooks
    removePluginHookSsrArgument: 'warn',
    removePluginHookHandleHotUpdate: 'warn',

    // Server APIs
    removeServerModuleGraph: 'warn',
    removeServerReloadModule: 'warn',
    removeServerPluginContainer: 'warn',
    removeServerHot: 'warn',
    removeServerTransformRequest: 'warn',
    removeServerWarmupRequest: 'warn',

    // SSR
    removeSsrLoadModule: 'warn',
  },
}
```

---

## Environment API Reference Summary

### Top-Level Exports

**From `vite`:**
```ts
import {
  createServer,
  createFetchableDevEnvironment,
  isFetchableDevEnvironment,
  isRunnableDevEnvironment,
  perEnvironmentPlugin,
  perEnvironmentState,
  DevEnvironment,
  RunnableDevEnvironment,
  FetchableDevEnvironment,
} from 'vite'
```

**From `vite/module-runner`:**
```ts
import {
  ModuleRunner,
  ESModulesEvaluator,
  createNodeImportMeta,
} from 'vite/module-runner'
```

### Configuration Options

**Environment-Level:**
```ts
{
  define: Record<string, any>
  resolve: {
    conditions: string[]
    noExternal: boolean | string[]
    external: string[]
  }
  optimizeDeps: {
    include: string[]
    exclude: string[]
  }
  consumer: 'client' | 'server'
  dev: {
    createEnvironment: (name, config) => DevEnvironment
    warmup: string[]
  }
  build: {
    outDir: string
    createEnvironment: (name, config) => BuildEnvironment
  }
}
```

**Server-Level:**
```ts
{
  environments: Record<string, EnvironmentOptions>
  builder: {
    buildApp: (builder) => Promise<void>
    sharedConfigBuild: boolean
  }
  future: {
    removePluginHookSsrArgument: 'warn'
    removePluginHookHandleHotUpdate: 'warn'
    removeServerModuleGraph: 'warn'
    // ... other future flags
  }
}
```

**Plugin Options:**
```ts
{
  name: string
  applyToEnvironment?: (environment: DevEnvironment) => boolean | Plugin
  sharedDuringBuild?: boolean
  perEnvironmentStartEndDuringDev?: boolean

  // Hooks
  config?: (config) => UserConfig | void
  configEnvironment?: (name, options) => EnvironmentOptions | void
  hotUpdate?: (options: HotUpdateOptions) => Array<EnvironmentModuleNode> | void

  // Access environment in transform hooks
  resolveId(id, importer) {
    this.environment // DevEnvironment instance
  }
}
```

---

## Best Practices

### Project Structure

**Recommended:**
```
project/
├── public/              # Static assets (copied as-is)
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── assets/          # Assets to transform (images, styles)
│   ├── components/      # Reusable components
│   ├── views/           # Route/page components
│   ├── router/          # Routing config
│   ├── store/           # State management
│   ├── utils/           # Utilities
│   ├── styles/          # Global styles
│   ├── App.vue
│   └── main.js
├── index.html
├── vite.config.js
└── package.json
```

### Import Practices

**DO:**
```js
// Explicit file extensions
import Component from './Component.vue'
import utils from './utils.js'

// Named imports for tree-shaking
import { debounce } from 'lodash-es'

// Direct imports (avoid barrel files)
import { Button } from './components/Button'
```

**DON'T:**
```js
// Missing extensions (slower)
import Component from './Component'

// Default import (no tree-shaking)
import _ from 'lodash'

// Barrel file (processes all exports)
import { Button } from './components'
```

### Environment Variables

**DO:**
```
# .env
VITE_API_URL=https://api.example.com
VITE_APP_NAME=My App

# Non-prefixed (server-only, secret)
DATABASE_URL=postgresql://...
API_KEY=secret
```

**DON'T:**
```
# ❌ Exposing secrets
VITE_DATABASE_URL=postgresql://...
VITE_API_KEY=secret
```

### Asset Handling

**DO:**
```js
// Transform and optimize
import logo from './assets/logo.png'
<img src={logo} />

// Explicit query for special handling
import logoUrl from './assets/logo.svg?url'
import logoRaw from './assets/logo.svg?raw'
```

**DON'T:**
```html
<!-- ❌ No optimization -->
<img src="/src/assets/logo.png" />
```

### CSS Organization

**DO:**
```js
// Component-scoped styles
import styles from './Component.module.css'

// Global styles in main entry
import './styles/global.css'

// CSS code splitting (default)
build: {
  cssCodeSplit: true
}
```

### Plugin Usage

**DO:**
```js
// Only use necessary plugins
plugins: [
  vue(),
  // Only add if needed
]

// Use enforce for ordering
export default function myPlugin() {
  return {
    name: 'my-plugin',
    enforce: 'pre'  // Run before others
  }
}
```

### Build Configuration

**DO:**
```js
build: {
  // Appropriate target
  target: 'baseline-widely-available',

  // Sensible chunk size
  chunkSizeWarningLimit: 500,

  // Manual chunks for better caching
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['vue', 'vue-router'],
        utils: ['lodash-es', 'axios']
      }
    }
  }
}
```

---

## Common Patterns

### Vue 3 SPA

**vite.config.js:**
```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
```

**src/main.js:**
```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/main.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
```

### React SPA

**vite.config.js:**
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'  // or @vitejs/plugin-react

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
```

**src/main.jsx:**
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

### Library Build

**vite.config.js:**
```js
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.js'),
      name: 'MyLib',
      formats: ['es', 'umd'],
      fileName: (format) => `my-lib.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'react'],
      output: {
        globals: {
          vue: 'Vue',
          react: 'React'
        }
      }
    }
  }
})
```

### Monorepo Setup

**Root vite.config.js:**
```js
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    fs: {
      allow: ['..']  // Allow serving files from parent
    }
  },

  resolve: {
    alias: {
      '@company/shared': resolve(__dirname, '../packages/shared/src')
    }
  },

  optimizeDeps: {
    include: ['@company/shared']  // Pre-bundle local packages
  }
})
```

### Custom Dev Server

**server.js:**
```js
import express from 'express'
import { createServer as createViteServer } from 'vite'

const app = express()

const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'custom'
})

app.use(vite.middlewares)

app.get('/api/*', (req, res) => {
  // Custom API routes
})

app.listen(3000)
```

### Environment-Specific Config

**vite.config.js:**
```js
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    define: {
      __APP_VERSION__: JSON.stringify(env.npm_package_version)
    },

    build: {
      sourcemap: command === 'serve',
      minify: mode === 'production'
    },

    server: {
      port: env.PORT || 5173
    }
  }
})
```

---

## Anti-Patterns to Avoid

### 1. Using Relative public/ References

**❌ Wrong:**
```js
// In source code
import logo from '../public/logo.png'
```

**✅ Correct:**
```js
// Use src/assets for images in source code
import logo from '@/assets/logo.png'

// Or use public/ with absolute path in HTML
<img src="/logo.png" />
```

### 2. Importing Node.js Modules in Client Code

**❌ Wrong:**
```js
import fs from 'fs'
import path from 'path'

const data = fs.readFileSync('./data.json')
```

**✅ Correct:**
```js
// Use browser APIs
const data = await fetch('/data.json').then(r => r.json())

// Or use in server-side code only (SSR)
```

### 3. Not Using Environment Variables Properly

**❌ Wrong:**
```
# .env
VITE_SECRET_KEY=my-secret-key
```

```js
// Now exposed to client!
const secret = import.meta.env.VITE_SECRET_KEY
```

**✅ Correct:**
```
# .env (server-only)
SECRET_KEY=my-secret-key

# Public variables
VITE_API_URL=https://api.example.com
```

### 4. Large Dependencies in optimizeDeps.include

**❌ Wrong:**
```js
optimizeDeps: {
  include: ['massive-library']  // Pre-bundles everything
}
```

**✅ Correct:**
```js
// Only include what's actually imported
// Let Vite auto-discover most dependencies
optimizeDeps: {
  include: ['specific-deep-import/that-needs-help']
}
```

### 5. Not Handling Dynamic Import Errors

**❌ Wrong:**
```js
const module = await import('./module.js')
```

**✅ Correct:**
```js
const module = await import('./module.js').catch(err => {
  console.error('Failed to load module:', err)
  // Handle error (show error page, retry, etc.)
  return null
})
```

### 6. Barrel Files for Tree-Shaking

**❌ Wrong:**
```js
// components/index.js
export * from './Button'
export * from './Input'
export * from './Form'
// ...100 more components

// App.js
import { Button } from './components'  // Must process all exports
```

**✅ Correct:**
```js
// App.js
import { Button } from './components/Button'  // Direct import
```

### 7. Not Configuring base for Deployment

**❌ Wrong:**
```js
// Deploy to GitHub Pages without base config
export default defineConfig({})
```

**Result:**
```
// Assets not found
https://user.github.io/assets/index.js  ❌
```

**✅ Correct:**
```js
export default defineConfig({
  base: '/repo-name/'
})
```

**Result:**
```
// Assets found
https://user.github.io/repo-name/assets/index.js  ✅
```

### 8. Overusing import.meta.glob

**❌ Wrong:**
```js
// Loads ALL files in directory
const modules = import.meta.glob('./modules/**/*.js', { eager: true })
```

**✅ Correct:**
```js
// Load specific files or use lazy loading
const modules = import.meta.glob('./modules/feature-*.js')

// Only load when needed
for (const path in modules) {
  modules[path]().then(mod => {
    // Use module
  })
}
```

---

## Summary

Vite is a next-generation build tool that provides:

**Core Strengths:**
- ⚡ Lightning-fast dev server with native ESM
- 🔥 Instant HMR that stays fast regardless of app size
- 🛠️ Rich features out-of-the-box (TypeScript, JSX, CSS preprocessors)
- 📦 Optimized production builds with Rollup/Rolldown
- 🔌 Powerful plugin system (Rollup-compatible)
- 🌐 Framework-agnostic (Vue, React, Svelte, etc.)

**Best For:**
- Modern web applications
- Single-Page Applications (SPA)
- Server-Side Rendered apps (SSR)
- Static sites
- Component libraries
- Monorepos

**Key Concepts:**
1. **Native ESM in Development** - Leverage browser's native module system
2. **Pre-Bundling Dependencies** - esbuild-powered dependency optimization
3. **On-Demand Compilation** - Only transform files as requested
4. **Optimized Production Builds** - Rollup/Rolldown with smart defaults
5. **Universal Plugin Interface** - Shared between dev and build

**Version 7 Highlights:**
- Node.js 20.19+ / 22.12+ required
- Modern browser baseline (Chrome 107+, Firefox 104+, Safari 16+)
- Rolldown integration for faster builds
- Lightning CSS support
- Enhanced performance optimizations

---

**This bible covers Vite 7.x with comprehensive coverage of all features, configurations, APIs, and best practices from the official Vite documentation.**
# Using responsive images in HTML

In this article, we'll learn about the concept of responsive images — images that work well on devices with widely differing screen sizes, resolutions, and other such features — and look at what tools HTML provides to help implement them. This helps to improve performance across different devices.

## Why responsive images?

Let's examine a typical scenario. A typical website may contain a header image and some content images below the header. The header image will likely span the whole of the width of the header, and the content image will fit somewhere inside the content column. Here's an example:

This works well on a wide screen device, such as a laptop or desktop (you can [see the example live](https://mdn.github.io/learning-area/html/multimedia-and-embedding/responsive-images/not-responsive.html) and find the [source code](https://github.com/mdn/learning-area/blob/main/html/multimedia-and-embedding/responsive-images/not-responsive.html) on GitHub.) We won't discuss the CSS much in this lesson, except to say that:

- The body content has been set to a maximum width of 1200 pixels — in viewports above that width, the body remains at 1200px and centers itself in the available space. In viewports below that width, the body will stay at 100% of the width of the viewport.
- The header image has been set so that its center always stays in the center of the header, no matter what width the heading is set at. If the site is being viewed on a narrower screen, the important detail in the center of the image (the people) can still be seen, and the excess is lost off either side. It is 200px high.
- The content images have been set so that if the body element becomes smaller than the image, the images start to shrink so that they always stay inside the body, rather than overflowing it.

However, issues arise when you start to view the site on a narrow screen device. The header below looks OK, but it's starting to take up a lot of the screen height for a mobile device. And at this size, it is difficult to see faces of the two people within the first content image.

An improvement would be to display a cropped version of the image which displays the important details of the image when the site is viewed on a narrow screen. A second cropped image could be displayed for a medium-width screen device, like a tablet. The general problem whereby you want to serve different cropped images in that way, for various layouts, is commonly known as the **art direction problem**.

In addition, there is no need to embed such large images on the page if it is being viewed on a mobile screen. Doing so can waste bandwidth; in particular, mobile users don't want to waste bandwidth by downloading a large image intended for desktop users, when a small image would do for their device. Conversely, a small raster image starts to look grainy when displayed larger than its original size (a raster image is a set number of pixels wide and a set number of pixels tall). Ideally, multiple resolutions would be made available to the user's web browser. The browser could then determine the optimal resolution to load based on the screen size of the user's device. This is called the **resolution switching problem**.

To make things more complicated, some devices have high resolution screens that need larger images than you might expect to display nicely. This is essentially the same problem, but in a slightly different context.

You might think that vector images would solve these problems, and they do to a certain degree — they are small in file size and scale well, and you should use them wherever possible. However, they aren't suitable for all image types. Vector images are great for simple graphics, patterns, interface elements, etc., but it starts to get very complex to create a vector-based image with the kind of detail that you'd find in say, a photo. Raster image formats such as JPEGs are more suited to the kind of images we see in the above example.

This kind of problem didn't exist when the web first existed, in the early to mid 90s — back then the only devices in existence to browse the Web were desktops and laptops, so browser engineers and spec writers didn't even think to implement solutions. Responsive image technologies were implemented recently to solve the problems indicated above by letting you offer the browser several image files, either all showing the same thing but containing different numbers of pixels (resolution switching), or different images suitable for different space allocations (art direction).

## How do you create responsive images?

In this section, we'll look at the two problems illustrated above and show how to solve them using HTML's responsive image features. You should note that we will be focusing on `<img>` elements for this section, as seen in the content area of the example above — the image in the site header is only for decoration, and therefore implemented using CSS background images.

> **Note:** [CSS arguably has better tools for responsive design](https://cloudfour.com/thinks/responsive-images-101-part-8-css-images/) than HTML, and we'll talk about those in a future CSS module.

### Resolution switching: Different sizes

So, what is the problem that we want to solve with resolution switching? We want to display identical image content, just larger or smaller depending on the device — this is the situation we have with the second content image in our example. The standard `<img>` element traditionally only lets you point the browser to a single source file:

```html
<img src="elva-fairy-800w.jpg" alt="Elva dressed as a fairy" />
```

We can however use two attributes — `srcset` and `sizes` — to provide several additional source images along with hints to help the browser pick the right one. You can see an example of this in our [responsive.html](https://mdn.github.io/learning-area/html/multimedia-and-embedding/responsive-images/responsive.html) example on GitHub (see also [the source code](https://github.com/mdn/learning-area/blob/main/html/multimedia-and-embedding/responsive-images/responsive.html)):

```html
<img
  srcset="elva-fairy-480w.jpg 480w, elva-fairy-800w.jpg 800w"
  sizes="(width <= 600px) 480px,
         800px"
  src="elva-fairy-800w.jpg"
  alt="Elva dressed as a fairy"
/>
```

The `srcset` and `sizes` attributes look complicated, but they're not too hard to understand if you format them as shown above, with a different part of the attribute value on each line. Each value contains a comma-separated list, and each part of those lists is made up of three sub-parts. Let's run through the contents of each now:

**`srcset`** defines the set of images we will allow the browser to choose between, and what size each image is. Each set of image information is separated from the previous one by a comma. For each one, we write:

- An image filename (`elva-fairy-480w.jpg`)
- A space
- The image's intrinsic width in pixels (`480w`) — note that this uses the `w` unit, not `px` as you might expect. An image's intrinsic size is its real size, which can be found by inspecting the image file on your computer (for example, on a Mac you can select the image in Finder and press Cmd + I to bring up the info screen).

**`sizes`** defines a set of media conditions (e.g., screen widths) and indicates what image size would be best to choose, when certain media conditions are true — these are the hints we talked about earlier. In this case, before each comma we write:

- A media condition (`(width <= 600px)`) — you'll learn more about these in the CSS topic, but for now let's just say that a media condition describes a possible state that the screen can be in. In this case, we are saying "when the viewport width is 600 pixels or less".
- A space
- The width of the slot the image will fill when the media condition is true (`480px`)

> **Note:** In `sizes`, you can use any length value. For example, rather than providing an absolute width (for example, `480px`), you can alternatively provide a width relative to the viewport (for example, `50vw`). However, you cannot use a percentage as the slot width. You may have noticed that the last slot width has no media condition (this is the default that is chosen when none of the media conditions are true). The browser ignores everything after the first matching condition, so be careful how you order the media conditions.

So, with these attributes in place, the browser will:

1. Look at screen size, pixel density, zoom level, screen orientation, and network speed.
2. Work out which media condition in the `sizes` list is the first one to be true.
3. Look at the slot size given to that media query.
4. Load the image referenced in the `srcset` list that has the same size as the slot. If there isn't an exact match for the display size, the browser will choose the first image that is bigger than the chosen slot size and scale it down to fit.

And that's it! At this point, if a supporting browser with a viewport width of 480px loads the page, the `(width <= 600px)` media condition will be true, and so the browser chooses the `480px` slot. The `elva-fairy-480w.jpg` will be loaded, as its inherent width (`480w`) is closest to the slot size. The 800px picture is 128KB on disk, whereas the 480px version is only 63KB — a saving of 65KB. Now, imagine if this was a page that had many pictures on it. Using this technique could save mobile users a lot of bandwidth.

> **Note:** When testing this with a desktop browser, if the browser fails to load the narrower images when you've got its window set to the narrowest width, have a look at what the viewport is (you can approximate it by going into the browser's JavaScript console and typing in `document.querySelector('html').clientWidth`). Different browsers have minimum sizes that they'll let you reduce the window width to, and they might be wider than you'd think. When testing it with a mobile browser, you can use tools like Firefox's `about:debugging` page to inspect the page loaded on the mobile using the desktop developer tools.
>
> To see which images were loaded, you can use Firefox DevTools's [Network Monitor](https://firefox-source-docs.mozilla.org/devtools-user/network_monitor/index.html) tab or Chrome DevTools's [Network](https://developer.chrome.com/docs/devtools/network/) panel. For Chrome, you may also want to [disable cache](https://stackoverflow.com/a/7000899/13725861) to prevent it from picking already downloaded images.

Older browsers that don't support these features will just ignore them. Instead, those browsers will go ahead and load the image referenced in the `src` attribute as normal.

> **Note:** In the `<head>` of the example linked above, you'll find the line `<meta name="viewport" content="width=device-width">`: this forces mobile browsers to adopt their real viewport width for loading web pages (some mobile browsers lie about their viewport width, and instead load pages at a larger viewport width then shrink the loaded page down, which is not very helpful for responsive images or design).

### Resolution switching: Same size, different resolutions

Suppose you have an image that will be rendered at the same real-world size on displays that have different screen resolutions. You can provide a better user experience on high resolution displays by serving a higher resolution version of the image.

To achieve this you can allow the browser to choose an appropriate resolution image by using `srcset` with x-descriptors and without `sizes` — a somewhat easier syntax! You can find an example of what this looks like in [srcset-resolutions.html](https://mdn.github.io/learning-area/html/multimedia-and-embedding/responsive-images/srcset-resolutions.html) (see also [the source code](https://github.com/mdn/learning-area/blob/main/html/multimedia-and-embedding/responsive-images/srcset-resolutions.html)):

```html
<img
  srcset="elva-fairy-320w.jpg, elva-fairy-480w.jpg 1.5x, elva-fairy-640w.jpg 2x"
  src="elva-fairy-640w.jpg"
  alt="Elva dressed as a fairy"
/>
```

> **Note:** Note that even though the image is always displayed with the same size, on higher resolution displays you get to see more detail.

In this example, the following CSS is applied to the image so that it will have a width of 320 pixels on the screen (also called CSS pixels):

```css
img {
  width: 320px;
}
```

In this case, `sizes` is not needed — the browser works out what resolution the display is that it is being shown on, and serves the most appropriate image referenced in the `srcset`. So if the device accessing the page has a standard/low resolution display, with one device pixel representing each CSS pixel, the `elva-fairy-320w.jpg` image will be loaded (the 1x is implied, so you don't need to include it.) If the device has a high resolution of two device pixels per CSS pixel or more, the `elva-fairy-640w.jpg` image will be loaded. The 640px image is 93KB, whereas the 320px image is only 39KB.

## Art direction

To recap, the **art direction problem** involves wanting to change the image displayed to suit different image display sizes. For example, a web page includes a large landscape shot with a person in the middle when viewed on a desktop browser. When viewed on a mobile browser, that same image is shrunk down, making the person in the image very small and hard to see. It would probably be better to show a smaller, portrait image on mobile, which zooms in on the person. The `<picture>` element allows us to implement just this kind of solution.

Returning to our original [not-responsive.html](https://mdn.github.io/learning-area/html/multimedia-and-embedding/responsive-images/not-responsive.html) example, we have an image that badly needs art direction:

```html
<img src="elva-800w.jpg" alt="Chris standing up holding his daughter Elva" />
```

Let's fix this, with `<picture>`! Like `<video>` and `<audio>`, the `<picture>` element is a wrapper containing several `<source>` elements that provide different sources for the browser to choose from, followed by the all-important `<img>` element. The code in [responsive.html](https://mdn.github.io/learning-area/html/multimedia-and-embedding/responsive-images/responsive.html) looks like so:

```html
<picture>
  <source media="(width < 800px)" srcset="elva-480w-close-portrait.jpg" />
  <source media="(width >= 800px)" srcset="elva-800w.jpg" />
  <img src="elva-800w.jpg" alt="Chris standing up holding his daughter Elva" />
</picture>
```

- The `<source>` elements include a `media` attribute that contains a media condition — as with the first `srcset` example, these conditions are tests that decide which image is shown — the first one that returns true will be displayed. In this case, if the viewport width is less than 800px wide, the first `<source>` element's image will be displayed. If the viewport width is 800px or more, it'll be the second one.
- The `srcset` attributes contain the path to the image to display. Just as we saw with `<img>` above, `<source>` can take a `srcset` attribute with multiple images referenced, as well as a `sizes` attribute. So, you could offer multiple images via a `<picture>` element, but then also offer multiple resolutions of each one. Realistically, you probably won't want to do this kind of thing very often.
- In all cases, you must provide an `<img>` element, with `src` and `alt`, right before `</picture>`, otherwise no images will appear. This provides a default case that will apply when none of the media conditions return true (you could actually remove the second `<source>` element in this example), and a fallback for browsers that don't support the `<picture>` element.

This code allows us to display a suitable image on both wide screen and narrow screen displays, as shown below:

> **Note:** You should use the `media` attribute only in art direction scenarios; when you do use `media`, don't also offer media conditions within the `sizes` attribute.

### Why can't we just do this using CSS or JavaScript?

When the browser starts to load a page, it starts to download (preload) any images before the main parser has started to load and interpret the page's CSS and JavaScript. That mechanism is useful in general for reducing page load times, but it is not helpful for responsive images — hence the need to implement solutions like `srcset`. For example, you couldn't load the `<img>` element, then detect the viewport width with JavaScript, and then dynamically change the source image to a smaller one if desired. By then, the original image would already have been loaded, and you would load the small image as well, which is even worse in responsive image terms.

## Implementing your own responsive images

In this exercise, we're expecting you to be brave and do it alone, mostly. We want you to implement your own suitable art-directed narrow screen/wide screenshot using `<picture>`, and a resolution switching example that uses `srcset`.

- Write some HTML to contain your code (use `not-responsive.html` as a starting point, if you like).
- Find a nice wide screen landscape image with some kind of detail contained in it somewhere. Create a web-sized version of it using a graphics editor, then crop it to show a smaller part that zooms in on the detail, and create a second image (about 480px wide is good for this).
- Use the `<picture>` element to implement an art direction picture switcher!
- Create multiple image files of different sizes, each showing the same picture.
- Use `srcset`/`sizes` to create a resolution switcher example, either to serve the same size image at different resolutions depending on the device resolution or to serve different image sizes depending on the viewport widths.

## Summary

That's a wrap for responsive images — we hope you enjoyed playing with these new techniques. As a recap, there are two distinct problems we've been discussing here:

- **Art direction:** The problem whereby you want to serve cropped images for different layouts — for example a landscape image showing a full scene for a desktop layout, and a portrait image showing the main subject zoomed in for a mobile layout. You can solve this problem using the `<picture>` element.
- **Resolution switching:** The problem whereby you want to serve smaller image files to narrow-screen devices, as they don't need huge images like desktop displays do — and to serve different resolution images to high density/low density screens. You can solve this problem using vector graphics (SVG images) and the `srcset` with `sizes` attributes.

## See also

- [Learn: Responsive design](/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design)
- [Jason Grigsby's excellent introduction to responsive images](https://cloudfour.com/thinks/responsive-images-101-definitions/)
- [Responsive Images: If you're just changing resolutions, use srcset](https://css-tricks.com/responsive-images-youre-just-changing-resolutions-use-srcset/) — includes more explanation of how the browser works out which image to use
- `<img>`
- `<picture>`
- `<source>`
# SHARP IMAGE PROCESSING BIBLE

> Comprehensive knowledge document for AI agents implementing Sharp image processing code

**📊 Document Stats:**
- **Coverage:** Complete official Sharp documentation
- **Library Version:** Sharp v0.34.x (latest: v0.34.5)
- **Last Updated:** 2025
- **Based on:** libvips v8.17.0

---

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Core Concepts](#core-concepts)
4. [Constructor & Basic Usage](#constructor--basic-usage)
5. [Input Metadata](#input-metadata)
6. [Resizing Images](#resizing-images)
7. [Image Operations](#image-operations)
8. [Channel Manipulation](#channel-manipulation)
9. [Colour Manipulation](#colour-manipulation)
10. [Compositing Images](#compositing-images)
11. [Output Options](#output-options)
12. [Format-Specific Options](#format-specific-options)
13. [Metadata Handling](#metadata-handling)
14. [Performance & Optimization](#performance--optimization)
15. [Global Utilities](#global-utilities)
16. [Best Practices](#best-practices)
17. [Common Patterns](#common-patterns)
18. [Troubleshooting](#troubleshooting)
19. [API Reference Quick Guide](#api-reference-quick-guide)

---

## Introduction

**Sharp** is a high performance Node.js image processing library powered by libvips. It is the fastest module for resizing JPEG, PNG, WebP, GIF, AVIF and TIFF images.

### What Makes Sharp Special?

- **High Performance**: 4x-5x faster than ImageMagick/GraphicsMagick
- **Memory Efficient**: Processes images in small regions, not loading entire image into RAM
- **Production Ready**: Handles colour spaces, ICC profiles, and alpha transparency correctly
- **Non-Blocking**: Uses libuv, no child processes, supports Promises/async/await
- **Format Support**: JPEG, PNG, WebP, GIF, AVIF, TIFF, SVG (input)
- **Platform Support**: Works with Node.js >=18.17.0, Deno, and Bun

### Key Features

- Resize, crop, rotate, and extract image regions
- Sharpen, blur, and apply filters
- Composite images with blend modes
- Convert between formats
- Stream, Buffer, and filesystem I/O
- Generate image pyramids (Deep Zoom)
- Optimize file sizes with mozjpeg, pngquant features
- Process animated images (GIF, WebP)

### Design Philosophy

Sharp uses **libvips** under the hood, which:
- Only loads small regions of compressed data at a time
- Takes advantage of multiple CPU cores and L1/L2/L3 cache
- Uses streaming and pipeline processing
- Avoids unnecessary memory allocations

---

## Installation

### Basic Installation

Works with any JavaScript package manager:

```sh
npm install sharp
```

```sh
pnpm add sharp
```

When using pnpm, add to `ignoredBuiltDependencies`:
```json
{
  "pnpm": {
    "ignoredBuiltDependencies": ["sharp"]
  }
}
```

```sh
yarn add sharp
```

```sh
bun add sharp
```

```sh
deno add --quiet npm:sharp
deno run --allow-env --allow-ffi --allow-read --allow-sys ...
```

### Prerequisites

- Node-API v9 compatible runtime
- Node.js ^18.17.0 or >=20.3.0

### Prebuilt Binaries

Available for most common platforms:
- macOS x64 (>= 10.15) and ARM64
- Linux ARM, ARM64, RISC-V 64-bit, ppc64, s390x, x64 (glibc/musl)
- Windows x64, x86, ARM64 (experimental)

Supports: JPEG, PNG, WebP, AVIF (8-bit), TIFF, GIF, SVG (input)

### Cross-Platform Support

**npm v10+:**
```sh
npm install --cpu=x64 --os=darwin sharp
npm install --cpu=arm64 --os=darwin sharp
npm install --cpu=x64 --os=linux --libc=glibc sharp
npm install --cpu=x64 --os=linux --libc=musl sharp
```

**yarn v3+ / pnpm v8+:**
Use `supportedArchitectures` configuration.

### Custom libvips

To use globally-installed libvips (must be >= version in `package.json`):
```sh
pkg-config --modversion vips-cpp
```

Environment variables:
- `SHARP_IGNORE_GLOBAL_LIBVIPS` - Never use global libvips
- `SHARP_FORCE_GLOBAL_LIBVIPS` - Always use global libvips

### Building from Source

Requires:
- C++17 compiler
- node-addon-api v7+
- node-gyp v9+

```sh
npm install --save node-addon-api node-gyp
```

When using pnpm, may need to add to `onlyBuiltDependencies`.

### Linux Memory Allocator

**Important:** glibc's default allocator causes fragmentation in long-running multi-threaded processes.

Use alternative allocator like jemalloc:
```sh
LD_PRELOAD=/usr/lib/x86_64-linux-gnu/libjemalloc.so.2 node app.js
```

Or set environment variables:
```sh
export MALLOC_ARENA_MAX="2"
```

Musl-based Linux (Alpine) and non-Linux systems are unaffected.

### AWS Lambda

- Use linux-x64 or linux-arm64 binaries
- Avoid symbolic links (not supported)
- Use largest memory available (1536 MB ~12x faster than 128 MB)
- Configure API Gateway binary media types

### Bundlers

**webpack:**
```js
externals: {
  'sharp': 'commonjs sharp'
}
```

**esbuild:**
```js
buildSync({
  external: ['sharp'],
})
```

**serverless-esbuild:**
```yaml
custom:
  esbuild:
    external:
      - sharp
    packagerOptions:
      scripts:
        - npm install --os=linux --cpu=x64 sharp
```

**electron-builder:**
```json
{
  "build": {
    "asar": true,
    "asarUnpack": [
      "**/node_modules/sharp/**/*",
      "**/node_modules/@img/**/*"
    ]
  }
}
```

**vite:**
```js
export default defineConfig({
  build: {
    rollupOptions: {
      external: ["sharp"]
    }
  }
});
```

### TypeScript

TypeScript definitions are included from v0.32.0 (previously `@types/sharp`).

Ensure `devDependencies` includes `@types/node`.

### Fonts

Uses `fontconfig` for text/SVG rendering:
- **Windows/macOS**: All system fonts available
- **macOS Homebrew**: May need `PANGOCAIRO_BACKEND=fontconfig`
- **Linux**: Fonts with fontconfig configuration available
- **Serverless**: Use `FONTCONFIG_PATH` for custom location

Embedded SVG fonts are unsupported.

---

## Core Concepts

### Image Processing Pipeline

Sharp uses a **pipeline** model:

```js
sharp(input)
  .resize(300, 200)     // Step 1
  .rotate(90)           // Step 2
  .sharpen()            // Step 3
  .toBuffer();          // Execute pipeline
```

Operations are queued and executed in a single pass when output is requested.

### Operation Order

**Important:** Order matters in pipelines:

```js
// Different results:
sharp(input).rotate(90).resize(100, 100)  // Rotate then resize
sharp(input).resize(100, 100).rotate(90)  // Resize then rotate
```

**Typical order:**
1. Input operations (autoOrient, extract pre-resize)
2. Resize/crop
3. Operations (rotate, flip, flop, sharpen, blur, etc.)
4. Composite
5. Output format/options

### Input Sources

Sharp accepts multiple input types:

```js
// File path
sharp('input.jpg')

// Buffer
sharp(buffer)

// Stream (when no input provided)
readableStream.pipe(sharp().resize(300))

// TypedArray (raw pixels)
sharp(uint8Array, { raw: { width, height, channels } })

// Array of inputs (for joining)
sharp([image1, image2], { join: { across: 2 } })

// Create from scratch
sharp({ create: { width: 300, height: 200, channels: 4, background: 'red' } })

// Create from text
sharp({ text: { text: 'Hello', font: 'Arial', width: 400 } })
```

### Output Destinations

```js
// File
await sharp(input).toFile('output.png');

// Buffer
const buffer = await sharp(input).toBuffer();

// Buffer with info
const { data, info } = await sharp(input).toBuffer({ resolveWithObject: true });

// Stream
sharp(input).pipe(writableStream);

// Tiles (Deep Zoom)
await sharp(input).tile({ size: 256 }).toFile('output.dz');
```

### Colour Spaces

Sharp handles colour spaces correctly:

- **sRGB**: Default output (web-friendly)
- **RGB**: Linear RGB
- **CMYK**: Cyan, Magenta, Yellow, Black
- **LAB**: Perceptual colour space
- **B-W**: Greyscale
- **RGB16**: 16-bit per channel RGB

```js
// Process in 16-bit, output 8-bit
await sharp(input)
  .pipelineColourspace('rgb16')
  .toColourspace('srgb')
  .toFile('output.png');
```

### Multi-Page Images

Animated GIF, WebP, TIFF support:

```js
// Read all frames
sharp('input.gif', { animated: true })

// Read specific pages
sharp('input.tiff', { pages: 5, page: 2 })

// All pages
sharp('input.webp', { pages: -1 })
```

Frames are stacked vertically as a "toilet roll" image.

---

## Constructor & Basic Usage

### Creating Sharp Instance

```js
sharp([input], [options])
```

### Constructor Options

```js
const image = sharp(input, {
  // Safety
  failOn: 'warning',           // 'none', 'truncated', 'error', 'warning'
  limitInputPixels: 268402689, // Max pixels (width × height)
  unlimited: false,            // Remove safety limits

  // Input handling
  autoOrient: false,          // Auto-rotate using EXIF
  sequentialRead: true,       // Use sequential vs random access
  density: 72,                // DPI for vector images (1-100000)
  ignoreIcc: false,          // Ignore embedded ICC profile

  // Multi-page
  pages: 1,                   // Number of pages (-1 for all)
  page: 0,                    // Starting page (zero-based)
  animated: false,            // Read all frames (sets pages: -1)

  // Raw pixel input
  raw: {
    width: 1920,
    height: 1080,
    channels: 3,              // 1-4
    premultiplied: false,
    pageHeight: 1080          // For animated
  },

  // Create new image
  create: {
    width: 300,
    height: 200,
    channels: 4,              // 3 (RGB) or 4 (RGBA)
    background: 'white',      // Colour string or object
    pageHeight: 200,          // For animated
    noise: {
      type: 'gaussian',
      mean: 128,
      sigma: 30
    }
  },

  // Create text image
  text: {
    text: 'Hello World',
    font: 'Arial',
    fontfile: '/path/to/font.ttf',
    width: 400,               // Word wrap width
    height: 300,              // Auto-fit to resolution
    align: 'left',            // 'left', 'centre', 'right'
    justify: false,
    dpi: 72,
    rgba: false,              // Enable colour/emoji
    spacing: 0,               // Line height in points
    wrap: 'word'              // 'word', 'char', 'word-char', 'none'
  },

  // Join images
  join: {
    across: 1,                // Images per row
    animated: false,          // Create animated output
    shim: 0,                  // Pixels between images
    background: 'white',
    halign: 'left',           // 'left', 'centre', 'right'
    valign: 'top'             // 'top', 'centre', 'bottom'
  },

  // TIFF specific
  tiff: {
    subifd: -1                // Sub IFD for OME-TIFF
  },

  // SVG specific
  svg: {
    stylesheet: 'path.css',   // Custom CSS
    highBitdepth: false       // 32-bit vs 8-bit RGBA
  },

  // PDF specific (requires libvips with PDFium/Poppler)
  pdf: {
    background: 'white'       // For partial transparency
  },

  // OpenSlide specific (requires libvips with OpenSlide)
  openSlide: {
    level: 0                  // Multi-level extraction
  },

  // JPEG 2000 specific (requires OpenJPEG)
  jp2: {
    oneshot: false            // Decode tiles in single operation
  }
});
```

### Basic Examples

**Simple resize:**
```js
await sharp('input.jpg')
  .resize(300, 200)
  .toFile('output.jpg');
```

**Stream processing:**
```js
const { body } = await fetch('https://example.com/image.jpg');
const readableStream = Readable.fromWeb(body);

const transformer = sharp()
  .resize(300)
  .on('info', ({ height }) => {
    console.log(`Height: ${height}`);
  });

readableStream.pipe(transformer).pipe(writableStream);
```

**Create blank image:**
```js
await sharp({
  create: {
    width: 300,
    height: 200,
    channels: 4,
    background: { r: 255, g: 0, b: 0, alpha: 0.5 }
  }
})
.png()
.toFile('red.png');
```

**Convert animated GIF:**
```js
await sharp('in.gif', { animated: true }).toFile('out.webp');
```

**Process raw pixels:**
```js
const input = Uint8Array.from([255, 255, 255, 0, 0, 0]);
await sharp(input, {
  raw: { width: 2, height: 1, channels: 3 }
}).toFile('two-pixels.png');
```

**Generate noise:**
```js
await sharp({
  create: {
    width: 300,
    height: 200,
    channels: 3,
    noise: {
      type: 'gaussian',
      mean: 128,
      sigma: 30
    }
  }
}).toFile('noise.png');
```

**Create from text:**
```js
await sharp({
  text: {
    text: 'Hello, <span foreground="red">world!</span>',
    font: 'Arial',
    rgba: true,
    width: 400,
    height: 300
  }
}).toFile('text.png');
```

**Join images:**
```js
const data = await sharp(
  [image1, image2, image3, image4],
  { join: { across: 2, shim: 4 } }
).toBuffer();
```

### Clone Method

Create multiple pipelines from single input:

```js
const pipeline = sharp().rotate();
pipeline.clone().resize(800, 600).pipe(stream1);
pipeline.clone().extract({ left: 20, top: 20, width: 100, height: 100 }).pipe(stream2);
readableStream.pipe(pipeline);
```

**With Promises:**
```js
const sharpStream = sharp({ failOn: 'none' });
const promises = [];

promises.push(
  sharpStream.clone().jpeg({ quality: 100 }).toFile('original.jpg')
);
promises.push(
  sharpStream.clone().resize({ width: 500 }).webp({ quality: 80 }).toFile('thumb.webp')
);

got.stream(url).pipe(sharpStream);
await Promise.all(promises);
```

---

## Input Metadata

### Get Metadata

```js
const metadata = await sharp(input).metadata();
```

Returns fast access to header information without decoding pixel data.

**Metadata Properties:**

```js
{
  format: 'jpeg',              // Decoder: jpeg, png, webp, gif, svg, tiff, etc.
  size: 245678,                // Bytes (Stream/Buffer only)
  width: 1920,                 // Pixels wide (ignores EXIF orientation)
  height: 1080,                // Pixels high (ignores EXIF orientation)
  space: 'srgb',               // Colour space: srgb, rgb, cmyk, lab, b-w, etc.
  channels: 3,                 // Number of bands (3=sRGB, 4=CMYK)
  depth: 'uchar',              // Pixel depth: uchar, char, ushort, float, etc.
  density: 72,                 // DPI if present
  chromaSubsampling: '4:2:0',  // JPEG chroma (4:2:0, 4:4:4, 4:2:0:4, 4:4:4:4)
  isProgressive: false,        // Progressive/interlaced scan
  isPalette: false,            // Palette-based (GIF, PNG)
  bitsPerSample: 8,            // Bits per sample per channel
  pages: 1,                    // Number of pages/frames
  pageHeight: 1080,            // Height of each page
  loop: 0,                     // Animation loop count (0=infinite)
  delay: [100, 100],           // Frame delays in ms
  pagePrimary: 0,              // Primary page (HEIF)
  levels: [],                  // Multi-level details (OpenSlide)
  subifds: 0,                  // Sub IFDs (OME-TIFF)
  background: { r, g, b },     // Default background (PNG, GIF)
  compression: 'av1',          // HEIF encoder (av1, hevc)
  resolutionUnit: 'inch',      // inch or cm
  hasProfile: true,            // Has ICC profile
  hasAlpha: true,              // Has alpha channel
  orientation: 1,              // EXIF Orientation (1-8)
  exif: Buffer,                // Raw EXIF data
  icc: Buffer,                 // Raw ICC profile data
  iptc: Buffer,                // Raw IPTC data
  xmp: Buffer,                 // Raw XMP data
  xmpAsString: '<xml>...',     // XMP as string if valid UTF-8
  tifftagPhotoshop: Buffer,    // Raw TIFFTAG_PHOTOSHOP data
  formatMagick: 'GIF',         // Format for *magick loaded images
  comments: [{keyword, text}]  // PNG text chunks
}
```

### EXIF Orientation

Get dimensions accounting for EXIF orientation:

```js
const { autoOrient } = await sharp(input).metadata();
const { width, height } = autoOrient;
```

### Get Statistics

```js
const stats = await sharp(input).stats();
```

Pixel-derived statistics for each channel:

```js
{
  channels: [
    {
      min: 0,                   // Minimum value
      max: 255,                 // Maximum value
      sum: 12345678,            // Sum of all values
      squaresSum: 123456789,    // Sum of squared values
      mean: 123.45,             // Mean value
      stdev: 67.89,             // Standard deviation
      minX: 100,                // X coordinate of minimum
      minY: 200,                // Y coordinate of minimum
      maxX: 150,                // X coordinate of maximum
      maxY: 250                 // Y coordinate of maximum
    },
    // ... one object per channel
  ],
  isOpaque: true,              // All pixels fully opaque
  entropy: 7.45,               // Greyscale entropy
  sharpness: 123.45,           // Greyscale sharpness
  dominant: { r: 127, g: 64, b: 32 }  // Dominant colour (4096-bin histogram)
}
```

**Note:** Stats are from original input. To get stats after operations:

```js
const image = sharp(input);
const part = await image.extract(region).toBuffer();
const stats = await sharp(part).stats();
```

---

## Resizing Images

### Resize Method

```js
sharp(input).resize([width], [height], [options])
```

### Resize Options

```js
await sharp(input).resize({
  width: 300,                  // Target width (null to auto-scale)
  height: 200,                 // Target height (null to auto-scale)
  fit: 'cover',                // How to fit: cover, contain, fill, inside, outside
  position: 'centre',          // Position/gravity/strategy
  background: 'white',         // Background for contain
  kernel: 'lanczos3',          // Kernel/interpolator
  withoutEnlargement: false,   // Don't scale up
  withoutReduction: false,     // Don't scale down
  fastShrinkOnLoad: true       // Use JPEG/WebP shrink-on-load
});
```

### Fit Options

**cover** (default):
- Preserves aspect ratio
- Ensures image covers both dimensions
- Crops to fit

**contain**:
- Preserves aspect ratio
- Fits within both dimensions
- Adds letterboxing if needed

**fill**:
- Ignores aspect ratio
- Stretches to exact dimensions

**inside**:
- Preserves aspect ratio
- As large as possible while ≤ dimensions

**outside**:
- Preserves aspect ratio
- As small as possible while ≥ dimensions

### Position Options

**sharp.position**: `top`, `right top`, `right`, `right bottom`, `bottom`, `left bottom`, `left`, `left top`

**sharp.gravity**: `north`, `northeast`, `east`, `southeast`, `south`, `southwest`, `west`, `northwest`, `center`, `centre`

**sharp.strategy** (cover only):
- `entropy`: Focus on highest Shannon entropy
- `attention`: Focus on luminance frequency, colour saturation, skin tones

### Kernels

For downsizing:
- `nearest`: Nearest neighbour
- `linear`: Triangle filter
- `cubic`: Catmull-Rom spline
- `mitchell`: Mitchell-Netravali spline
- `lanczos2`: Lanczos with a=2
- `lanczos3`: Lanczos with a=3 (default)
- `mks2013`: Magic Kernel Sharp 2013 (Facebook)
- `mks2021`: Magic Kernel Sharp 2021 (more accurate)

For upsampling, these map to `nearest`, `linear`, `cubic`.

### Resize Examples

**Auto-scale width:**
```js
await sharp(input).resize({ width: 100 }).toBuffer();
```

**Auto-scale height:**
```js
await sharp(input).resize({ height: 100 }).toBuffer();
```

**Contain with background:**
```js
await sharp(input).resize(200, 300, {
  kernel: sharp.kernel.nearest,
  fit: 'contain',
  position: 'right top',
  background: { r: 255, g: 255, b: 255, alpha: 0.5 }
}).toFile('output.png');
```

**Strategy-based cropping:**
```js
await sharp(input).resize({
  width: 200,
  height: 200,
  fit: sharp.fit.cover,
  position: sharp.strategy.entropy
}).toBuffer();
```

**Prevent enlargement:**
```js
await sharp(input).resize(200, 200, {
  fit: sharp.fit.inside,
  withoutEnlargement: true
}).toBuffer();
```

**Prevent reduction:**
```js
await sharp(input).resize(200, 200, {
  fit: sharp.fit.outside,
  withoutReduction: true
}).toBuffer();
```

**Scale by percentage:**
```js
const { width } = await sharp(input).metadata();
await sharp(input).resize(Math.round(width * 0.5)).toBuffer();
```

**Important:** Only one resize per pipeline. Previous resize calls are ignored.

### Extend/Pad

Add pixels to edges:

```js
await sharp(input).extend({
  top: 10,
  bottom: 20,
  left: 10,
  right: 10,
  background: { r: 0, g: 0, b: 0, alpha: 0 },
  extendWith: 'background'  // 'background', 'copy', 'repeat', 'mirror'
});
```

**Single value (all edges):**
```js
await sharp(input).extend(50);
```

**Extrude/mirror:**
```js
await sharp(input).extend({
  right: 8,
  extendWith: 'mirror'
});
```

### Extract/Crop

Extract region (pre- or post-resize):

```js
await sharp(input).extract({
  left: 100,
  top: 50,
  width: 200,
  height: 150
}).toFile('output.jpg');
```

**Extract-resize-extract:**
```js
await sharp(input)
  .extract({ left: 10, top: 10, width: 500, height: 500 })
  .resize(200, 200)
  .extract({ left: 20, top: 20, width: 100, height: 100 })
  .toFile('output.jpg');
```

### Trim

Trim similar pixels from edges:

```js
await sharp(input).trim({
  background: 'yellow',     // Default: top-left pixel
  threshold: 10,            // Allowed difference
  lineArt: false            // Vector vs photographic
}).toFile('output.jpg');
```

**Exact colour:**
```js
await sharp(input).trim({ threshold: 0 });
```

**Line art:**
```js
await sharp(input).trim({
  background: '#FF0000',
  lineArt: true
});
```

The `info` response will contain `trimOffsetLeft` and `trimOffsetTop`.

---

## Image Operations

### Rotate

```js
await sharp(input).rotate([angle], [options])
```

Angles are normalized to positive degrees. `-450` becomes `270`.

```js
// Auto-orient using EXIF
await sharp(input).rotate().toBuffer();

// Rotate 90 degrees
await sharp(input).rotate(90).toBuffer();

// Rotate with background
await sharp(input).rotate(45, {
  background: '#ff6600'
}).toBuffer();
```

**Important:**
- Only one rotation per pipeline (except initial EXIF orientation)
- Multi-page images can only rotate 180 degrees
- Method order matters: `.rotate(x).extract(y)` ≠ `.extract(y).rotate(x)`

### Auto-Orient

```js
await sharp(input).autoOrient().toBuffer();
```

Reads EXIF Orientation tag, rotates/flips accordingly, then removes tag.

**Note:** Auto-orient logically occurs after manual rotate/flip/flop regardless of call order.

### Flip & Flop

**Flip** (vertical, up-down, about x-axis):
```js
await sharp(input).flip().toBuffer();
await sharp(input).flip(false).toBuffer();  // Disable
```

**Flop** (horizontal, left-right, about y-axis):
```js
await sharp(input).flop().toBuffer();
await sharp(input).flop(false).toBuffer();  // Disable
```

**Note:** Always occur before rotation. Multi-page images not supported.

### Affine Transform

Apply 2x2 affine transformation matrix:

```js
await sharp(input).affine([[1, 0.3], [0.1, 0.7]], {
  background: 'white',
  interpolator: sharp.interpolators.nohalo,
  idx: 0,   // Input horizontal offset
  idy: 0,   // Input vertical offset
  odx: 0,   // Output horizontal offset
  ody: 0    // Output vertical offset
}).toBuffer();
```

Always occurs after resize, extraction, and rotation.

### Sharpen

**Fast sharpen:**
```js
await sharp(input).sharpen().toBuffer();
```

**Accurate sharpen (with sigma):**
```js
await sharp(input).sharpen({
  sigma: 2,      // Gaussian mask sigma (1 + radius/2)
  m1: 1.0,       // Flat area sharpening
  m2: 2.0,       // Jagged area sharpening
  x1: 2.0,       // Flat/jagged threshold
  y2: 10.0,      // Max brightening
  y3: 20.0       // Max darkening
}).toBuffer();
```

### Median Filter

Apply median filter (removes noise):

```js
await sharp(input).median().toBuffer();      // 3x3 (default)
await sharp(input).median(5).toBuffer();     // 5x5
```

### Blur

**Fast box blur:**
```js
await sharp(input).blur().toBuffer();
```

**Gaussian blur:**
```js
await sharp(input).blur(5).toBuffer();

await sharp(input).blur({
  sigma: 5,
  precision: 'integer',      // 'integer', 'float', 'approximate'
  minAmplitude: 0.2
}).toBuffer();
```

### Dilate & Erode

**Dilate** (expand foreground):
```js
await sharp(input).dilate(1).toBuffer();
```

**Erode** (shrink foreground):
```js
await sharp(input).erode(1).toBuffer();
```

### Flatten

Merge alpha channel with background:

```js
await sharp(input).flatten({
  background: '#F0A703'
}).toBuffer();
```

### Unflatten

Make white pixels transparent:

```js
await sharp(input).unflatten().toBuffer();

// Combined with threshold
await sharp(input)
  .threshold(128, { grayscale: false })
  .unflatten()
  .toBuffer();
```

### Gamma Correction

```js
await sharp(input).gamma(2.2).toBuffer();
await sharp(input).gamma(2.2, 3.0).toBuffer();  // Different in/out
```

Reduces encoding pre-resize (darken), increases post-resize (brighten).

**Note:** Disables JPEG/WebP shrink-on-load optimization.

### Negate

Create negative:

```js
await sharp(input).negate().toBuffer();
await sharp(input).negate({ alpha: false }).toBuffer();
```

### Normalise/Normalize

Enhance contrast by stretching luminance:

```js
await sharp(input).normalise().toBuffer();

await sharp(input).normalise({
  lower: 1,     // Underexpose percentile
  upper: 99     // Overexpose percentile
}).toBuffer();
```

### CLAHE

Contrast Limited Adaptive Histogram Equalization:

```js
await sharp(input).clahe({
  width: 3,         // Search window width
  height: 3,        // Search window height
  maxSlope: 3       // Brightness level (0-100, 0=disable limiting)
}).toBuffer();
```

### Convolve

Apply custom convolution kernel:

```js
await sharp(input).convolve({
  width: 3,
  height: 3,
  kernel: [-1, 0, 1, -2, 0, 2, -1, 0, 1],  // Sobel horizontal
  scale: 1,      // Optional scale
  offset: 0      // Optional offset
}).raw().toBuffer();
```

### Threshold

Binary threshold:

```js
await sharp(input).threshold(128).toBuffer();

await sharp(input).threshold(128, {
  greyscale: false    // Keep colour channels
}).toBuffer();
```

Values ≥ threshold → 255, otherwise → 0.

### Boolean Operations

Bitwise operations with operand image:

```js
await sharp(input1).boolean(input2, 'and').toBuffer();
await sharp(input1).boolean(input2, 'or').toBuffer();
await sharp(input1).boolean(input2, 'eor').toBuffer();
```

With raw pixel data:
```js
await sharp(input).boolean(buffer, 'and', {
  raw: { width: 100, height: 100, channels: 3 }
}).toBuffer();
```

### Linear

Apply `a * input + b` formula:

```js
// Single channel
await sharp(input).linear(0.5, 2).toBuffer();

// Per-channel
await sharp(input).linear(
  [0.25, 0.5, 0.75],
  [150, 100, 50]
).toBuffer();
```

### Recomb

Recombine with matrix:

```js
// Sepia filter
await sharp(input).recomb([
  [0.3588, 0.7044, 0.1368],
  [0.2990, 0.5870, 0.1140],
  [0.2392, 0.4696, 0.0912]
]).toBuffer();
```

### Modulate

Transform brightness, saturation, hue, lightness:

```js
await sharp(input).modulate({
  brightness: 2,      // Multiplicative
  saturation: 0.5,    // Multiplicative
  hue: 180,           // Degrees rotation
  lightness: 50       // Additive
}).toBuffer();
```

---

## Channel Manipulation

### Remove Alpha

```js
await sharp('rgba.png')
  .removeAlpha()
  .toFile('rgb.png');
```

### Ensure Alpha

```js
// Fully opaque
await sharp('rgb.jpg')
  .ensureAlpha()
  .toFile('rgba.png');

// Fully transparent
await sharp(rgb).ensureAlpha(0).toBuffer();
```

### Extract Channel

```js
// By name
await sharp(input)
  .extractChannel('green')
  .toFile('green.jpg');

// By index (0-based)
await sharp(input)
  .extractChannel(0)
  .raw()
  .toBuffer();
```

Output will be `b-w` (8-bit) or `grey16` (16-bit).

### Join Channel

```js
await sharp(rgb)
  .joinChannel(alphaChannel)
  .toFile('rgba.png');

// Multiple channels
await sharp(input)
  .joinChannel([channel1, channel2])
  .toFile('output.png');
```

Channel ordering (vips convention):
- **sRGB**: 0=Red, 1=Green, 2=Blue, 3=Alpha
- **CMYK**: 0=Magenta, 1=Cyan, 2=Yellow, 3=Black, 4=Alpha

### Band Boolean

Bitwise operation across all channels → single channel:

```js
await sharp('rgb.png')
  .bandbool('and')  // 'and', 'or', 'eor'
  .toFile('single-channel.png');
```

Example: If `RGB = [0b11110111, 0b10101010, 0b00001111]`
Result: `0b11110111 & 0b10101010 & 0b00001111 = 0b00000010`

---

## Colour Manipulation

### Tint

```js
await sharp(input).tint({ r: 255, g: 240, b: 16 }).toBuffer();
await sharp(input).tint('sepia').toBuffer();
```

Alpha channel remains unchanged.

### Greyscale/Grayscale

Convert to 8-bit greyscale:

```js
await sharp(input).greyscale().toBuffer();
await sharp(input).grayscale().toBuffer();  // Alternative spelling
```

**Note:** Linear operation. For sRGB input, use with `gamma()` for best results.

Default output is sRGB with 3 identical channels. Override with `toColourspace('b-w')` for single channel.

### Pipeline Colourspace

Set colourspace for entire pipeline:

```js
await sharp(input)
  .pipelineColourspace('rgb16')
  .toColourspace('srgb')
  .toFile('output.png');
```

Options: `rgb16`, `scrgb`, `lab`, `grey16`, etc.

### Output Colourspace

```js
await sharp(input).toColourspace('rgb16').toFile('16-bpp.png');
```

Options: `srgb`, `rgb`, `cmyk`, `lab`, `b-w`, `rgb16`, etc.

Default output is web-friendly sRGB.

---

## Compositing Images

### Composite

Overlay images with various blend modes:

```js
await sharp(background).composite([
  { input: layer1, gravity: 'northwest' },
  { input: layer2, gravity: 'southeast' }
]).toFile('combined.png');
```

### Composite Options

```js
await sharp(background).composite([
  {
    input: overlay,                  // Buffer, path, or create object
    blend: 'over',                   // Blend mode
    gravity: 'centre',               // Position
    top: 10,                         // Pixel offset from top
    left: 20,                        // Pixel offset from left
    tile: false,                     // Repeat across image
    premultiplied: false,            // Avoid premultiply
    density: 72,                     // DPI for vector overlays
    autoOrient: false,               // Use EXIF orientation
    animated: false,                 // Read all frames
    failOn: 'warning',
    limitInputPixels: 268402689
  }
]).toBuffer();
```

**Note:** `top` and `left` take precedence over `gravity`.

### Blend Modes

`clear`, `source`, `over` (default), `in`, `out`, `atop`, `dest`, `dest-over`, `dest-in`, `dest-out`, `dest-atop`, `xor`, `add`, `saturate`, `multiply`, `screen`, `overlay`, `darken`, `lighten`, `colour-dodge`, `color-dodge`, `colour-burn`, `color-burn`, `hard-light`, `soft-light`, `difference`, `exclusion`

### Create Overlay

```js
await sharp(bg).composite([{
  input: {
    create: {
      width: 100,
      height: 100,
      channels: 4,
      background: { r: 255, g: 0, b: 0, alpha: 0.5 }
    }
  },
  gravity: 'center'
}]).toBuffer();
```

### Text Overlay

```js
await sharp(bg).composite([{
  input: {
    text: {
      text: '<span foreground="red">Hello</span>',
      font: 'Arial',
      rgba: true,
      width: 300,
      dpi: 72
    }
  },
  gravity: 'northwest'
}]).toBuffer();
```

### Tile Overlay

```js
await sharp('input.gif', { animated: true })
  .composite([{
    input: 'pattern.png',
    tile: true,
    blend: 'saturate'
  }])
  .toBuffer();
```

### Complex Example

```js
await sharp('input.png')
  .rotate(180)
  .resize(300)
  .flatten({ background: '#ff6600' })
  .composite([{ input: 'overlay.png', gravity: 'southeast' }])
  .sharpen()
  .withMetadata()
  .webp({ quality: 90 })
  .toBuffer();
```

---

## Output Options

### To File

```js
const info = await sharp(input).toFile('output.png');
```

Returns info object:
```js
{
  format: 'png',
  size: 12345,            // Bytes
  width: 300,
  height: 200,
  channels: 3,
  premultiplied: false,
  cropOffsetLeft: 0,      // When using crop strategy
  cropOffsetTop: 0,
  attentionX: 150,        // When using attention strategy
  attentionY: 100,
  pageHeight: 200,        // Animated output
  pages: 1,
  textAutofitDpi: 72      // Text images
}
```

Format inferred from extension: `.jpg`, `.png`, `.webp`, `.avif`, `.tiff`, `.gif`, `.dzi`

### To Buffer

```js
const buffer = await sharp(input).toBuffer();

// With info
const { data, info } = await sharp(input).toBuffer({ resolveWithObject: true });
```

**Working with raw pixels:**
```js
const { data, info } = await sharp('my-image.jpg')
  .raw()
  .toBuffer({ resolveWithObject: true });

const pixelArray = new Uint8ClampedArray(data.buffer);

// Modify pixelArray...

const { width, height, channels } = info;
await sharp(pixelArray, { raw: { width, height, channels } })
  .toFile('modified.jpg');
```

### To Stream

```js
sharp(input).pipe(writableStream);
```

### Set Timeout

```js
try {
  await sharp(input)
    .blur(1000)
    .timeout({ seconds: 3 })
    .toBuffer();
} catch (err) {
  if (err.message.includes('timeout')) {
    // Handle timeout
  }
}
```

Clock starts when libvips opens input. Time waiting for libuv thread not included.

---

## Format-Specific Options

### JPEG

```js
await sharp(input).jpeg({
  quality: 80,                      // 1-100
  progressive: false,               // Interlaced scan
  chromaSubsampling: '4:2:0',      // '4:4:4' prevents subsampling
  optimiseCoding: true,            // Optimize Huffman tables
  mozjpeg: false,                  // Use mozjpeg defaults
  trellisQuantisation: false,      // Trellis quantisation
  overshootDeringing: false,       // Overshoot deringing
  optimiseScans: false,            // Optimize progressive (forces progressive)
  quantisationTable: 0,            // 0-8
  force: true                      // Force JPEG output
}).toBuffer();
```

**High quality:**
```js
await sharp(input).jpeg({
  quality: 100,
  chromaSubsampling: '4:4:4'
}).toBuffer();
```

**Smaller file size:**
```js
await sharp(input).jpeg({ mozjpeg: true }).toBuffer();
```

### PNG

```js
await sharp(input).png({
  progressive: false,               // Interlaced
  compressionLevel: 6,              // 0 (fastest) - 9 (smallest)
  adaptiveFiltering: false,         // Adaptive row filtering
  palette: false,                   // Quantize to palette
  quality: 100,                     // Sets palette: true
  effort: 7,                        // 1 (fastest) - 10 (slowest), sets palette: true
  colours: 256,                     // Max palette entries, sets palette: true
  dither: 1.0,                      // Floyd-Steinberg dithering
  force: true
}).toBuffer();
```

**Full colour:**
```js
await sharp(input).png().toBuffer();
```

**Indexed (smaller):**
```js
await sharp(input).png({ palette: true }).toBuffer();
```

**16-bit RGB:**
```js
await sharp(input)
  .toColourspace('rgb16')
  .png()
  .toBuffer();
```

### WebP

```js
await sharp(input).webp({
  quality: 80,                      // 1-100
  alphaQuality: 100,                // 0-100
  lossless: false,
  nearLossless: false,
  smartSubsample: false,            // High quality chroma subsampling
  smartDeblock: false,              // Auto deblocking (slow)
  preset: 'default',                // 'default', 'photo', 'picture', 'drawing', 'icon', 'text'
  effort: 4,                        // 0 (fastest) - 6 (slowest)
  loop: 0,                          // Animation iterations (0=infinite)
  delay: [100, 200],                // Frame delays (ms)
  minSize: false,                   // Minimize file size (slow)
  mixed: false,                     // Mix lossy/lossless frames (slow)
  force: true
}).toBuffer();
```

**Lossless:**
```js
await sharp(input).webp({ lossless: true }).toBuffer();
```

**Optimize animated:**
```js
await sharp('input.webp', { animated: true })
  .webp({ effort: 6 })
  .toBuffer();
```

### GIF

```js
await sharp(input).gif({
  reuse: true,                      // Re-use palette
  progressive: false,               // Interlaced
  colours: 256,                     // 2-256 (including transparency)
  effort: 7,                        // 1-10
  dither: 1.0,                      // 0-1
  interFrameMaxError: 0,            // 0 (lossless) - 32
  interPaletteMaxError: 3,          // 0-256
  keepDuplicateFrames: false,       // Keep vs combine duplicates
  loop: 0,                          // Iterations (0=infinite)
  delay: [100, 200],                // Frame delays (ms)
  force: true
}).toBuffer();
```

**Convert PNG to GIF:**
```js
await sharp(pngBuffer).gif().toBuffer();
```

**Lossy animated GIF:**
```js
await sharp('in.gif', { animated: true })
  .gif({ interFrameMaxError: 8 })
  .toFile('optim.gif');
```

### AVIF

```js
await sharp(input).avif({
  quality: 50,                      // 1-100
  lossless: false,
  effort: 4,                        // 0 (fastest) - 9 (slowest)
  chromaSubsampling: '4:4:4',      // '4:2:0' for subsampling
  bitdepth: 8                       // 8, 10, 12
}).toBuffer();
```

**Note:** Prebuilt binaries support 8-bit only. Windows ARM64 requires ARMv8.4+.

### HEIF

```js
await sharp(input).heif({
  compression: 'av1',               // 'av1' or 'hevc'
  quality: 50,                      // 1-100
  lossless: false,
  effort: 4,                        // 0-9
  chromaSubsampling: '4:4:4',      // '4:2:0'
  bitdepth: 8                       // 8, 10, 12
}).toBuffer();
```

Requires globally-installed libvips with libheif, libde265, x265 for HEIC.

### TIFF

```js
await sharp(input).tiff({
  quality: 80,                      // 1-100
  force: true,
  compression: 'jpeg',              // 'none', 'jpeg', 'deflate', 'packbits', 'ccittfax4', 'lzw', 'webp', 'zstd', 'jp2k'
  bigtiff: false,
  predictor: 'horizontal',          // 'none', 'horizontal', 'float'
  pyramid: false,                   // Write image pyramid
  tile: false,                      // Write tiled TIFF
  tileWidth: 256,
  tileHeight: 256,
  xres: 1.0,                        // Pixels/mm
  yres: 1.0,
  resolutionUnit: 'inch',           // 'inch', 'cm'
  bitdepth: 8,                      // 1, 2, 4, 8
  miniswhite: false                 // 1-bit as miniswhite
}).toBuffer();
```

**LZW 1-bit:**
```js
await sharp('input.svg')
  .tiff({
    compression: 'lzw',
    bitdepth: 1
  })
  .toFile('1-bpp.tiff');
```

### JP2 (JPEG 2000)

```js
await sharp(input).jp2({
  quality: 80,                      // 1-100
  lossless: false,
  tileWidth: 512,
  tileHeight: 512,
  chromaSubsampling: '4:4:4'       // '4:2:0'
}).toBuffer();
```

Requires libvips with OpenJPEG (not in prebuilt binaries).

### JXL (JPEG-XL)

```js
await sharp(input).jxl({
  distance: 1.0,                    // 0 (best) - 15 (worst)
  quality: 90,                      // 1-100, overrides distance
  decodingTier: 0,                  // 0 (best) - 4 (worst)
  lossless: false,
  effort: 7,                        // 1-9
  loop: 0,                          // Animation iterations
  delay: [100, 200]                 // Frame delays (ms)
}).toBuffer();
```

Experimental. Requires libvips with libjxl (not in prebuilt binaries).

### Raw Pixel Data

```js
const { data, info } = await sharp('input.jpg')
  .raw({
    depth: 'uchar'  // 'char', 'uchar', 'short', 'ushort', 'int', 'uint', 'float', 'complex', 'double', 'dpcomplex'
  })
  .toBuffer({ resolveWithObject: true });
```

Pixel ordering: left-to-right, top-to-bottom, no padding.
Channel ordering: RGB or RGBA for non-greyscale.

**Extract alpha as 16-bit:**
```js
const data = await sharp('input.png')
  .ensureAlpha()
  .extractChannel(3)
  .toColourspace('b-w')
  .raw({ depth: 'ushort' })
  .toBuffer();
```

### Tile Output (Deep Zoom)

```js
await sharp('input.tiff')
  .png()
  .tile({
    size: 256,                      // 1-8192
    overlap: 0,                     // 0-8192
    angle: 0,                       // Multiple of 90
    background: 'white',
    depth: 'onepixel',              // 'onepixel', 'onetile', 'one'
    skipBlanks: -1,                 // -1 (no skip), 0-255 (8-bit), 0-65535 (16-bit)
    container: 'fs',                // 'fs', 'zip'
    layout: 'dz',                   // 'dz', 'iiif', 'iiif3', 'zoomify', 'google'
    centre: false,
    id: 'https://example.com/iiif', // For IIIF layouts
    basename: 'tiles'               // For zip container
  })
  .toFile('output.dz');
```

Creates `output.dzi` (XML) and `output_files/` directory with tiles.

**Zip output:**
```js
const zipFileWithTiles = await sharp(input)
  .tile({ basename: 'tiles' })
  .toBuffer();
```

---

## Metadata Handling

### Keep All Metadata

```js
await sharp(input).keepMetadata().toBuffer();
```

Keeps EXIF, ICC, XMP, IPTC. Converts to sRGB with ICC profile.

### With Metadata

```js
await sharp(input).withMetadata({
  orientation: 1,   // EXIF Orientation (1-8)
  density: 96       // DPI
}).toBuffer();
```

Keeps most metadata, converts to sRGB, adds web-friendly ICC if appropriate.

### EXIF

**Keep EXIF:**
```js
await sharp(input).keepExif().toBuffer();
```

**Set EXIF:**
```js
await sharp(input).withExif({
  IFD0: {
    Copyright: 'The National Gallery'
  },
  IFD3: {
    GPSLatitudeRef: 'N',
    GPSLatitude: '51/1 30/1 3230/100',
    GPSLongitudeRef: 'W',
    GPSLongitude: '0/1 7/1 4366/100'
  }
}).toBuffer();
```

**Merge EXIF:**
```js
await sharp(inputWithExif).withExifMerge({
  IFD0: {
    Copyright: 'Updated Copyright'
  }
}).toBuffer();
```

### ICC Profile

**Keep ICC:**
```js
await sharp(input).keepIccProfile().toBuffer();
```

**Transform with ICC:**
```js
await sharp(input).withIccProfile('p3').toBuffer();

await sharp(input).withIccProfile('/path/to/profile.icc', {
  attach: true  // Include in output metadata
}).toBuffer();
```

Built-in profiles: `srgb`, `p3`, `cmyk`

**CMYK example:**
```js
await sharp(cmykInput)
  .pipelineColourspace('cmyk')
  .toColourspace('cmyk')
  .keepIccProfile()
  .toBuffer();
```

### XMP

**Keep XMP:**
```js
await sharp(input).keepXmp().toBuffer();
```

**Set XMP:**
```js
const xmpString = `
<?xml version="1.0"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/">
      <dc:creator><rdf:Seq><rdf:li>John Doe</rdf:li></rdf:Seq></dc:creator>
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>`;

await sharp(input).withXmp(xmpString).toBuffer();
```

Supported: PNG, JPEG, WebP, TIFF

---

## Performance & Optimization

### Parallelism

**UV_THREADPOOL_SIZE**: Number of images processed in parallel (default: 4)

```sh
export UV_THREADPOOL_SIZE="$(lscpu -p | egrep -v '^#' | sort -u -t, -k 2,4 | wc -l)"
```

**sharp.concurrency()**: Threads per image (default: CPU cores, or 1 on glibc Linux without jemalloc)

```js
sharp.concurrency(2);  // Set to 2 threads per image
const threads = sharp.concurrency();  // Get current
sharp.concurrency(0);  // Reset to CPU cores
```

### Memory

**glibc systems:** Set MALLOC_ARENA_MAX to reduce fragmentation:

```sh
export MALLOC_ARENA_MAX="2"
```

**Cache management:**

```js
const stats = sharp.cache();
// { memory, files, items }

sharp.cache({ memory: 50, files: 20, items: 100 });
sharp.cache(false);  // Disable caching
```

### SIMD

Enable/disable SIMD (highway) for resize, blur, sharpen:

```js
const enabled = sharp.simd();
sharp.simd(false);  // Disable
```

Requires libvips compiled with highway support.

### Benchmark Results

**JPEG resize (2725x2225 → 720x588, Lanczos 3, quality 80)**

AMD64 (c7a.xlarge):
- jimp (buffer): 2.40 ops/sec (1.0x)
- imagemagick (file): 9.70 ops/sec (4.0x)
- gm (file): 11.72 ops/sec (4.9x)
- **sharp (buffer): 64.42 ops/sec (26.8x)**

ARM64 (c8g.xlarge):
- jimp (buffer): 2.24 ops/sec (1.0x)
- imagemagick (file): 10.42 ops/sec (4.7x)
- gm (file): 12.88 ops/sec (5.7x)
- **sharp (buffer): 49.20 ops/sec (22.0x)**

**PNG resize (2048x1536 RGBA → 720x540, premultiply/unpremultiply)**

AMD64:
- imagemagick (file): 6.06 ops/sec (1.0x)
- **sharp (buffer): 28.70 ops/sec (4.7x)**

ARM64:
- imagemagick (file): 7.09 ops/sec (1.0x)
- **sharp (buffer): 24.19 ops/sec (3.4x)**

### Optimization Features

**Built-in optimizations:**
- JPEG: Huffman table optimization (mozjpeg compatible)
- PNG: No filtering by default (like pngcrush for diagrams)
- GIF: Optimized animation file size
- WebP/AVIF: Efficient encoding
- JPEG/WebP: Shrink-on-load for faster decoding

**mozjpeg:**
```js
await sharp(input).jpeg({ mozjpeg: true }).toBuffer();
```

Equivalent to:
```js
{
  trellisQuantisation: true,
  overshootDeringing: true,
  optimiseScans: true,
  quantisationTable: 3
}
```

---

## Global Utilities

### Version Information

```js
console.log(sharp.versions);
// {
//   sharp: '0.34.5',
//   libvips: '8.17.0',
//   ...dependencies
// }
```

### Format Support

```js
console.log(sharp.format);
// {
//   jpeg: { input: true, output: true },
//   png: { input: true, output: true },
//   ...
// }
```

### Interpolators

```js
sharp.interpolators.nearest
sharp.interpolators.bilinear
sharp.interpolators.bicubic         // Default
sharp.interpolators.locallyBoundedBicubic  // lbb
sharp.interpolators.nohalo
sharp.interpolators.vertexSplitQuadraticBasisSpline  // vsqbs
```

### Queue Events

```js
sharp.queue.on('change', (queueLength) => {
  console.log(`Queue: ${queueLength} tasks`);
});
```

### Counters

```js
const { queue, process } = sharp.counters();
// queue: Tasks waiting for libuv thread
// process: Tasks currently being processed
```

### Block/Unblock Operations

**Block operations (security):**
```js
sharp.block({
  operation: ['VipsForeignLoadTiff']
});
```

**Allowlist approach:**
```js
sharp.block({ operation: ['VipsForeignLoad'] });
sharp.unblock({ operation: ['VipsForeignLoadWebpFile'] });
```

**Block all except JPEG/PNG from Buffer/Stream:**
```js
sharp.block({ operation: ['VipsForeignLoad'] });
sharp.unblock({
  operation: ['VipsForeignLoadJpegBuffer', 'VipsForeignLoadPngBuffer']
});
```

Also respects `VIPS_BLOCK_UNTRUSTED` environment variable.

---

## Best Practices

### Performance

1. **Use appropriate concurrency**:
   ```js
   sharp.concurrency(4);  // Set based on workload
   ```

2. **Enable caching for repeated operations**:
   ```js
   sharp.cache({ memory: 100, files: 30, items: 200 });
   ```

3. **Use jemalloc on glibc Linux**:
   ```sh
   LD_PRELOAD=/usr/lib/x86_64-linux-gnu/libjemalloc.so.2 node app.js
   ```

4. **Leverage shrink-on-load**:
   ```js
   sharp(input).resize(800, 600, { fastShrinkOnLoad: true });
   ```

5. **Use streams for large files**:
   ```js
   fs.createReadStream('large.jpg')
     .pipe(sharp().resize(800))
     .pipe(fs.createWriteStream('thumb.jpg'));
   ```

6. **Process in batches with Promise.all**:
   ```js
   await Promise.all(
     images.map(img => sharp(img).resize(200).toFile(`thumb-${img}`))
   );
   ```

### Quality

1. **Use appropriate kernels**:
   - Lanczos3 (default) for general use
   - Mitchell for smoother results
   - Nearest for pixel art

2. **Handle colour spaces correctly**:
   ```js
   await sharp(cmyk)
     .pipelineColourspace('cmyk')
     .toColourspace('srgb')
     .toBuffer();
   ```

3. **Preserve image quality**:
   ```js
   await sharp(input)
     .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
     .toBuffer();
   ```

4. **Use gamma for resizing sRGB**:
   ```js
   await sharp(input).gamma(2.2).resize(400).toBuffer();
   ```

### Memory Management

1. **Avoid loading entire images**:
   ```js
   // Good: Sharp streams internally
   await sharp(input).resize(300).toBuffer();

   // Bad: Loading full image into memory first
   const buffer = await fs.readFile('huge.jpg');
   await sharp(buffer).resize(300).toBuffer();
   ```

2. **Use extract before resize**:
   ```js
   // Extract region first, then resize
   await sharp(input)
     .extract({ left: 100, top: 100, width: 500, height: 500 })
     .resize(200)
     .toBuffer();
   ```

3. **Clone for multiple outputs**:
   ```js
   const pipeline = sharp(input);
   await Promise.all([
     pipeline.clone().resize(800).toFile('large.jpg'),
     pipeline.clone().resize(400).toFile('medium.jpg'),
     pipeline.clone().resize(200).toFile('small.jpg')
   ]);
   ```

### Error Handling

1. **Use try-catch with async/await**:
   ```js
   try {
     await sharp(input).resize(300).toFile('output.jpg');
   } catch (err) {
     console.error('Sharp error:', err);
   }
   ```

2. **Set appropriate failOn**:
   ```js
   await sharp(input, { failOn: 'error' }).resize(300).toBuffer();
   ```

3. **Add timeout for processing limits**:
   ```js
   await sharp(input).timeout({ seconds: 5 }).resize(300).toBuffer();
   ```

### Security

1. **Limit input pixels**:
   ```js
   await sharp(input, {
     limitInputPixels: 100000000  // ~10000x10000
   }).resize(300).toBuffer();
   ```

2. **Block untrusted operations**:
   ```js
   sharp.block({ operation: ['VipsForeignLoad'] });
   sharp.unblock({ operation: ['VipsForeignLoadJpegBuffer'] });
   ```

3. **Use environment variables**:
   ```sh
   export VIPS_BLOCK_UNTRUSTED=1
   ```

### Production Deployment

1. **Ensure prebuilt binaries**:
   ```json
   {
     "optionalDependencies": {
       "sharp": "^0.34.0"
     }
   }
   ```

2. **Configure for platform**:
   ```sh
   npm install --cpu=x64 --os=linux --libc=glibc sharp
   ```

3. **Set environment variables**:
   ```sh
   export UV_THREADPOOL_SIZE=8
   export MALLOC_ARENA_MAX=2
   ```

4. **Monitor memory usage**:
   ```js
   setInterval(() => {
     console.log(sharp.cache());
     console.log(sharp.counters());
   }, 60000);
   ```

---

## Common Patterns

### Responsive Images

Generate multiple sizes:

```js
const sizes = [400, 800, 1200, 1600];
const input = 'original.jpg';

await Promise.all(
  sizes.map(width =>
    sharp(input)
      .resize(width)
      .jpeg({ quality: 85 })
      .toFile(`image-${width}.jpg`)
  )
);
```

### Thumbnail Generation

Square thumbnail with attention strategy:

```js
await sharp(input)
  .resize(200, 200, {
    fit: 'cover',
    position: sharp.strategy.attention
  })
  .jpeg({ quality: 80 })
  .toFile('thumb.jpg');
```

### Watermarking

```js
await sharp('photo.jpg')
  .composite([{
    input: 'watermark.png',
    gravity: 'southeast'
  }])
  .toFile('watermarked.jpg');
```

### Format Conversion

```js
const formats = ['jpeg', 'webp', 'avif'];

await Promise.all(
  formats.map(format =>
    sharp('input.png')
      .toFormat(format, { quality: 85 })
      .toFile(`output.${format}`)
  )
);
```

### Image Optimization

```js
await sharp(input)
  .rotate()  // Auto-orient
  .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
  .jpeg({ quality: 85, progressive: true, mozjpeg: true })
  .toFile('optimized.jpg');
```

### Batch Processing

```js
const files = await fs.readdir('input/');

await Promise.all(
  files.map(async file => {
    await sharp(`input/${file}`)
      .resize(800)
      .toFile(`output/${file}`);
  })
);
```

### SVG to PNG

```js
await sharp('logo.svg', { density: 300 })
  .resize(800)
  .png()
  .toFile('logo.png');
```

### Extract Frames from GIF

```js
const { pages } = await sharp('animated.gif', { animated: true }).metadata();

for (let i = 0; i < pages; i++) {
  await sharp('animated.gif', { page: i })
    .png()
    .toFile(`frame-${i}.png`);
}
```

### Colour Extraction

```js
const { dominant } = await sharp(input).stats();
console.log(`Dominant colour: rgb(${dominant.r}, ${dominant.g}, ${dominant.b})`);
```

### Create Placeholder

Low quality image placeholder:

```js
const placeholder = await sharp(input)
  .resize(20)
  .blur(5)
  .jpeg({ quality: 30 })
  .toBuffer();

const base64 = placeholder.toString('base64');
const dataUri = `data:image/jpeg;base64,${base64}`;
```

### Progressive JPEG

```js
await sharp(input)
  .jpeg({
    quality: 85,
    progressive: true,
    optimiseCoding: true
  })
  .toFile('progressive.jpg');
```

---

## Troubleshooting

### Common Errors

**"Input file is missing or empty"**
- File path is incorrect
- File doesn't exist
- File is empty
- Permissions issue

**"Input buffer contains unsupported image format"**
- Format not supported by libvips
- Corrupted image data
- Check `sharp.format` for supported formats

**"Expected pixel array length ... but got ..."**
- Raw pixel array size doesn't match width × height × channels
- Check raw options: `{ raw: { width, height, channels } }`

**"libvips error: ... timeout"**
- Processing exceeded timeout
- Increase timeout: `.timeout({ seconds: 10 })`
- Or remove timeout: `.timeout({ seconds: 0 })`

**"Unsupported ... embedded ICC profile"**
- Invalid or corrupted ICC profile
- Use `ignoreIcc: true` option
- Or remove profile: `.withMetadata({ icc: false })`

**"Cannot use ... with animated images"**
- Operation not supported for multi-page images
- Extract single frame first
- Or disable animation: `{ animated: false }`

**"Memory allocation failed"**
- Image too large
- Use `limitInputPixels` option
- Process in smaller chunks
- Increase available memory

### Platform Issues

**Linux Memory Fragmentation:**
```sh
export MALLOC_ARENA_MAX=2
# Or use jemalloc
LD_PRELOAD=/usr/lib/x86_64-linux-gnu/libjemalloc.so.2 node app.js
```

**macOS Font Issues:**
```sh
export PANGOCAIRO_BACKEND=fontconfig
```

**Windows Path Issues:**
```js
const path = require('path');
await sharp(path.resolve('image.jpg')).toBuffer();
```

### Performance Issues

**Slow Processing:**
1. Check concurrency: `sharp.concurrency(4)`
2. Enable caching: `sharp.cache({ memory: 100 })`
3. Use jemalloc on Linux
4. Increase UV_THREADPOOL_SIZE
5. Use streams for large files

**High Memory Usage:**
1. Lower cache limits: `sharp.cache({ memory: 20 })`
2. Process files in smaller batches
3. Use streaming where possible
4. Disable cache: `sharp.cache(false)`

**CPU Usage:**
1. Lower concurrency: `sharp.concurrency(2)`
2. Use less expensive kernels
3. Disable SIMD: `sharp.simd(false)`

### Debugging

**Enable verbose logging:**
```sh
VIPS_WARNING=1 node app.js
```

**Check libvips version:**
```js
console.log(sharp.versions);
```

**Test format support:**
```js
console.log(sharp.format);
```

**Monitor performance:**
```js
sharp.queue.on('change', len => console.log('Queue:', len));
setInterval(() => console.log(sharp.counters()), 1000);
```

---

## API Reference Quick Guide

### Input/Output
- `sharp(input, options)` - Constructor
- `.metadata()` - Get image metadata
- `.stats()` - Get pixel statistics
- `.toFile(path)` - Write to file
- `.toBuffer()` - Write to buffer
- `.clone()` - Clone pipeline

### Resize/Crop
- `.resize(width, height, options)` - Resize
- `.extend(options)` - Add padding
- `.extract(options)` - Crop region
- `.trim(options)` - Trim edges

### Transform
- `.rotate(angle, options)` - Rotate
- `.autoOrient()` - EXIF orientation
- `.flip()` - Vertical mirror
- `.flop()` - Horizontal mirror
- `.affine(matrix, options)` - Affine transform

### Enhance
- `.sharpen(options)` - Sharpen
- `.median(size)` - Median filter
- `.blur(options)` - Blur
- `.dilate(width)` - Dilate
- `.erode(width)` - Erode
- `.flatten(options)` - Merge alpha
- `.unflatten()` - White → transparent
- `.gamma(gamma)` - Gamma correction
- `.negate(options)` - Negative
- `.normalise(options)` - Normalize contrast
- `.clahe(options)` - CLAHE
- `.convolve(kernel)` - Custom convolution

### Adjust
- `.threshold(threshold)` - Binary threshold
- `.boolean(operand, operator)` - Boolean operation
- `.linear(a, b)` - Linear adjustment
- `.recomb(matrix)` - Recombination matrix
- `.modulate(options)` - Brightness/saturation/hue

### Channels
- `.removeAlpha()` - Remove alpha channel
- `.ensureAlpha(alpha)` - Add alpha channel
- `.extractChannel(channel)` - Extract single channel
- `.joinChannel(images)` - Join channels
- `.bandbool(boolOp)` - Bitwise across channels

### Colour
- `.tint(colour)` - Tint
- `.greyscale()` - Convert to greyscale
- `.pipelineColourspace(space)` - Set pipeline colourspace
- `.toColourspace(space)` - Set output colourspace

### Composite
- `.composite(images)` - Overlay images

### Format
- `.toFormat(format, options)` - Set output format
- `.jpeg(options)` - JPEG options
- `.png(options)` - PNG options
- `.webp(options)` - WebP options
- `.gif(options)` - GIF options
- `.avif(options)` - AVIF options
- `.heif(options)` - HEIF options
- `.tiff(options)` - TIFF options
- `.jp2(options)` - JP2 options
- `.jxl(options)` - JXL options
- `.raw(options)` - Raw pixel output
- `.tile(options)` - Tiled output

### Metadata
- `.keepMetadata()` - Keep all metadata
- `.withMetadata(options)` - Keep metadata with options
- `.keepExif()` - Keep EXIF
- `.withExif(exif)` - Set EXIF
- `.withExifMerge(exif)` - Merge EXIF
- `.keepIccProfile()` - Keep ICC profile
- `.withIccProfile(icc)` - Set ICC profile
- `.keepXmp()` - Keep XMP
- `.withXmp(xmp)` - Set XMP

### Utilities
- `.timeout(options)` - Set processing timeout
- `sharp.cache(options)` - Configure cache
- `sharp.concurrency(threads)` - Set concurrency
- `sharp.counters()` - Get counters
- `sharp.simd(enable)` - Enable/disable SIMD
- `sharp.block(options)` - Block operations
- `sharp.unblock(options)` - Unblock operations

### Constants
- `sharp.versions` - Version information
- `sharp.format` - Format support
- `sharp.interpolators` - Available interpolators
- `sharp.kernel` - Resize kernels
- `sharp.fit` - Resize fit options
- `sharp.position` - Position constants
- `sharp.gravity` - Gravity constants
- `sharp.strategy` - Cropping strategies
- `sharp.queue` - Queue event emitter

---

## Summary

Sharp is the fastest, most feature-rich Node.js image processing library, powered by the battle-tested libvips engine.

**Key Strengths:**
- **Performance**: 4x-5x faster than alternatives
- **Memory Efficient**: Streaming architecture, no full image loading
- **Production Ready**: Handles colour spaces, ICC profiles correctly
- **Format Support**: JPEG, PNG, WebP, GIF, AVIF, TIFF, SVG
- **Feature Rich**: Resize, crop, rotate, composite, filters, metadata
- **Developer Friendly**: Promise/async/await, TypeScript support

**When to Use Sharp:**
- Server-side image processing
- Thumbnail generation
- Image optimization
- Format conversion
- Responsive images
- Watermarking
- Batch processing
- Any production image pipeline

**Platform Support:**
- Node.js >=18.17.0
- Deno
- Bun
- Linux (x64, ARM64, ARM, RISC-V, ppc64, s390x)
- macOS (x64, ARM64)
- Windows (x64, x86, ARM64)

**Best For:**
- High-volume image processing
- Web applications (thumbnails, optimization)
- Content management systems
- E-commerce (product images)
- Media management platforms
- Any system requiring fast, reliable image processing

**Remember:**
- Operations are pipelined and executed once
- Order matters in pipeline operations
- Use streams for large files
- Leverage caching for repeated operations
- Configure concurrency based on workload
- Use jemalloc on glibc Linux for production

---

*This bible documents Sharp v0.34.x based on libvips v8.17.0. Always refer to the official documentation at [sharp.pixelplumbing.com](https://sharp.pixelplumbing.com/) for the latest updates.*
# ASTRO IMAGETOOLS BIBLE

> Comprehensive knowledge document for AI agents implementing Astro ImageTools code

**📊 Document Stats:**
- **~12,000 tokens** (~47KB)
- **1,800+ lines** of documentation
- **5,000+ words**
- **Coverage:** 100% of official Astro ImageTools documentation
- **Library Version:** astro-imagetools v0.6.0+
- **Compatible with:** Astro 1.x, 2.x, 3.x
- **Last Updated:** 2025

---

## Table of Contents

1. [Introduction](#introduction)
2. [Core Concepts](#core-concepts)
3. [Installation & Setup](#installation--setup)
4. [Components](#components)
5. [APIs](#apis)
6. [Configuration Options](#configuration-options)
7. [Layouts](#layouts)
8. [Placeholders](#placeholders)
9. [Image Formats](#image-formats)
10. [Breakpoints & Responsive Images](#breakpoints--responsive-images)
11. [Art Direction](#art-direction)
12. [Vite Plugin Usage](#vite-plugin-usage)
13. [Markdown Images](#markdown-images)
14. [SSR Support](#ssr-support)
15. [Global Configuration](#global-configuration)
16. [Image Transformations](#image-transformations)
17. [Best Practices](#best-practices)
18. [Common Patterns](#common-patterns)
19. [Troubleshooting](#troubleshooting)
20. [Migration & Deprecations](#migration--deprecations)

---

## Introduction

**Astro ImageTools** is a comprehensive image optimization library for **Astro JS** that provides components, APIs, and a Vite plugin for optimizing, transforming, and delivering responsive images.

### What is Astro ImageTools?

Astro ImageTools is a collection of tools designed to:
- Optimize images for the web automatically
- Generate responsive image sets
- Provide placeholder images while loading
- Support art direction for different viewports
- Work with both local and remote images
- Transform images with filters and effects

### Key Features

- ✅ **Regular Image Optimization** (`<img>` and `<picture>`)
- ✅ **Background Image Optimization**
- ✅ **Responsive Images** with automatic breakpoint calculation
- ✅ **Simple and intuitive Art Direction API**
- ✅ **Lazy Loading** support
- ✅ **Programmatic APIs** for advanced use cases
- ✅ **Asynchronous Decoding**
- ✅ **Unique Breakpoints Calculation** algorithm
- ✅ **Preloading** for critical images
- ✅ **SVG Tracing and Posterization** for placeholders
- ✅ **100% Scoped CSS**
- ✅ **Four Layouts**: `constrained`, `fixed`, `fullWidth`, `fill`
- ✅ **Three Placeholders**: `blurred`, `dominantColor`, `tracedSVG`
- ✅ **Long list of supported Image Formats**: AVIF, WebP, JPEG, PNG, TIFF, GIF, HEIC, HEIF
- ✅ **Extensive Configuration Options**
- ✅ **Remote Images and Data URIs** support
- ✅ **Sharp-less Environments** support
- ✅ **Memory-based and FS-based Caching**
- ✅ **Semantic HTML** respect

---

## Core Concepts

### Component vs API Approach

**Astro ImageTools** provides two ways to work with images:

**1. Components** - Astro components for declarative usage
```astro
<Picture src="/src/images/hero.jpg" alt="Hero image" />
```

**2. APIs** - Functions for programmatic usage
```astro
---
const { picture } = await renderPicture({
  src: "/src/images/hero.jpg",
  alt: "Hero image"
});
---
<Fragment set:html={picture} />
```

### Regular Images vs Background Images

**Regular Images:**
- Use `<Img />` or `<Picture />` components
- Use `renderImg` or `renderPicture` APIs
- Standard HTML `<img>` or `<picture>` elements
- Support lazy loading, async decoding, sizes attribute

**Background Images:**
- Use `<BackgroundImage />` or `<BackgroundPicture />` components
- Use `renderBackgroundImage` or `renderBackgroundPicture` APIs
- CSS background-image or positioned `<picture>` element
- `<BackgroundImage />` requires JavaScript for format detection
- `<BackgroundPicture />` uses positioned picture element

### Image Processing Pipeline

1. **Input**: Source image (local, remote, or data URI)
2. **Processing**:
   - Format conversion
   - Resizing for breakpoints
   - Optimization (compression, quality adjustment)
   - Transformation (filters, effects)
   - Placeholder generation
3. **Output**: Optimized image sets with HTML markup

---

## Installation & Setup

### Installation

```bash
npm install astro-imagetools

# yarn
yarn add astro-imagetools

# pnpm
pnpm add astro-imagetools
```

### Configuration

Register the Astro Integration in `astro.config.mjs`:

```js
import { astroImageTools } from "astro-imagetools";

export default {
  integrations: [astroImageTools],
};
```

Or with `defineConfig`:

```js
import { defineConfig } from "astro/config";
import { astroImageTools } from "astro-imagetools";

export default defineConfig({
  integrations: [astroImageTools],
});
```

**That's it!** The integration will:
- Register the Vite plugin automatically
- Configure image optimization
- Enable all components and APIs

---

## Components

Astro ImageTools provides five main components for different use cases.

### `<Img />`

Renders an optimized and responsive `<img>` element.

**Use When:**
- You don't need multiple source formats
- You don't need art direction
- You want simple, straightforward image optimization

**Example:**

```astro
---
import { Img } from "astro-imagetools/components";
---

<Img src="https://picsum.photos/1024/768" alt="A random image" />
```

**With Configuration:**

```astro
<Img
  src="/src/images/photo.jpg"
  alt="Photo"
  layout="constrained"
  width={800}
  placeholder="blurred"
  loading="lazy"
/>
```

**Required Props:**
- `src` - Image source path
- `alt` - Alternative text

---

### `<Picture />`

Renders an optimized and responsive `<picture>` element with multiple source formats.

**Use When:**
- You need multiple source formats (AVIF, WebP, etc.)
- You want art direction support
- You want fade-in transition effects
- **This is the component you'll use most often**

**Example:**

```astro
---
import { Picture } from "astro-imagetools/components";
---

<Picture
  src="/src/images/landscape.jpg"
  alt="A landscape image"
/>
```

**With Art Direction:**

```astro
<Picture
  src="/src/images/landscape.jpg"
  alt="A landscape image"
  artDirectives={[
    {
      src: "/src/images/portrait.jpg",
      media: "(orientation: portrait)",
    },
  ]}
/>
```

**Multiple Formats:**

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  format={["avif", "webp"]}
  fallbackFormat="jpg"
/>
```

**Required Props:**
- `src` - Image source path
- `alt` - Alternative text

---

### `<BackgroundImage />`

Renders background images using CSS `background-image` property.

**Use When:**
- You need background images with optimization
- You can accept the JavaScript dependency
- You need art direction for backgrounds

**Limitations:**
- No lazy loading
- No async decoding
- No sizes attribute
- No fade-in transition
- Requires `<ImageSupportDetection />` component

**Example:**

```astro
---
import {
  BackgroundImage,
  ImageSupportDetection,
} from "astro-imagetools/components";
---

<html>
  <head>
    <ImageSupportDetection />
  </head>
  <body>
    <BackgroundImage src="/src/images/bg.jpg">
      <h1>Content over background</h1>
    </BackgroundImage>
  </body>
</html>
```

**With Art Direction:**

```astro
<BackgroundImage
  src="/src/images/bg-landscape.jpg"
  artDirectives={[
    {
      src: "/src/images/bg-portrait.jpg",
      media: "(orientation: portrait)",
    },
  ]}
>
  <div>Content here</div>
</BackgroundImage>
```

**Required Props:**
- `src` - Image source path

**Important:** Add `<ImageSupportDetection />` to your layout's `<head>` (adds 655 bytes).

---

### `<BackgroundPicture />`

Renders background images using positioned `<picture>` element.

**Use When:**
- You need background images with optimization
- You want lazy loading support
- You prefer no JavaScript dependency

**Advantages over `<BackgroundImage />`:**
- Supports lazy loading
- Supports async decoding
- Supports sizes attribute
- Supports fade-in transition
- No JavaScript required

**Example:**

```astro
---
import { BackgroundPicture } from "astro-imagetools/components";
---

<BackgroundPicture src="/src/images/bg.jpg">
  <h1>Content over background</h1>
</BackgroundPicture>
```

**With Art Direction:**

```astro
<BackgroundPicture
  src="/src/images/bg-desktop.jpg"
  artDirectives={[
    {
      src: "/src/images/bg-mobile.jpg",
      media: "(max-width: 768px)",
    },
  ]}
>
  <div>Content here</div>
</BackgroundPicture>
```

**Required Props:**
- `src` - Image source path

---

### `<ImageSupportDetection />`

Detects WebP and AVIF format support for `<BackgroundImage />`.

**Use When:**
- You're using `<BackgroundImage />` component
- You're using `renderBackgroundImage` API

**Example:**

```astro
---
import { ImageSupportDetection } from "astro-imagetools/components";
---

<html>
  <head>
    <ImageSupportDetection />
  </head>
  <body>
    <!-- Your content -->
  </body>
</html>
```

**Notes:**
- Add once in your layout's `<head>`
- Adds 655 bytes to page
- Required for `<BackgroundImage />` to detect format support
- Not needed for `<BackgroundPicture />`

---

## APIs

Astro ImageTools provides programmatic APIs for advanced use cases.

### `renderImg`

Generates optimized `<img>` element markup.

**Returns:**
```typescript
{
  link: string;   // Preload link tag (if preload is set)
  style: string;  // Placeholder styles (if placeholder is not "none")
  img: string;    // The img element HTML
}
```

**Example:**

```astro
---
import { renderImg } from "astro-imagetools/api";

const { link, style, img } = await renderImg({
  src: "https://picsum.photos/1024/768",
  alt: "A random image",
});
---

<Fragment set:html={link + style + img} />
```

**With Configuration:**

```astro
---
const { img } = await renderImg({
  src: "/src/images/photo.jpg",
  alt: "Photo",
  width: 800,
  height: 600,
  format: "webp",
  placeholder: "dominantColor",
  loading: "eager",
  preload: "webp"
});
---
<Fragment set:html={img} />
```

---

### `renderPicture`

Generates optimized `<picture>` element markup.

**Returns:**
```typescript
{
  link: string;     // Preload link tag (if preload is set)
  style: string;    // Placeholder styles (if placeholder is not "none")
  picture: string;  // The picture element HTML
}
```

**Example:**

```astro
---
import { renderPicture } from "astro-imagetools/api";

const { link, style, picture } = await renderPicture({
  src: "https://picsum.photos/1024/768",
  alt: "A random image",
});
---

<Fragment set:html={link + style + picture} />
```

**With Art Direction:**

```astro
---
const { picture } = await renderPicture({
  src: "/src/images/landscape.jpg",
  alt: "Landscape",
  artDirectives: [
    {
      src: "/src/images/portrait.jpg",
      media: "(orientation: portrait)",
    },
  ],
});
---
<Fragment set:html={picture} />
```

---

### `renderBackgroundImage`

Generates background image markup using CSS `background-image`.

**Returns:**
```typescript
{
  link: string;        // Preload link tag (if preload is set)
  style: string;       // Background image styles + placeholder
  htmlElement: string; // Container element HTML
}
```

**Example:**

```astro
---
import { renderBackgroundImage } from "astro-imagetools/api";
import { ImageSupportDetection } from "astro-imagetools/components";

const content = "<h1>Content</h1>";

const { link, style, htmlElement } = await renderBackgroundImage({
  src: "https://picsum.photos/1024/768",
  content,
});
---

<html>
  <head>
    <ImageSupportDetection />
  </head>
  <body>
    <Fragment set:html={link + style + htmlElement} />
  </body>
</html>
```

**Required Config:**
- `src` - Image source path
- `content` (optional) - HTML content for container

---

### `renderBackgroundPicture`

Generates background image markup using positioned `<picture>`.

**Returns:**
```typescript
{
  link: string;        // Preload link tag (if preload is set)
  style: string;       // Container styles + placeholder
  htmlElement: string; // Container with positioned picture
}
```

**Example:**

```astro
---
import { renderBackgroundPicture } from "astro-imagetools/api";

const content = "<h1>Content</h1>";

const { link, style, htmlElement } = await renderBackgroundPicture({
  src: "/src/images/bg.jpg",
  content,
  artDirectives: [
    {
      src: "/src/images/bg-mobile.jpg",
      media: "(max-width: 768px)",
    },
  ],
});
---

<Fragment set:html={link + style + htmlElement} />
```

---

### `importImage`

Dynamically import images similar to ESM `import()`.

**Returns:** `Promise<string>` - Source path or srcset

**Use When:**
- You need dynamic image paths
- Working with remote URLs
- Need query parameter support

**Example:**

```js
import { importImage } from "astro-imagetools/api";

// Basic usage
const src = await importImage("https://picsum.photos/1024/768");

// With query parameters
const src = await importImage(
  "https://picsum.photos/1024/768?w=200&h=200&format=avif&q=80"
);

// Generate srcset (multiple widths)
const srcset = await importImage(
  "https://picsum.photos/1024/768?w=200;400;800"
);

// Dynamic paths
const imagePath = "/public/images/image.jpeg";
const src = await importImage(imagePath);
```

**In React Component:**

```jsx
import React from "react";
import { importImage } from "astro-imagetools/api";

const src = await importImage("https://picsum.photos/1024/768");

export default function ReactImage() {
  return <img src={src} />;
}
```

**Notes:**
- Supports remote URLs and data URIs
- Does NOT support relative local paths
- Query parameters work like regular imports
- Returns srcset when multiple widths specified

---

## Configuration Options

### Core Configuration Options

All components and APIs share these common configuration options:

#### `src`

**Type:** `string`

**Required:** Yes (except for background APIs where `content` may be used)

**Description:** Path to the source image.

**Supported Paths:**
- **Absolute paths**: `/src/images/photo.jpg`
- **Relative paths** (Markdown only): `./images/photo.jpg`, `../images/photo.jpg`
- **Remote URLs**: `https://example.com/image.jpg`
- **Data URIs**: `data:image/png;base64,...`

**Examples:**

```astro
<Picture src="/src/images/photo.jpg" alt="Photo" />
<Picture src="https://picsum.photos/1024/768" alt="Remote" />
```

---

#### `alt`

**Type:** `string`

**Required:** Yes (for `<Img />` and `<Picture />` components/APIs)

**Description:** Alternative text for the image.

**Example:**

```astro
<Picture src="/src/images/photo.jpg" alt="Mountain landscape at sunset" />
```

---

#### `layout`

**Type:** `"constrained" | "fixed" | "fullWidth" | "fill"`

**Default:** `"constrained"`

**Description:** Determines image resizing behavior.

**Layouts:**

**`constrained`** (Default)
- Image occupies full width of container
- Max-width: 100% of original width
- Height calculated from aspect ratio
- Image scales down but not up

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  layout="constrained"
/>
```

**`fixed`**
- Fixed width and height
- No scaling
- Uses `width` and `height` props

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  layout="fixed"
  width={400}
  height={300}
/>
```

**`fullWidth`**
- Scales to fill container width
- Height from aspect ratio
- Can scale up or down

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  layout="fullWidth"
/>
```

**`fill`**
- Fills entire container width AND height
- May distort aspect ratio

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  layout="fill"
/>
```

**Note:** Background image components don't support `layout`.

---

#### `placeholder`

**Type:** `"dominantColor" | "blurred" | "tracedSVG" | "none"`

**Default:** `"blurred"`

**Description:** Placeholder displayed while image loads.

**Options:**

**`blurred`** (Default)
- Low-resolution version enlarged
- Smooth blur effect
- Fast generation

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  placeholder="blurred"
/>
```

**`dominantColor`**
- Single dominant color
- Smallest payload
- Fastest option

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  placeholder="dominantColor"
/>
```

**`tracedSVG`**
- Traced/posterized SVG outline
- Artistic effect
- Customizable via `formatOptions`

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  placeholder="tracedSVG"
/>
```

**`none`**
- No placeholder
- No fade-in transition

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  placeholder="none"
/>
```

---

#### `format`

**Type (Img):** `"heic" | "heif" | "avif" | "jpg" | "jpeg" | "png" | "tiff" | "webp" | "gif"`

**Type (Picture):** `format | format[] | [] | null`

**Default (Img):** Source image format

**Default (Picture):** `["avif", "webp"]`

**Description:** Output format(s) for image sets.

**For `<Img />` / `renderImg`:**

```astro
<Img
  src="/src/images/photo.jpg"
  alt="Photo"
  format="webp"
/>
```

**For `<Picture />` / `renderPicture`:**

```astro
<!-- Multiple formats -->
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  format={["avif", "webp", "jpg"]}
/>

<!-- No additional formats -->
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  format={[]}
/>

<!-- Single format -->
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  format="avif"
/>
```

**Note:** Even with `format={[]}`, images are still generated for:
- Source format (if `includeSourceFormat: true`)
- Fallback format (from `fallbackFormat`)

---

#### `fallbackFormat`

**Type:** `"heic" | "heif" | "avif" | "jpg" | "jpeg" | "png" | "tiff" | "webp" | "gif"`

**Default:** Source image format

**Description:** Format for fallback `<img>` in `<picture>`.

```astro
<Picture
  src="/src/images/photo.png"
  alt="Photo"
  format={["avif", "webp"]}
  fallbackFormat="jpg"
/>
```

---

#### `includeSourceFormat`

**Type:** `boolean`

**Default:** `true`

**Description:** Include source format in generated image sets.

```astro
<!-- Don't generate source format -->
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  format={["avif", "webp"]}
  includeSourceFormat={false}
/>
```

---

#### `loading`

**Type:** `"lazy" | "eager" | "auto" | null`

**Default:** `preload ? "eager" : "lazy"`

**Description:** Loading strategy for the image.

```astro
<!-- Lazy load -->
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  loading="lazy"
/>

<!-- Eager load (no lazy loading) -->
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  loading="eager"
/>

<!-- Omit loading attribute -->
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  loading={null}
/>
```

---

#### `decoding`

**Type:** `"async" | "sync" | "auto" | null`

**Default:** `"async"`

**Description:** Image decoding strategy.

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  decoding="async"
/>
```

---

#### `preload`

**Type:** `"heic" | "heif" | "avif" | "jpg" | "jpeg" | "png" | "tiff" | "webp" | "gif"`

**Default:** `undefined`

**Description:** Which format to preload.

**Important:** Only preload critical above-the-fold images.

```astro
<!-- Preload WebP version -->
<Picture
  src="/src/images/hero.jpg"
  alt="Hero"
  format={["avif", "webp"]}
  preload="webp"
/>
```

**Note:** Can't preload multiple formats. Choose based on browser support vs file size.

---

#### `fadeInTransition`

**Type:** `boolean | { delay?: string; duration?: string; timingFunction?: string; }`

**Default:** `true` / `{ delay: "0s", duration: "1s", timingFunction: "ease" }`

**Description:** Fade-in transition when image loads.

**Requirements:**
- Only available when `placeholder` is not `"none"`
- Available for `<Picture />` and `<BackgroundPicture />`

```astro
<!-- Disable fade-in -->
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  fadeInTransition={false}
/>

<!-- Custom transition -->
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  fadeInTransition={{
    delay: "0.5s",
    duration: "0.5s",
    timingFunction: "linear"
  }}
/>
```

---

#### `breakpoints`

**Type:** `number[] | { count?: number; minWidth?: number; maxWidth?: number }`

**Default:** `undefined` (auto-calculated)

**Description:** Widths (in pixels) for responsive image sets.

**Array Syntax:**

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  breakpoints={[200, 400, 800, 1600]}
/>
```

**Object Syntax:**

```astro
<!-- Generate 3 breakpoints from 300px to 1024px -->
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  breakpoints={{ count: 3, minWidth: 300, maxWidth: 1024 }}
/>
```

**Auto-calculation:** Uses intelligent algorithm when not specified.

---

#### `sizes`

**Type:** `string | (breakpoints: number[]) => string`

**Default:** `` (breakpoints) => `(min-width: ${max}px) ${max}px, 100vw` ``

**Description:** Value for `sizes` attribute.

**String:**

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  sizes="(min-width: 1024px) 1024px, 100vw"
/>
```

**Function:**

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  sizes={(breakpoints) => {
    const max = breakpoints[breakpoints.length - 1];
    return `(min-width: ${max}px) ${max}px, 100vw`;
  }}
/>
```

---

#### `width` & `height`

**Type:** `number`

**Default:** Original image dimensions

**Description:** Target width/height for image.

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
/>
```

**Notes:**
- Required for `layout="fixed"`
- Used to calculate aspect ratio
- Image will maintain aspect ratio unless `layout="fill"`

---

#### `attributes`

**Type:** `Record<string, any>`

**Default:** `{}`

**Description:** Additional HTML attributes for generated elements.

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  attributes={{
    class: "hero-image",
    "data-testid": "hero",
    style: "border-radius: 8px;"
  }}
/>
```

---

### Image Transformation Options

#### `quality`

**Type:** `number` (0-100)

**Default:** Format-dependent

**Description:** Output quality for lossy formats.

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  quality={90}
/>
```

Via query parameter:
```astro
<Img src="/src/images/photo.jpg?q=80" alt="Photo" />
```

---

#### `aspect`

**Type:** `number`

**Description:** Force aspect ratio.

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  aspect={16/9}
/>
```

---

#### `fit`

**Type:** `"cover" | "contain" | "fill" | "inside" | "outside"`

**Default:** `"cover"`

**Description:** How image should fit target dimensions.

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  width={400}
  height={400}
  fit="contain"
/>
```

---

#### `position`

**Type:** `"top" | "right top" | "right" | "right bottom" | "bottom" | "left bottom" | "left" | "left top" | "north" | "northeast" | "east" | "southeast" | "south" | "southwest" | "west" | "northwest" | "center" | "centre" | "entropy" | "attention"`

**Default:** `"centre"`

**Description:** Position/gravity for cropping.

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  width={400}
  height={400}
  position="top"
/>
```

**Smart Positioning:**
- `"entropy"` - Focus on region with most entropy
- `"attention"` - Focus on region likely to attract attention

---

#### `kernel`

**Type:** `"nearest" | "cubic" | "mitchell" | "lanczos2" | "lanczos3"`

**Default:** `"lanczos3"`

**Description:** Resampling kernel for resizing.

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  kernel="lanczos3"
/>
```

---

### Image Filters & Effects

#### `blur`

**Type:** `number` (0.3 - 1000)

**Description:** Gaussian blur sigma.

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  blur={5}
/>
```

Via query:
```astro
<Img src="/src/images/photo.jpg?blur=10" alt="Photo" />
```

---

#### `rotate`

**Type:** `number`

**Description:** Rotation angle in degrees.

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  rotate={90}
/>
```

---

#### `flip`

**Type:** `boolean`

**Default:** `false`

**Description:** Flip image vertically.

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  flip={true}
/>
```

Via query:
```astro
<Img src="/src/images/photo.jpg?flip" alt="Photo" />
```

---

#### `flop`

**Type:** `boolean`

**Default:** `false`

**Description:** Flip image horizontally.

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  flop={true}
/>
```

---

#### `invert`

**Type:** `boolean`

**Default:** `false`

**Description:** Invert colors.

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  invert={true}
/>
```

Via query:
```astro
<Img src="/src/images/photo.jpg?invert" alt="Photo" />
```

---

#### `grayscale`

**Type:** `boolean`

**Default:** `false`

**Description:** Convert to grayscale.

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  grayscale={true}
/>
```

Via query:
```astro
<Img src="/src/images/photo.jpg?grayscale" alt="Photo" />
```

---

#### `normalize`

**Type:** `boolean`

**Default:** `false`

**Description:** Normalize image by stretching luminance.

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  normalize={true}
/>
```

---

#### `brightness`

**Type:** `number`

**Description:** Brightness multiplier (0.5 = 50% darker, 2 = 200% brighter).

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  brightness={1.5}
/>
```

---

#### `saturation`

**Type:** `number`

**Description:** Saturation multiplier.

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  saturation={0.5}
/>
```

---

#### `hue`

**Type:** `number`

**Description:** Hue rotation in degrees.

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  hue={180}
/>
```

---

#### `tint`

**Type:** `string`

**Description:** Tint color (RGB hex).

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  tint="#FF0000"
/>
```

---

#### `median`

**Type:** `number` (1-50)

**Description:** Median filter size for noise reduction.

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  median={3}
/>
```

---

#### `flatten`

**Type:** `boolean | string`

**Description:** Flatten alpha channel with background color.

```astro
<!-- Flatten with white -->
<Picture
  src="/src/images/photo.png"
  alt="Photo"
  flatten={true}
/>

<!-- Flatten with custom color -->
<Picture
  src="/src/images/photo.png"
  alt="Photo"
  flatten="#FF0000"
/>
```

---

### Background-Specific Options

#### `background`

**Type:** `string`

**Description:** Background color for transparent images.

```astro
<Picture
  src="/src/images/photo.png"
  alt="Photo"
  background="#FFFFFF"
/>
```

---

#### `backgroundSize`

**Type:** `string`

**Description:** CSS `background-size` value (for `<BackgroundImage />`).

```astro
<BackgroundImage
  src="/src/images/bg.jpg"
  backgroundSize="cover"
>
  Content
</BackgroundImage>
```

---

#### `backgroundPosition`

**Type:** `string`

**Description:** CSS `background-position` value (for `<BackgroundImage />`).

```astro
<BackgroundImage
  src="/src/images/bg.jpg"
  backgroundPosition="center center"
>
  Content
</BackgroundImage>
```

---

#### `objectFit`

**Type:** `string`

**Description:** CSS `object-fit` value.

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  objectFit="cover"
/>
```

---

#### `objectPosition`

**Type:** `string`

**Description:** CSS `object-position` value.

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  objectPosition="center top"
/>
```

---

### Advanced Options

#### `formatOptions`

**Type:** `Record<string, any>`

**Description:** Format-specific options for image processing.

**Example:**

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  formatOptions={{
    jpg: { quality: 80 },
    png: { quality: 80 },
    webp: { quality: 50 },
    tracedSVG: {
      options: {
        background: "#fff",
        color: "#000",
        turnPolicy: "black",
        threshold: 100
      }
    }
  }}
/>
```

**TracedSVG Options:**
- `background` - Background color
- `color` - Trace color
- `turnPolicy` - `"black"`, `"white"`, `"left"`, `"right"`, `"minority"`, `"majority"`
- `turdSize` - Suppress speckles of this size
- `alphaMax` - Corner threshold
- `optCurve` - Optimize curves
- `threshold` - Threshold for bitmap
- `blackOnWhite` - Invert colors

---

#### `tag`

**Type:** `string`

**Description:** HTML tag for background image container.

```astro
<BackgroundPicture
  src="/src/images/bg.jpg"
  tag="section"
>
  Content
</BackgroundPicture>
```

---

#### `content`

**Type:** `string`

**Description:** HTML content for background image container (API only).

```astro
---
const { htmlElement } = await renderBackgroundPicture({
  src: "/src/images/bg.jpg",
  content: "<h1>Hello</h1>"
});
---
```

---

## Art Direction

Art direction allows different images for different viewport conditions.

### Basic Art Direction

```astro
<Picture
  src="/src/images/landscape.jpg"
  alt="Landscape"
  artDirectives={[
    {
      src: "/src/images/portrait.jpg",
      media: "(orientation: portrait)",
    },
  ]}
/>
```

### Multiple Art Directives

```astro
<Picture
  src="/src/images/desktop.jpg"
  alt="Hero"
  artDirectives={[
    {
      src: "/src/images/mobile.jpg",
      media: "(max-width: 768px)",
    },
    {
      src: "/src/images/tablet.jpg",
      media: "(max-width: 1024px)",
    },
  ]}
/>
```

### Art Direction with Dark Mode

```astro
<Picture
  src="/src/images/light-landscape.jpg"
  alt="Hero"
  artDirectives={[
    {
      src: "/src/images/dark-portrait.jpg",
      media: "(prefers-color-scheme: dark) and (orientation: portrait)",
    },
    {
      src: "/src/images/light-portrait.jpg",
      media: "(prefers-color-scheme: light) and (orientation: portrait)",
    },
    {
      src: "/src/images/dark-landscape.jpg",
      media: "(prefers-color-scheme: dark) and (orientation: landscape)",
    },
  ]}
/>
```

### Art Direction with Different Settings

Each art directive can have its own configuration:

```astro
<Picture
  src="/src/images/desktop.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  artDirectives={[
    {
      src: "/src/images/mobile.jpg",
      media: "(max-width: 768px)",
      width: 768,
      height: 1024,
      breakpoints: [256, 384, 576, 768],
      format: ["avif"],
      fallbackFormat: "webp",
      placeholder: "dominantColor"
    },
  ]}
/>
```

### ArtDirective Type

```typescript
interface ArtDirective {
  src: string;                    // Required
  media: string;                  // Required

  // All other component props except:
  // - alt (Picture only)
  // - preload (Picture only)
  // - loading (Picture only)
  // - decoding (Picture only)
  // - attributes (Picture only)
  // - layout (Picture only)
  // - fadeInTransition (Picture only)
  // - attributes (BackgroundImage only)
}
```

---

## Vite Plugin Usage

The Vite plugin handles image imports automatically.

### Basic Import

```js
import React from "react";
import src from "../images/image.jpg";

export default function ReactImage() {
  return <img src={src} />;
}
```

### Import with Query Parameters

```js
import src from "../images/image.jpg?w=200&h=200&format=avif&q=80";
```

### Generate Srcset

Pass multiple widths:

```js
import srcset from "../images/image.jpg?w=200;400;800";
```

### Available Query Parameters

All configuration options work as query parameters:

```js
// Format
import src from "./img.jpg?format=webp";

// Dimensions
import src from "./img.jpg?w=400&h=300";

// Quality
import src from "./img.jpg?q=80";

// Filters
import src from "./img.jpg?grayscale&blur=5";

// Multiple values (semicolon-separated)
import srcset from "./img.jpg?w=400;800;1200";
```

### Usage in Framework Components

**React:**

```jsx
import React from "react";
import heroSrc from "../images/hero.jpg?w=1920&h=1080&format=webp";

export default function Hero() {
  return <img src={heroSrc} alt="Hero" />;
}
```

**Vue:**

```vue
<script setup>
import heroSrc from "../images/hero.jpg?w=1920&format=avif";
</script>

<template>
  <img :src="heroSrc" alt="Hero" />
</template>
```

**Svelte:**

```svelte
<script>
  import heroSrc from "../images/hero.jpg?w=1920";
</script>

<img src={heroSrc} alt="Hero" />
```

---

## Markdown Images

Astro ImageTools automatically optimizes images in Markdown files.

### Basic Markdown Images

```md
# My Post

<!-- Remote image -->
![A random image](https://picsum.photos/1024/768)

<!-- Local image (relative to markdown file) -->
![Local image](./images/photo.jpg)

<!-- Local image (relative to project root) -->
![Project image](/src/images/photo.jpg)
```

### Markdown Images with Query Parameters

```md
![Grayscale image](https://picsum.photos/1024/768?grayscale)

![Blurred image](./images/photo.jpg?blur=10&width=800)
```

### Using Components in Markdown

For advanced features, import components:

```md
---
src: https://picsum.photos/1024/768
alt: A random image
setup: |
  import { Picture } from "astro-imagetools/components";
---

# Hello Markdown

<Picture
  src={frontmatter.src}
  alt={frontmatter.alt}
  layout="fullWidth"
  placeholder="tracedSVG"
/>
```

### Supported Syntax

Both syntaxes work:

```md
<!-- Markdown syntax -->
![Alt text](path/to/image.jpg)

<!-- HTML syntax -->
<img src="path/to/image.jpg" alt="Alt text" />
```

**Notes:**
- Only works in `.md` files
- Does NOT work with `<Markdown />` component
- Supports absolute, relative, remote, and data URI paths
- Relative paths only work in Markdown (not in components)

---

## SSR Support

Astro ImageTools supports server-side rendering.

### Requirements

- `astro-imagetools` v0.6.0+
- `@astrojs/node` adapter (currently only Node.js supported)

### Installation

```bash
pnpm add @astrojs/node astro-imagetools@^0.6.0
```

Install on server too:

```bash
pnpm add astro-imagetools@^0.6.0
```

### Server Setup

Use the exported `middleware`:

```js
import http from "http";
import { middleware } from "astro-imagetools/ssr";
import { handler as ssrHandler } from "./dist/server/entry.mjs";

http
  .createServer(function (req, res) {
    ssrHandler(req, res, async (err) => {
      if (err) {
        res.writeHead(500);
        res.end(err.toString());
      } else {
        const buffer = await middleware(req, res);

        if (buffer) {
          res.writeHead(200);
          res.end(buffer);
        } else {
          // Serve static assets or return 404
          res.writeHead(404);
          res.end();
        }
      }
    });
  })
  .listen(8080);
```

### Local Images in SSR

For local images, generate assets first:

```astro
---
import src from "../images/image.jpg?raw";
import { Picture } from "astro-imagetools/components";
---

<Picture src={src} alt="A local image" />
```

**Note:** The `?raw` query parameter emits the source image unchanged.

---

## Global Configuration

Create `astro-imagetools.config.mjs` in project root for global defaults.

### With TypeScript

```js
import { defineConfig } from "astro-imagetools/config";

export default defineConfig({
  placeholder: "tracedSVG",
  format: ["webp", "jpg"],
  fallbackFormat: "png",
  includeSourceFormat: false,
  formatOptions: {
    jpg: {
      quality: 80,
    },
    png: {
      quality: 80,
    },
    webp: {
      quality: 50,
    },
    tracedSVG: {
      options: {
        background: "#fff",
        color: "#000",
        threshold: 100,
      },
    },
  },
});
```

### With JSDoc

```js
/**
 * @type {import('astro-imagetools').GlobalConfigOptions}
 */
const config = {
  placeholder: "blurred",
  format: ["avif", "webp"],
  quality: 85,
};

export default config;
```

### Available Global Options

All configuration options can be set globally EXCEPT:
- `src`
- `alt`
- `content`
- `artDirectives`

**Additional global-only options:**

#### `cacheDir`

**Type:** `string`

**Description:** Directory for caching processed images.

```js
export default defineConfig({
  cacheDir: "./node_modules/.astro-imagetools"
});
```

#### `assetFileNames`

**Type:** `string`

**Description:** Pattern for generated asset filenames.

```js
export default defineConfig({
  assetFileNames: "assets/[hash][extname]"
});
```

---

## Layouts

Astro ImageTools provides four layout modes.

### `constrained` (Default)

**Behavior:**
- Image width: 100% of container
- Max-width: 100% of original image width
- Height: Calculated from aspect ratio
- Scales down to fit but never enlarges beyond original size

**Use When:**
- You want responsive images
- You don't want images larger than their original size
- You want to maintain aspect ratio

**Example:**

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  layout="constrained"
/>
```

**Generated CSS:**
```css
img {
  max-width: 100%;
  height: auto;
  object-fit: cover;
}
```

---

### `fixed`

**Behavior:**
- Fixed width and height (no scaling)
- Uses `width` and `height` props
- Image stays at specified dimensions

**Use When:**
- You need exact dimensions
- Image should never change size
- Working with icons or thumbnails

**Example:**

```astro
<Picture
  src="/src/images/avatar.jpg"
  alt="Avatar"
  layout="fixed"
  width={128}
  height={128}
/>
```

**Required:** `width` and `height` props must be specified.

---

### `fullWidth`

**Behavior:**
- Fills 100% of container width
- Height calculated from aspect ratio
- Can scale up OR down

**Use When:**
- You want images to fill container width
- Container width varies
- Enlarging beyond original size is acceptable

**Example:**

```astro
<Picture
  src="/src/images/hero.jpg"
  alt="Hero"
  layout="fullWidth"
/>
```

**Generated CSS:**
```css
img {
  width: 100%;
  height: auto;
  object-fit: cover;
}
```

---

### `fill`

**Behavior:**
- Fills entire container width AND height
- May distort aspect ratio if container ratio differs
- Uses `object-fit` to control fitting behavior

**Use When:**
- Container has specific dimensions
- You want to fill the entire space
- You can control fitting with `objectFit`

**Example:**

```astro
<div style="width: 400px; height: 300px; position: relative;">
  <Picture
    src="/src/images/bg.jpg"
    alt="Background"
    layout="fill"
    objectFit="cover"
  />
</div>
```

**Generated CSS:**
```css
img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover; /* or contain, fill, etc. */
}
```

---

## Placeholders

Show placeholders while images load for better UX.

### `blurred` (Default)

**Description:**
- Low-resolution version of image
- Enlarged and blurred
- Smooth, pleasant effect

**Pros:**
- Accurate preview of final image
- Good visual effect
- Fast generation

**Cons:**
- Slightly larger than `dominantColor`

**Example:**

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  placeholder="blurred"
/>
```

**Result:** ~20-30px version enlarged to full size with blur.

---

### `dominantColor`

**Description:**
- Single solid color (dominant color from image)
- Smallest payload
- Instant display

**Pros:**
- Smallest size (just one color)
- Fastest option
- Works well with fade-in

**Cons:**
- Less accurate preview
- Can look plain

**Example:**

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  placeholder="dominantColor"
/>
```

**Result:** Solid color background that fades to actual image.

---

### `tracedSVG`

**Description:**
- Traced/posterized SVG outline of image
- Artistic effect
- Highly customizable

**Pros:**
- Artistic, unique look
- Scalable (SVG)
- Customizable

**Cons:**
- Generation takes longer
- Larger than `dominantColor`

**Example:**

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  placeholder="tracedSVG"
/>
```

**Customization:**

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  placeholder="tracedSVG"
  formatOptions={{
    tracedSVG: {
      options: {
        background: "#ffffff",
        color: "#000000",
        turnPolicy: "black",
        turdSize: 1,
        threshold: 120,
        blackOnWhite: false,
      }
    }
  }}
/>
```

**TracedSVG can also be posterized:**
```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  placeholder="tracedSVG"
  formatOptions={{
    tracedSVG: {
      options: {
        posterize: true,
        blackOnWhite: false,
      }
    }
  }}
/>
```

---

### `none`

**Description:**
- No placeholder
- No fade-in transition

**Use When:**
- You don't want placeholders
- Images load fast enough
- You're handling loading states separately

**Example:**

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  placeholder="none"
/>
```

**Note:** `fadeInTransition` won't work with `placeholder="none"`.

---

## Image Formats

Astro ImageTools supports all major image formats.

### Supported Formats

- **AVIF** - Best compression, modern browsers
- **WebP** - Great compression, wide support
- **JPEG/JPG** - Universal support, lossy
- **PNG** - Lossless, transparency
- **TIFF** - High quality, large files
- **GIF** - Animation support
- **HEIC/HEIF** - Apple ecosystem

### Format Recommendations

**For Photos:**
```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  format={["avif", "webp"]}
  fallbackFormat="jpg"
/>
```

**For Graphics/Logos:**
```astro
<Picture
  src="/src/images/logo.png"
  alt="Logo"
  format={["avif", "webp"]}
  fallbackFormat="png"
/>
```

**For Maximum Compatibility:**
```astro
<Picture
  src="/src/images/hero.jpg"
  alt="Hero"
  format={["webp"]}
  fallbackFormat="jpg"
  includeSourceFormat={true}
/>
```

### Format Support by Browser

| Format | Chrome | Firefox | Safari | Edge |
|--------|--------|---------|--------|------|
| AVIF   | 85+    | 93+     | 16+    | 85+  |
| WebP   | 23+    | 65+     | 14+    | 18+  |
| JPEG   | All    | All     | All    | All  |
| PNG    | All    | All     | All    | All  |

**Note:** `<Picture />` automatically provides fallbacks for older browsers.

---

## Breakpoints & Responsive Images

### Auto-Calculated Breakpoints

By default, breakpoints are calculated intelligently:

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
/>
```

**Algorithm:** Uses image dimensions and common device widths to generate optimal breakpoints.

### Manual Breakpoints

**Array syntax:**

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  breakpoints={[320, 640, 960, 1280, 1920]}
/>
```

**Object syntax:**

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  breakpoints={{
    count: 5,
    minWidth: 320,
    maxWidth: 1920
  }}
/>
```

Generates 5 evenly distributed breakpoints from 320px to 1920px.

### Sizes Attribute

**Default:**
```js
(breakpoints) => `(min-width: ${maxWidth}px) ${maxWidth}px, 100vw`
```

**String syntax:**

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  sizes="(min-width: 1024px) 1024px, (min-width: 768px) 768px, 100vw"
/>
```

**Function syntax:**

```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  sizes={(breakpoints) => {
    const max = breakpoints[breakpoints.length - 1];
    const mid = breakpoints[Math.floor(breakpoints.length / 2)];
    return `(min-width: ${max}px) ${max}px, (min-width: ${mid}px) ${mid}px, 100vw`;
  }}
/>
```

### Responsive Images Best Practices

1. **Let auto-calculation do its job** for most cases
2. **Specify breakpoints** when you know exact device targets
3. **Use `sizes`** attribute for art-directed layouts
4. **Consider bandwidth** - more breakpoints = more images
5. **Test on real devices** to verify behavior

---

## Best Practices

### Performance

**1. Use `<Picture />` for most images**
```astro
<Picture
  src="/src/images/hero.jpg"
  alt="Hero"
  format={["avif", "webp"]}
/>
```

**2. Lazy load below-the-fold images**
```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  loading="lazy"
/>
```

**3. Preload critical images**
```astro
<Picture
  src="/src/images/hero.jpg"
  alt="Hero"
  loading="eager"
  preload="webp"
/>
```

**4. Choose appropriate placeholders**
- Use `dominantColor` for fastest load
- Use `blurred` for better preview
- Use `tracedSVG` for artistic effect

**5. Optimize quality settings**
```astro
<Picture
  src="/src/images/photo.jpg"
  alt="Photo"
  formatOptions={{
    avif: { quality: 65 },
    webp: { quality: 75 },
    jpg: { quality: 85 }
  }}
/>
```

---

### Accessibility

**1. Always provide alt text**
```astro
<Picture src="/src/images/photo.jpg" alt="Mountain landscape at sunset" />
```

**2. Use descriptive alt text**
- Describe what's in the image
- Don't start with "Image of" or "Picture of"
- Keep it concise but descriptive

**3. Use empty alt for decorative images**
```astro
<Picture src="/src/images/decoration.jpg" alt="" />
```

---

### SEO

**1. Use semantic image formats**
- Modern formats (AVIF, WebP) with fallbacks
- Include source format for broad support

**2. Optimize file sizes**
- Balance quality vs size
- Test different quality settings
- Use appropriate formats

**3. Provide complete metadata**
```astro
<Picture
  src="/src/images/product.jpg"
  alt="Red leather handbag with gold hardware"
  width={1200}
  height={800}
/>
```

---

### Development

**1. Use global config for defaults**

Create `astro-imagetools.config.mjs`:
```js
import { defineConfig } from "astro-imagetools/config";

export default defineConfig({
  placeholder: "blurred",
  format: ["avif", "webp"],
  loading: "lazy",
  formatOptions: {
    avif: { quality: 65 },
    webp: { quality: 75 }
  }
});
```

**2. Use Vite plugin for simple cases**
```js
import heroSrc from "../images/hero.jpg?w=1920&format=webp";
```

**3. Use components for advanced cases**
```astro
<Picture src="/src/images/hero.jpg" alt="Hero" artDirectives={...} />
```

**4. Test on real devices**
- Check image quality
- Verify loading performance
- Test different network conditions

---

## Common Patterns

### Hero Image

```astro
---
import { Picture } from "astro-imagetools/components";
---

<Picture
  src="/src/images/hero.jpg"
  alt="Hero image"
  layout="fullWidth"
  format={["avif", "webp"]}
  placeholder="blurred"
  loading="eager"
  preload="webp"
  fadeInTransition={false}
/>
```

### Thumbnail Grid

```astro
---
import { Picture } from "astro-imagetools/components";

const photos = [
  { src: "/src/images/photo1.jpg", alt: "Photo 1" },
  { src: "/src/images/photo2.jpg", alt: "Photo 2" },
  { src: "/src/images/photo3.jpg", alt: "Photo 3" },
];
---

<div class="grid">
  {photos.map(photo => (
    <Picture
      src={photo.src}
      alt={photo.alt}
      layout="fixed"
      width={300}
      height={300}
      format={["avif", "webp"]}
      placeholder="dominantColor"
      loading="lazy"
    />
  ))}
</div>
```

### Product Image

```astro
<Picture
  src="/src/images/product.jpg"
  alt="Red leather handbag"
  layout="constrained"
  width={800}
  height={800}
  format={["avif", "webp"]}
  placeholder="blurred"
  loading="lazy"
  quality={90}
/>
```

### Avatar

```astro
<Picture
  src={user.avatar}
  alt={`${user.name} avatar`}
  layout="fixed"
  width={64}
  height={64}
  format={["avif", "webp"]}
  placeholder="dominantColor"
  attributes={{
    class: "avatar rounded-full"
  }}
/>
```

### Background Hero

```astro
---
import { BackgroundPicture } from "astro-imagetools/components";
---

<BackgroundPicture
  src="/src/images/hero-bg.jpg"
  layout="fullWidth"
  format={["avif", "webp"]}
  placeholder="dominantColor"
  objectFit="cover"
  artDirectives={[
    {
      src: "/src/images/hero-bg-mobile.jpg",
      media: "(max-width: 768px)"
    }
  ]}
>
  <div class="hero-content">
    <h1>Welcome</h1>
  </div>
</BackgroundPicture>
```

### Programmatic Image Generation

```astro
---
import { renderPicture } from "astro-imagetools/api";

const images = [
  "photo1.jpg",
  "photo2.jpg",
  "photo3.jpg"
];

const renderedImages = await Promise.all(
  images.map(img => renderPicture({
    src: `/src/images/${img}`,
    alt: img,
    width: 400,
    height: 300
  }))
);
---

{renderedImages.map(({ picture }) => (
  <Fragment set:html={picture} />
))}
```

---

## Troubleshooting

### Images Not Optimizing

**Problem:** Images not being optimized

**Causes:**
1. Images in `public/` directory (not processed)
2. Integration not registered
3. Build errors

**Solutions:**
1. Move images to `src/images/` or import from `public/`
2. Check `astro.config.mjs`:
   ```js
   import { astroImageTools } from "astro-imagetools";
   export default { integrations: [astroImageTools] };
   ```
3. Run `npm run build` and check for errors

---

### Remote Images Not Loading

**Problem:** Remote images fail to load

**Causes:**
1. CORS issues
2. Network timeouts
3. Invalid URLs

**Solutions:**
1. Verify URL is accessible
2. Check CORS headers on remote server
3. Use data URIs as fallback

---

### Background Images Not Working

**Problem:** `<BackgroundImage />` not displaying

**Causes:**
1. Missing `<ImageSupportDetection />` component
2. JavaScript disabled

**Solutions:**
1. Add to layout:
   ```astro
   <head>
     <ImageSupportDetection />
   </head>
   ```
2. Use `<BackgroundPicture />` instead (no JS required)

---

### Build Performance Issues

**Problem:** Slow builds

**Causes:**
1. Too many breakpoints
2. Too many formats
3. Large source images

**Solutions:**
1. Reduce breakpoints count
2. Limit formats to essential ones (AVIF + WebP)
3. Pre-optimize source images
4. Enable caching

---

### TypeScript Errors

**Problem:** TypeScript errors with components

**Solutions:**
1. Ensure types are installed:
   ```bash
   npm install -D @types/astro-imagetools
   ```
2. Use JSDoc for config:
   ```js
   /** @type {import('astro-imagetools').GlobalConfigOptions} */
   ```

---

### SSR Issues

**Problem:** Images not working in SSR mode

**Solutions:**
1. Use `?raw` query for local images:
   ```astro
   import src from "../images/image.jpg?raw";
   ```
2. Ensure middleware is configured correctly
3. Verify `astro-imagetools` v0.6.0+ is installed

---

## Migration & Deprecations

### v0.6.0 Breaking Changes

**Removed:**
- `<Image />` component → Use `<Picture />`
- `renderImage` API → Use `renderPicture`

**Changed:**
- Vite plugin no longer registered directly
- Must use Astro integration

**Migration:**

```js
// Before (v0.5.x)
import { Image } from "astro-imagetools/components";
import { renderImage } from "astro-imagetools/api";

// After (v0.6.0+)
import { Picture } from "astro-imagetools/components";
import { renderPicture } from "astro-imagetools/api";
```

**Config:**

```js
// Before
import { astroImageToolsVitePlugin } from "astro-imagetools";
export default {
  vite: {
    plugins: [astroImageToolsVitePlugin]
  }
};

// After
import { astroImageTools } from "astro-imagetools";
export default {
  integrations: [astroImageTools]
};
```

---

### v0.5.1 Deprecations

The `<Image />` component and `renderImage` API were deprecated in v0.5.1:

- `<Image />` → Aliased to `<Picture />`
- `renderImage` → Aliased to `renderPicture`

If still using these, migrate immediately as they were removed in v0.6.0.

---

## Summary

**Astro ImageTools** is a comprehensive image optimization solution for Astro with:

**Key Features:**
- Multiple components for different use cases
- Programmatic APIs for advanced scenarios
- Automatic responsive image generation
- Multiple format support (AVIF, WebP, etc.)
- Art direction support
- Three placeholder types
- Four layout modes
- Extensive transformation options
- SSR support
- Markdown image optimization
- Global configuration
- Vite plugin integration

**Best For:**
- Content-heavy websites
- E-commerce sites
- Photography portfolios
- Blogs and marketing sites
- Any site where image performance matters

**Components:**
- `<Img />` - Simple optimized images
- `<Picture />` - Advanced multi-format images
- `<BackgroundImage />` - CSS background images
- `<BackgroundPicture />` - Positioned background images
- `<ImageSupportDetection />` - Format detection helper

**APIs:**
- `renderImg` - Generate img markup
- `renderPicture` - Generate picture markup
- `renderBackgroundImage` - Generate background image markup
- `renderBackgroundPicture` - Generate background picture markup
- `importImage` - Dynamic image imports

**When to Use:**
- Any Astro project needing image optimization
- Projects requiring responsive images
- Sites with art direction needs
- Projects needing background image optimization

---

*This bible documents Astro ImageTools v0.6.0+. For the latest updates, see the [official documentation](https://astro-imagetools-docs.vercel.app/).*
