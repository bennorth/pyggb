Circle
======

.. py:class:: Circle

   In the following constructors, additional keyword arguments can be
   provided to set properties of the new :py:class:`Circle`.

   .. py:method:: Circle(x, y, r)

      Construct the circle whose centre is (*x*, *y*) and whose radius
      is *r*.

   .. py:method:: Circle(p, r)
      :noindex:

      Construct the circle whose centre is the point *p* and whose
      radius is *r*.

   .. py:method:: Circle(p1, p2)
      :noindex:

      Construct the circle whose centre is the point *p1* and which
      passes through the point *p2*.

   .. py:method:: Circle(p1, p2, p3)
      :noindex:

      Construct the circle which passes through the three points *p1*,
      *p2*, and *p3*.

   .. py:property:: center

      |getOnlyProp| The circle's centre, as a wrapped GeoGebra
      :py:class:`Point`.

   .. py:property:: radius

      |getOnlyProp| The circle's radius, as a Python :py:type:`float`.

   .. py:property:: radius_number

      |getOnlyProp| The circle's radius, as a dynamic :py:class:`Number`.

   .. py:property:: latex
      :type: str

      |getOnlyProp| A string of LaTeX representing the current
      equation of the circle, giving, e.g., :math:`(x - 1)^{2} + (y -
      2)^{2} = 9`.

   A :py:class:`Circle` also has the following common properties:

   * :py:attr:`is_visible`
   * :py:attr:`color`
   * :py:attr:`color_floats`
   * :py:attr:`line_thickness`
   * :py:attr:`line_style`
   * :py:attr:`opacity`
   * :py:attr:`label_visible`
   * :py:attr:`label_style`
   * :py:attr:`caption`


.. seealso::

   `GeoGebra Circle() reference
   <https://geogebra.github.io/docs/manual/en/commands/Circle/>`_
