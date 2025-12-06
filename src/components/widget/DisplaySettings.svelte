<script lang="ts">

import Icon from "@iconify/svelte";
import { getDefaultHue, getHue, setHue, getStoredTheme, setTheme } from "@utils/setting-utils";
import { AUTO_MODE, DARK_MODE, LIGHT_MODE } from "@constants/constants";

let hue = getHue();
const defaultHue = getDefaultHue();

let theme = getStoredTheme();

function resetHue() {
	hue = getDefaultHue();
}

$: if (hue || hue === 0) {
	setHue(hue);
}

function switchTheme(newTheme: string) {
	theme = newTheme;
	setTheme(newTheme);
}
</script>

<div id="display-setting" class="float-panel float-panel-closed absolute transition-all w-80 right-4 px-4 py-4">
    <div class="flex flex-row gap-2 mb-3 items-center justify-between">
        <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]"
        >
            主题模式
        </div>
        <div class="flex gap-1">
            <button aria-label="Light Mode" class="btn-regular w-10 h-10 rounded-md active:scale-90"
                    class:!bg-[var(--primary)]={theme === LIGHT_MODE}
                    class:!text-white={theme === LIGHT_MODE}
                    on:click={() => switchTheme(LIGHT_MODE)}
            >
                <Icon icon="material-symbols:wb-sunny-outline-rounded" class="text-[1.25rem]"></Icon>
            </button>
            <button aria-label="Dark Mode" class="btn-regular w-10 h-10 rounded-md active:scale-90"
                    class:!bg-[var(--primary)]={theme === DARK_MODE}
                    class:!text-white={theme === DARK_MODE}
                    on:click={() => switchTheme(DARK_MODE)}
            >
                <Icon icon="material-symbols:dark-mode-outline-rounded" class="text-[1.25rem]"></Icon>
            </button>
            <button aria-label="System Mode" class="btn-regular w-10 h-10 rounded-md active:scale-90"
                    class:!bg-[var(--primary)]={theme === AUTO_MODE}
                    class:!text-white={theme === AUTO_MODE}
                    on:click={() => switchTheme(AUTO_MODE)}
            >
                <Icon icon="material-symbols:desktop-windows-outline-rounded" class="text-[1.25rem]"></Icon>
            </button>
        </div>
    </div>
    <div class="flex flex-row gap-2 mb-3 items-center justify-between">
        <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]"
        >
            主题色彩
            <button aria-label="Reset to Default" class="btn-regular w-7 h-7 rounded-md  active:scale-90"
                    class:opacity-0={hue === defaultHue} class:pointer-events-none={hue === defaultHue} on:click={resetHue}>
                <div class="text-[var(--btn-content)]">
                    <Icon icon="fa6-solid:arrow-rotate-left" class="text-[0.875rem]"></Icon>
                </div>
            </button>
        </div>
        <div class="flex gap-1">
            <div id="hueValue" class="transition bg-[var(--btn-regular-bg)] w-10 h-7 rounded-md flex justify-center
            font-bold text-sm items-center text-[var(--btn-content)]">
                {hue}
            </div>
        </div>
    </div>
    <div class="w-full h-6 px-1 bg-[oklch(0.80_0.10_0)] dark:bg-[oklch(0.70_0.10_0)] rounded select-none">
        <input aria-label="主题色彩" type="range" min="0" max="360" bind:value={hue}
               class="slider" id="colorSlider" step="5" style="width: 100%">
    </div>
</div>


<style lang="stylus">
    #display-setting
      input[type="range"]
        -webkit-appearance none
        height 1.5rem
        background-image var(--color-selection-bar)
        transition background-image 0.15s ease-in-out

        /* Input Thumb */
        &::-webkit-slider-thumb
          -webkit-appearance none
          height 1rem
          width 0.5rem
          border-radius 0.125rem
          background rgba(255, 255, 255, 0.7)
          box-shadow none
          &:hover
            background rgba(255, 255, 255, 0.8)
          &:active
            background rgba(255, 255, 255, 0.6)

        &::-moz-range-thumb
          -webkit-appearance none
          height 1rem
          width 0.5rem
          border-radius 0.125rem
          border-width 0
          background rgba(255, 255, 255, 0.7)
          box-shadow none
          &:hover
            background rgba(255, 255, 255, 0.8)
          &:active
            background rgba(255, 255, 255, 0.6)

        &::-ms-thumb
          -webkit-appearance none
          height 1rem
          width 0.5rem
          border-radius 0.125rem
          background rgba(255, 255, 255, 0.7)
          box-shadow none
          &:hover
            background rgba(255, 255, 255, 0.8)
          &:active
            background rgba(255, 255, 255, 0.6)

</style>
