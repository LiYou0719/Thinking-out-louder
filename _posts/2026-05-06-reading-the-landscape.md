---
title: "New Methods, Old Frameworks: The State of UX Research in the LLM Era"
date: 2026-05-06
---

> **TLDR:** Frontier labs have made real progress on new research modalities, interaction observatories, and agentic workflows. UXR tooling vendors are integrating LLM into UXR infrastructure, but largely within traditional research frameworks. The more interesting gap is epistemological: none of this work has seriously addressed what validity means for these new methods, or how to study the specific product ecologies where LLM is actually being deployed. That work falls to in-house researchers inside product organizations, and it is mostly still undone.

In an [earlier post](https://liyou0719.github.io/Thinking-out-louder/2026/03/28/before-the-defaults-solidify.html), I tried to map several emerging directions for UX research in the age of LLMs. It was meant to be a field map: sketch the territory and name the problems that felt increasingly hard to describe with existing research language.

Compared to a field map, a landscape asks a harder question: where are these things already taking shape, and where does the evidence remain thin? Some parts of the field map are no longer merely conceptual. There are now public examples from frontier LLM labs showing that new forms of human-LLM interaction research are already being practiced. This post is an attempt to read that landscape honestly: to understand what shape it has taken, and what that shape implies about where the genuinely unfinished work still lives.

---

## What Frontier Labs Are Already Doing

### New research modalities: when scale and depth stop being a tradeoff

The clearest example of a genuinely new research modality comes from Anthropic. [Anthropic Interviewer](https://www.anthropic.com/about-anthropic-interviewer) is a Claude-powered tool that conducts real-time conversational interviews at scale: it works from a researcher-defined interview guide, adapts follow-up questions based on each participant's responses, and synthesizes findings back to the research team. The methodology was put to its most visible test in a [study involving over 80,000 participants](https://www.anthropic.com/features/81k-interviews) across 159 countries and 70 languages. Anthropic describes it as bridging the typical tradeoff between depth and volume in qualitative research. The boundary between qualitative and quantitative research is being reorganized, not just stretched.

Synthetic users and simulation represent another direction. I plan to write about this in more depth separately, as it is a large enough topic. The short version: the interesting question is not whether LLM can generate plausible-sounding user responses, but whether simulation can be used to explore interaction dynamics in product ecologies that do not yet exist. 

### LLM as research instrument: interaction traces as a research substrate

Anthropic, OpenAI, and Google Research have all explored treating real-world interaction traces, rather than recruited participants or post-hoc self-reports, as a primary research substrate. 

[Anthropic's Clio](https://www.anthropic.com/research/clio) is bottom-up: it surfaces patterns analysts did not know to look for, using heuristic privacy protections to abstract away from individual conversations. [Google's Urania](https://research.google/blog/a-differentially-private-framework-for-gaining-insights-into-ai-chatbot-use/) takes this infrastructure question further, proposing formal differential privacy guarantees for the same kind of pipeline, which is a sign that how to make interaction traces trustworthy research data is itself an active area of inquiry. [OpenAI's usage study](https://openai.com/index/how-people-are-using-chatgpt/) takes the opposite direction: it applies pre-defined classification frameworks (developed from OpenAI's internal product analytics) to categorize behavior at scale and track how distributions evolve over time. The [OpenAI and MIT Media Lab affective use study](https://openai.com/index/affective-use-study/) adds yet another layer, combining large-scale trace analysis with a randomized controlled trial to isolate causal effects that observational data alone cannot establish.

What these approaches collectively demonstrate is that interaction traces are now a legitimate research substrate with its own epistemic properties. The disagreements about how to use them responsibly (heuristic vs. formal privacy, discovery vs. hypothesis-testing, observational vs. causal) are themselves methodologically productive. They suggest a field actively working out what it means to do rigorous research from this kind of data.

What none of them demonstrate is how this transfers to specific product contexts. Tools like [Langfuse](https://langfuse.com/) already give product teams observability into LLM conversations: traces, prompts, latency, feedback, cost. But observability is not yet research method. The gap between logging interaction data and generating research-grade insights from it remains wide.

### Agent-facing interface and human oversight: the organizational design problem

Cursor and Replit are not doing UX research explicitly, but their public writing about building with agents exposes something research teams need to understand.

[Cursor's experiments](https://cursor.com/blog/scaling-agents) with hundreds of concurrent coding agents began with a flat coordination model, where agents self-organized through shared files and locking mechanisms. This failed predictably: agents held locks too long, became risk-averse, avoided difficult tasks, and produced work that churned without progress. The solution was a planner/worker hierarchy that separates exploration from execution. [Replit's exploration](https://blog.replit.com/automated-self-testing) was different but structurally related: their Agent 3 was producing features that appear functional on first inspection but are not actually wired up. After ruling out several approaches, Replit landed on a verification subagent that catches the main agent cutting corners before the main task context moves on.

Both teams arrived at the same meta-solution: insert structure at the point where autonomous action becomes unreliable. The intervention was not more capable models or better prompts, but a deliberate decision about where human-like judgment needed to be inserted into the workflow.

"Agent-facing interface and human oversight" is not a UI problem. Studying where autonomous systems fail, and what kinds of structural interventions restore reliability, is itself a research program that requires methods capable of observing delegation in action. As Anthropic [moves into enterprise deployment](https://www.anthropic.com/news/enterprise-ai-services-company), they will accumulate cross-context comparative knowledge that no single organization can match. Yet, comparative breadth is different from situated depth. The organizations that most need to understand how delegation boundaries form, where accountability breaks down, and what kinds of human judgment resist automation are the ones living inside specific product ecologies.

---

## What Tooling Vendors Are Already Doing

The UXR tooling market's response to LLMs has been swift. Across vendors, three layers of integration are emerging.

The first layer is **LLM as workflow glue**: accelerating existing research operations without changing their structure. [UserTesting](https://help.usertesting.com/hc/en-us/articles/23429696486045-UserZoom-to-UserTesting-Quick-guide-to-maximize-your-experience#info5) has added sentiment analysis, friction detection, and AI-generated insight summaries. [User Interviews' MCP](https://www.userinterviews.com/mcp-integration) promises to spin up studies and recruit participants from Claude, ChatGPT or Cursor. In addition, [Rally's MCP integration](https://www.rallyuxr.com/changelog/april-2026) lets teams query panel health, surface qualified participants, and generate quarterly research reports without leaving their LLM tools. 

The second layer is **LLM as knowledge interface**: making accumulated research queryable across an organization. [Dovetail's MCP server](https://docs.dovetail.com/integrations/mcp-server) gives AI assistants read access to transcripts, insights, highlights, and projects, allowing teams to ask natural language questions across their entire research corpus. Its [Channels](https://docs.dovetail.com/help/channels) feature continuously classifies incoming feedback (support tickets, NPS responses, app store reviews) into themes in real time.

The third layer, and the most methodologically ambitious, is **LLM as research instrument**: changing how data is collected, not just processed. [Great Question's AI-moderated interviews](https://greatquestion.co/features/ai-moderated-interviews) claim "the reach of a survey with the depth of an interview," with adaptive probing and parallel async sessions. The framing echoes Anthropic Interviewer almost exactly. This is the closest the tooling market has come to genuine methodological reimagination.

Mapped against the directions I outlined in the [first post](https://liyou0719.github.io/Thinking-out-louder/2026/03/28/before-the-defaults-solidify.html), tooling vendors are making real moves toward **Research Efficiency**. Dovetail's cross-corpus querying is the clearest expression of **Knowledge Structuring and Management** becoming agent-operable. Rally's panel health visibility edges toward **Longitudinal and Continuous Research**, though it is still framed as operational efficiency rather than a sustained research methodology. These are the infrastructure of **Research Democratization**, allowing more people to do research faster with what already exists. But research is still organized into candidates, studies, screeners, interviews, surveys, transcripts, highlights, and insights. These are the same objects that have defined UXR platforms for a decade. What is notably absent is any serious engagement with the directions that require rethinking research from the ground up.

This is not a criticism of these vendors. Their efforts will determine which new methods can actually reach organizations that lack the resources to invent their own. But the tooling market is betting that the old epistemology of research, made faster and more accessible, will be enough.

---

## Where the Landscape Is Still Open: Research Validity and Epistemology

Reading the landscape across frontier labs and tooling vendors, the deepest gap is not methodological but epistemological. New modalities discussed in this post, such as large-scale adaptive interviewing and interaction observatories, have been built and deployed before anyone has seriously answered the validity questions underneath it. 

The gap is not merely abstract. Research Ops infrastructure like [Rally](https://www.rallyuxr.com/changelog/april-2026) is being built to solve operational problems like panel health and participant fatigue. When agents can initiate studies and reuse recruitment at scale, participant overuse, selection bias, context collapse, and governance leakage become systematic risks that compound with every automated research cycle. Research Ops is not just an efficiency problem in the LLM era. It is an epistemic guardrail, and right now it is being built as if it were only the former.

As HCI transitions to HAI research, the questions that most need answering are distributed across specific product ecologies. An in-house researcher at a legal tech company, a healthcare platform, or an enterprise software team would study how delegation boundaries form in their specific context: where accountability breaks down when agents act, what kinds of human judgment resist automation, how trust is built and lost over months of use. These are not smaller versions of the questions frontier labs ask, and the new research modalities that matter most are not yet fully invented. 

Two directions I find myself thinking about (though hardly the only ones worth pursuing) illustrate what this space might look like: The first is **artifact-delta analysis**, which studies the gap between what a model produces and what a human actually commits to. Microsoft Research's work on [follow-up behaviors in LLM-assisted writing](https://prototypical-hai-collaborations.github.io/) points in this direction, analyzing collaboration patterns across millions of Copilot sessions. This exploration can expand beyond writing: in legal review, in medical documentation, in engineering decisions, what users changed, accepted, and quietly discarded may be the most legible record of where human judgment still matters and why.

The second is **prospective ecosystem research**: methods for investigating product futures that users cannot yet fully imagine. This is not a new problem for design research, but LLMs make it more acute. Many UXR practitioners, myself included, are trying to figure out what their product even is, in a world where the boundaries between interface, agent, memory, and organizational workflow are still being drawn. Users cannot articulate what they want from a product ecology that does not yet exist, while existing UXR methods are most suited to a world where the research object is an interface.

Both of these require situated presence that no frontier lab or tooling vendor can provide from the outside. Reimagined UXR in the LLM era will need to be built iteratively, inside specific product ecologies, by researchers who are there for the long term. If you are working on building situated research practice inside a product team, thinking about how to study delegation and accountability in LLM-mediated workflows, or simply trying to name what is happening in your organization before the defaults solidify, I would love to hear from you.
