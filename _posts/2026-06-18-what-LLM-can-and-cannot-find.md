---
layout: post
title: "Lost in Translation: What LLM Can and Cannot Find for Product Teams in User Interview Transcripts"
date: 2026-06-18
image:
  path: /assets/images/well_posedness_figure.png
  alt: "Scatter plot of well-posedness versus human prior-reading pass rate for 23 UXR questions"
---

> **TLDR**: Not all UXR questions are equally suited for LLMs. To measure this empirically, I sampled 50 interview transcripts and designed 23 UXR questions to simulate what a product team might want to learn. For each question, I tested how consistently the LLM could classify whether it was answerable based on interview transcripts (well-posedness), then crossed that against how often the proxy's responses matched my own prior readings of the same transcripts. Questions about observable behavior, factual experience, and explicit stance tend to work well; emotional and affective questions, fine-grained process behaviors, and normative positions tend not to, because the product-relevant threshold for what counts as a useful answer is hard to transmit through a rubric. If you are using LLMs to process interview transcripts and finding the outcomes sloppy, there are three levers: select question types that are well-posed for LLMs, refine wording to stabilize the criterion, or provide product context upfront. For those building [LLM-powered user proxies](https://guanjie.li/Thinking-out-louder/2026/05/13/user-proxies-in-the-llm-era.html), the real engineering challenge is not getting the LLM to find information, but helping humans communicate what they are looking for clearly enough that the model can hold it as a target.

This post is part of a series on LLM-powered user proxies: not synthetic personas built from demographic priors, but LLMs given a single real participant's input (here, interview transcript) and asked to answer research questions about that participant. This post asks a prior question for building any user proxy: which questions are worth asking a proxy at all? To answer this empirically, I ran a set of UXR questions through user proxies built on real interview data. 

The transcripts come from Anthropic's publicly available [LLM-conducted professional interview dataset](https://huggingface.co/datasets/Anthropic/AnthropicInterviewer), covering how professionals across industries [think about AI in their work](https://www.anthropic.com/research/anthropic-interviewer): trust and reliability, workflow integration, emotional responses, workplace and social context. I sampled 50 transcripts and designed 25 questions to simulate what a product team might want to learn from this kind of research. Some help a designer understand where friction lives in AI-assisted workflows; others help a product lead identify trust issues or set roadmap priorities; others surface reliability and performance signals an engineering team could act on. Two questions were dropped as the topics they covered came up in fewer than three transcripts, leaving too little signal to measure. The remaining 23 are what this post analyzes.

