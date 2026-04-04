Vector
======

.. py:class:: Vector

   In the following constructors, additional keyword arguments can be
   provided to set properties of the new :py:class:`Vector`.

   .. py:method:: Vector(p1, p2)

      Construct the Vector which translates the point *p1* to the
      point *p2*.

   .. py:method:: Vector(x, y)
      :noindex:

      Construct the Vector with the given *x* and *y* components.

   :py:class:`Vector` instances support arithmetic operations where
   that makes sense, for example adding two vectors.

   A :py:class:`Vector` has the following common properties:

   * :py:attr:`is_visible`
   * :py:attr:`is_independent`
   * :py:attr:`color`
   * :py:attr:`color_floats`
   * :py:attr:`line_style`
   * :py:attr:`line_thickness`
   * :py:attr:`label_visible`
   * :py:attr:`label_style`
   * :py:attr:`caption`


.. seealso::

   `GeoGebra Vector() reference
   <https://geogebra.github.io/docs/manual/en/commands/Vector/>`_


.. seealso::

   :ref:`Operations between objects <operations-between-objects>`
