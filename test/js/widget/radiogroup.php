<script id="example" type="text/javascript">
var d = new oui.dialog();
d.attach(oui.$('#dialog'), {
    'children': [
        {'radiogroup': {
             'name':  'radio',
             'items': [
                {
                    'label': 'Item #1',
                    'value': 1
                },
                {
                    'label': 'Item #2',
                    'value': 2
                }
             ]
        }}
    ]
});
</script>
