<script id="example" type="text/javascript">
oui.$(document).ready(function() {
    var node = oui.dom.create('div', {
        '#html': 'DIV TAG',
        'styles': {
            'border': '1px solid #ff0000'
        }
    })

    oui.$('#dialog').append(node);
});
</script>
