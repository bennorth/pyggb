Ellipse
=======

.. py:class:: Ellipse

   In the following constructors, additional keyword arguments can be
   provided to set properties of the new :py:class:`Ellipse`.

   .. py:method:: Ellipse(f1, f2, a)

      Construct the ellipse whose two foci are the points *f1* and *f2*,
      and whose semimajor axis length is *a*.

   .. py:method:: Ellipse(f1, f2, s)

      Construct the ellipse whose two foci are the points *f1* and
      *f2*, and whose semimajor axis length is the length of the
      Segment *s*.

   .. py:method:: Ellipse(f1, f2, p)

      Construct the ellipse whose two foci are the points *f1* and
      *f2*, and which passes through the point *p*.

   An :py:class:`Ellipse` has the following common properties:

   * :py:attr:`is_visible`
   * :py:attr:`color`
   * :py:attr:`color_floats`
   * :py:attr:`opacity`
   * :py:attr:`line_thickness`


.. seealso::

   `GeoGebra Ellipse() reference
   <https://geogebra.github.io/docs/manual/en/commands/Ellipse/>`_
