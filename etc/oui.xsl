<?xml version="1.0"?>

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
    dialogs['</xsl:text><xsl:value-of select="@id"/><xsl:text>'] = oui.proxy(function() {
        var dialog = new oui.</xsl:text><xsl:value-of select="node()" /><xsl:text>();
        dialog.attach(container, {
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
</xsl:stylesheet>
