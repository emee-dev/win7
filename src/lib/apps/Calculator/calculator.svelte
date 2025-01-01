<script lang="ts">
  import {
    getFs,
    type TaskManagerItem,
  } from "@/components/desktop/file_system.svelte";
  import { combineNumbers, type ValidOperators } from "./utils";
  import { Window } from "@/components/window_inprogress";
  import { getIconByProgramId } from "@/components/desktop/utils";

  type CalculatorProps = {
    placement?: {
      x: number;
      y: number;
    };
  } & TaskManagerItem;

  type NumberNode = MouseEvent & { currentTarget: EventTarget } & {
    target: {
      innerText: string;
    };
  };

  const fs = getFs();
  const validOperators: ValidOperators[] = ["*", "+", "-", "/"];

  let {
    label,
    id: windowId,
    programId,
    placement = $bindable({ x: 0, y: 0 }),
  }: CalculatorProps = $props();

  let operation = $state<string[]>([]);

  const displaySteps = $derived.by(() => {
    return operation.reduce((acc, cur) => acc + " " + cur, "") as string;
  });

  const calculation = $derived.by(() => {
    if (operation.length === 0) return;

    const cal = combineNumbers(operation).reduce((acc, curItem, index, arr) => {
      let operator = curItem as ValidOperators;

      if (operator === "+") {
        let nextItem = Number(arr[index + 1]);

        return (Number(acc) + nextItem).toString();
      }

      if (operator === "-") {
        let nextItem = Number(arr[index + 1]);

        return (Number(acc) - nextItem).toString();
      }

      if (operator === "/") {
        let nextItem = Number(arr[index + 1]);

        return (Number(acc) / nextItem).toString();
      }

      if (operator === "*") {
        let nextItem = Number(arr[index + 1]);

        return (Number(acc) * nextItem).toString();
      }

      return acc;
    });

    if (isNaN(Number(cal))) {
      return;
    }

    return cal;
  });

  const handleNumber = ({ target }: NumberNode) => {
    if (!target || !target.innerText) {
      return;
    }

    const number = target.innerText.toString();

    operation.push(number);
  };

  const handleOperator = ({ target }: NumberNode) => {
    if (!target || !target.innerText) {
      return;
    }

    const operator = target.innerText.toString() as ValidOperators;

    if (!validOperators.includes(operator)) {
      console.error(`Operator is not valid. ${operator}`);
      return;
    }

    let lastOperationItem = operation.at(-1) as ValidOperators;

    if (lastOperationItem && validOperators.includes(lastOperationItem)) {
      let temp = operation.slice(0, -1);
      temp.push(operator);

      // operation = temp;
      operation = structuredClone(temp);

      // operation  = []
      console.log("Invalid operation.", temp);
      return;
    }

    operation.push(operator);
  };

  function toggleNegative(str: string): string {
    if (str.startsWith("-")) {
      return str.slice(1); // Remove the '-' prefix if it exists
    }
    return `-${str}`; // Add the '-' prefix if it doesn't exist
  }

  const onclose = () => {
    fs.terminateTask(windowId);
  };

  const onminimize = () => {
    fs.modifyTask(windowId, { windowStatus: "minimized" });
  };
</script>

<!-- credits: https://codepen.io/dahis39/pen/jaJQeq -->

<Window
  {windowId}
  bind:placement
  showBarMenu={false}
  style="width: 270px; height: 330px;"
  interactjs={{
    min: { width: 270, height: 330 },
    max: { width: 270, height: 330 },
  }}
  disableResize
>
  <Window.Head title={label} icon={getIconByProgramId(programId)}>
    <Window.MinimizeBtn {onminimize} />
    <Window.CloseBtn {onclose} />
  </Window.Head>

  <Window.Content>
    <main class="flex flex-col">
      <div class="display">
        <input
          class="w-full border-none"
          type="text"
          disabled
          value={displaySteps}
        />
        <input
          class="w-full border-none text-right font-mono"
          type="text"
          disabled
          maxlength="20"
          value={calculation}
        />
      </div>

      <table class="btns flex-1">
        <tbody class="">
          <tr>
            <td
              class="btn"
              onclick={() => {
                operation = operation.slice(0, -1);
              }}><span>←</span></td
            >
            <td class="btn" onclick={() => {}}><span>CE</span></td>
            <td
              class="btn"
              onclick={() => {
                operation = [""];
              }}><span>C</span></td
            >
            <td
              class="btn"
              onclick={() => {
                let lastItem = operation.at(-1);

                if (!lastItem) {
                  return;
                }

                // toggleNegative(lastItem)
              }}><span>±</span></td
            >
            <td class="btn font-segoePro" onclick={() => {}}><span>√</span></td>
          </tr>
          <tr>
            <td class="btn btn-bright" onclick={handleNumber as any}
              ><span>7</span></td
            >
            <td class="btn btn-bright" onclick={handleNumber as any}
              ><span>8</span></td
            >
            <td class="btn btn-bright" onclick={handleNumber as any}
              ><span>9</span></td
            >
            <td class="btn" onclick={handleOperator as any}><span>/</span></td>
            <td class="btn"><span>%</span></td>
          </tr>
          <tr>
            <td class="btn btn-bright" onclick={handleNumber as any}
              ><span>4</span></td
            >
            <td class="btn btn-bright" onclick={handleNumber as any}
              ><span>5</span></td
            >
            <td class="btn btn-bright" onclick={handleNumber as any}
              ><span>6</span></td
            >
            <td class="btn" onclick={handleOperator as any}><span>*</span></td>
            <td class="btn"><span>1/x</span></td>
          </tr>
          <tr>
            <td class="btn btn-bright" onclick={handleNumber as any}
              ><span>1</span></td
            >
            <td class="btn btn-bright" onclick={handleNumber as any}
              ><span>2</span></td
            >
            <td class="btn btn-bright" onclick={handleNumber as any}
              ><span>3</span></td
            >
            <td class="btn" onclick={handleOperator as any}><span>-</span></td>
            <td class="btn text-3xl" rowspan="2"
              ><span class="font-bold">=</span></td
            >
          </tr>
          <tr>
            <td class="btn btn-bright" colspan="2" onclick={handleNumber as any}
              ><span class="">0</span></td
            >
            <td class="btn btn-bright"><span>.</span></td>
            <td class="btn" onclick={handleOperator as any}><span>+</span></td>
          </tr>
        </tbody>
      </table>
    </main>
  </Window.Content>
