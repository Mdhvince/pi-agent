# Source analysis and evidence map

This reference records the two articles' substantive coverage, the relationship between their recommendations, and the limits of the resulting skill. It paraphrases the sources rather than reproducing them. Source IDs are local to this skill.

## Source register

| ID | Article | Author | Published date shown in page metadata |
| --- | --- | --- | --- |
| H | [The Psychology Behind Data Visualization: How Colors & Charts Affect Perception](https://www.hashstudioz.com/blog/the-psychology-behind-data-visualization-how-colors-charts-affect-perception/) | Aparna Kashyap | 2025-03-28 |
| T | [The Psychology behind Data Visualization Techniques](https://towardsdatascience.com/the-psychology-behind-data-visualization-techniques-68ef12865720/) | Elena V Kazakova | 2021-03-31 |

Both article bodies were accessible. T's explanatory diagrams were inspected, including its visual-variable classification image and sampled frames of the employment-chart animation. The linked external studies and articles were not used as additional sources. Pi documentation was used only for skill packaging, not visualization guidance.

The skill covers the visualization concepts taught by these two pages. It is not a complete guide to every chart type, statistical method, accessibility requirement, or visualization technology.

## HashStudioz coverage

### H1: Introduction and The Role of Data Analytics in Decision-Making

H presents visualization as a means of making patterns, trends, and insights easier to understand and use in decisions. It makes communication of the intended message the criterion for effectiveness.

The opening material also claims that visual information is processed 60,000 times faster than text and that 90% of information transmitted to the brain is visual. The article does not supply supporting study details for those figures. They are recorded here for completeness, not adopted as verified facts or implementation requirements.

**Skill use:** Establish the communication question and relevant context. No numerical performance promise is derived from the introductory claims.

### H2: The Impact of Colors in Data Visualization

The three subsections cover emotional associations, cultural interpretation, and palette choice.

- H associates blue with trust and stability, including corporate and financial uses.
- H associates red with urgency and warnings, with losses and danger as examples.
- H contrasts green's association with growth and prosperity in Western cultures with fertility and life in some Asian cultures.
- H recommends a balanced palette that differentiates datasets without excessive contrast or too many competing colors. It also notes that too little variation can feel monotonous.

**Skill use:** Choose colors according to the audience and the intended distinction. These are broad associations reported by H, not universal psychological responses or a mandate to add decorative variation.

### H3: Chart-type subsections

The page's contents group these under “How Different Charts Affect Data Perception.”

| Chart | Source purpose | Source condition or caution |
| --- | --- | --- |
| Bar and column | Compare quantities across categories, such as regional sales | The eye compares bar lengths readily. Use the same category color consistently. |
| Pie | Show proportions or percentages | Interpretation becomes difficult with too many slices. H names more than 6-7 slices as a problem and recommends a few simple categories. |
| Line | Show trends, patterns, and anomalies over time | Distinguish multiple series with contrasting colors. Red and blue are example choices. |
| Scatter | Show relationships between two variables, such as marketing spend and sales | Dot patterns can suggest positive, negative, or no correlation. Clarity depends on axis scales and point distribution. H prioritizes overall trends over exact-value reading. |

**Skill use:** Task-based chart selection. The pie threshold remains an attributed heuristic. The red/blue example is not treated as an accessibility certification. No rules for unmentioned chart types are inferred from H.

### H4: The Psychology Behind Data Interpretation

H discusses:

- **Proximity:** Close objects are perceived as related.
- **Continuity:** Smooth, continuous lines help viewers follow a trend.
- **Closure:** Incomplete forms are perceived as complete. H describes this as useful when presenting incomplete datasets.
- **Cognitive load:** Too many points, excessive colors, and unnecessary details can make the intended insight harder to extract.
- **Simplicity:** Removing 3D effects and overly complex legends can reduce distractions.

**Skill use:** Deliberate grouping and reduced clutter. The closure recommendation is restricted by T's explicit missing-data warning; see the conflict analysis below.

### H5: Best Practices for Effective Data Visualization

H recommends selecting the right chart, limiting colors, accounting for color blindness, using clear titles/axes/legends, and supplying annotations or a short contextual explanation.

Its context example suggests explaining a quarterly sales decline. It does not provide a method for determining the cause of a decline.

**Skill use:** A review checklist for chart fit, palette restraint, labeling, and context. The requirement not to invent an explanation follows the user's source-only constraint. H's accessibility advice is retained without adding a standard or a specific testing method that it does not contain.

### H6: Commercial material, conclusion, and FAQs

The commercial section promotes custom visualization, analytics consulting, interactive dashboards, business intelligence, UI/UX services, and infographics/reports. These are service descriptions, not technical implementation instructions.

The conclusion and five FAQs repeat the earlier messages: color can affect emotion and attention; chart choice depends on the data task; simplicity reduces overload; culture matters; and Gestalt grouping helps communicate relationships.

**Skill use:** The repeated guidance is integrated above. Marketing claims, contact invitations, and service endorsements are not included as skill instructions. The service list does not justify requirements for real-time dashboards, a particular technology, or interactive behavior.

## Towards Data Science coverage

### T1: Opening and Brief History of Data Visualization

T frames visualization as communication of analytical findings and also as a means of noticing unexpected patterns. It gives historical examples:

- Early maps and the growth of public economic, population, and weather data.
- William Playfair and his 1786 trade graphics, including the reproduced imports/exports time series.
- Florence Nightingale's mortality diagrams, which distinguish disease, wounds, and other causes. T describes their role in communicating the importance of hygiene and influencing policy.

These are the article's historical account, not independently checked findings. The skill does not convert those examples into preferred chart templates.

T also presents a sensory-bandwidth analogy attributed to Tor Nørretranders, including a sight estimate of 1250 MB/s and an image caption claiming 0.7% conscious awareness. Neither number is necessary to apply the visualization guidance, and neither was independently verified from the two allowed pages.

**Skill use:** Communication and pattern discovery as purposes. History and sensory-bandwidth claims remain background, not design rules.

### T2: Pre-attentive processing

T describes pre-attentive processing as subconscious accumulation and filtering of sensory information, with salient or relevant information selected for fuller conscious attention. It connects visual processing with speed and reduced cognitive effort.

The section also gives a simplified thalamus/cerebral-cortex explanation and a timing claim of a few hundred milliseconds. The skill does not restate this as a verified account of neuroscience or a guaranteed response time.

**Skill use:** Make the important feature perceptually distinguishable. T12 supplies the concrete focal-point application. Avoid turning this into a promise that a viewer will interpret the intended meaning correctly or within a fixed duration.

### T3: Visual Variables

T attributes the original visual-variable set to Jacques Bertin and names position, size, shape, lightness/value, hue, orientation, and texture. It names saturation, arrangement, crispness, resolution, and transparency as later additions associated with later researchers.

Its prose defines four perception categories: selective, associative/dissociative, ordered, and quantitative. Only the associative side of the paired term receives a separate prose definition. Variables can belong to several categories.

#### Classification shown in the article's image

The following is a transcription of the labels in T's [“Bertin's Visual Variables and their Associated levels” diagram](https://assets.insightmediagroup.io/media/wp-content/uploads/2021/03/1dcO-I9tiwbFvH2i_oSb6zA.png). It records this article's classification, not an independently validated table.

| Variable | Labels shown beneath it |
| --- | --- |
| Position | Selective; associative; ordered; quantitative |
| Size | Selective; ordered; quantitative |
| Shape | Associative |
| Value / lightness | Selective; ordered; quantitative |
| Hue | Selective; associative |
| Orientation | Selective; associative (sometimes) |
| Texture | Selective; associative; ordered (sometimes) |

The image does not classify the later additions. In particular, do not generate missing table entries for transparency, saturation, arrangement, crispness, or resolution.

The image labels lightness quantitative, but the article separately warns that quantitative perception is approximate and places shading/saturation low in its accuracy hierarchy. Recording the image label does not establish exact ratio-reading accuracy for lightness.

#### Application rules in the prose

T advises against nonselective variables such as shape when the goal is immediate pattern recognition. It warns about breaking perceived sameness, gives combined color and size as an example in that context, recommends ordered variables for ordered/numerical data, and warns against ordered encodings for information with no natural order. It also says that magnitude differences may require a legend and that size estimation is imperfect.

These recommendations depend on the perceptual task. They do not eliminate shape-based grouping or all multivariable charts.

#### Accuracy hierarchy reported by T

T attributes this order to Cleveland and McGill's 1984 graphical-perception study:

| Rank | Visual feature as listed in T | Chart examples attached by T |
| --- | --- | --- |
| 1 | Position along a common scale | Bar charts; dot plots |
| 2 | Positions along nonaligned, identical scales | Small multiples |
| 3 | Length, direction, angle | Pie charts |
| 4 | Area | Treemaps |
| 5 | Volume, curvature | 3D bar charts; area charts |
| 6 | Shading, color saturation | Heat maps; choropleth maps |

Preserve the distinction between a visual feature and a chart that may use several features. The inclusion of area charts in T's fifth group is an association made by the article; it is not grounds to claim that every area chart is read through volume or curvature. The original study was not separately examined.

T explicitly states that the ordering is a framework rather than a precise chart prescription.

**Skill use:** Prefer more accurately compared encodings when the task calls for precise comparison, while retaining chart-task fit. Keep the full vocabulary and diagram available without fabricating methods for every variable.

### T4: Applying Gestalt Principles to Data Visualization

T explains that viewers organize elements into patterns and may perceive structure even among unrelated objects. Its Kanizsa-style figures show perceived triangles formed by incomplete arrangements rather than drawn continuous triangle boundaries.

T notes that lists of Gestalt principles vary. Its overview image shows seven principles; the article also discusses focal point as an additional principle used by some accounts.

**Skill use:** Check intended and unintended grouping. Do not present eight principles as the only possible taxonomy.

### T5: Law of Proximity

T recommends grouping by the visual's information priority and states that spatial proximity takes precedence over other grouping principles. Its example places three years of bars within each country group.

**Skill use:** Let the analytical priority determine proximity. The example supports grouping by country when country is the priority, not an unconditional instruction to group all country/year datasets that way. The article's precedence claim is not expanded into a universal conflict-resolution algorithm.

### T6: Law of Closure

T warns that viewers mentally complete an interrupted graph. The example places an incomplete time series beside a fuller series. The missing region conceals a peak, so an assumed smooth connection would misrepresent it.

**Skill use:** Review gaps as a source of false inference. Preserve the distinction between observed and missing information. Neither article supplies interpolation, imputation, or smoothing rules.

### T7: Law of Similarity

T describes grouping through similar color, shape, size, or orientation. The example is a property-price/living-space scatter plot with two ZIP-code groups distinguished by color.

**Skill use:** Make visual similarity correspond to intended group membership. Do not infer that T3's shape warning prohibits this use of shape.

### T8: Law of Enclosure

Also called common region, this principle concerns objects being perceived as connected within a boundary. T recommends enclosing the objects to be grouped and noticed.

Its animated employment-chart example uses a Plotly time-range control to focus on an interval. Inspected frames show the visible date range changing. The example does not establish that every chart needs brushing, a range slider, animation, or Plotly.

**Skill use:** A shared region can communicate a group or focus an interval. Keep the principle separate from the particular demonstration technology.

### T9: Law of Continuity

T says viewers follow lines, curves, and established directions. It recommends arranging objects to simplify grouping and comparison.

The image contrasts genre bars in an unsorted value sequence with bars sorted by descending return. A sequential palette reinforces the ordered progression.

**Skill use:** Consider value ordering for a magnitude-comparison task. Do not transfer this example to time-series reordering or use a sequence to imply that unrelated categories have an inherent order.

### T10: Law of Figure-Ground

T recommends sufficient foreground/background contrast and warns against excessive color. It recommends a continuous color scale when a data dimension is represented through color.

The example has a dark background and a property-price/living-space scatter plot with a building-grade color scale. Its use of color for numerical information fits T3's ordered-variable advice. The prose's broad color-scale wording should not override T3's prohibition on implying order where none exists.

**Skill use:** Separate marks from background and choose color encoding according to data type. Do not infer a required background color, palette, trend-line algorithm, or bubble-size mapping from the image.

### T11: Law of Symmetry

T describes symmetrical elements as a unified group and associates symmetry with stability and order. It notes that asymmetry can draw attention to differences. It suggests before-and-after comparisons and similar groups as applications.

The example uses split violin plots for red and white US wine-price distributions by state. It illustrates comparison, not a requirement for the two distributions to match.

**Skill use:** Use comparable arrangements to support reading groups and differences. No density-estimation, bandwidth, or sample-size rules are provided.

### T12: Law of Focal Point

T describes distinctive objects as drawing attention first. It recommends a different color or shape to create a focal point.

The example makes the US bar red among green bars in a country wine-price comparison. The point is deliberate distinction, not that the US value is the highest or that red/green is a universally suitable palette.

**Skill use:** Make the relevant item distinct and explain the emphasis. Apply H5's color-blindness requirement rather than copying the example's colors without checking them.

### T13: Summary and acknowledgements

T connects visual-variable theory with Gestalt grouping, contrast, orientation, size, color, symmetry, and continuity. It emphasizes the tendency to predict from a perceived trend.

Its acknowledgements point to further material. Those links are not part of this skill's evidence base and were not treated as additional sources.

## Cross-source analysis and limits

| Issue | Evidence | Treatment in the skill |
| --- | --- | --- |
| Closure and missing data | H4 presents closure as useful with incomplete datasets; T6 shows a misleading inferred connection. | Keep closure as a perceptual explanation but treat missingness as a risk. Do not infer or fabricate absent values. |
| Shape | T3 calls shape nonselective; T7 and T12 allow shape for grouping and distinction. | Separate rapid pattern selection from group identity and focal emphasis. Do not ban shape. |
| Color plus size | T3 warns that combining them can break perceived sameness; T10's example varies both marker color and size. | Apply the warning when equal perceived visibility is needed. Do not invent a blanket ban or copy an unexplained size encoding. |
| Hue and emphasis | T3 classifies hue as associative; T12 uses a distinct hue to draw attention. | Preserve the reported classification without claiming that color can never create emphasis. Consider the role of the actual contrast in the display. |
| Continuous scales | T10 broadly recommends a continuous scale for a color dimension; T3 rejects ordered variables for unordered data; T7 uses categorical color. | Limit the continuous-scale recommendation to ordered/numerical encodings. |
| Chart accuracy | H3 supports pie charts for simple proportions; T3 ranks angle below common-scale position. | Choose by task and needed comparison accuracy. A heuristic ranking is not a universal chart ban. |
| Example styling | T5's bars have beveled effects, while H4 recommends removing unnecessary 3D effects. T12 uses red/green, while H5 requires color-blindness consideration. | Extract the demonstrated grouping or focal principle rather than treating an entire example as a best-practice template. |
| Numerical rules | H supplies a pie-slice heuristic and broad cognitive statistics. Neither article specifies palette sizes, contrast ratios, or layout dimensions. | Attribute the slice heuristic; do not manufacture precise design thresholds. Keep unsupported scientific figures out of operative rules. |
| Context versus explanation | H5 recommends explaining significance and gives a sales-decline example. | Add only supported context. Neither a visible pattern nor the instruction to explain supplies evidence for its cause. |

### What is intentionally not specified

These articles do not provide a sufficient basis for exact palette codes, a full accessibility audit, zero-baseline or logarithmic-axis policies, typography and spacing systems, responsive layout rules, statistical significance tests, uncertainty-interval construction, aggregation methods, missing-data estimation, animation timings, or a chart-library selection process.

They mention some related concepts or demonstrate individual technologies, but a mention or screenshot is not a complete specification. State the coverage limit when one of these decisions matters. Do not silently import external rules under H or T citations.

### Nature of the synthesis

The skill's workflow, questions, checklist, source IDs, and response formats organize the articles into repeatable practice. They are not claimed as article quotations or as a validated methodology. The prohibitions on fabricated data, invented causes, and unsupported precision enforce the source-only requirement. They do not add a third theory of visualization.
