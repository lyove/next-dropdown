# Next-Dropdown
A lightweight dropdown plugin based on vanilla js

⚠️ The project is no longer maintained. Prefer [Next-Popover](https://github.com/lyove/next-popover), which is lightweight and much more capable.

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
    direction: "bottom",
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
