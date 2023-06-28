/**
 * Dropdown supported content
 */
type DropdownContent = HTMLElement | DocumentFragment | Node | string;

/**
 * Dropdown placement
 */
type Direction =
  | "bottom-left"
  | "bottom-right"
  | "bottom-middle"
  | "top-left"
  | "top-right"
  | "top-middle";

/**
 * Base options interface for dropdown
 */
interface DropdownOptions {
  /**
   * Dropdown direction: top|bottom|left|right
   */
  direction?: Direction;

  /**
   * Before dropdown open
   * @returns void
   */
  beforeOpen?: () => void;

  /**
   * Before dropdown close
   * @returns void
   */
  beforeClose?: () => void;

  /**
   * Dropdown onOpen
   * @returns void
   */
  onOpen?: () => void;

  /**
   * Dropdown onClose
   * @returns void
   */
  onClose?: () => void;
}
