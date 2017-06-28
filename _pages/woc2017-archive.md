---
layout: archive
permalink: /woc2017/articles/
title: "WOC 2017 Articles"
author_profile: false
excerpt: "Reports from WOC 2017 <br> in Estonia"
header:
  overlay_image: gg-woc2015.jpg
  caption: "Graham Gristwood at WOC 2015 in Scotland"
  overlay_filter: 0.5
---
{% include group-by-array collection=site.posts field="categories" %}
<h2 id="{{ category | slugify }}" class="archive__subtitle">{{ "WOC-2017" }}</h2>
{% for post in site.categories.WOC-2017 %}
  {% include archive-single.html %}
{% endfor %}
