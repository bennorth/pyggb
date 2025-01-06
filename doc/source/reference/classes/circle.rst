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

   .. py:property:: radius

      |getOnlyProp| The circle's radius, as a Python :py:type:`float`.

   .. py:property:: radius_number

      |getOnlyProp| The circle's radius, as a dynamic :py:class:`Number`.

   A :py:class:`Circle` also has the following common properties:

   * :py:attr:`is_visible`
   * :py:attr:`color`
   * :py:attr:`color_floats`
   * :py:attr:`line_thickness`
   * :py:attr:`opacity`


.. seealso::

   `GeoGebra Circle() reference
   <https://geogebra.github.io/docs/manual/en/commands/Circle/>`_
