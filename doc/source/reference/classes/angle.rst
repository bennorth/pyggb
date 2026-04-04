Angle
=====

.. py:class:: Angle

   .. py:method:: Angle(obj)

      Construct the angle formed between the given *obj* and the *x*
      axis, depending on the type of *obj*:

      * *line* or *vector* — the angle between the *x* axis and *obj*.
      * *point* — the angle between the *x* axis and the line between
        the origin and the given point.

   .. py:method:: Angle(obj1, obj2)
      :noindex:

      Construct the angle between the two given objects, whose type
      must be either *line* or *vector*.  Both objects must be of the
      same type.

   .. py:method:: Angle(point1, point2, point3)
      :noindex:

      Construct the angle formed by the three given points at
      *point2*, in the sense that would sweep the ray
      *point2*–*point1* anticlockwise until it coincides with the ray
      *point2*–*point3*.

   .. py:property:: value

      |getOnlyProp| The current value as a Python :py:type:`float`, as
      measured in radians.

   :py:class:`Angle` instances support arithmetic operations where
   that makes sense.  For example, adding two :py:class:`Angle`\ s
   gives another :py:class:`Angle`; adding an :py:class:`Angle` to a
   Python number gives a Python number by using the radian measure of
   the :py:class:`Angle`.

   An :py:class:`Angle` also has the following common properties:

   * :py:attr:`is_visible`
   * :py:attr:`color`
   * :py:attr:`color_floats`
   * :py:attr:`opacity`
   * :py:attr:`label_visible`
   * :py:attr:`label_style`
   * :py:attr:`caption`


.. seealso::

   `GeoGebra Angle() reference
   <https://geogebra.github.io/docs/manual/en/commands/Angle/>`_


.. seealso::

   :ref:`Operations between objects <operations-between-objects>`
