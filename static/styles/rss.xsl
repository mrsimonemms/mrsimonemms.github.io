<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:variable name="title" select="/rss/channel/title"/>

  <xsl:template match="/">
    <html>
      <head>
        <title>
          <xsl:value-of select="$title" /> RSS Feed
        </title>
        <meta charset="UTF-8" />
        <meta http-equiv="x-ua-compatible" content="IE=edge,chrome=1" />
        <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1,shrink-to-fit=no" />
      </head>
      <body>
        <xsl:apply-templates select="rss/channel"/>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="channel">
    <header>
      <h1>RSS Feed</h1>
      <h2>
        <xsl:value-of select="$title" /> RSS Feed
      </h2>
      <p>
        <xsl:value-of select="/rss/channel/description"/>
      </p>
      <a hreflang="en" target="_blank">
        <xsl:attribute name="href">
          <xsl:value-of select="/rss/channel/link"/>
        </xsl:attribute>
        Visit Website &#x2192;
      </a>
    </header>

    <main>
      <h2>Recent Posts</h2>
      <xsl:apply-templates select="item"/>
    </main>
  </xsl:template>

  <xsl:template match="item">
	  <article>
      <h3>
        <a hreflang="en" target="_blank">
          <xsl:attribute name="href">
            <xsl:value-of select="link"/>
          </xsl:attribute>
          <xsl:value-of select="title"/>
        </a>
      </h3>
      <div class="category">
        Categories:
        <xsl:apply-templates select="category"/>
      </div>
      <footer>
        Published:
        <time>
          <xsl:value-of select="pubDate" />
        </time>
      </footer>
    </article>
	</xsl:template>

  <xsl:template match="category">
    <xsl:value-of select="." />
    <xsl:if test="position() != last()">, </xsl:if>
  </xsl:template>

</xsl:stylesheet>
