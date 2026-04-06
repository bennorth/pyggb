Parabola
========

.. py:class:: Parabola

   In the following constructors, additional keyword arguments can be
   provided to set properties of the new :py:class:`Parabola`.

   .. py:method:: Parabola(focus, directrix)

      Construct the parabola with the given *focus* and *directrix* —
      i.e., the set of all points which are equidistant from the focus
      and the directrix.

   .. py:method:: Parabola(a, b, c)
      :noindex:

      Construct the parabola with equation *y = ax² + bx + c*.

   .. py:method:: __call__(x)

      A parabola instance can be called like a function, either with a
      Python number or a wrapped GeoGebra :py:class:`Number`.  The
      result is a wrapped GeoGebra :py:class:`Number`.  For example:

      .. code-block:: python

         p = Parabola(2, 3, 4)
         print(p(-1.0).value)
         # 3.0

   .. py:property:: latex
      :type: str

      |getOnlyProp| A string of LaTeX representing the current
      equation of the parabola, giving, e.g., :math:`y\, = \,3 \;
      x^{2} + 4 \; x + 7`.

   A :py:class:`Parabola` has the following common properties:

   * :py:attr:`is_independent`
   * :py:attr:`is_visible`
   * :py:attr:`color`
   * :py:attr:`color_floats`
   * :py:attr:`line_style`
   * :py:attr:`line_thickness`
   * :py:attr:`label_visible`
   * :py:attr:`label_style`
   * :py:attr:`caption`

   Where these properties are read-write, they can be set on
   construction by passing them as keyword arguments.


.. seealso::

   `GeoGebra Parabola() reference
   <https://geogebra.github.io/docs/manual/en/commands/Parabola/>`_
