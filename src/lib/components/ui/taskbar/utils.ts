import html2canvas from "html2canvas";

interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;

  // Event handlers
  onchargingchange: ((this: BatteryManager, ev: Event) => any) | null;
  onchargingtimechange: ((this: BatteryManager, ev: Event) => any) | null;
  ondischargingtimechange: ((this: BatteryManager, ev: Event) => any) | null;
  onlevelchange: ((this: BatteryManager, ev: Event) => any) | null;

  // Event listener methods
  addEventListener<K extends keyof BatteryManagerEventMap>(
    type: K,
    listener: (this: BatteryManager, ev: BatteryManagerEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof BatteryManagerEventMap>(
    type: K,
    listener: (this: BatteryManager, ev: BatteryManagerEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
}

interface BatteryManagerEventMap {
  chargingchange: Event;
  chargingtimechange: Event;
  dischargingtimechange: Event;
  levelchange: Event;
}

export interface CustomNavigator {
  getBattery?: () => Promise<BatteryManager>;
}

export const handleBattery = async (navigator: CustomNavigator) => {
  if (!navigator || !navigator.getBattery) {
    return;
  }

  try {
    const battery = await navigator.getBattery();

    // Function to update all battery info initially
    function updateAllBatteryInfo() {
      updateChargeInfo();
      updateLevelInfo();
    }

    // Update battery information initially
    //   updateAllBatteryInfo();

    // Add event listeners for changes in charging and level status
    battery.addEventListener("chargingchange", updateChargeInfo);
    battery.addEventListener("levelchange", updateLevelInfo);

    // Function to update the charging status
    function updateChargeInfo() {
      console.log(`Battery charging? ${battery.charging ? "Yes" : "No"}`);
    }

    // Function to update the battery level
    function updateLevelInfo() {
      console.log(`Battery level: ${battery.level * 100}%`);
    }
  } catch (error) {
    console.error("Error accessing battery status:", error);
  }
};

/**
 * Captures a screenshot of an element with a specific data attribute and returns a Blob.
 *
 * @param {string} selector - The data attribute to select the element (e.g., 'data-screenshot-id').
 * @returns {Promise<Blob>} - A promise that resolves with the screenshot as a Blob.
 */
export const captureElement = async (
  selector: string | HTMLElement
): Promise<Blob> => {
  let element;

  if (typeof selector === "string") {
    element = document.querySelector(selector);
  }

  if (selector instanceof Element) {
    element = selector;
  }

  if (!element) {
    throw new Error(`Selector ${selector} not found.`);
  }

  const canvas = await html2canvas(element as HTMLElement, {
    foreignObjectRendering: true,
  });

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        throw new Error("Failed to capture screenshot as Blob.");
      }
    });
  });
};
