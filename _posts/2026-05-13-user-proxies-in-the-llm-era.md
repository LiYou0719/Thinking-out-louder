---
layout: post
title: "The Right Way to Build User Proxies with LLM"
date: 2026-05-13
---

> **TLDR**: AI personas remain active despite substantial criticism and consistent failure in supporting product decisions. This indicates genuine, unmet research needs. Indirect representation of users has a longer history than the current debate suggests. Its value is not prediction accuracy, but traceable, bounded inferences. To be useful, LLM-powered user proxies should be built on real individuals' data, and be honest about where the evidence ends and where the analogical jump begins. It is worth investing in when product launch costs are high, failure consequences are asymmetric, or the research question is genuinely prospective.

The criticism of AI personas is already well-sourced. It spans controlled experiments, large-scale empirical reviews, HCI scholarship, and practitioner analysis, and it covers multiple failure modes from multiple angles (see Table 1).

Despite the substantial criticism, this space is still active because of genuine, unmet research needs. In a [previous blog post](https://liyou0719.github.io/blog/2026/05/06/reading-the-landscape.html), I named prospective research as one example of such needs: users cannot meaningfully answer questions about experiences that have no current referent.

This post is not to relitigate the case against AI personas, which is well-made and I largely agree with it. The most comprehensive empirical synthesis to date (a [systematic review](https://storage.ghost.io/c/13/75/1375db81-cd4e-4555-bb92-4438a626256b/content/files/2026/03/synthetic_participants_generated_by_large_language_models_a_systematic_literature_review.pdf) of 182 papers) flags that the prospect of augmentative approaches incorporating real human data are "significant for solving several key issues." This post is an attempt to take that direction seriously, asking whether there is a rigorous way to build LLM-based user proxies that genuinely serve research rather than replacing it.

| Source | Description | Core conclusion |
|---|---|---|
| [Kuric et al. (2026)](https://storage.ghost.io/c/13/75/1375db81-cd4e-4555-bb92-4438a626256b/content/files/2026/03/synthetic_participants_generated_by_large_language_models_a_systematic_literature_review.pdf) | Literature review of 182 papers | LLM-generated synthetic participants are heuristic-like tools, their distortions are mechanistically inextricable |
| [NNGroup (2024)](https://www.nngroup.com/articles/synthetic-users/) | Industry institution evaluation | Hands-on evaluation found synthetic users systematically unreliable for findings that require real lived experience, including concept testing |
| [IDEO (2025)](https://www.ideo.com/journal/the-case-against-ai-generated-users) | Industry institution case report | In practice, weeks of LLM-simulated user interviews proved too generic to inform design |
| [MeasuringU (2026)](https://measuringu.com/review-of-experiments-with-synthetic-users/) | Literature review by industry institution | Across 12 replication experiments, LLMs show inconsistent alignment with human data, making their outputs unreliable without prior validation |
| [Russell (2025), ACM Interactions](https://interactions.acm.org/blog/view/the-challenges-of-synthetic-users-in-ux-research) | HCI expert opinion piece | Synthetic users are an incomplete substitute for real users in consequential UX research decisions |
| [Papangelis (2025), ACM Interactions](https://interactions.acm.org/blog/view/the-synthetic-persona-fallacy-how-ai-generated-research-undermines-ux-research) | HCI expert opinion piece | Synthetic personas are deliberately misrepresented tools; economic incentives align vendors and product teams against research rigor |
| [Papas (2025)](https://www.thevoiceofuser.com/synthetic-personas-stochastic-theater-why-llm-outputs-arent-qualitative-insight/) | UXR practitioner opinion piece | Synthetic personas are statistical pattern-matching dressed in the language of psychology to exploit organizations that cannot tell the difference |
| [Hu & Collier (2024)](https://arxiv.org/abs/2402.10811) | Academic quantitative evaluation | On subjective tasks, persona variables explain <10% variance, setting a low ceiling for what prompt-based personas can achieve |

*Table 1: Existing discussion on AI personas*

---

## User proxies are nothing new

Abstracted representation of users existed long before UX research became a professional function. [Fitts' Law](https://www.lri.fr/~mbl/ENS/FONDIHM/2013/papers/Fitts-JEP54.pdf), introduced in 1954, was a well-known formal model of human movement, which still informs interface decisions today: it is why buttons need sufficient target size, and why frequently used controls are placed within easy reach. In 1983, the [GOMS model](https://www.taylorfrancis.com/books/mono/10.1201/9780203736166/psychology-human-computer-interaction-stuart-card) (Goals, Operators, Methods, and Selection rules) pushed this logic further by representing skilled interactions as procedural tasks with stable goal structures. A decade later, it proved precise enough to identify a performance difference at NYNEX that translated into roughly [$2 million in annual operating cost](https://www.lri.fr/~mbl/ENS/FundHCI/2013/papers/Gray-HCI93.pdf). 

The history of Fitts’ Law and GOMS gives us a more precise way to talk about user proxies: not as fake users, but as bounded representations that help product teams reason about users beyond direct observation. After GOMS, this family of proxies diversified. Some remained formal, predictive, and computational, from [ACT-R](https://www.taylorfrancis.com/books/edit/10.4324/9781315806938/rules-mind-john-anderson) to [computationally rational models of interaction](https://dl.acm.org/doi/10.1145/3491102.3517739?utm_source=chatgpt.com). Others became familiar artifacts for UXRs and product teams: scenarios, personas, journey maps, use cases, and workflow models. Still others took the form of empirical traces, such as analytics, logs, support tickets, user reviews, and community data. 

What unites them as a category is not their form but their function: each is a stand-in for the user, useful precisely because it makes a specific, checkable claim about user behavior. The legitimacy of all user proxies rests on the same discipline: they can only inform decisions within the slice of user behavior they are built to represent. [Carroll (1997)](https://www.researchgate.net/publication/5287803_Human-computer_interaction_Psychology_as_a_science_of_design) observed that GOMS never became "a comprehensive paradigm for scientifically grounded HCI design", and that is the point: no user proxy should be. Boundedness is not a limitation to overcome; it is the source of accountability.

---

## The fundamental split

In the LLM era, the cost of making a user proxy has collapsed. You no longer need years of cognitive modeling expertise to produce something that “responds like a user.” (see Table 2) That reduction in friction is genuinely useful and genuinely dangerous. The important split is not whether a proxy is synthetic, but what kind of claim it is allowed to make.  

### Prompt-based persona inference

The [Anthropic PSM paper](https://alignment.anthropic.com/2026/psm/) makes it unsurprising that prompting or post-training can elicit particular LLM behavioral patterns. Indeed, LLM behavioral patterns are even steerable: In [game-theoretic tasks](https://arxiv.org/abs/2603.21398), activation steering can systematically shift LLM's strategic choices and verbal justifications. Behavior distributions are not useless; they are highly suitable for [engineering purposes](https://arxiv.org/pdf/2501.04410) where interpretive authority is not required (data augmentation, stress testing, [recommender system evaluation](https://arxiv.org/abs/2506.04551), etc). 

But that suitability does not transfer to UX research contexts. [Deepsona](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5805805), for example, achieved distributional match with USDA consumer datasets at the level of directional effects, segment-level heterogeneity, and relative magnitudes. Meanwhile, it does not establish that the generated segments are real market segments, or that their explanations carry the interpretive authority of research with situated users. Consider what [Hu et al.](https://arxiv.org/abs/2402.10811) quantified: even real human persona variables explain less than 10% of variance on subjective judgment tasks. How could AI personas offer more interpretive authority than that? 

No wonder that both [NNGroup](https://www.nngroup.com/articles/synthetic-users/) and [IDEO](https://www.ideo.com/journal/the-case-against-ai-generated-users) reached the same conclusion after testing 'AI interviews' in practice: the outputs were too detached from real user behavior to support product decisions. They are optimistic where real users are ambivalent, and generic where real users are specific.  

### Grounded LLMs as hypothesis tools

On the other hand, [PersonaCite](https://arxiv.org/abs/2601.22288) and Park et al.‘s [generative agents](https://arxiv.org/abs/2411.10109) ground LLM-based user proxies in real individuals' data. Both constrain outputs to what that data supports, and achieve some form of claim check (see Table 2). What makes these approaches different from prompt-based persona inference is that their outputs are traceable to specific data, which means their limits are visible too.

What does that look like in your UXR practice? Let's say you, an in-house UX researcher or a product lead, want to understand how users would respond to a fully autonomous agent making consequential decisions. An honest LLM-powered user proxy based on your VoC data can draw an inference from how users respond when an AI tool makes a mistake. It should also flag that this inference requires an explicit analogy claim: that users' trust mechanisms for autonomous decisions are structurally similar to their error-response mechanisms for AI tools. This assumption should be contested, and it is crucial to make that epistemic jump visible, so it can be examined rather than silently embedded in a confident-sounding output.

| Work / Product | Approach | Validation | Use cases |
|---|---|---|---|
| Previous version of Synthetic User | Prompt-based persona inference | Comparable to asking ChatGPT directly ([NNGroup](https://www.nngroup.com/articles/synthetic-users/)) | Brainstorming and generating candidate research questions |
| [Deepsona](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5805805), [Synthetic Users](https://www.syntheticusers.com/science-posts/synthetic-users-system-architecture-the-simplified-version) | Prompt-based persona inference incorporating census distributions and psychopometric literature | Deepsona's self evaluation against USDA consumer study | Purposes requiring distribution match only; not suitable for situated individual judgment |
| [GWI Agent Spark](https://www.gwi.com/blog/synthetic-personas) | Claimed to trace back to annual real-consumer surveys; retrieval architecture not disclosed | Internal claims of representativeness via weighted panel methodology | Mechanism undisclosed; use case validity unclear |
| [Ditto](https://6seedsconsulting.com/services/research) | Claimed to be calibrated against demographic, behavioral, and category data; underlying architecture not disclosed | Claims of ongoing internal validation against unspecified real-world benchmarks | Mechanism undisclosed; use case validity unclear |
| [PersonaCite (2026)](https://arxiv.org/abs/2601.22288) | VoC data (social media / customer feedback) retrieved via RAG at inference time | Preliminary expert consultations; larger validation study pending | Early-stage triage of design directions before investing in formal user research |
| [Park et al. (2024)](https://arxiv.org/abs/2411.10109) | Individual-level life history interviews injected into LLM prompt at inference time | 85% accuracy matching participants' own 2-week retest consistency | Measurement refinement, experimental design pilot testing |

*Table 2: Comparing LLM-based user proxy approaches*

---

## Where the boundaries are

Making the epistemic jump visible is only useful if you take the boundaries seriously. Three boundaries matter.

The first is coverage. The more transparent a user proxy is about the limits of its evidence, the fewer questions it can answer. High accuracy holds only within the domain covered by the grounding data, which returns us to [Jie Li's formulation](https://interactions.acm.org/archive/view/may-june-2024/how-far-can-we-go-with-synthetic-user-experience-research), now with a mechanism underneath it: AI interpolates, humans extrapolate. Every inference that crosses into new territory requires an explicit analogy claim, not a data-supported conclusion. The value of grounded user proxies is precisely this traceability.

The second is validation. A grounded user proxy without validation produces confident-sounding outputs, not trustworthy hypotheses. The existing research that achieves meaningful validation shares a common dependency: observable ground truth. The [GOMS-based prediction at NYNEX](https://www.lri.fr/~mbl/ENS/FundHCI/2013/papers/Gray-HCI93.pdf) was verified by a four-month field trial; [Park et al.](https://arxiv.org/abs/2411.10109) checked agent inferences against participants' own responses two weeks later. In both cases, there is a real-world outcome you can compare the user proxy's output against. For many product research questions, and especially for prospective ones, that condition doesn't hold. Whether your scenario has any path to validation at all is a prerequisite question, not a technical detail to sort out later.

The third boundary is different in kind, and [Roberts et al.](https://doi.org/10.1016/j.cpa.2024.102722) make the argument through Habermas's framework of communicative rationality. The voices most valuable to qualitative research are often the ones suppressed by power relations: perspectives that have never entered public discourse, institutional records, or the text that training data is built from. The gap exists before data collection, and no amount of grounding addresses this structural problem. 

---

## Is it worth the efforts?

The argument so far has been largely about limits, because the existing discourse has undersold them, and getting the limits right is a prerequisite for using the approach well. But limits are not the same as uselessness. Three situations define where LLM-powered user proxies offer something that wasn't previously available.

The first is high launch cost. If building and shipping requires substantial engineering commitment before you can observe any real user response, LLM-powered user proxies can help eliminate clearly wrong directions and save cost before that commitment is made by surfacing directions that your existing research data already argues against.

The second is asymmetric failure consequences. In healthcare, finance, or any high-compliance context where a wrong design decision damages user trust or creates ethical exposure, "launch and learn" is not an acceptable epistemology. In these contexts, any tool that provides traceable, bounded information before launch has value, even if that information comes with explicit uncertainty and analogical gaps attached.

The third is genuine prospectivity. Some questions cannot be answered by launching a beta, because the experience you are designing for doesn't exist yet and users have no basis for responding to it meaningfully. This is precisely the scenario where validation in the traditional sense is unavailable, and where the visibility of analogical gaps becomes even more important. LLM-powered user proxies don't resolve the prospective research problem, but they provide a structured way to generate labeled hypotheses about a possibility space, with visible evidence bases and visible gaps, before any real signal is available.

If your situation fits one or more of these, the practice path is as follows: Start with the interview or VoC data you already have, and map which problem domains that data actually covers. Generate inferences explicitly labeled by type: what is data-supported, and what is an analogical jump. Then calibrate with a small round of real research targeted specifically at the inferences you are least confident in. A product team may not have enough resources to validate everything, so try to establish a reliability bound for the domain you are acting on.

This is not a cheap path. It requires existing research of real quality, honest bookkeeping about where the data runs out, and a willingness to run real research to check the most consequential inferences. It is a way to make better use of research you already have, not to avoid doing more. What it offers in return is not answers, but more informed decision-making in situations where answers are not available. And there is a category of research it cannot touch at all, as Roberts et al. argue. That is why user proxies, however well-grounded, are not a substitute for qualitative research with real humans.
