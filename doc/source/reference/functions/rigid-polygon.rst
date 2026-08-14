RigidPolygon function
=====================

.. py:function:: RigidPolygon(polygon)

   Construct and return a new polygon object (or a specialised object
   such as quadrilateral) congruent to the given `polygon`, but
   restricted so that only translation and rotation are possible.


.. py:function:: RigidPolygon(polygon, x_offset, y_offset)
   :noindex:

   As ``RigidPolygon(polygon)``, except that a translation of
   ``(x_offset, y_offset)`` is applied before returning the new
   polygon.


.. py:function:: RigidPolygon(points)
   :noindex:

   Construct and return a new polygon object (or a specialised object
   such as quadrilateral) with the given ``points`` (which should be
   an iterable of points) as vertices.  The given ``points`` are
   updated to ensure that only rigid movements (translation and
   rotation) of the returned polygon are possible.


.. seealso::

   `GeoGebra RigidPolygon() reference
   <https://geogebra.github.io/docs/manual/en/commands/RigidPolygon/>`_
