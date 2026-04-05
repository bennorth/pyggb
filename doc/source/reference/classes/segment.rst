Segment
=======

.. py:class:: Segment

   In the following constructors, additional keyword arguments can be
   provided to set properties of the new :py:class:`Segment`.

   .. py:method:: Segment(p1, p2)

      Construct the line segment from the point *p1* to the point
      *p2*.

   .. py:property:: length

      |getOnlyProp| The length of the Segment, i.e., the distance
      between the two points defining it.

   .. py:property:: latex
      :type: str

      |getOnlyProp| A string of LaTeX representing the current length
      of the segment, giving, e.g., :math:`12`.

   A :py:class:`Segment` also has the following common properties:

   * :py:attr:`is_visible`
   * :py:attr:`color`
   * :py:attr:`color_floats`
   * :py:attr:`line_style`
   * :py:attr:`line_thickness`
   * :py:attr:`label_visible`
   * :py:attr:`label_style`
   * :py:attr:`caption`


.. seealso::

   `GeoGebra Segment() reference
   <https://geogebra.github.io/docs/manual/en/commands/Segment/>`_
