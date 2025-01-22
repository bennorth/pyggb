Polygon
=======

.. py:class:: Polygon

   In the following constructors, additional keyword arguments can be
   provided to set properties of the new :py:class:`Polygon`.

   .. py:method:: Polygon(points)
      :no-index:

      Construct the Polygon whose vertices are at the given *points*,
      which should be an iterable of :py:class:`Point` instances.

   .. py:method:: Polygon(p1, p2, n_sides)
      :no-index:

      Construct the regular Polygon which has *n_sides* sides, one of
      whose sides is the segment joining the points *p1* and *p2*, and
      such that the interior of the Polygon is on your left as you
      travel from *p1* to *p2*.

   .. py:property:: area

      |getOnlyProp| The area, in square units, of the Polygon.

   A :py:class:`Polygon` also has the following common properties:

   * :py:attr:`is_visible`
   * :py:attr:`color`
   * :py:attr:`color_floats`
   * :py:attr:`opacity`
   * :py:attr:`line_thickness`


.. seealso::

   `GeoGebra Polygon() reference
   <https://geogebra.github.io/docs/manual/en/commands/Polygon/>`_
