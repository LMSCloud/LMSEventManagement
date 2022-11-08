export default function updateRangeOutput({ rangeInput, rangeOutput }) {
  const rangeOutputRef = rangeOutput;
  rangeOutputRef.textContent = rangeInput.value === '120' ? '∞' : rangeInput.value;
}
