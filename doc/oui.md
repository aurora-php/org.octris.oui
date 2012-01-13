OUI XML -- Octris UI XML Dialog definitions
===========================================

    <oui id="dialog">
        <include src="..." />                                       <!-- include sub-xml -->

        <modal id="modal1">                                         <!-- use ltk.proxy to open this modal dialog -->
            ...
        </modal>

        <dialog>
            <script type="text/javascript" src="..."></script>
            <script type="text/javascript">
            ...
            </script>
            <button label="test" onclick="#modal1" />               <!-- open modal dialog -->
            <button label="test" onclick="function() {...}" />      <!-- javascript -->
        </dialog>
    </oui>
