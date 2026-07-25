# Orbit — Text-Scale & Zoom Verification Results

**Date:** 2026-07-22  
**Environment:** Orbit Lab, Chrome 149 headless, 1440px desktop viewport.

## Method

Each catalog page was loaded through Orbit Lab. The **Scala testo** control was
set to 150%, browser page scale was set to 200% through Chrome DevTools, and
font-only zoom was simulated by setting the document root font size to 20px.
Each state was inspected for clipping, overlap and broken text/icon alignment.

The resolved CSS values confirm that the test conditions took effect: a
representative content control grows from 42px to about 58.8px at text scale
1.5, and to 52.5px when the root font size is 20px. Chrome reported a visual
viewport scale of 2 for the page-zoom condition.

## Results

| Catalog page      | Text scale 1.5 | Page zoom 200% | Font-only zoom (20px root) |
| ----------------- | -------------- | -------------- | -------------------------- |
| Text input        | Pass           | Pass           | Pass                       |
| Button            | Pass           | Pass           | Pass                       |
| Operational modal | Pass           | Pass           | Pass                       |
| Pill switch       | Pass           | Pass           | Pass                       |
| Attachments       | Pass           | Pass           | Pass                       |
| Pickers           | Pass           | Pass           | Pass                       |

No follow-up component fixes are required. The sample covers form controls,
buttons, modal composition, pill selection, attachment lists/dropzones and
date/time picker controls as required by the design.