</Window>

<style>
  main {
    user-select: none;
    font-size: 16px;
    visibility: inherit;
    font-family:
      Segoe UI,
      sans-serif;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    box-sizing: border-box;
    overflow: auto;
    height: 100%;
    position: relative;
    box-shadow: 0 0 0 1px hsla(0, 0%, 100%, 0.6666666667);
    background: #d9e4f1;
    padding: 10px;
    border: 1px solid #365a6d;
    pointer-events: auto;
  }

  .display {
    font-size: 16px;
    visibility: inherit;
    font-family:
      Segoe UI,
      sans-serif;
    user-select: none;
    --tw-ring-inset: var(--tw-empty, /*!*/ /*!*/);
    position: relative;
    box-sizing: border-box;
    background-image: linear-gradient(#d9e4f1, #fff);
    margin-bottom: 3px;
    border: 1px solid #8e9cad;
    border-radius: 2px;
    box-shadow: inset 0 0 0 1px hsla(0, 0%, 100%, 0.6666666667);
    pointer-events: auto;
  }

  .display > input {
    visibility: inherit;
    user-select: none;
    outline: none;
    font-family: monospace;
    color: #000;
    width: 100%;
    font-size: 9pt;
    box-sizing: border-box;
    background: none;
    border: 0;
    padding: 0 2px;
    text-align: right;
    pointer-events: auto;
  }

  .display > input:nth-child(2) {
    font-size: 16pt;
  }

  .btns {
    font-size: 16px;
    font-weight: 900;
    width: 100%;
    border-spacing: 5px;
    border-collapse: separate;
    pointer-events: auto;
    table-layout: fixed;
  }

  .btn {
    font-size: 16px;
    visibility: inherit;
    font-family:
      Segoe UI,
      sans-serif;
    border-spacing: 5px;
    user-select: none;
    --tw-ring-inset: var(--tw-empty, /*!*/ /*!*/);
    position: relative;
    min-width: 20%;
    background: linear-gradient(hsla(0, 0%, 100%, 0.4) 50%, transparent 0);
    border: 1px solid #8797aa;
    border-radius: 2px;
    box-shadow: inset 0 0 2px 1px #fff;
    padding: 5px;
    text-align: center;
    transition: border-color 1s;
    pointer-events: auto;
  }

  .btn::before {
    border-radius: 2px;
    background-image: radial-gradient(
        circle at bottom,
        hsla(0, 0%, 100%, 0.5333333333) 5%,
        transparent 15%
      ),
      linear-gradient(#ffeedc, #fee2c2 50%, #ffd06d 0);
    background-size:
      500% 50%,
      100% 100%;
    background-position: bottom, 50%;
    background-repeat: no-repeat;
    -webkit-box-shadow: inset 0 0 2px 1px #fff;
    box-shadow: inset 0 0 2px 1px #fff;
    -webkit-transition: opacity 1s;
    transition: opacity 1s;

    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  .btn:hover::before {
    transition: opacity 0.3s;
    opacity: 1;
  }

  .btn span {
    border-spacing: 5px;
    text-align: center;
    user-select: none;

    margin: 0;
    position: relative;
    z-index: 3;
    font-weight: 500;
  }

  .btn::after {
    left: 0;
    border-radius: 2px;
    background-image: radial-gradient(
        circle at bottom,
        hsla(0, 0%, 100%, 0.5333333333) 5%,
        transparent 15%
      ),
      linear-gradient(#f5c97c 50%, #f5be5b 0);
    background-size:
      500% 50%,
      100% 100%;
    background-position: bottom, 50%;
    background-repeat: no-repeat;
    -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);
    -webkit-transition: opacity 1s;
    transition: opacity 1s;
    content: "";
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  /* BTN of 0-9 types */
  .btn-bright {
    background: linear-gradient(
      hsla(0, 0%, 100%, 0.7019607843) 50%,
      hsla(0, 0%, 100%, 0.4) 0
    );

    background: linear-gradient(hsla(0, 0%, 100%, 0.4) 50%, transparent 0);
    border: 1px solid #8797aa;
    border-radius: 2px;
    -webkit-box-shadow: inset 0 0 2px 1px #fff;
    box-shadow: inset 0 0 2px 1px #fff;
    padding: 5px;
    text-align: center;
    -webkit-transition: border-color 1s;
    transition: border-color 1s;
    position: relative;
    min-width: 20%;
  }
</style>