The [previous post](https://guanjie.li/Thinking-out-louder/2026/06/13/measuring-user-proxies.html)  established two yardsticks for evaluating proxy responses: a transcript-grounded grader that checks proxy responses directly against the interview transcript without any human input, and a human prior-reading grader that anchors against product-relevant judgment. In this post, the human prior-reading pass rate measures how often the proxy's responses matched my prior reading of the same transcript. It catches cases where the proxy answered consistently but answered the wrong thing, a failure invisible to any automated check.

But before asking whether an answer is correct, it is worth asking how consistently a question is even answerable to LLM from a given transcript. I call this well-posedness: a question that LLM can't consistently classify as answerable doesn't have a stable enough target for any user proxy to be reliably held to. To measure this, I reuse the transcript-grounded grader infrastructure: the grader runs 9 times on each of the 50 transcripts, and the within-participant variance of those judgments becomes the well-posedness score. For the exact formula and the full argument on why proxy-side stability can't substitute for this approach, see the appendix.

These two instruments catch different failures, and neither alone is sufficient. The figure below plots all 23 questions on both axes at once.

<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<div style="padding: 1.5rem 0 1rem; font-family: 'Open Sans', sans-serif;">
  <div style="display: flex; gap: 32px; margin-bottom: 0.75rem; flex-wrap: wrap; align-items: flex-start;">
    <div>
      <div style="font-size: 11px; color: #666; margin-bottom: 4px;">question well-posedness (x axis)</div>
      <div style="display: flex; align-items: center; gap: 6px;">
        <span style="font-size: 10px; color: #666;">low</span>
        <div style="width: 80px; height: 10px; border-radius: 3px; background: linear-gradient(to right, #C0392B, #9B7EA8, #0047AB);"></div>
        <span style="font-size: 10px; color: #666;">high</span>
      </div>
      <div style="font-size: 10px; color: #666; margin-top: 2px;">red → blue · 1 − answerability var / 0.25</div>
    </div>
    <div>
      <div style="font-size: 11px; color: #666; margin-bottom: 4px;">human prior-reading pass rate (y axis)</div>
      <div style="display: flex; align-items: center; gap: 6px;">
        <span style="font-size: 10px; color: #666;">low</span>
        <div style="width: 80px; height: 10px; border-radius: 3px; background: linear-gradient(to right, rgba(180,180,180,0.25), rgba(10,10,10,0.9));"></div>
        <span style="font-size: 10px; color: #666;">high</span>
      </div>
      <div style="font-size: 10px; color: #666; margin-top: 2px;">light → dark</div>
    </div>
  </div>
  <p style="font-size: 11px; color: #666; margin: 0 0 0.75rem;">hover over a point for question text and details · well-posedness = 1 − answerability variance / 0.25</p>
  <div id="wp-chart-wrapper" style="position: relative; width: 100%; height: 500px;">
    <canvas id="wp-scatter" role="img" aria-label="Scatter plot of 23 UXR questions by well-posedness (x, 0.6 to 1.0) and human prior-reading pass rate (y, 0 to 1)."></canvas>
    <div id="wp-tooltip" style="display:none; position:absolute; pointer-events:none; font-family:'Open Sans',sans-serif; font-size:11px; line-height:1.6; max-width:290px; padding:10px 12px; border-radius:6px; box-shadow:0 2px 8px rgba(0,0,0,0.12); background:#fff; border:1px solid rgba(0,0,0,0.12);"></div>
  </div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"></script>
<script>
(function() {
const raw = [
  {qid:'Q01', av:0.0889, ci_lo:0.0611, ci_hi:0.1167, L2:0.84, pct:0.58, q:"What specific AI tools does this participant mention using in their work?"},
  {qid:'Q24', av:0.0667, ci_lo:0.0456, ci_hi:0.0883, L2:0.32, pct:0.42, q:"What does this participant describe about how they prefer to communicate with AI (e.g., chat vs structured prompts vs voice)?"},
  {qid:'Q15', av:0.0489, ci_lo:0.0283, ci_hi:0.0722, L2:0.70, pct:0.78, q:"What tasks or responsibilities, if any, does this participant explicitly say should be done by humans rather than AI, regardless of whether AI is capable of doing them?"},
  {qid:'Q10', av:0.0472, ci_lo:0.0278, ci_hi:0.0683, L2:0.54, pct:0.77, q:"Does this participant describe being frustrated by AI tools, and if so, in what context?"},
  {qid:'Q23', av:0.035,  ci_lo:0.0183, ci_hi:0.0528, L2:0.78, pct:0.31, q:"After AI generates an output, how does this participant pass it into a non-AI tool, document, or system to continue their workflow?"},
  {qid:'Q19', av:0.035,  ci_lo:0.0172, ci_hi:0.0533, L2:0.72, pct:0.54, q:"What AI capabilities does this participant wish existed but don't yet?"},
  {qid:'Q06', av:0.0322, ci_lo:0.0178, ci_hi:0.0478, L2:0.78, pct:0.67, q:"What specific action, if any, does this participant take to check that AI's output is correct or trustworthy before using it?"},
  {qid:'Q18', av:0.0283, ci_lo:0.0122, ci_hi:0.0472, L2:0.64, pct:0.44, q:"Does this participant raise broader societal, economic, or ethical concerns about generative AI?"},
  {qid:'Q22', av:0.0233, ci_lo:0.0094, ci_hi:0.0406, L2:0.62, pct:0.84, q:"What does this participant do, if anything, in follow-up prompts to AI to refine the output toward what they need?"},
  {qid:'Q14', av:0.0228, ci_lo:0.0078, ci_hi:0.04,   L2:0.74, pct:0.71, q:"Does this participant express concern about AI displacing their job or profession?"},
  {qid:'Q08', av:0.0206, ci_lo:0.0072, ci_hi:0.0378, L2:0.68, pct:0.93, q:"What positive emotions or sources of satisfaction does this participant express about working with AI?"},
  {qid:'Q11', av:0.02,   ci_lo:0.0078, ci_hi:0.0344, L2:0.88, pct:0.68, q:"How does this participant describe their colleagues' or workplace's attitudes toward AI use?"},
  {qid:'Q12', av:0.0183, ci_lo:0.005,  ci_hi:0.035,  L2:0.80, pct:0.15, q:"Does this participant describe encountering social stigma, judgment, or perceived 'laziness' around using AI at work?"},
  {qid:'Q09', av:0.0161, ci_lo:0.0039, ci_hi:0.0306, L2:0.30, pct:0.84, q:"What concerns does this participant raise about how AI performs on their work tasks — its accuracy, reliability, or the quality of its output?"},
  {qid:'Q17', av:0.0156, ci_lo:0.0043, ci_hi:0.03,   L2:0.82, pct:0.87, q:"How does this participant envision their personal use of AI evolving in the next few years?"},
  {qid:'Q05', av:0.0139, ci_lo:0.0044, ci_hi:0.0261, L2:0.86, pct:0.59, q:"Has this participant encountered AI making factual errors, hallucinating, or producing incorrect output? If so, in what context?"},
  {qid:'Q16', av:0.0056, ci_lo:0.0,    ci_hi:0.0167, L2:0.96, pct:0.25, q:"Has this participant considered shifting their role toward managing or overseeing AI systems?"},
  {qid:'Q04', av:0.005,  ci_lo:0.0,    ci_hi:0.015,  L2:0.80, pct:0.99, q:"Are there tasks this participant prefers to keep doing themselves rather than delegate to AI? If so, which?"},
  {qid:'Q21', av:0.0,    ci_lo:0.0,    ci_hi:0.0,    L2:0.98, pct:1.0,  q:"What is this participant's occupation or job role?"},
  {qid:'Q03', av:0.0,    ci_lo:0.0,    ci_hi:0.0,    L2:0.81, pct:1.0,  q:"Does this participant describe using AI to augment their own work, or to automate/delegate tasks entirely?"},
  {qid:'Q20', av:0.0,    ci_lo:0.0,    ci_hi:0.0,    L2:0.84, pct:1.0,  q:"What is this participant's overall stance toward AI in their work — enthusiastic, cautious, conflicted, resistant, or other?"},
  {qid:'Q02', av:0.0,    ci_lo:0.0,    ci_hi:0.0,    L2:0.76, pct:1.0,  q:"What kinds of work tasks does this participant use AI for?"},
  {qid:'Q13', av:0.0,    ci_lo:0.0,    ci_hi:0.0,    L2:0.96, pct:0.14, q:"What concerns, if any, does this participant raise about privacy, data security, or sharing confidential information with AI?"},
];

const X_MIN = 0.6, X_MAX = 1.0;
const FONT = "'Open Sans', sans-serif";

const points = raw.map(d => ({
  ...d,
  wp:    Math.max(0, Math.min(1, 1 - d.av    / 0.25)),
  wp_lo: Math.max(0, Math.min(1, 1 - d.ci_hi / 0.25)),
  wp_hi: Math.max(0, Math.min(1, 1 - d.ci_lo / 0.25)),
}));

function lerpRGB(t, r1,g1,b1, r2,g2,b2) {
  return [Math.round(r1+(r2-r1)*t), Math.round(g1+(g2-g1)*t), Math.round(b1+(b2-b1)*t)];
}

function pointColor(wp, L2) {
  const l2Norm = Math.min(Math.max(L2, 0), 1);
  const t = Math.max(0, Math.min(1, (wp - X_MIN) / (X_MAX - X_MIN)));
  const [r,g,b] = lerpRGB(t, 192,57,43, 0,71,171);
  const wm = 0.68 - 0.68 * l2Norm;
  return `rgb(${Math.round(r+(228-r)*wm)},${Math.round(g+(228-g)*wm)},${Math.round(b+(228-b)*wm)})`;
}

const gridColor  = 'rgba(0,0,0,0.07)';
const axisColor  = 'rgba(0,0,0,0.38)';
const titleCol   = '#1a1a1a';
const bodyCol    = 'rgba(0,0,0,0.5)';
const boldCol    = 'rgba(0,0,0,0.75)';

const tooltipEl = document.getElementById('wp-tooltip');

function wrapText(text, maxLen) {
  const words = text.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxLen) { if (cur) lines.push(cur); cur = w; }
    else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur);
  return lines;
}

const qidLabelPlugin = {
  id: 'qidLabels',
  afterDatasetsDraw(chart) {
    const {ctx} = chart;
    ctx.save();
    ctx.font = `500 10px ${FONT}`;
    chart.getDatasetMeta(0).data.forEach((point, i) => {
      const d = points[i];
      ctx.fillStyle = pointColor(d.wp, d.L2);
      const nearTop = point.y < 20;
      ctx.textAlign = 'right';
      ctx.fillText(d.qid, point.x - 8, point.y + (nearTop ? 16 : -8));
    });
    ctx.restore();
  }
};

Chart.defaults.font.family = FONT;

new Chart(document.getElementById('wp-scatter'), {
  type: 'scatter',
  plugins: [qidLabelPlugin],
  data: {
    datasets: [{
      data: points.map(d => ({x: d.wp, y: d.L2})),
      backgroundColor: points.map(d => pointColor(d.wp, d.L2)),
      borderColor:     points.map(d => pointColor(d.wp, d.L2)),
      borderWidth: 1,
      pointRadius: 7,
      pointHoverRadius: 9,
      pointHoverBorderWidth: 2,
      pointHoverBorderColor:     points.map(d => pointColor(d.wp, d.L2)),
      pointHoverBackgroundColor: '#fff',
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 20, right: 16, bottom: 16, left: 40 } },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: false,
        external({ tooltip }) {
          if (tooltip.opacity === 0 || !tooltip.dataPoints?.length) {
            tooltipEl.style.display = 'none';
            return;
          }
          const d = points[tooltip.dataPoints[0].dataIndex];
          const qLines = wrapText(d.q, 50).map(l => `<span style="color:${bodyCol}">${l}</span>`).join('<br>');
          tooltipEl.innerHTML = `
            <div style="font-weight:600;color:${titleCol};margin-bottom:4px">${d.qid}</div>
            <div style="margin-bottom:8px;line-height:1.5">${qLines}</div>
            <div style="margin-bottom:2px"><span style="font-weight:600;color:${boldCol}">well-posedness:</span> <span style="color:${bodyCol}">${d.wp.toFixed(2)}&nbsp;&nbsp;(90% CI: ${d.wp_lo.toFixed(2)} – ${d.wp_hi.toFixed(2)})</span></div>
            <div style="margin-bottom:2px"><span style="font-weight:600;color:${boldCol}">human prior-reading pass rate:</span> <span style="color:${bodyCol}">${d.L2.toFixed(2)}</span></div>
            <div><span style="font-weight:600;color:${boldCol}">transcripts where question is addressed:</span> <span style="color:${bodyCol}">${(d.pct*100).toFixed(0)}%</span></div>
          `;
          const wrapper = document.getElementById('wp-chart-wrapper');
          const cw = wrapper.offsetWidth;
          const tw = 300;
          let x = tooltip.caretX + 14;
          if (x + tw > cw) x = tooltip.caretX - tw - 14;
          tooltipEl.style.left = x + 'px';
          tooltipEl.style.top  = (tooltip.caretY - 10) + 'px';
          tooltipEl.style.display = 'block';
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'well-posedness →', color: axisColor, font: { size: 12, family: FONT } },
        min: 0.6, max: 1.0,
        grid: { color: gridColor },
        ticks: { color: axisColor, font: { size: 11, family: FONT }, callback: v => v.toFixed(2) }
      },
      y: {
        title: { display: true, text: 'human prior-reading pass rate →', color: axisColor, font: { size: 12, family: FONT } },
        min: 0, max: 1.0,
        grid: { color: gridColor },
        ticks: { color: axisColor, font: { size: 11, family: FONT }, callback: v => v.toFixed(1) }
      }
    }
  }
});

