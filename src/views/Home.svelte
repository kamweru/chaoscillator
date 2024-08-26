<script>
  import { onMount } from "svelte";
  import Canvas from "../components/Canvas.svelte";
  import { CanvasClass } from "../lib/Canvas";
  import { Environment } from "../lib/Environment";
  let canvas, canvasClass;
  onMount(() => {
    canvasClass = new CanvasClass({
      canvas: canvas,
      ctx: canvas.getContext("2d"),
      width: canvas.width,
      height: canvas.height,
    });
    Environment.setup({
      canvas: canvasClass,
    });
  });
</script>

<main class="flex space-between">
  <div class="border">
    <button on:click={Environment.start}>start</button>
  </div>
  <Canvas bind:canvas></Canvas>
</main>
