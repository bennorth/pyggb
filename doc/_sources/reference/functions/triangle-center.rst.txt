TriangleCenter function
=======================

.. py:function:: TriangleCenter(point1, point2, point3, center-kind)

   Construct a new (non-independent) GeoGebra :py:class:`Point` at the
   "center" of the triangle formed by the three given points.  A
   triangle has many kinds of "center".  The last argument should be
   one of the following strings, to specify which one is required:

   * ``incenter``
   * ``centroid``
   * ``circumcenter``
   * ``orthocenter``
   * ``nine-point-center``
   * ``symmedian-point``
   * ``gergonne-point``
   * ``nagel-point``
   * ``first-isogonic-center``


.. seealso::

   `GeoGebra TriangleCenter() reference
   <https://geogebra.github.io/docs/manual/en/commands/TriangleCenter/>`_,
   although note that in nativeGeoGebra, the center-kind is specified
   by number rather than string.
