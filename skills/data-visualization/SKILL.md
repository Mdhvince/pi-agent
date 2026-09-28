---
name: data-visualization
description: >
  Design and review data visualizations using chart selection, visual encodings,
  color perception, cognitive load, and Gestalt principles. Use when choosing
  charts, designing dashboards or reports, explaining visual design decisions,
  or checking a visualization for misleading grouping, emphasis, or missing-data
  interpretation. Guidance is limited to the supplied HashStudioz and Towards
  Data Science articles, with source references and explicit limitations.
---

# Data visualization

Help the audience understand the data through suitable charts, clear encodings, and deliberate grouping. Do not make a visual imply information that the data does not establish.

## Sources and boundaries

Use only these two articles as the basis for this skill's visualization guidance:

- **H:** [The Psychology Behind Data Visualization: How Colors & Charts Affect Perception](https://www.hashstudioz.com/blog/the-psychology-behind-data-visualization-how-colors-charts-affect-perception/), HashStudioz.
- **T:** [The Psychology behind Data Visualization Techniques](https://towardsdatascience.com/the-psychology-behind-data-visualization-techniques-68ef12865720/), Towards Data Science.

Read [references/source-analysis.md](references/source-analysis.md) with this file. It maps the source IDs below to article sections, records image-only information, and explains conflicts and limits. The workflow and response structure are an operational synthesis, not procedures quoted from either article.

- Treat these articles as design guidance, not as independently verified scientific evidence. Do not describe their linked research as research you have read.
- Do not invent data, causes, audience characteristics, measurements, palette codes, accessibility thresholds, or chart limits.
- Do not fill gaps in their coverage with outside visualization advice and attribute it to these sources. State when a requested decision is not covered.
- The articles do not supply a complete accessibility standard, statistical workflow, or implementation specification. Do not claim that following this skill establishes accessibility compliance or statistical validity.
- Their cognitive-speed statistics and broad neuroscience explanations are not design requirements. See the reference notes before repeating them.

T describes **pre-attentive processing** as subconscious processing that selects salient or relevant information for fuller attention. Use deliberate visual distinction to help the important feature get noticed, then use clear encodings and context to support its interpretation. Do not equate attracting attention with communicating the right meaning. This combines T's perceptual explanation with its focal-point guidance and H's context requirement. (T2, T12; H5)

## 1. Establish the communication task

Identify the audience, the question the visual must answer, and the main information priority. Determine whether the task is comparison, change over time, proportions, relationships, or comparison of distributions. Check whether the viewer needs an overall pattern or exact values. Chart choice and grouping must serve that task. (H1, H3, H5; T3, T5)

Inspect the supplied data or chart before making recommendations. Identify categories, ordered or numerical variables, time fields, existing labels, and visible gaps. Ask a focused question if missing information changes the chart choice or interpretation. Do not invent the missing information. This is the operational step for applying the sources' chart, encoding, and context guidance.

For a redesign, identify the current perception problem before changing the chart: wrong comparison, unclear groups, unwanted emphasis, excessive detail, weak contrast, or an apparent trend through missing values. (H3-H5; T5-T12)

## 2. Choose the chart and comparison method

| Communication task | Source-supported choice | Conditions and cautions |
| --- | --- | --- |
| Compare quantities across categories | Bar or column chart | Keep category color assignments consistent. Bars make length comparison straightforward. (H3) |
| Show change over time | Line chart | Use distinguishable colors for multiple series. Check gaps and the risk of implied continuity. (H3; T6, T9) |
| Show simple proportions or percentages | Pie chart | Use only a few categories. H warns about more than 6-7 slices; this is an article heuristic, not a proven universal cutoff. (H3) |
| Show a relationship between two variables | Scatter plot | Use the pattern to inspect positive, negative, or absent correlation. Check axis scales and point distribution. H emphasizes patterns rather than exact-value reading. (H3) |
| Compare distributions in two groups | Violin plots are T's symmetry example | Use the example to reason about comparable arrangements and differences. The articles do not specify distribution estimation or violin-plot parameters. (T11) |
| Compare numerical values through position | Bar charts or dot plots on a common scale | T places common-scale position first in its reported accuracy hierarchy. (T3) |
| Compare views on separate, identical scales | Small multiples | T lists these under nonaligned, identical scales. It does not provide a full small-multiple layout method. (T3) |

When accurate visual comparison is the priority, use T's reported ordering as a decision framework:

1. Position along a common scale.
2. Positions along nonaligned, identical scales.
3. Length, direction, angle.
4. Area.
5. Volume, curvature.
6. Shading, color saturation.

This is the article's account of Cleveland and McGill, not an independently checked universal ranking of whole chart types. A chart can use several encodings. Do not turn the hierarchy into a ban on pie charts, treemaps, or heat maps. T explicitly says it is a framework, not a precise prescription. Its illustrative chart associations are recorded in the reference. (T3)

If neither source covers the requested chart or decision, say so rather than invent a recommendation from them.

## 3. Select visual encodings

T lists these original visual variables: **position, size, shape, lightness/value, color hue, orientation, and texture**. It also lists **color saturation, arrangement, crispness, resolution, and transparency** as later additions. Listing a variable does not provide a complete method for using it. (T3)

Apply the article's perception levels:

| Level | Meaning in T | Design question |
| --- | --- | --- |
| Selective | The variable separates symbols into recognizable categories. | Can the audience readily pick out the intended pattern or category? |
| Associative | The variable preserves visibility rather than giving one element greater importance. | Do elements that should seem equivalent retain that perceived sameness? |
| Ordered | The variable can express an ordering. | Does the encoded variable actually have an order? |
| Quantitative | The variable can express ratios as well as order. | Is the audience estimating magnitude, and is that estimate being mistaken for an exact measurement? |

T also names **dissociative**, paired with associative, but does not separately define it in its prose. Do not invent an additional definition or a full classification of the later variables. The reference transcribes the original-variable diagram. (T3)

Use these rules:

- Use ordered visual variables for numerical or ordered information. Do not imply a natural order in unordered categories. (T3)
- Do not rely on shape alone for immediate pattern selection. T calls shape nonselective, while still allowing shape to communicate similarity or create a distinctive focal point. These are different tasks, not a ban on shape. (T3, T7, T12)
- When equivalent visibility matters, avoid encoding choices that break perceived sameness. T gives combined color and size as a caution in this context, not as a universal prohibition. (T3)
- Supply a clear legend where magnitude encoding needs explanation. Even size-based quantitative perception is approximate, not precise measurement. (H5; T3)
- For a precise-comparison task, consider the position-based alternatives above rather than requiring viewers to estimate magnitude from color or area alone. This combines T's hierarchy with its warning about visual estimation. (T3)

## 4. Use color with a defined purpose

Use color to distinguish data groups, represent ordered variation, or draw attention to a relevant element. Keep the palette limited enough to avoid overload but sufficiently distinct to separate the required series. Neither article specifies a universal maximum palette size. (H2, H5; T7, T10, T12)

- **Consistency:** Give the same category the same color throughout the visual. (H3)
- **Multiple lines:** Choose contrasting, distinguishable colors. H mentions red and blue as an example, not a mandatory or certified-accessible palette. (H3)
- **Ordered information:** T demonstrates a sequential palette with value-sorted bars and recommends a continuous scale for its numerical color dimension. Apply this alongside its instruction not to encode unordered categories as ordered. Do not use a continuous scale for every variable merely because color is involved. (T3, T9, T10)
- **Foreground and background:** Use sufficient contrast to keep data marks legible and distinct from the background. Avoid color overload. Do not infer a dark-mode requirement from T's example. (T10)
- **Emotional associations:** H associates blue with trust and stability and red with urgency or warning. Use these as context-dependent associations, not guarantees about an audience's response. (H2)
- **Culture:** Consider the intended audience. H gives different associations for green in Western and some Asian contexts. Do not turn these broad examples into fixed rules for all people in a culture. (H2)
- **Accessibility:** H requires consideration of color blindness. Check whether the intended distinctions remain usable, and report any check that has not been done. Neither source supplies a tested palette, simulation method, or numerical contrast standard. (H5)

A distinctive color attracts attention, but attention is not the same as a measured difference or importance established by the data. Make the reason for a highlight clear. This applies T's focal-point guidance together with H's requirement for context. (T12; H5)

## 5. Apply Gestalt principles deliberately

People can perceive groups, paths, and complete forms even when the underlying elements do not establish them. Review both the intended grouping and any unintended relationship the visual could suggest. T notes that different accounts list different Gestalt principles; do not claim that its eight discussed principles form a single universal taxonomy. (T4)

| Principle | Perceptual effect | Apply or check |
| --- | --- | --- |
| **Proximity** | Nearby objects appear related. | Place related observations together according to the information priority. T groups several years within each country when country comparison is the priority. Check whether spacing suggests the wrong group. (H4; T5) |
| **Closure** | Viewers mentally complete incomplete forms. | Treat missing-data gaps as an interpretation risk. Do not silently connect or invent missing observations. Make missingness explicit in the chart or its context. This safeguard applies T's warning and H's context guidance. (H4, H5; T6) |
| **Similarity** | Similar colors, shapes, sizes, or orientations appear to belong together. | Use consistent visual properties for intended groups. Check that unrelated groups do not accidentally appear equivalent. T illustrates two ZIP-code groups in a scatter plot. (T7) |
| **Enclosure / common region** | Objects inside a shared boundary appear connected and attract attention. | Enclose items that should be processed as a group. T illustrates focusing on a time interval in an employment chart. Do not treat its Plotly example as a required library or interaction. (T8) |
| **Continuity** | The eye follows lines, curves, and established directions. | Arrange objects to aid comparison. T sorts category bars by value and uses sequential color to reinforce the progression. Apply that example to value comparison, not as an instruction to reorder time observations by value. (H3, H4; T9) |
| **Figure-ground** | Viewers distinguish foreground information from background. | Make the data stand out through contrast without making the display too busy. Check that background and marks do not compete. (T10) |
| **Symmetry** | Symmetrical arrangements appear unified; differences can attract attention. | Consider comparable arrangements for before-and-after views or two similar groups. T illustrates paired distributions with violin plots. Do not change data to force symmetry. (T11) |
| **Focal point** | A distinctive element attracts attention first. | Use a distinct color or shape to emphasize the relevant item. T highlights the US bar in a wine-price chart. Do not copy its colors without the color-blindness check required by H. (T12; H5) |

**Closure requires special care:** H presents closure as useful with incomplete datasets. T shows why a viewer's assumed connection can conceal an unseen peak. Use closure as a warning about inference, not permission to repair or interpolate data. Neither source provides an imputation method. (H4; T6)

## 6. Reduce effort without removing necessary information

- Remove unnecessary 3D effects, distracting details, excessive colors, and overly complex legends. Limit information density when it prevents the key comparison from being understood. (H4, H5)
- Keep descriptive titles, axis labels, and clear, consistent legends. Simplification must not remove the information needed to interpret the chart. (H5)
- Add annotations or a short explanation that gives the relevant context. H suggests explaining a sales decline. Do this only when the explanation is supported by supplied information; otherwise state that the cause is unknown. (H5, with the source boundary above)
- Check scatter-plot scales and point distribution for visual clarity. The articles do not give a general algorithm for axis limits. (H3)
- Use emphasis and grouping to make the relevant pattern easier to find, not to hide an inconvenient observation or uncertainty. This is the application of the sources' clarity and closure guidance. (H5; T4, T6, T12)

## 7. Review and deliver

Before delivering a design or review, check:

- [ ] The chart answers the stated comparison or question. (H3, H5)
- [ ] Encodings fit category, order, and magnitude requirements. Visual estimates are not presented as exact measurements. (T3)
- [ ] Color assignments are consistent, distinguishable, and appropriate for the audience. Color-blindness limitations or unperformed checks are stated. (H2, H3, H5)
- [ ] Spacing, similarity, boundaries, and alignment create the intended groups. (T5, T7-T9)
- [ ] Missing observations cannot be mistaken for a known smooth connection. (T6)
- [ ] Data marks stand out from the background, and emphasis has an explained purpose. (T10, T12; H5)
- [ ] Titles, axes, legends, and context are clear. Unnecessary detail is removed. (H4, H5)
- [ ] No conclusion, data value, cause, scientific certainty, or implementation rule has been invented.

For a **new design**, provide the chart or chart specification, the field-to-visual mapping, grouping and color choices, necessary labels/context, and material limitations. Explain the key decisions with source IDs.

For a **review**, report each material issue as: **observed issue → likely perception problem → proposed change → source ID**. Distinguish observed problems from checks that require more data or testing.

Keep the response proportional to the request. Do not reproduce the whole theory when a chart and a short explanation are enough.
