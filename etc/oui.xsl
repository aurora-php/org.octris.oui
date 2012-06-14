<?xml version="1.0"?>
<!--
/**
 * Stylesheet for transforming oui xml ui definition files to javascript code.
 *
 * @octdoc      etc/oui
 * @copyright   copyright (c) 2012 by Harald Lapp
 * @author      Harald Lapp <harald@octris.org>
 */
/**/
-->

<!DOCTYPE xsl:stylesheet PUBLIC "Unofficial XSLT 1.0 DTD" "http://www.w3.org/1999/11/xslt10.dtd"> 

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:output method="text" indent="no"/>
    
    <xsl:template match="/oui">
        <xsl:text>
;(function() {
    // auto-generated using 'org.octris.oui/etc/oui.xsl'
    var dialogs = {};
        </xsl:text>
        
        <xsl:apply-templates select="modal|dialog" />
        
        <xsl:text>
})();
        </xsl:text>
    </xsl:template>
    
    <xsl:template match="modal|dialog">
        <xsl:text>
    dialogs['</xsl:text><xsl:value-of select="@id"/><xsl:text>'] = oui.proxy(function(container) {
        var dialog = new oui.</xsl:text><xsl:value-of select="name()" /><xsl:text>();
        dialog.attach(</xsl:text>
        <xsl:choose>
            <xsl:when test="name() = 'dialog'">
                <xsl:text>container</xsl:text>
            </xsl:when>
            <xsl:otherwise>
                <xsl:text>null</xsl:text>
            </xsl:otherwise>
        </xsl:choose>
        <xsl:text>, {
            'children': [</xsl:text>
            <xsl:apply-templates />
            <xsl:text>]
        });
    });
        </xsl:text>
    </xsl:template>

    <xsl:template match="button">
        <xsl:text>
                {'button': {
                    'label': '</xsl:text><xsl:value-of select="@label" /><xsl:text>'
                }}
        </xsl:text>
    </xsl:template>

    <xsl:template match="checkgroup">
        <xsl:text>
                {'checkgroup': {
                    'items': [</xsl:text>
                    <xsl:apply-templates select="checkbox" />
                    <xsl:text>]
                }}
        </xsl:text>
    </xsl:template>
    <xsl:template match="checkbox">
        <xsl:text>
                {
                    'label':
                }
        </xsl:text>
    </xsl:template>
</xsl:stylesheet>
