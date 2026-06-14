---
layout: post
title: "Dual Reference Points for User Proxy Evaluation: Design and Rationale"
date: 2026-06-13
---

> **TLDR**: Grader configuration (which reference point you use and how the grader is built) moves measured pass rates by 5–9 points per variable on byte-identical proxy responses. This post explains why both a transcript-grounded and a prior-reading-grounded yardstick are necessary, what each captures that the other cannot, and what to watch for when building your own user proxy evaluation pipeline..

In the next few posts, I will be comparing different ways of building [LLM-powered user proxies](https://guanjie.li/Thinking-out-louder/2026/05/13/user-proxies-in-the-llm-era.html) grounded in the same interview transcript data, and reporting how well each holds up against the source interviews. Before those comparisons land, one thing needs to be established: what "holds up" is being measured against, and why.

The evaluation uses two reference points. The first treats the original interview transcript as the answer key: an LLM grader reads it directly and checks whether the proxy's response is consistent with what the interview participant actually said. The second uses my own prior readings: inferences I drew from the transcripts before running any proxy, then checked independently against proxy outputs. These two references don't always agree with each other. This post explains why both are necessary, what each captures that the other structurally cannot, and what you should know if you are thinking about replicating this setup. If you are primarily interested in the practical implications, skip to the "what this means in practice" section.

---

## The experiment

To understand how much grader configuration matters, I ran a 2×2 experiment. For notes on grader design and calibration, see the appendix.

The user proxies evaluated by the grader are individual-level: each takes a single participant's interview transcript as its only input, and generates responses to a set of UXR questions about that participant's experiences and views. The interview data comes from Anthropic's publicly available [LLM-conducted professional interview dataset](https://huggingface.co/datasets/Anthropic/AnthropicInterviewer), covering topics such as AI trust and reliability, workflow integration, and workplace and social context. I sampled 50 interview transcripts from this dataset, each paired with the same set of 25 UXR questions, yielding 1,247 valid responses in total (a small number of items were excluded as not applicable). 

The proxy architecture follows the logic of [Park et al. (2024)](https://arxiv.org/abs/2411.10109), grounding outputs in a specific individual's data. It also requires abstention when the transcript does not provide sufficient evidence, inspired by [PersonaCite (2026)](https://arxiv.org/abs/2601.22288). For each question, an LLM grader (given a rubric specifying what counts as a pass or a failure) checks whether the proxy's characterization of the participant is consistent with what the transcript actually supports, or whether the proxy correctly abstained rather than speculating beyond the record.

I ran the same proxy responses through four grader configurations: two ground truth sources crossed with two LLM harnesses. The two ground truth sources are the original interview transcript itself, and my own prior readings of the transcripts, completed before any proxy output was available. The two harnesses are built differently: in the first, grading instructions are passed via LLM API with each proxy response evaluated individually; in the second, grading instructions are delivered as user messaging within an LLM-orchestrated workflow, with proxy responses batched together. This setup is faster and more token-efficient, one that practitioners building their own evaluation pipelines might reasonably reach for. Whether that efficiency comes at a measurement cost is one of the things this experiment tested.

|  | Transcript-grounded | Prior-readings-grounded |
|--|--|--|
| **Harness 1** | 82.1% [80.1, 84.1] | 75.9% [73.3, 78.3] |
| **Harness 2** | 90.5% [87.9, 93.0] | 85.4% [82.4, 88.4] |

*Table 1: Pass rate by grader configuration (95% cluster-bootstrap CI, N=50 transcripts)*

Switching ground truth moves the pass rate by roughly 5-6 points regardless of which harness you use; switching harness moves it by roughly 8–9 points regardless of which ground truth you use. The confidence intervals shown in Table 1 are built on transcript-level clustering; both main effects remain well clear of zero under this correction. The two effects are independently additive, though at N=50 the experiment cannot rule out small interaction effects.

---

## Why two reference points?

The 6-point gap between transcript and prior readings reflects a genuine difference in what the two reference points are asking the grader to check.

When both the proxy and the grader are processing the same text-only transcript, their interaction surfaces LLM-internal consistency problems. Consider a proxy response that says "the participant raises no concern with X." Is this acknowledging that the participant simply didn't address the topic, or is it a substantive negative answer? Both readings are defensible from the text alone. In this experiment, the grader did not always interpret it the same way when encountering responses of this kind. And if the transcript itself contains information with low signal clarity, both the proxy and the grader may demonstrate stochasticity in their interpretation. A low score under transcript-grounded grading could therefore reflect signal clarity problems, model consistency issues, or other LLM-internal factors invisible without this kind of alignment check. Left undetected, they can quietly produce misleading pass rates.

Meanwhile, the proxy and the grader may converge on a stable misinterpretation, disguised as a high score. Human prior readings are necessary to bring product context, domain knowledge, and (if interview recordings are available) tone and body language that never make it into the transcript. But prior readings drift too. In this experiment, one question asked about a participant's preferred way of communicating with AI. The proxy abstained, as the transcript does not directly address this. My prior reading, however, had noted that the participant copies and pastes document sections for LLM revision rather than submitting whole documents, which is a deliberate choice pointing to an opportunity to rethink AI-assisted editing workflows. The grader checking against my reading scored the proxy as failing to surface this, though the proxy was more literally accurate. One could call this over-strict; one could also call it the grader catching a case where the proxy was technically correct but missed a design-relevant signal. Either way, the prior-reading yardstick is useful but should not be used alone.

The two reference points are therefore complementary rather than redundant. A low score under transcript-grounded grading signals LLM-internal problems such as signal clarity or model consistency issues, yet a high score is not sufficient on its own: the proxy and the grader may have converged on a consistent but unhelpful reading, which is what prior-reading-grounded grading is designed to surface. Disagreement between the two is not a problem to resolve; it is information about which kind of issue is present.

---

## The hidden impact of harness choice

Switching harness changes how reliably the grader follows its instructions. In this experiment, at least two mechanisms are at play. First, grading instructions sit in the prompt differently: instructions passed via API are processed as system prompt; in the LLM-orchestrated workflow, technical constraints meant instructions were processed as part of user messaging instead. Second, batching in Harness 2 introduces relational contamination: when a grader evaluates a set of proxy responses from the same interview together rather than one at a time, the quality of surrounding responses bleeds into the judgment of any individual one. Figure 1 shows rescue rates: cases where Harness 1 scored a response as a failure but Harness 2 reversed it. The figure breaks this down by two variables: the pass rate of other responses from the same interview, and how confident Harness 1 was in its original failure judgment.

![Harness 2 rescue rates among Harness 1 failures.]({{ '/assets/images/table2_rescue_rates.png' | relative_url }})

*Figure 1: Harness 2 rescue rates among Harness 1 failures.*

Across every bar cluster in Figure 1, rescue rate rises with the pass rate of other responses from the same interview, regardless of ground truth or confidence level. One might argue this simply reflects that failures in high pass rate interviews are softer to begin with. But the rescue rate rises significantly among failures Harness 1 was most certain about, in both ground truth conditions (transcript: p=0.018; prior-reading: p<0.001). That the effect is strongest precisely where failures are least ambiguous points to contamination rather than softness.

This impact is invisible in practice. A proxy builder reaching for batching to reduce token costs may not suspect it affects grader judgment, and have no way to detect it without comparing multiple harnesses on the same responses.

---

## What this means in practice

If you are a practitioner building LLM user proxies by feeding individual-level materials to an LLM and asking it to answer questions on a user's behalf, three suggestions follow from the findings above.

**First, triangulate user proxy responses with your own prior readings.** Go through at least a few interviews before running any proxy, note what evidence each question can and cannot be answered from, and freeze those readings before any proxy output is available. Do not re-annotate after seeing proxy responses. Both humans and LLMs have blind spots and tendencies to drift, often in different directions. Without comparison, you risk being misled by the LLM's interpretation without realizing it. The bonus is that the comparison may also reveal something about your own interpretive tendencies.

**Second, treat LLM outputs as harness-specific.** Any harness you did not build yourself or cannot fully replicate may contain configuration details that affect LLM behavior in ways that are not obvious: how the LLM orchestrates its own workflow, how instructions are positioned relative to other content, whether inputs are processed individually or together. As this experiment shows on the grader side, switching harness risks introducing LLM behavioral drift that is difficult to attribute. The practical implication is not to avoid efficient setups entirely, but to avoid comparing LLM outputs across different harnesses except in controlled experiments.

**Third, pay attention to signal clarity.** Some participant responses are genuinely ambiguous in transcript form, and an LLM working from text only will not always resolve the ambiguity consistently even with good model consistency. If your interviews are recorded, tone, hesitation, and body language carry information that text-based evaluation cannot replicate. Going back to the recording yourself is the check that no LLM configuration can substitute for.

---

## Appendix: A note on grader design

Proxy architectures and question types vary enough that presenting the grader prompts used in this experiment as a reusable template would be misleading. Instead, what follows is a note on the grader prompt design process.

Grader rubrics need to be calibrated iteratively against two things: proxy responses and grader judgments. Reading proxy responses reveals gaps in the grading instructions. In this experiment, a proxy could list borderline-relevant evidence and only admit at the end that it was insufficient to answer the question. In real use, this would mislead anyone reading quickly. Before the formal experiment, both the user proxy and the grading prompts were updated to require that abstentions lead with the acknowledgment of absence rather than follow a substantive-looking response.

Reading grader judgments reveals a different kind of problem. In this experiment, the grader was penalizing proxy responses that cited transcript content not captured in my prior readings, treating the gap as hallucination. The grader prompt was updated to provide context on how the proxy works: content absent from the prior readings is not necessarily absent from the transcript. After this calibration, the grader no longer treated such citations as hallucinations in the formal experiment.

Neither adjustment would have been possible without inspecting the grader's reasoning together with its verdicts. Budget time for this kind of calibration before running your formal experiment and drawing conclusions from the results.
