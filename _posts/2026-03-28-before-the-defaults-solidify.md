---
title: "Before the Defaults Solidify: Mapping the Future of UX Research"
description: "AI will not make UX research irrelevant. It may dissolve the boundaries around who does it, where it happens, and what counts as evidence."
date: 2026-03-28
---

UX research as a profession is under threat. Most practitioners know this, but fewer people are willing to say out loud that the threat is not that users no longer matter; it is that the way we have defined "doing research" is increasingly hard to defend.

Most of what passes for innovation in UXR today is faster execution of the same old methods, such as AI-assisted note-taking and automated synthesis. But I don't think this has to be a historical moment wasted. Nobody asks whether coding is still relevant; developers have not disappeared, while the ability to build things spread. The same transformation is available to UX research. Not the disappearance of the practice, but the dissolution of its boundaries: who does it, when it happens, what form it takes, and what it is allowed to influence. If anything, research becomes more essential when more people are building things, as someone has to keep asking whether we are building in the right direction.

The tools to make this possible already exist. What is missing is the imagination to use them for something genuinely new. 

---

## The distinction I want to draw is not about tools, but assumptions

Traditional UXR, however well-intentioned, was structured around a fundamental separation: researchers step outside the product, recruit participants, create controlled conditions, collect data, and bring findings back in. This separation introduced artificiality, compliance problems, and a chronic lag between insight and action, but we accepted these costs because we had no alternative.

LLMs make the separation itself optional. Consider the diary study: a method beloved for its ability to capture lived experience, and notorious for its compliance problem: participants forget; they summarize instead of describe; they drop out. What if the research happened inside the LLM chat the user was already in? Not a separate app, not a reminder to "log your experience," but a conversation that was already happening, now also listening.

The failure mode to watch for, which is already happening, is mistaking novelty for imagination. Synthetic participants are a useful example. Using AI models to stand in for users sounds radical, until you notice that the underlying framework is identical: recruit participants, conduct interviews, extract findings. We have just replaced humans with models.

The cost of that substitution is not minor. User interviews are irreplaceable precisely because they surface what we don't know we don't know: the unexpected reaction, the mental model we never thought to ask about, the friction that does not show up in any existing dataset. A model trained on aggregate human behavior can only predict within the boundaries of what is already known. Interviewing it does not reduce your risk of building in the wrong direction. It just gives you the feeling that you have done your research.

There is genuine value in the cognitive science of building such models. The process of asking "what is a mental model, and how should it shape a product" is worth pursuing seriously. But wrapping a RAG pipeline in an interview interface and calling it UX research is merely LLM FOMO dressed up as methodology. Genuine reimagination requires questioning the framework, not just the cast.

---

## A map of what is worth questioning

The eleven areas below are not independent problems. They form a cycle: how research happens, how what it produces stays alive and keeps generating value, and where the boundaries of the practice are expanding. Running through all of them is a single meta-question about evidence: what we can trust, and what justifies action.

### How research happens

**New Research Modalities**

The qual/quant binary is dissolving. AI-conducted interviews can operate at scale without sacrificing depth, but they are not simply "large-scale qualitative research," and treating them as such glosses over real differences between human and AI interviewers. Synthetic participants will become more common too, but their epistemic status needs to be clearly defined: not substitutes for real users, but a different kind of tool with specific uses and hard limits. More modalities are coming. The interesting question is not which ones are valid, but what each one is actually capable of revealing.

**LLM as Research Instrument**

Beyond new methods, there is a more fundamental shift in where research happens, which no longer require users to step outside their lives to participate. A few directions are already visible: observing how users naturally unfold their thinking inside LLM interactions, particularly relevant for AI products themselves; meeting users inside existing habits to solve chronic compliance problems, like a diary study that happens in a conversation the user was already having; and generating interactive stimuli that let users react to concrete, explorable prototypes instead of abstract concepts they struggle to imagine. Of course, these are not the only possibilities.  

**Research Efficiency and Existing Data Mining**

Access has always been a limiting factor. Recruiting representative participants is slow, expensive, and competitive. Meanwhile, enormous volumes of user-generated content sit largely unmined: support conversations, community forums, product reviews. These are not a replacement for primary research, yet a way to spend primary research where it is irreplaceable, on the questions that cannot be answered any other way.

**Longitudinal and Continuous Research**

Most research is still project-shaped: a defined study, a report, a handoff. But when research is embedded in products, data accumulates continuously rather than arriving in batches. This requires a fundamentally different operating model. Less like a consulting engagement, more like a living system that continuously integrates new signals, surfaces relevant changes, and flags when evidence has accumulated enough to justify revisiting a decision (if you happen to be a developer, think CI/CD). The hard problem is not technical, but knowing which signals matter, how to weigh them, and when enough is enough.

