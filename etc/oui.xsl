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
                if (!('dialogs' in oui)) {
                    oui.dialogs = (function() {
                        var dialogs = {};

                        return {
                            'addDialog': function(name, fn) {
                                dialogs[name] = fn;
                            },
                            'getDialog': function(name, container) {
                                return (name in dialogs
                                        ? dialogs[name]
                                        : false);
                            }
                        };
                    })();
                }
        </xsl:text>
        
        <xsl:apply-templates select="modal|dialog" />
        
        <xsl:text>
            })();
        </xsl:text>
    </xsl:template>
    
    <xsl:template match="modal|dialog">
        <xsl:text>oui.dialogs.addDialog('</xsl:text>
        <xsl:value-of select="@id"/>
        <xsl:text>', oui.proxy(function(container) {
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
        <xsl:text>, {</xsl:text>
        <xsl:call-template name="children" />
        <xsl:text>
                });
            }));
        </xsl:text>
    </xsl:template>

    <xsl:template name="children">
        <xsl:text>
            'children': [</xsl:text>
            <xsl:for-each select="*">
                <xsl:apply-templates select="." />
                <xsl:if test="position() != last()">
                    <xsl:text>,</xsl:text>
                </xsl:if>
            </xsl:for-each>
        <xsl:text>]</xsl:text>
    </xsl:template>

    <xsl:template name="items">
        <xsl:text>
            'items': [</xsl:text>
            <xsl:for-each select="*">
                <xsl:apply-templates select="." />
                <xsl:if test="position() != last()">
                    <xsl:text>,</xsl:text>
                </xsl:if>
            </xsl:for-each>
        <xsl:text>]</xsl:text>
    </xsl:template>

    <!--
    /*
     * button
     */
    -->
    <xsl:template match="button">
        <xsl:text>
            {'button': {
                'label': '</xsl:text><xsl:value-of select="@label" /><xsl:text>'
            }}
        </xsl:text>
    </xsl:template>

    <xsl:template match="codemirror">
    </xsl:template>

    <!--
    /*
     * checkgroup
     */
    -->
    <xsl:template match="checkgroup">
        <xsl:text>
            {'checkgroup': {
        </xsl:text>
        <xsl:call-template name="items" />
        <xsl:text>
            }}
        </xsl:text>
    </xsl:template>
    <xsl:template match="checkbox">
        <xsl:text>
            {
                'name':  '</xsl:text><xsl:value-of select="@name" /><xsl:text>',
                'label': '</xsl:text><xsl:value-of select="@label" /><xsl:text>',
                'value': '</xsl:text><xsl:value-of select="@value" /><xsl:text>'
            }
        </xsl:text>
    </xsl:template>

    <!--
    /*
     * radiogroup
     */
    -->
    <xsl:template match="radiogroup">
        <xsl:text>
            {'radiogroup': {
                'name': '</xsl:text><xsl:value-of select="@name" /><xsl:text>',
        </xsl:text>
        <xsl:call-template name="items" />
        <xsl:text>
            }}
        </xsl:text>
    </xsl:template>
    <xsl:template match="radiobutton">
        <xsl:text>
            {
                'label': '</xsl:text><xsl:value-of select="@label" /><xsl:text>',
                'value': '</xsl:text><xsl:value-of select="@value" /><xsl:text>'
            }
        </xsl:text>
    </xsl:template>

    <!--
    /*
     * textline
     */
    -->
    <xsl:template match="textline">
        <xsl:text>
            {'textline': {
                'name':  '</xsl:text><xsl:value-of select="@name" /><xsl:text>',
                'value': '</xsl:text><xsl:value-of select="@value" /><xsl:text>'
            }}
        </xsl:text>
    </xsl:template>
</xsl:stylesheet>
