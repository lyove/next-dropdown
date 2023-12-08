# Next-Dropdown
A lightweight dropdown plugin based on vanilla js

⚠️ The project is no longer maintained. Prefer [Next-Popover](https://github.com/lyove/next-popover), which is lightweight and much more capable.

## ⭐️ Features

- Hybrid support - CommonJS and ESM modules
- IIFE bundle for direct browser support without bundler
- Typings bundle
- ESLint - scripts linter
- Stylelint - styles linter
- Prettier - formatter
- Jest - test framework
- Husky + lint-staged - pre-commit git hook set up for formatting

## 📦 Getting Started

```
git clone https://github.com/lyove/next-dropdown.git
npm install
```

### 💎 npm

```
import NextDropdown from "next-dropdown";

const target = document.querySelector('.dropdown-trigger');
const content = document.createElement('div');
content.innerHTML = 'dropdown content';

new NextDropdown(target, content, {
    direction: "bottom-middle",
    onOpen: function () {
        console.log("is open");
    },
    onClose: function () {
        console.log("is now closed");
    }
});
```

### 🚀 cdn

```
<link rel="stylesheet" href="https://unpkg.com/next-dropdown@latest/dist/style.css">
<script src="https://unpkg.com/next-dropdown@latest/dist/dropdown.umd.js"></script>

const NextDropdown = window.NextDropdown;
const dropdown = new NextDropdown(trigger, content, options);
...
```

## ✅ About

- [Next-Dropdown](https://github.com/lyove/next-dropdown) - Next-Dropdown
