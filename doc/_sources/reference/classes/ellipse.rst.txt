Ellipse
=======

.. py:class:: Ellipse

   In the following constructors, additional keyword arguments can be
   provided to set properties of the new :py:class:`Ellipse`.

   .. py:method:: Ellipse(f1, f2, a)

      Construct the ellipse whose two foci are the points *f1* and *f2*,
      and whose semimajor axis length is *a*.

   .. py:method:: Ellipse(f1, f2, s)
      :noindex:

      Construct the ellipse whose two foci are the points *f1* and
      *f2*, and whose semimajor axis length is the length of the
      Segment *s*.

   .. py:method:: Ellipse(f1, f2, p)
      :noindex:

      Construct the ellipse whose two foci are the points *f1* and
      *f2*, and which passes through the point *p*.

   .. py:property:: center

      |getOnlyProp| The ellipse's centre, as a wrapped GeoGebra
      :py:class:`Point`.

   .. py:property:: latex
      :type: str

      |getOnlyProp| A string of LaTeX representing the current
      equation of the ellipse, giving, e.g., :math:`5x^{2} + 9y^{2} -
      10x\, = \,40`.

      Note that when the ellipse happens to be a circle, the spacing
      specified by the LaTeX is slightly different to that specified
      by the LaTeX of the same circle as a :py:class:`Circle`.

   An :py:class:`Ellipse` has the following common properties:

   * :py:attr:`is_visible`
   * :py:attr:`color`
   * :py:attr:`color_floats`
   * :py:attr:`opacity`
   * :py:attr:`line_style`
   * :py:attr:`line_thickness`
   * :py:attr:`label_visible`
   * :py:attr:`label_style`
   * :py:attr:`caption`

   Where these properties are read-write, they can be set on
   construction by passing them as keyword arguments.


.. seealso::

   `GeoGebra Ellipse() reference
   <https://geogebra.github.io/docs/manual/en/commands/Ellipse/>`_
