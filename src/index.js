import "./style.css";

// class name
const ClassPrefix = "next-dropdown";

/**
 * Creates HTML element in editor document
 *
 * @param {string} name
 * @param {Object.<string, string>} [attributes = {}]
 * @param {string} [innerHTML = '']
 * @return {HTMLElement}
 */
const createElement = (tagName = "div", { attributes = {}, innerHTML = "" } = {}) => {
  if (typeof tagName !== "string") {
    return null;
  }
  const element = document.createElement(tagName);
  element.innerHTML = innerHTML;
  Object.entries(attributes).forEach(([key, val]) => val && element.setAttribute(key, `${val}`));
  return element;
};

/**
 * Remove all child elements of a DOM node
 *
 * @return {HTMLElement} element
 */
const removeElementChild = (element) => {
  if (!(element instanceof HTMLElement)) {
    return;
  }
  while (element.firstChild) {
    element.removeChild(element.lastChild);
  }
};

/**
 * Globally Unique Identifier
 * @returns {string}
 */
const guid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const findAncestor = (el, cls) => {
  while (el && !el.classList.contains(cls)) {
    el = el.parentElement;
  }
  return el;
};

/**
 * NextDropdown
 */
export default class NextDropdown {
  constructor(target, content, options) {
    this.key = guid();
    this.target = target;
    this.container = null;
    this.content = content;
    this.triggerClass = `${ClassPrefix}-trigger`;
    this.showClass = `${ClassPrefix}--show`;
    this.dropdownClass = `${ClassPrefix}-container`;
    this.defaults = {
      direction: "bottom-left",
      onOpen: null,
      onClose: null,
      beforeOpen: null,
      beforeClose: null,
    };
    this.options = Object.assign({}, this.defaults, options);

    // init
    this.target.classList.add(this.triggerClass);
    this.target.setAttribute("data-dropdown-key", this.key);
    this.#bindEvents();
  }

  // Event
  #bindEvents() {
    // Close menu when mouthclick outside menu
    document.addEventListener("click", (event) => {
      if (
        !(
          findAncestor(event.target, this.triggerClass) === this.target ||
          findAncestor(event.target, this.dropdownClass) === this.container
        )
      ) {
        if (this.target.classList.contains(this.showClass)) {
          this.close.call(this);
        }
      }
    });

    // Show menu
    this.target.addEventListener("click", (event) => {
      event.preventDefault();
      if (!this.target.classList.contains(this.showClass)) {
        this.open();
      } else {
        this.close();
      }
    });

    // Close menu with escape key
    this.target.addEventListener("keydown", (event) => {
      if (event.keyCode === 27) {
        this.close();
      }
    });
  }

  // Create dropdown struture
  #createDropdown() {
    const dropdownKey = this.target.getAttribute("data-dropdown-key");
    const container = document.querySelector(`.${this.dropdownClass}`);
    if (container) {
      container.setAttribute("data-dropdown-key", dropdownKey);
      container.setAttribute("data-dropdown-direction", this.options.direction);
      container.setAttribute("aria-hidden", "false");
    }

    this.container =
      container ||
      createElement("div", {
        attributes: {
          class: this.dropdownClass,
          "data-dropdown-key": dropdownKey,
          "data-dropdown-direction": this.options.direction,
          "aria-hidden": "false",
        },
      });

    this.container.textContent = "";
    this.container.style.position = "absolute";

    const dropdownContent = createElement("div", {
      attributes: {
        class: `${ClassPrefix}-content`,
      },
    });

    if (typeof this.content === "string") {
      dropdownContent.innerHTML = this.content;
    } else if (this.content instanceof HTMLElement) {
      const clonedElement = this.content.cloneNode(true);
      dropdownContent.appendChild(clonedElement);
    }

    this.container?.appendChild(dropdownContent);

    document.body.appendChild(this.container);
  }

  // Destory dropdown content
  #destoryDropdown() {
    if (document.body.contains(this.container)) {
      document.body.removeChild(this.container);
    }
    this.container = null;
  }

  // Open dropdown
  open() {
    if (this.options.beforeOpen) {
      this.options.beforeOpen();
    }

    this.target.classList.add(this.showClass);

    this.#createDropdown();

    const { direction } = this.options;
    const targetRect = this.target.getBoundingClientRect();
    const { scrollTop, scrollLeft } = document.documentElement;
    const { left: tLeft, top: tTop, right: tRight, bottom: tBottom, width: tWidth } = targetRect;
    const containerRect = this.container?.getBoundingClientRect() || {};
    const { width: cWidth, height: cHeight } = containerRect;

    switch (direction) {
      case "bottom-left":
        this.container.style.left = `${tLeft + scrollLeft}px`;
        this.container.style.top = `${tBottom + scrollTop}px`;
        break;

      case "bottom-right":
        this.container.style.left = `${tLeft - (cWidth - tWidth) + scrollLeft}px`;
        this.container.style.top = `${tBottom + scrollTop}px`;
        break;

      case "bottom-middle":
        this.container.style.left = `${tLeft - (cWidth - tWidth) / 2 + scrollLeft}px`;
        this.container.style.top = `${tBottom + scrollTop}px`;
        break;

      case "top-left":
        this.container.style.left = `${tLeft + scrollLeft}px`;
        this.container.style.top = `${tTop - cHeight + scrollTop}px`;
        break;

      case "top-right":
        this.container.style.left = `${tLeft - (cWidth - tWidth) + scrollLeft}px`;
        this.container.style.top = `${tTop - cHeight + scrollTop}px`;
        break;

      case "top-middle":
        this.container.style.left = `${tLeft - (cWidth - tWidth) / 2 + scrollLeft}px`;
        this.container.style.top = `${tTop - cHeight + scrollTop}px`;
        break;

      default:
    }

    if (this.options.onOpen) {
      this.options.onOpen();
    }
  }

  // Close dropdown
  close() {
    if (this.options.beforeClose) {
      this.options.beforeClose();
    }
    this.target.classList.remove(this.showClass);
    const targetKey = this.target.getAttribute("data-dropdown-key");
    const dropdownKey = this.container.getAttribute("data-dropdown-key");
    if (targetKey === dropdownKey) {
      this.#destoryDropdown();
    }
    if (this.options.onClose) {
      this.options.onClose();
    }
  }
}
