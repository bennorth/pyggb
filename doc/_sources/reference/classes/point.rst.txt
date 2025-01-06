Point
=====

.. py:class:: Point

   A GeoGebra ``Point`` can be constructed in the following ways:

   .. py:method:: Point(x, y)

      Construct the point whose *x*-coordinate is ``x`` and whose
      *y*-coordinate is ``y``.

   .. py:method:: Point(obj, t)
      :noindex:

      Construct the point which is a distance ``t`` along the object
      ``obj``.  What "along" means varies depending on what kind of
      object ``obj`` is.  For example, for a line segment, ``t``
      varies from 0 at the first point of the segment to 1 at the
      second point.

   .. py:property:: x

      The current value of the Point's *x*-coordinate as a Python
      :py:type:`float`.

   .. py:property:: x_number

      The current value of the Point's *x*-coordinate as a dynamic
      :py:class:`Number`.

   .. py:property:: y

      The current value of the Point's *y*-coordinate as a Python
      :py:type:`float`.

   .. py:property:: y_number

      The current value of the Point's *y*-coordinate as a dynamic
      :py:class:`Number`.

   A :py:class:`Point` also has the following common properties:

   * :py:attr:`is_visible`
   * :py:attr:`is_independent`
   * :py:attr:`color`
   * :py:attr:`color_floats`
   * :py:attr:`size`


.. seealso::

   `GeoGebra Point() reference
   <https://geogebra.github.io/docs/manual/en/commands/Point/>`_
