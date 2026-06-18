---
layout: post
title: "Dual Reference Points for User Proxy Evaluation: Design and Rationale"
date: 2026-06-13
---

> **TLDR**: When assessing LLM-powered user proxies, grader configuration matters. Switching ground truth moves measured pass rates by 16 points. Switching harness may introduce bias that is difficult to detect and attribute. This post explains why both a transcript-grounded and a prior-reading-grounded yardstick are necessary, what each captures that the other cannot, and what to watch for when building your own user proxies.

In the next few posts, I will be comparing different ways of building [LLM-powered user proxies](https://guanjie.li/Thinking-out-louder/2026/05/13/user-proxies-in-the-llm-era.html) grounded in the same interview transcript data, and reporting how well each holds up against the source interviews. Before those comparisons land, one thing needs to be established: what "holds up" is being measured against, and why.

The evaluation uses two reference points. The first treats the original interview transcript as the answer key: an LLM grader reads it directly and checks whether the proxy's response is consistent with what the interview participant actually said. The second uses my own prior readings: inferences I drew from the transcripts before running any proxy, then checked independently against proxy outputs. These two references don't always agree with each other. This post explains why both are necessary, what each captures that the other structurally cannot, and what you should know if you are thinking about replicating this setup. If you are primarily interested in the practical implications, skip to the "what this means in practice" section.

---

## The experiment

To understand how much grader configuration matters, I ran a 2×2 experiment. For notes on grader design and calibration, see the appendix.

The user proxies evaluated by the grader are individual-level: each takes a single participant's interview transcript as its only input, and generates responses to a set of UXR questions about that participant's experiences and views. The interview data comes from Anthropic's publicly available [LLM-conducted professional interview dataset](https://huggingface.co/datasets/Anthropic/AnthropicInterviewer), covering topics such as AI trust and reliability, workflow integration, and workplace and social context. I sampled 50 interview transcripts from this dataset, each paired with the same set of 25 UXR questions, yielding 1,247 valid responses in total (a small number of items were excluded as not applicable). 

The proxy architecture follows the logic of [Park et al. (2024)](https://arxiv.org/abs/2411.10109), grounding outputs in a specific individual's data. It also requires abstention when the transcript does not provide sufficient evidence, inspired by [PersonaCite (2026)](https://arxiv.org/abs/2601.22288). For each question, an LLM grader (given a rubric specifying what counts as a pass or a failure) checks whether the proxy's characterization of the participant is consistent with what the transcript actually supports, or whether the proxy correctly abstained rather than speculating beyond the record.

I ran the same proxy responses through four grader configurations: two ground truth sources crossed with two LLM harnesses. The two ground truth sources are the original interview transcript itself, and my own prior readings of the transcripts, completed before any proxy output was available. The two harnesses are built differently: in the first, grading instructions are passed via LLM API with each proxy response evaluated individually; in the second, grading instructions are delivered as user messaging within an LLM-orchestrated workflow, with proxy responses batched together. This setup is faster and more token-efficient, one that practitioners building their own evaluation pipelines might reasonably reach for. Whether that efficiency comes at a measurement cost is one of the things this experiment tested.

![Pass rate by grader configuration.]({{ '/assets/images/table1_pass_rates.png' | relative_url }})

*Figure 1: Pass rate by grader configuration*

Switching ground truth moves the pass rate substantially in both harness conditions (both p < 0.001). Switching harness, however, only matters when grading against human prior-readings (p < 0.001); against the human-free transcript, the two harnesses are statistically indistinguishable (p = 0.93). The two effects are not independently additive; the interaction is significant (p < 0.001). Both main effects and the interaction are built on transcript-level clustering with N=50.

---

## Why two reference points?

When both the proxy and the grader are processing the same text-only transcript, their interaction surfaces LLM-internal consistency problems. Consider a proxy response that says "the participant raises no concern with X." Is this acknowledging that the participant simply didn't address the topic, or is it a substantive negative answer? Both readings are defensible from the text alone. In this experiment, the grader did not always interpret it the same way when encountering responses of this kind. And if the transcript itself contains information with low signal clarity, both the proxy and the grader may demonstrate stochasticity in their interpretation. A low score under transcript-grounded grading could therefore reflect signal clarity problems, model consistency issues, or other LLM-internal factors invisible without this kind of alignment check. Left undetected, they can quietly produce misleading pass rates.

However, transcript-grounded grading is lenient by construction. It cannot catch cases where the proxy and the grader converge on a stable misinterpretation, one that shows up as a high score rather than a warning signal. In this experiment, transcript-grounded grading passed 92% of responses. Human prior readings are necessary to bring product context, domain knowledge, and (if interview recordings are available) tone and body language that never make it into the transcript. 

But prior readings drift too. In this experiment, one question asked about a participant's preferred way of communicating with AI. The proxy abstained, as the transcript does not directly address this. My prior reading, however, had noted that the participant copies and pastes document sections for LLM revision rather than submitting whole documents, which is a deliberate choice pointing to an opportunity to rethink AI-assisted editing workflows. The grader checking against my reading scored the proxy as failing to surface this, though the proxy was more literally accurate. One could call this over-strict; one could also call it the grader catching a case where the proxy was technically correct but missed a design-relevant signal. Either way, the prior-reading yardstick is useful but should not be used alone.

The two reference points are therefore complementary rather than redundant. A low score under transcript-grounded grading signals LLM-internal problems such as signal clarity or model consistency issues, yet a high score is not sufficient on its own: the proxy and the grader may have converged on a consistent but unhelpful reading, which is what prior-reading-grounded grading is designed to surface. Disagreement between the two is not a problem to resolve; it is information about which kind of issue is present.

---

## The hidden impact of harness choice

With the prior-reading graders, Harness 2 rescued 107 responses that Harness 1 had failed, while demoting only 8 it had passed. The 13:1 ratio suggests this is not random noise.

32 of the rescues involve proxy responses that led with a statement like "the participant raises no concern with X." As discussed above, whether such a response counts as a correct abstention or a non-abstention is genuinely ambiguous; even the same grader re-running the same item might land differently. But the asymmetry here goes beyond stochasticity: of 147 responses Harness 1 scored as non-abstained, 32 were rescued by Harness 2 (21.8%); of 449 it scored as correctly abstained, only 5 were demoted (1.1%). Harness 2 is systematically more willing to credit an abstention.

The remaining rescues follow a similar pattern: Harness 2 rounds partially correct retrieval up to fully correct (62 cases) and accepts inferences Harness 1 had judged as missing or wrong (11 cases). Across all three patterns, Harness 2 extends benefit-of-the-doubt; it almost never moves in the other direction.

In the transcript condition, the harness effect disappears entirely (p=0.93). But it does not follow that harness effects are absent in other configurations. For a different proxy, a different question set, or a different grader prompt, the direction and magnitude of any harness effect may differ. Unless you have tested your specific configuration, treat harness choice as a variable that needs to be controlled, not assumed away.

---

## What this means in practice

If you are a practitioner building LLM user proxies by feeding individual-level materials to an LLM and asking it to answer questions on a user's behalf, three suggestions follow from the findings above.

**First, triangulate user proxy responses with your own prior readings.** Go through at least a few interviews before running any proxy, note what evidence each question can and cannot be answered from, and freeze those readings before any proxy output is available. Do not re-annotate after seeing proxy responses. Both humans and LLMs have blind spots and tendencies to drift, often in different directions. Without comparison, you risk being misled by the LLM's interpretation without realizing it. The bonus is that the comparison may also reveal something about your own interpretive tendencies.

**Second, treat LLM outputs as harness-specific.** Any harness you did not build yourself or cannot fully replicate may contain configuration details that affect LLM behavior in ways that are not obvious. In this experiment, one harness was systematically more lenient than the other under prior-reading grounding,  demonstrating directional bias. Do not compare LLM outputs across different harnesses except in controlled experiments; the bias is difficult to detect and harder to attribute.

**Third, pay attention to signal clarity.** Some participant responses are genuinely ambiguous in transcript form, and an LLM working from text only will not always resolve the ambiguity consistently even with good model consistency. If your interviews are recorded, tone, hesitation, and body language carry information that text-based evaluation cannot replicate. Going back to the recording yourself is the check that no LLM configuration can substitute for.

---

## Appendix: A note on grader design

Proxy architectures and question types vary enough that presenting the grader prompts used in this experiment as a reusable template would be misleading. Instead, what follows is a note on the grader prompt design process.

Grader rubrics need to be calibrated iteratively against two things: proxy responses and grader judgments. Reading proxy responses reveals gaps in the grading instructions. In this experiment, a proxy could list borderline-relevant evidence and only admit at the end that it was insufficient to answer the question. In real use, this would mislead anyone reading quickly. Before the formal experiment, both the user proxy and the grading prompts were updated to require that abstentions lead with the acknowledgment of absence rather than follow a substantive-looking response.

Reading grader judgments reveals a different kind of problem. In this experiment, the grader was penalizing proxy responses that cited transcript content not captured in my prior readings, treating the gap as hallucination. The grader prompt was updated to provide context on how the proxy works: content absent from the prior readings is not necessarily absent from the transcript. After this calibration, the grader no longer treated such citations as hallucinations in the formal experiment.

Neither adjustment would have been possible without inspecting the grader's reasoning together with its verdicts. Budget time for this kind of calibration before running your formal experiment and drawing conclusions from the results.
