---
layout: default
---

<section class="home-intro">
  <p class="home-intro__eyebrow">Independent writing by Guanjie Li</p>
  <h1>Thinking Out Louder</h1>
  <p class="home-intro__lede">Notes on minds, machines, and the users between them: How AI is changing UX research, evidence, and product decisions.</p>
</section>

<section class="writing-index" aria-labelledby="latest-writing">
<div class="section-heading">
  <h2 id="latest-writing">Latest writing</h2>
  <span>{{ site.posts | size }} essays</span>
</div>

<ol class="post-list">
{% for post in site.posts %}
  {% assign post_words = post.content | number_of_words %}
  {% assign post_minutes = post_words | divided_by: 220 | plus: 1 %}
  {% assign post_summary_source = post.content | markdownify | strip_html | normalize_whitespace | replace_first: 'TLDR:', '' | replace_first: 'TLDR', '' | strip %}
  {% assign post_summary_parts = post_summary_source | split: '. ' %}
  {% assign post_fallback = post_summary_parts | first | append: '.' | replace: '?.', '?' | replace: '!.', '!' %}
  {% assign post_summary = post.description | default: post_fallback %}
  <li class="post-list__item">
    <a href="{{ post.url | relative_url }}">
      <span class="post-list__meta">{{ post.date | date: "%b %-d, %Y" }} · {{ post_minutes }} min</span>
      <span class="post-list__title">{{ post.title }}</span>
      <span class="post-list__description">{{ post_summary }}</span>
    </a>
  </li>
{% endfor %}
</ol>
</section>