document.getElementById('wp-scatter').addEventListener('mouseleave', () => {
  tooltipEl.style.display = 'none';
});
})();
</script>

*Figure 1: 23 UXR questions by well-posedness and human prior-reading pass rate*

---

## Which questions work, and why

The figure plots all 23 questions on two axes. The horizontal axis is well-posedness (inverted so that higher means more stable), represented by hue (red dots = unstable criterion, blue dots = stable). The vertical axis is human prior-reading pass rate, represented by lightness (light dots = proxy's responses diverge from researcher's reading, dark dots = proxy's responses aligns). The dots clustering toward the upper right side that appear dark blue are questions the proxy handles well on both counts. Questions that appear red or pale are ones to approach with caution for different reasons.

### What works

The questions that land in the upper right share a common structure. They ask about observable behavior, explicit stance, or factual experience, not what participants felt or should have felt. These are questions with a relatively clear evidentiary standard. Note that a subset of the dark blue cluster (Q13 privacy concerns, Q16 role shift to oversight, Q12 social stigma) have very low base rates: fewer than a quarter of participants from this sample addressed them at all. The proxy handles these generally well by abstaining when the signal isn't there.

### What doesn't work, and why it differs

Questions not in the upper right fall short for distinct reasons. A red or purple dot means the grader flip-flops on whether the question is answerable at all, usually because it contains a boundary the rubric can't resolve without product context. A pale dot means the criterion is stable but the proxy's content diverges from what my prior reading finds useful. Some questions are both purple and pale: the criterion is unstable, and when an answer does come through, the content diverges too.

*Emotional and affective questions* are hard to transmit to an LLM. Q08 (positive emotions) appears blue but pale: while user satisfaction sounds straightforward and intuitive, what counts as a meaningful, product-relevant expression of it is use-dependent. Finding a value proposition requires knowing when affect crosses into something strong enough to matter; assessing long-term satisfaction might only need cognitive appraisal. Without specifying which, the question is well-posed for the LLM but may not surface what a product team is actually looking for. Q10 (frustration with AI) appears lilac: whether a participant's negative mentions count as frustration has no stable answer until a threshold is defined. Q09 (performance concerns) took considerable revision to distinguish from adjacent questions, and the proxy had little difficulty surfacing concerns literally present in the transcript. Yet what I was looking for was a real gap between user expectation and LLM capability, at a level of detail that would inform a product decision. The proxy doesn't have that lens, and its responses diverge from my prior readings accordingly.

*Fine-grained behavioral and process questions* (Q22 follow-up prompting behavior, Q23 post-AI workflow handoff, Q24 communication style preference) range from pale indigo to mauve. The signal for micro-behaviors in Q22 and Q23 is sparse and fragmented in interview text. Q24 compounds the problem: what counts as a "communication style" spans text prompts, file uploads, structured templates, and more. Whether a participant's offhand mention of any of these counts as a meaningful pattern depends on what kind of friction you're trying to understand, and different teams would draw that line differently. These questions are often the most valuable to designers precisely because they are hard to ask directly, and for the same reason, they are hard for an LLM to extract reliably from interview text.

*Normative questions* (Q15 tasks humans should do regardless of AI capability, Q18 broader societal concerns) sit on the paler side. They ask what participants believe ought to be the case, and whether a given statement rises to the level of a considered position depends on reading tone and intent. A product team asking these questions may be trying to set guardrails and identify directions to deprioritize, a judgment that requires product context the proxy doesn't have access to.

Q01 (AI tools used) deserves a separate note because it looks different from the others: the dot is red but not pale. The proxy reads the content and captures what the human prior reading recognizes as AI tools, but there is instability in the criterion itself: Does someone mentioning "an AI assistant" counts as specifying their tool? How about "AI features in Adobe"? Rewording or sharpening the rubric would help, but only up to a point. Any definition of "specific enough" will lag behind what users are actually doing, since the tool landscape changes faster than any rubric can track.

---

## The bottleneck is communication, not LLM capability

Looking across the questions that fall short, a pattern emerges. The questions that work are those where a product team member can transmit their intent to the LLM completely enough. The questions a proxy struggles with tend to be ones where the criterion itself resists articulation: what counts as a meaningful expression of frustration, whether a workflow detail rises to the level of a stated preference.

A user proxy is, at its core, a communication channel: a product team member specifies what they want to know, the proxy extracts it from the transcript, and an LLM or human evaluator checks whether the extraction was faithful. Every step in that chain requires a shared understanding of what counts. Human colleagues build that understanding implicitly from accumulated product exposure, from seeing which signals matter for which decisions, from a shared sense of what an insight looks like before it can be written down. The rubric is the only interface between a human and an LLM, and some things don't fit through it, because the understanding itself was never fully linguistic to begin with.

This is also why qualitative research can't be replaced by running interview transcripts through an LLM, regardless of how capable the model becomes. The bottleneck isn't the model's ability to read or reason, but the cost of communicating what you are looking for precisely enough that the model can find it. That cost is highest exactly where the research value is highest: in the findings a product team didn't know to look for until they saw them. A tighter rubric makes the proxy more reliable at finding what you specified; it also makes it less likely to surface what you didn't. The most valuable qualitative insights tend to be the ones that reframe the question, and those can't be written into a rubric in advance.

---

## What this means in practice

If you have used an LLM to process user interview transcripts and found the results uneven (useful in some places, frustratingly sloppy in others), the pattern above suggests why. It is not a capability problem. It is a question design problem, and more specifically, a communication problem: the LLM may have found what the question asked for; the question just didn't ask for what you needed. There are three levers to improve.

The first is **question selection**. The results here reflect one question set, one dataset, and one proxy architecture. Your questions and your product context will shift the picture. But the underlying pattern is likely to hold: observable, factual, explicit questions travel better through the rubric interface. If you are starting out, these are where a proxy will be most consistent and most aligned with what you are looking for. Emotional reactions, process micro-behaviors, and normative positions require substantially more effort to capture reliably, and may not be worth that effort for every research goal.

The second is **question refinement**. If a question is ill-posed but the construct is in principle articulable, sharpening the wording or the rubric boundary will help. Though if the boundary depends on product context, no amount of rewording will fully close the gap. There is also a deeper tradeoff: the tighter the rubric, the more reliably the proxy finds what you specified, and the less likely it is to surface what you didn't. For questions where unexpected findings are the point, over-specifying the criterion can be counterproductive.

The third is **context provision**: giving the LLM your role, the decisions you are trying to make, what you already know and what kind of signal you are looking for. This is the highest-effort lever and the one with the highest ceiling. It can make questions usable that would otherwise be ill-posed. The catch is that it requires externalizing tribal knowledge you may not realize you have. Much of what makes a product team member's reading of a transcript valuable is accumulated and implicit; knowing which details matter, for which decisions, is something that develops over time and doesn't always survive translation into a prompt.

For those building user proxy systems, this reframes where the real work lies. Getting the proxy to extract information from a transcript is the easier half of the problem. The harder half is on the human side: helping product team members communicate what they are looking for clearly enough that the rubric can carry it. That means designing question sets iteratively, stress-testing rubric boundaries against real proxy responses, and building in ways for users to specify context. The proxy is only as good as the question it is answering, and the question is only as good as the intent behind it can be made explicit.

---

## Appendix 1: Why well-posedness is measured through the grader

You might wonder: why not measure answerability directly from the user proxy? Why use the transcript-grounded grader infrastructure, which was designed for a different task?

**Answerability is not a property of the proxy alone.** "Can this question be answered?" only has meaning once you define what counts as an answer. For clear-cut cases (a participant explicitly mentions an observable behavior), answerability is a fact about the transcript and the rubric agrees instantly. For boundary cases (does mentioning "AI features in Adobe" count as specifying AI tools used, or is it too vague?), answerability depends on a normative choice about where to draw the line. That choice lives in the rubric, not in the proxy. Q01 is the clearest example: the proxy consistently reads the transcript in a way aligned with human prior readings; the instability is in whether the rubric classifies that response as addressing the question. No amount of inspecting the proxy would reveal this.

**There is no grader-free shortcut.** One might propose re-running the proxy and comparing responses: if the proxy answers consistently, the question must be answerable. But a proxy can rephrase across runs and still be expressing the same meaning. Determining whether two responses agree on answerability despite differences in wording would itself require applying the rubric, which is exactly what the grader does.

If there is so much struggle with rubric definition, why not have a human judge and rely on an internalized rubric? A human judge faces the same instability the LLM-powered grader does. With genuinely ambiguous boundary cases, a human reading the same transcript twice will not always land the same way. The difference is that the grader's drift is measurable and human drift is not: there is no practical way to have a human judge the same item multiple times with no memory of prior judgments. The grader is not a substitute for human judgment, but the only instrument that can make the instability visible and quantifiable.

---

## Appendix 2: The well-posedness formula

For each question and interview transcript pair, the grader runs $r$ times and produces a binary judgment on each run: answerable or not. Let $p_b$ be the fraction of runs that called the question answerable for the transcript of participant $b$. The within-participant variance for that question-participant pair is $p_b(1 - p_b)$, which equals zero when the grader is fully consistent and reaches its maximum of 0.25 when the grader is evenly split.

Well-posedness is defined as:

$$\text{well-posedness} = 1 - \frac{1}{0.25} \cdot \frac{1}{N} \sum_{b=1}^{N} p_b(1 - p_b)$$

Here, $N = 50$ participants and $r = 9$ times. The denominator 0.25 is the theoretical maximum of a Bernoulli variance (achieved when $p = 0.5$), making the score interpretable as a fraction: 1.0 means the grader was never uncertain about answerability for any participant; 0 means it was at 50/50 for every participant on every run.

### Three caveats

**This is within-participant variance, not total variance.** The formula averages $p_b(1-p_b)$ across participants (the grader's uncertainty for a given participant's transcript). It does not use the variance of the mean $p$ across participants, which would mix in between-participant heterogeneity: some participants' transcripts address a topic, others' don't. That between-participant spread reflects base rate, not fuzziness. Q13 (privacy concerns) and Q16 (role shift to oversight) have near-zero well-posedness variance but low base rates, as the grader is perfectly consistent that most transcripts don't address these topics.

**The raw (uncorrected) variance is used for normalization.** An unbiased variance estimator would multiply by $\frac{r}{r-1}$, but individual values can then exceed 0.25, breaking the $[0, 1]$ bound. Since the formula is used for interpretation rather than variance estimation, the raw mean is the right choice. The two versions differ by less than 12% in practice and do not change the ranking.

**Use Figure 1 for direction, not precision.** Each dot represents a question's mean well-posedness score, and hovering reveals a 90% confidence interval derived from a bootstrap over the 50 interview transcripts. For many questions in the middle of the range, those intervals overlap. Q01 sits clearly at the left (0.64) and a handful of questions sit clearly at the right (1.0), but the questions in between are harder to rank with confidence. Narrowing the confidence intervals would require a larger sample, which is beyond the scope of this post. The figure is a guide to broad groupings, not a precise scorecard.