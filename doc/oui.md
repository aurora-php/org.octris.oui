OUI XML -- Octris UI XML Dialog definitions
===========================================

Containers vs. Tiles
--------------------

*   containers may be nested
*   tiles have to be placed in containers
*   it's forbidden to nest tiles
*   it's forbidden to place a container inside a tile

UI container
------------

*   an UI container has to be placed in a tile
*   UI containers may be nested
*   it's forbidden to place a container or a tile in an UI container

Oui XML
-------

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
