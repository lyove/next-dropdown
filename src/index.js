import "./style.css";

const ClassPrefix = "next-dropdown";

export default class NextDropdown {
  constructor(target, content, options) {
    this.key = this._guid();
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
    this.options = this._extendObject({}, this.defaults, options);

    this.init();
  }

  /**
   * Helpers
   */

  /**
   * Creates HTML element in editor document
   *
   * @param {string} name
   * @param {Object.<string, string>} [attributes = {}]
   * @param {string} [innerHTML = '']
   * @return {HTMLElement}
   */
  _createElement(name = "div", { attributes = {}, innerHTML = "" } = {}) {
    if (typeof name !== "string") {
      return null;
    }
    const element = document.createElement(name);
    element.innerHTML = innerHTML;
    Object.entries(attributes).forEach(([key, val]) => val && element.setAttribute(key, `${val}`));
    return element;
  }

  /**
   * Remove all child elements of a DOM node
   *
   * @return {HTMLElement} element
   */
  _removeElementChild(element) {
    if (!(element instanceof HTMLElement)) {
      return;
    }
    while (element.firstChild) {
      element.removeChild(element.lastChild);
    }
  }

  /**
   * Globally Unique Identifier
   * @returns {string}
   */
  _guid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  _stringToDom(htmlString = "") {
    const div = document.createElement("div");
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  }

  _extendObject() {
    for (let i = 1; i < arguments.length; i++) {
      for (let key in arguments[i]) {
        if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
          arguments[0][key] = arguments[i][key];
        }
      }
    }
    return arguments[0];
  }

  _findAncestor(el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
  }

  /**
   * Init
   */
  init() {
    this.target.classList.add(this.triggerClass);
    this.target.setAttribute("data-dropdown-key", this.key);
    this._bindEvents();
  }

  /**
   * Event
   */
  _bindEvents() {
    // Close menu when mouthclick outside menu
    document.addEventListener("click", (event) => {
      if (
        !(
          this._findAncestor(event.target, this.triggerClass) === this.target ||
          this._findAncestor(event.target, this.dropdownClass) === this.container
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

  /**
   * Constructors
   */

  // Construct dropdown struture
  _constructDropdown() {
    const dropdownKey = this.target.getAttribute("data-dropdown-key");
    const container = document.querySelector(`.${this.dropdownClass}`);
    if (container) {
      container.setAttribute("data-dropdown-key", dropdownKey);
      container.setAttribute("data-dropdown-direction", this.options.direction);
      container.setAttribute("aria-hidden", "false");
    }

    this.container =
      container ||
      this._createElement("div", {
        attributes: {
          class: this.dropdownClass,
          "data-dropdown-key": dropdownKey,
          "data-dropdown-direction": this.options.direction,
          "aria-hidden": "false",
        },
      });

    this.container.textContent = "";
    this.container.style.position = "absolute";

    const dropdownContent = this._createElement("div", {
      attributes: {
        class: `${ClassPrefix}-content`,
      },
    });

    if (typeof this.content === "string") {
      dropdownContent.innerHTML = this.content;
    } else if (this.content instanceof HTMLElement) {
      dropdownContent.appendChild(this.content);
    }

    this.container?.appendChild(dropdownContent);

    document.body.appendChild(this.container);
  }

  // Destory dropdown content
  _destoryDropdown() {
    if (document.body.contains(this.container)) {
      document.body.removeChild(this.container);
    }
    this.container = null;
  }

  // Open dropdown
  open() {
    this._beforeOpen();

    this.target.classList.add(this.showClass);

    this._constructDropdown();

    const { direction } = this.options;
    const targetRect = this.target.getBoundingClientRect();
    const { scrollTop, scrollLeft } = document.documentElement;
    const { left: tLeft, top: tTop, right: tRight, bottom: tBottom, width: tWidth } = targetRect;
    const containerRect = this.container.getBoundingClientRect();
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

    this._onOpen();
  }

  // Close dropdown
  close() {
    this._beforeClose();
    this.target.classList.remove(this.showClass);
    const targetKey = this.target.getAttribute("data-dropdown-key");
    const dropdownKey = this.container.getAttribute("data-dropdown-key");
    if (targetKey === dropdownKey) {
      this._destoryDropdown();
    }
    this._onClose();
  }

  /**
   * Callback methods
   */

  _onOpen() {
    if (this.options.onOpen) {
      this.options.onOpen();
    }
  }

  _onClose() {
    if (this.options.onClose) {
      this.options.onClose();
    }
  }

  _beforeOpen() {
    if (this.options.beforeOpen) {
      this.options.beforeOpen();
    }
  }

  _beforeClose() {
    if (this.options.beforeClose) {
      this.options.beforeClose();
    }
  }
}
