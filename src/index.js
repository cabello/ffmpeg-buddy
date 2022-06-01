/* global outputEl, formEl, inputFilenameEl, outputFilenameEl, disableVideoEl, disableAudioEl, scaleWidthEl, scaleHeightEl, framerateEl, rotateEl, startAtEl, endAtEl */

import quoteFilename from "./lib/quote-filename.js";
import getScaleFlag from "./lib/get-scale-flag.js";

function render() {
  const inputFilename = inputFilenameEl.value.trim() || "input.mp4";
  const outputFilename = outputFilenameEl.value.trim() || "output.gif";

  const hasVideo = !disableVideoEl.checked;
  const hasAudio = !disableAudioEl.checked;

  let videoFlags = [];
  if (hasVideo) {
    const scaleFlag = getScaleFlag(scaleWidthEl.value, scaleHeightEl.value);
    const framerate = parseInt(framerateEl.value.trim(), 10) || null;
    const rotation = rotateEl.value;
    if (scaleFlag) {
      videoFlags.push(scaleFlag);
    }
    if (framerate) {
      videoFlags.push(`-r ${framerate}`);
    }
    if (rotation !== "no rotation") {
      videoFlags.push(rotation);
    }
  } else {
    videoFlags.push("-vn");
  }

  const startAt = startAtEl.value.trim();
  const endAt = endAtEl.value.trim();

  outputEl.innerText = [
    "ffmpeg",
    ...(startAt ? [`-ss '${startAt}'`] : []),
    "-i",
    quoteFilename(inputFilename),
    ...videoFlags,
    ...(hasAudio ? [] : ["-an"]),
    ...(endAt ? [`-to '${endAt}'`] : []),
    "-c:v copy -c:a copy",
    quoteFilename(outputFilename),
  ].join(" ");

  for (const el of document.getElementsByClassName("needs-video")) {
    if (hasVideo) {
      el.removeAttribute("hidden");
    } else {
      el.setAttribute("hidden", "hidden");
    }
  }
}

formEl.addEventListener("input", () => render());
formEl.addEventListener("change", () => render());
formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  render();
});

render();
