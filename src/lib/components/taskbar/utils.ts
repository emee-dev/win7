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
