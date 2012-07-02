<script id="example" type="text/javascript">
var d = new oui.dialog();
d.attach(oui.$('#dialog'), {
    'children': [
        {'checkgroup': {
             'items': [
                {
                    'label': 'Item #1',
                    'name':  'item1',
                    'value': 1
                },
                {
                    'label': 'Item #2',
                    'name':  'item2',
                    'value': 2
                }
             ]
        }}
    ]
});
</script>