---

### How knowledge stays alive

**Knowledge Structuring and Management**

Research produces tribal knowledge: insights that live in documents, slide decks, and researchers' heads, and slowly become inaccessible. Structuring that knowledge is not just an organizational problem. It requires thinking about how each piece of knowledge will be used: as a direct constraint on system behavior (think cursor rules or system prompt guardrails), as a shared semantic vocabulary that keeps product decisions consistent, or as the rationale that explains why something was built a certain way. Crucially, every piece of knowledge needs an explicit account of what it affects, so that when new insights arrive, the impact is traceable rather than guessed at.

**Knowledge Communication and Human Consumption**

As research knowledge becomes structured enough to directly feed into vibe coding workflows, humans still need to understand insights. Today's static reports and slide decks are passive formats that deliver a fixed rendering regardless of what the reader actually needs to understand. A more powerful model would be insights stored in structured form, rendered dynamically based on the question being asked, surfacing as a journey map in one context, a set of design constraints in another, or a conversational exploration in a third. The destination is insight that assembles itself around the problem at hand.

**Knowledge Synthesis and Discovery**

Research value does not only exist in individual studies; it accumulates. As knowledge builds up across projects, methods, and time, there is an opportunity to surface connections that no human analyst would think to look for. The specific structure that enables this, whether embeddings, networks, or something else entirely, matters less than the underlying possibility: a large enough body of structured research knowledge will generate insights that were not explicitly put there.

---

### Where the boundaries are expanding

**UX Research for LLM Products**

AI products introduce research questions that existing frameworks were not built to answer. How do users form expectations of systems that behave non-deterministically? How does trust develop, or break, when the product's behavior is genuinely hard to predict? What does "usability" mean when the interface is a conversation? These questions will only become more pressing as AI products mature, and the field is still early in developing the vocabulary to ask them precisely.

**Agent-Facing Interface and Human Oversight**

GUI design assumes a human on the other side: someone with particular perceptual and cognitive constraints, forming intentions and acting on them. As agents become significant users of software systems, that assumption breaks. Designing interfaces for agents means rethinking what an interface is for. And because humans remain in the loop as supervisors, as ultimate decision-makers, as the people who set the goals, the design question becomes: at what points does human judgment need to be inserted, and how do you make that insertion effective rather than ceremonial?

**Research Democratization and Copilot for Research**

As vibe coding has made building accessible to people who are not professional developers, AI will make research accessible to people who are not professional researchers. This is not a threat to the practice, but an expansion of it. The people who build products will increasingly be the people who research them. What is needed is tooling that makes it possible to do research well without years of methodological training: a copilot for research that encodes rigor without requiring expertise. The risk to manage is not that too many people will do research. It is that ease of execution will be mistaken for quality of insight.

---

### The question running through all of it

**Research Validity and Epistemology**

Every area above carries a version of the same question: what can we actually trust? AI interviewers introduce new forms of response bias. Synthetic participants can only reflect what models already know. Mined UGC carries the biases of whoever chose to post. And even when the data is clean, the harder question remains: how strong does evidence need to be to justify action? Research findings have never automatically changed minds. Product teams have assumptions, timelines, and competing priorities. In an AI-assisted research world, where it becomes easier than ever to generate apparently rigorous findings, the discipline of asking "is this actually good enough evidence?" becomes more important, not less.

And this list is not complete. Some of these areas will turn out to be more interesting than they appear here; others may collapse into each other as the thinking matures. I expect to add to it, revise it, and sometimes be wrong about it. What I am more confident about is the underlying premise: the tools now exist to do something genuinely different with user research. The window for imagining what that looks like, before the defaults solidify and the lazy versions win, is open right now. I intend to work inside that window for a long time.

I will be writing about each of these areas in more depth, moving between observation and practice as I go. If any of this resonates, or if you think I have framed something incorrectly, I would like to hear from you.

*A note on influences: The UXR community has been actively grappling with what research looks like in the age of LLMs, and those conversations, in articles, threads, and discussions too numerous to trace, have inevitably shaped my thinking. Two pieces in particular encouraged me to write this down: Anthropic's work on the [Anthropic Interviewer](https://www.anthropic.com/research/anthropic-interviewer), and [Dr. C. Papas's framing of AI-moderated research as a new modality](https://www.thevoiceofuser.com/ai-unmoderated-research-is-a-modality-now-stop-arguing-about-what-to-call-it-it-doesnt-need-your-approval-it-needs-a-framework/) in its own right. I am grateful to everyone thinking seriously about these questions. The specific framing here is my own attempt to map the territory. I make no claim to having originated the problems, only to having my own perspective on them.*
