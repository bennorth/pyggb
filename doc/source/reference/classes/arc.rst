Arc
===

.. py:class:: Arc

   In the following constructors, additional keyword arguments can be
   provided to set properties of the new :py:class:`Arc`.

   .. py:method:: Arc(e1, p1, p2)

      Construct the arc which is part of the ellipse *e1* (which can
      be a circle), and whose starting point is given by the
      intersection of *e1* with the line through the centre of *e1*
      and *p1*, and whose ending point is given similarly using *p2*.

   .. py:method:: Arc(e1, th1, th2)
      :noindex:

      Construct the arc which is part of the ellipse *e1* (which can
      be a circle), and whose starting point is given by the angle
      *th1* and whose ending point is given by the angle *th2*.

   An :py:class:`Arc` has the following common properties:

   * :py:attr:`is_visible`
   * :py:attr:`color`
   * :py:attr:`color_floats`
   * :py:attr:`opacity`
   * :py:attr:`line_thickness`
   * :py:attr:`line_style`


.. seealso::

   `GeoGebra Arc() reference
   <https://geogebra.github.io/docs/manual/en/commands/Arc/>`_
