ZoomIn function
===============

.. py:function:: ZoomIn()

   Reset the construction viewport to its default settings.

.. py:function:: ZoomIn(k)
   :noindex:

   Zoom the viewport by the given factor *k* about the origin, where
   *k > 1* indicates zooming in and *k < 1* (including negative *k*?)
   indicates zooming out.

.. py:function:: ZoomIn(k, p)
   :noindex:

   Zoom the viewport by the given factor *k* about the given point
   *p*.

.. py:function:: ZoomIn(k, coords)
   :noindex:

   Zoom the viewport by the given factor *k* about the point whose
   coordinates are *coords[0]* and *coords[1]* — for this to be valid,
   *coords* must be a two-element list or tuple both of whose elements
   are numbers.

.. py:function:: ZoomIn(min_x, min_y, max_x, max_y)
   :noindex:

   Zoom the viewport such that it covers the rectangle whose
   bottom-left corner is the point (*min_x*, *min_y*) and whose
   top-right corner is the point (*max_x*, *max_y*).  Do nothing if
   *min_x > max_x* or *min_y > max_y*.

.. seealso::

   `GeoGebra ZoomIn() reference
   <https://geogebra.github.io/docs/manual/en/commands/ZoomIn/>`_
