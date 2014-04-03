<script id="example" type="text/javascript">
var d = new oui.dialog();
d.attach(oui.$('#dialog'), {
    'children': [
        {'hbox': {
            'children': [
                {'html:span': {'#html': 'cell #1'}},
                {'html:span': {'#html': 'cell #2'}},
                {'html:span': {'#html': 'cell #3'}}
            ]
        }}
    ]
});
</script>
<script id="def">
var args = {
    
}
</script>
