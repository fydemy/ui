# @fydemy/ui

A CLI for initializing and adding components to your project.

## Usage

### Create project

Run the `init` command inside your **root** project to configure the component path, theme, and package manager to install the required dependencies.

```
npx @fydemy/ui@latest init
```

### Add component

Start adding component to your designated component path.

```
npx @fydemy/ui@latest add button
```

### Import

Import the component that you have added to your project.

```tsx
import { Button } from "@/components/ui/button";

export default function Home() {
  return <Button>Create !</Button>;
}
```

## Documentation

Visit our docs at: [fydemy-ui.vercel.app](https://fydemy-ui.vercel.app)

## Contributing

Please read at: [https://fydemy-ui.vercel.app/docs/contribute](https://fydemy-ui.vercel.app/docs/contribute)
